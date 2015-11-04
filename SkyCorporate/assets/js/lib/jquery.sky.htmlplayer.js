document.createElement('video');
var sky = sky || {};
sky.html5player = sky.html5player || {};
sky.html5player.browsers = sky.html5player.browsers || {};
sky.html5player.browsers.isOpera = navigator.userAgent.toLowerCase().indexOf("opera") > -1;
sky.html5player.browsers.isKindle = navigator.userAgent.toLowerCase().indexOf("silk") > -1;
sky.html5player.browsers.isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
sky.html5player.browsers.isXbox = navigator.userAgent.toLowerCase().indexOf("xbox") > -1;
sky.html5player.browsers.isiPad = navigator.userAgent.toLowerCase().indexOf("ipad") > -1;
sky.html5player.browsers.isiPhone = navigator.userAgent.toLowerCase().indexOf("iphone") > -1;
sky.html5player.browsers.isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
sky.html5player.browsers.isIEMobile = navigator.userAgent.toLowerCase().indexOf("iemobile") > -1;
sky.html5player.browsers.isMobileOrTablet = navigator.userAgent.toLowerCase().match(/android|blackberry|iphone|ipad|ipod|opera mini|iemobile/i) ? true : false;
sky.html5player.base_video_url = 'http://player.sky.com';
sky.html5player.log_level = 0;
sky.html5player.getUrlOptions = (function () {
    // Read a page's GET URL variables and return them as an associative array.
    var hash;
    var options = {};
    var hashes = (window.location.href.indexOf('?') > 0) ? window.location.href.slice(window.location.href.indexOf('?') + 1).split('&') : [];
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        options[hash[0]] = hash[1];
    }
    if (options.log_level || options.log_container) {
        sky.html5player.log_level = options.log_level ? options.log_level : (options.log_container ? 1 : 0);
        sky.html5player.log_container = options.log_container ? options.log_container : undefined;
        if (sky.html5player.log_container && $("." + sky.html5player.log_container).length == 0) {
            $("body").append("<div class='" + sky.html5player.log_container + "'></div>");
        }
    }
})();
sky.html5player.log = function (msg) {
    if (window.console && sky.html5player.log_level > 0)
        console.log("[skyplayer] : " + msg);
};
if (!window.console) console = { log: function () { } };
sky.html5player.receiveFlashMessage = function (event) {
    sky.html5player.log("Flash message " + event);
    if (event.data == "play") {
        $('.video-player').data('mediaplayer').play();
    }
    if (event.data == "pause") {
        $('.video-player').data('mediaplayer').pause();
    }
    if (event.data == "mute") {
        $('.video-player').data('mediaplayer').volume(0);
    }

    if (event.data.indexOf("funcvolume") != -1) {
        sky.html5player.log("flash" + event.data);
        //TODO: find other solution
        //eval("flash"+event.data);
    }
};

//Have a look, is this ok way of exposing a wrapper to control both html5 and flash...
sky.html5player.pause = function (container) {
    if ($(".video-player", container).data('mediaplayer')) {
        $(".video-player", container).data('mediaplayer').pause();
    }
    else if ($("video", container).data("sky.html5player")) {
        $("video", container).data("sky.html5player").pause();
    }

};

sky.html5player.play = function (container) {
    if ($(".video-player", container).data('mediaplayer')) {
        sky.html5player.log("FLASH");
        try {
            $(".video-player", container).data('mediaplayer').play();
        } catch (e) {
            setTimeout(function () { sky.html5player.play(container); }, 333);
        }
    }
    else if ($("video", container).data("sky.html5player")) {
        sky.html5player.log("HTML5");
        try {
            $("video", container).data("sky.html5player").play();
        } catch (e) {
            setTimeout(function () { sky.html5player.play(container); }, 333);
        }
    } else {
        setTimeout(function () { sky.html5player.play(container); }, 333);
    }
};

sky.html5player.close = function (container) {
    var wrap, wrapContent;
    if ($(".video-player", container).data('mediaplayer')) {
        $(".video-player", container).data('mediaplayer').pause();
        wrap = $(container).find('object').parents('.videocontrolcontainer');
        if (swfobject) {
            swfobject.removeSWF($(container).find('object').attr('id'));
        }
        wrap.html("<video></video>").attr("class", "videocontrolcontainer");
    }
    else if ($("video", container).data("sky.html5player")) {
        wrap = $(container).find('video').parents('.videocontrolcontainer');
        wrapContent = $("<video></video>").attr("id", $("video", container).attr("id")).attr("class", $("video", container).attr("class")).after($("<img></img>").attr("class", "posterFrame"));
        $("video", container).data("sky.html5player").stop();
        wrap.html(wrapContent).attr("class", "videocontrolcontainer");
    }
};

sky.html5player.resize = function (container) {
    sky.html5player.log("resize call - not doing anything");
};

function flashfuncvolume(volume) {
    sky.html5player.log("volume set" + volume);
    if (parseFloat(volume) <= 0) {
        $('.video-player').data('mediaplayer').volume(0);
    } else if (parseFloat(volume) > 0) {
        $('.video-player').data('mediaplayer').volume(parseFloat(volume));
    }
}

; (function ($) {

    if (!$.sky) {
        $.sky = {};
    }

    var envSettings = {};
    var ignoreFade = false;
    var _parentID = "";

    $.sky.html5player = function (el, options) {

        if (window.addEventListener) {
            window.addEventListener("message", receiveMessage, false);
        }
        else if (window.attachEvent) {
            window.attachEvent("message", receiveMessage);
        }

        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        var timeOut, videoOptions = {}, videoSettings = {}, tooltipTimeOut, videoSource;
        var timeUtilities, volumeControls, videoError = -1, videoResetTimer = 5000, videoSrc = "", videoRetry = 0;

        // Access to jQuery and DOM versions of element
        base.self = $(el);
        base.video = $(el).get(0);
        base.type = "video";
        base.element = $(el);
        base.onReadyCall = [];

        base.videoWrap = base.self.parent(".videocontrolcontainer");
        base.poster = $("img.posterFrame", base.videoWrap);
        base.poster.error(function () { $(this).attr('src', '//static.video.sky.com/posterframes/skychasky.jpg'); });
        // Add a reverse reference to the DOM object
        base.self.data("sky.html5player", base);

        if (base.videoWrap.attr("id") == undefined || base.videoWrap.attr("id") == "") {
            base.videoWrap.attr("id", ("skyplayer-" + $.sky.html5player.playerId));
        }

        if (base.video.tagName.toLowerCase() == "video") {
            base.self.removeAttr("controls");
            base.self.attr("preload", "none").attr("width", "100%").attr("height", "100%");
            // Turn off right click menu on video
            base.video.oncontextmenu = function () { return false; };
        }

        // Member declartions
        volumeControls = new $.sky.html5player.VolumeControls(base.video, base.videoWrap);
        timeUtilities = new $.sky.html5player.TimeUtilities();

        function getUrlOptions() {
            // Read a page's GET URL variables and return them as an associative array.
            var hash;
            var options = {};
            var hashes = (window.location.href.indexOf('?') > 0) ? window.location.href.slice(window.location.href.indexOf('?') + 1).split('&') : [];
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                options[hash[0]] = hash[1];
            }
            checkOptions(options);
        }

        function checkOptions(options) {
            _parentID = options.videoId ? options.videoId : '';

            //parse string values to boolean when necessary
            for (var e in options) {
                if (typeof options[e] === "string") {
                    options[e] = options[e].replace(/\/$/, ""); // remove trail '/'
                    if (options[e] === "false") {
                        options[e] = false;
                    } else if (options[e] === "true") {
                        options[e] = true;
                    }
                } else {
                    options[e] = options[e];
                }
            }
            videoOptions = $.extend({}, $.sky.html5player.defaultOptions, options);
            if (videoOptions.videoId) {
                getEnvSettings();
            }
            else {
                envSettings.base_video_url = sky.html5player.base_video_url.replace('http:', location.protocol);
                envSettings.player_options = envSettings.base_video_url + "/flashPlayer/includes/config/options/playerOptions.xml";
                getEnvSettingsSuccess();
            }
        }

        function extendOptions() {
            var videoSettingsOverride = { configuration: {} },
            videoSettingsDefaults = {
                configuration: {
                    om_account: 'bskybskyvideocuts',
                    fw_f_admanager: 'http://adm.fwmrm.net/p/sky_news_live/AdManager.swf',
                    fw_f_admanager_s: 'https://m.v.fwmrm.net/p/sky_news_live/AdManager.swf',
                    fw_f_theServerURL: 'http://2356e.v.fwmrm.net/ad/p/1',
                    fw_theServerURL: 'http://23571.v.fwmrm.net/ad/p/1',
                    fw_admanager: 'http://adm.fwmrm.net/p/sky_html5_live/AdManager.js',
                    fw_admanager_s: 'https://m.v.fwmrm.net/p/sky_html5_live/AdManager.js'
                }
            },
            source;
            //freewheel override
            if (videoOptions.omn_variable && window[videoOptions.omn_variable]) {
                source = window[videoOptions.omn_variable];
            } else {
                source = videoOptions;
            }
            videoSettingsOverride.category = source.omn_category ? source.omn_category : undefined;
            videoSettingsOverride.clipTitle = source.omn_title ? source.omn_title : undefined;
            videoSettingsOverride.type = source.omn_type ? source.omn_type : undefined;
            videoSettingsOverride.guid = source.omn_id ? source.omn_id : undefined;
            videoSettingsOverride.videoFormat = source.omn_format ? source.omn_format : undefined;
            videoSettingsOverride.provider = source.omn_provider ? source.omn_provider : undefined;
            videoSettingsOverride.mediaUrl = videoOptions.src ? videoOptions.src : undefined;
            videoSettingsOverride.site = source.omn_site ? source.omn_site : undefined;
            videoSettingsOverride.configuration.om_account = source.omn_account ? source.omn_account : undefined;
            //freewheel override
            if (videoOptions.fw_variable && window[videoOptions.fw_variable]) {
                source = window[videoOptions.fw_variable];
            } else {
                source = videoOptions;
            }
            videoSettingsOverride.flashPoster = source.flashPoster ? source.flashPoster : undefined;
            videoSettingsOverride.configuration.fw_theProfileId = source.fw_theProfileId ? source.fw_theProfileId : undefined;
            if (source.freewheel !== undefined)
                videoSettingsOverride.configuration.fw_enabled = source.freewheel;
            else if (source.fw_enabled !== undefined)
                videoSettingsOverride.configuration.fw_enabled = source.fw_enabled;
            else videoSettingsOverride.configuration.fw_enabled = undefined;
            videoSettingsOverride.configuration.fw_f_admanager = source.fw_f_admanager ? source.fw_f_admanager : undefined;
            videoSettingsOverride.configuration.fw_f_theServerURL = source.fw_f_theServerURL ? source.fw_f_theServerURL : undefined;
            videoSettingsOverride.configuration.fw_Profile = source.fw_Profile ? source.fw_Profile : undefined;
            videoSettingsOverride.configuration.fw_theDisplayBaseId = source.fw_theDisplayBaseId ? source.fw_theDisplayBaseId : undefined;
            videoSettingsOverride.configuration.fw_theServerURL = source.fw_theServerURL ? source.fw_theServerURL : undefined;
            videoSettingsOverride.configuration.fw_theNetworkId = source.fw_theNetworkId ? source.fw_theNetworkId : undefined;
            videoSettingsOverride.configuration.fw_theSiteSectionId = source.fw_theSiteSectionId ? source.fw_theSiteSectionId : undefined;
            $.extend(true, videoSettings, videoSettingsOverride);

            // override missing default values
            for (var e in videoSettingsDefaults.configuration) {
                if (videoSettings.configuration[e] === undefined)
                    videoSettings.configuration[e] = videoSettingsDefaults.configuration[e];
            }

            videoSettings.configuration.fw_enabled = (videoSettings.configuration.fw_enabled === 'false') ? false : videoSettings.configuration.fw_enabled;
            videoSettings.configuration.fw_enabled = (videoSettings.configuration.fw_enabled === 'true') ? true : videoSettings.configuration.fw_enabled;
            // if no freewheel config is available, turn adverts off
            if (!videoSettings || !videoSettings.configuration || !videoSettings.configuration.fw_enabled || !videoSettings.configuration.fw_theNetworkId) {
                videoSettings.configuration.fw_enabled = false;
            }
        }

        function getEnvSettingsSuccess() {
            if (typeof videoOptions.videoId === 'undefined' && typeof videoOptions.src === 'undefined' && base.video.src == '' && !videoOptions.videos) {
                base.log("getEnvSettingsSuccess - no param videoId, no param src, no video.src >> video not found");
                notFound();
                return false;
            }
            if (videoOptions.log_level) sky.html5player.log_level = videoOptions.log_level;
            if (videoOptions.log_container) sky.html5player.log_container = videoOptions.log_container;
            if (sky.html5player.log_container && $("." + sky.html5player.log_container).length == 0) $("body").append("<div class='" + sky.html5player.log_container + "'></div>");
            if (videoOptions.width)
                base.videoWrap.width(videoOptions.width);
            if (videoOptions.height)
                base.videoWrap.height(videoOptions.height);

            if (videoOptions.videoId) {
                base.log("getEnvSettingsSuccess - videoOptions.videoId = " + videoOptions.videoId);
                videoOptions.guid = videoOptions.videoId;
                getVideoSettings(videoOptions.videoId);
            } else {
                videoSettings = { configuration: { om_account: 'bskybskyvideocuts'} };
                videoSettings.guid = videoOptions.guid ? videoOptions.guid : '';
                extendOptions();
                if (videoOptions.videos) {
                    selectPlayer(videoOptions.videos);
                    return;
                }
                if (videoOptions.src) {
                    var video = [{ url: videoOptions.src, type: 'video/' + videoOptions.src.split('.').pop()}];
                    selectPlayer(video);
                    return;
                }
            }
        }

        function getEnvSettings() {
            if (!jQuery.isEmptyObject(envSettings)) {
                getEnvSettingsSuccess();
                return;
            }
            $.ajax({
                url: "//player.sky.com/conf/properties.json",
                dataType: "jsonp",
                jsonpCallback: "excEnvConfig",
                async: false,
                cache: true,
                success: function (data) {
                    envSettings = data;
                    envSettings.base_video_url = envSettings.base_video_url.replace('http:', location.protocol);
                    envSettings.base_url = envSettings.base_url.replace('http:', location.protocol);
                    getEnvSettingsSuccess();
                },
                error: function () {
                    notFound();
                }
            });
        }

        base.log = function (msg) {
            if (window.console && sky.html5player.log_level > 0) {
                console.log("[skyplayer] " + videoOptions.guid + ": " + msg);
                if (sky.html5player.log_container) {
                    $("." + sky.html5player.log_container).append("<div>[skyplayer] " + videoOptions.guid + ": " + msg + "</div>");
                }
            }
        };

        base.logObject = function (obj, space) {
            if (sky.html5player.log_level == 0) return;
            var espace = space ? space : " ";
            for (var e in obj) {
                if (typeof (obj[e]) == "object") {
                    base.logObject(obj[e], espace + " ");
                } else if (typeof (obj[e]) == 'string') {
                    base.log(espace + e + " = " + obj[e]);
                }
            }
        };

        // Setting up the video
        base.setup = function (options) {
            if (options !== undefined) {
                checkOptions(options);
            } else {
                getUrlOptions();
            }
        };

        base.setup(options);

        //API METHODS
        base.play = function () {
            if (base.videoReady) {
                doPlay();
            } else {
                base.onReadyCall.push(function () {
                    base.play();
                });
            }
        };

        base.pause = function () {
            doPause();
        };

        base.stop = function () {
            base.video.pause();
            reset();
            stopTrackingPlayProgress();
            stopTrackingBufferProgress();
        };

        base.mute = function () {
            base.video.muted = true;
            postMessageToParent(_parentID + ':State=mute:true');
        };

        base.unmute = function () {
            base.video.muted = false;
            postMessageToParent(_parentID + ':State=mute:false');
        };

        base.setVolume = function (i) {
            postMessageToParent(_parentID + ':State=setVolume=' + i);
            setVolume(i);
        };

        base.getVolume = function () {
            return getVolume();
        };

        base.setVideoSrc = function (url) {
            base.video.src = url;
            init();
        };

        base.fullscreen = function () {
            togglefullscreen();
        };

        function init() {
            //////////////////////////////////////////////////
            base.self.data("sky.html5player.advert", false);
            base.playProgressInterval = null;
            base.playBufferInterval = null;
            base.videoHasPlayed = false;
            base.videoCanPlay = false;
            base.videoReady = false;

            base.videoWrap.attr("tabindex", 0).addClass(supportsFullscreen()).addClass(supportsVolumeControl());
            if (sky.html5player.browsers.isiPhone) {
                base.self.addClass("offscreen");
                base.videoWrap.addClass("iPhone");
            }
            if (sky.html5player.browsers.isiPad) {
                base.videoWrap.addClass("iPad");
            }
            if (sky.html5player.browsers.isIEMobile) {
                base.videoWrap.addClass("iemobile");
            }
            if (document.body.ontouchstart !== undefined) {
                base.videoWrap.addClass("touchenabled");
            }
            ///////////////////////////////////////////////////

            if (sky.html5player.browsers.isAndroid && sky.html5player.browsers.isFirefox) {
                base.videoWrap.addClass("ffandroid");
            }
            if (sky.html5player.browsers.isAndroid) {
                base.videoWrap.addClass("android");
            }
            ///////////////////////////////////////////////////

            base.videoWrap.bind('custom', function (event) {
                reset();
            });

            base.videoWrap.bind('timeSet', function (event) {
                if (!base.video.duration) {
                    if (videoSettings.duration) $(".time .dur", base.videoWrap).html(formatTime(videoSettings.duration));
                    updateTimeDisplay();
                }
            });

            if (base.video.duration) {
                $(".time .dur", base.videoWrap).html(formatTime(base.video.duration));
                updateTimeDisplay();
            } else if (videoSettings.duration) {
                if (videoSettings.duration) $(".time .dur", base.videoWrap).html(formatTime(videoSettings.duration));
                updateTimeDisplay();
            } else {
                base.video.addEventListener("loadedmetadata", function () {
                    $(".time .dur", base.videoWrap).html(formatTime(base.video.duration));
                    updateTimeDisplay();
                }, false);
            }

            if (videoOptions.autoplay && !sky.html5player.browsers.isMobileOrTablet) base.videoWrap.addClass("autoplay");

            base.videoControl = new $.sky.html5player.videoControls(base.videoWrap, base.video, videoOptions, envSettings, videoSettings);

            // only old design?
            volumeControls.setupVolumeBar(base.videoControl.controls.volumebar);
            volumeControls.setVolumeControl(base.videoControl.controls.volume);
            videoOptions.offsetleft = Number(base.videoControl.controls.scrubbar.offset().left);


            base.video.addEventListener("loadedmetadata", function () {
                base.video.muted = false;
                base.video.muted = base.self.data("muted");
            }, false);

            base.video.addEventListener('webkitbeginfullscreen', fullscreenChange, false);
            base.video.addEventListener('webkitendfullscreen', fullscreenChange, false);
            $(document).on('fullscreeneventchange webkitfullscreenchange mozfullscreenchange webkitbeginfullscreen webkitendfullscreen', function (e) {
                fullscreenChange(e);
            });

            base.self.on("error", function (e) {
                var msg;
                if (base.videoWrap.hasClass("advert")) return;
                // CATCH ERROR HERE
                switch (e.target.error.code) {
                    case e.target.error.MEDIA_ERR_ABORTED:
                        msg = 'You aborted the video playback.';
                        break;
                    case e.target.error.MEDIA_ERR_NETWORK:
                        msg = 'A network error caused the video download to fail part-way.';
                        break;
                    case e.target.error.MEDIA_ERR_DECODE:
                        msg = 'The video playback was aborted due to a corruption problem or because the video used features your browser did not support.';
                        break;
                    case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                        msg = 'The video could not be loaded, either because the server or network failed or because the format is not supported.';
                        break;
                    default:
                        msg = 'An unknown error occurred.';
                        break;
                }
                reset();
                base.log(msg);
                displayError(msg);
                return;
            });

            base.self.on("ended", function () {
                if (!base.videoWrap.hasClass("advert")) {
                    base.log(_parentID + ":State=ContentEnded");
                    postMessageToParent(_parentID + ":State=ContentEnded");
                    base.wasPlaying = false;
                    reset();
                }
            });

            $('.initialplaycontrol', base.videoWrap).on("click", function (event) {
                toggleplay(event);
            });

            base.video.addEventListener("play", playpause, false);
            base.video.addEventListener("pause", playpause, false);
            base.video.addEventListener("volumechange", volumeChange, false);

            function volumeChange() {
                volumeControls.displayMuted(base.video.muted);
                base.self.data("muted", base.video.muted);
                setVolumeBar();
            }

            base.videoWrap.on("keydown", function (e) {
                var kcode = (e.keyCode ? e.keyCode : e.which);
                if (kcode == 32) {
                    toggleplay();
                }
                return false; //stop event bubbling
            });

            base.self.on("durationchange", function () {
                $(".time .dur", base.videoWrap).html(formatTime(base.video.duration));
            });

            base.videoControl.controls.playpause.on("click", function (evt) {
                toggleplay(evt);
            });

            base.videoControl.controls.mute.on("click", function (evt) {
                togglemute(evt);
            });


            //old design
            base.videoControl.controls.volumebar.click(function (evt) {
                volumeControls.onVolumebarClickSetVolume();
                volumeControls.volumeBarClickSetGraphic();
            });

            base.videoControl.controls.volumebar.hover(function () {
                var ind = $(this, "ul").index(),
                    last = base.videoControl.controls.volumebar.length;
                for (var i = 0; i < last; i++) {
                    if (i < ind) $(".volume-level li:eq(" + i + ")", base.videoWrap).removeClass("hover").addClass("inactive");
                    else $(".volume-level li:eq(" + i + ")", base.videoWrap).addClass("hover");
                }
            }, function () {
                $(".volume-level li", base.videoWrap).removeClass("hover inactive");
            });



            base.videoControl.controls.fullscreen.click(function () {
                if (!base.videoWrap.hasClass("advert") || (!sky.html5player.browsers.isiPad && !sky.html5player.browsers.isiPhone)) {
                    togglefullscreen();
                }
            });

            $(".playpause", base.videoWrap).click(function () {
                hideControls(5000);
            });

            base.videoWrap.on("mouseleave", function () {
                hideControls(5000);
            });

            $(".ctrl-box", base.videoWrap).on("mouseenter", function () {
                ignoreFade = true;
            });

            $(".ctrl-box", base.videoWrap).on("mouseleave", function () {
                ignoreFade = false;
            });

            base.videoWrap.on("mouseleave", function () {
                ignoreFade = false;
            });

            base.videoWrap.on("mousemove touchstart click", function () {
                showControls(5000);
            });

            $(".more", base.videoControl.controls.volume).on("click", function () {
                showControls(5000);

                if (base.video.muted) {
                    base.video.muted = !base.video.muted;
                    return;
                }
                volumeControls.plusClickSetGraphic();
                volumeControls.onPlusMinusClickSetVolume();
            });

            $(".less", base.videoControl.controls.volume).on("click", function () {
                showControls(5000);

                if ($(".on", base.videoControl.controls.volume).length > 1) {
                    volumeControls.minusClickSetGraphic();
                    volumeControls.onPlusMinusClickSetVolume();
                } else {
                    base.video.muted = true;
                }
            });

            function endOfPlay(e) {
                if (base.self.data("sky.html5player.advert") == true) return;
                postMessageToParent(_parentID + ":State=ContentEnded");
                base.wasPlaying = false;
                reset();
            }

            //AD EVENTS ORDER: onSlotStarted defaultImpression adEnd onSlotEnded
            // WHEN NO CAMPAIGN FOUND OR NO FORMAT SUPPORTED, WE STILL GET: onSlotStarted onSlotEnded
            function customAdvert(e) {
                switch (e.type) {
                    case "onSlotStarted":
                        base.videoWrap.addClass("advert");
                        break;
                    case "onSlotEnded":
                        base.videoWrap.removeClass("advert");
                        break;
                    case "onVideoStateCompleted":
                        endOfPlay(e);
                        break;
                    case "defaultImpression":
                        base.self.data("sky.html5player.advert", true);
                        break;
                    case "adEnd":
                        base.self.data("sky.html5player.advert", false);
                        break;
                    default:
                        base.log("customAdvert " + e.type + " not recognized");
                        break;
                }
            }
            function onlyPlayWhenAdReady() {
                base.video.pause();
                videoOptions.autoplay = true;
                base.log("onlyPlayWhenAdReady pausing video " + base.video.paused);
            }
            function kickFirstPlay() {
                base.self.trigger("playerready");
                base.self.off("play", kickFirstPlay);
            }
            if (videoSettings.configuration.fw_enabled) {
                if (videoOptions.autoplay) base.self.on("play", onlyPlayWhenAdReady);

                base.self.on("onRequestComplete", function (e) {
                    base.self.on("onSlotStarted onSlotEnded defaultImpression adEnd onVideoStateCompleted", customAdvert);
                    base.self.off("play", onlyPlayWhenAdReady);
                    if (!videoOptions.autoplay) {
                        base.self.on("play", kickFirstPlay);
                    } else {
                        kickFirstPlay();
                    }
                });

            }
            // end of play, we can reset the state of the player (exit fullscreen?, reset src)
            base.self.on("ended", endOfPlay);

            function trackSeek(e) {
                var coord;
                if (e.type.indexOf("touch") > -1) {
                    coord = e.changedTouches ? e.changedTouches[0].pageX : e.originalEvent.touches[0].pageX;
                } else {
                    coord = e.pageX ? e.pageX : 0;
                }
                if (coord != 'undefined' && !isNaN(coord)) {
                    var progressOffset = coord - videoOptions.offsetleft;
                    if (progressOffset < 0) return;
                    progressOffset = progressOffset / base.videoControl.controls.scrubbar.width() * 100;
                    progressOffset = (progressOffset >= 100) ? 99.9 : ((progressOffset <= 0) ? 0.1 : progressOffset);
                    if (base.video.duration) {
                        var newTime = (progressOffset * base.video.duration / 100);
                        newTime = +newTime.toFixed(1);
                        base.video.currentTime = newTime;
                        base.self.trigger("timeupdate");
                        base.cacheTime = newTime;
                        updatePlayProgress();
                    }
                }
            }


            function seekEnd() {
                unblockTextSelection();
                document.removeEventListener("mousemove", trackSeek, false);
                document.removeEventListener("touchmove", trackSeek, false);
                document.removeEventListener("mouseup", seekEnd, false);
                document.removeEventListener("touchend", seekEnd, false);
                base.scrubbing = false;
                if (base.wasPlaying) base.video.play();
            }

            base.videoControl.controls.scrubbar.on("mousedown touchstart", function (e) {
                e.preventDefault();
                var kcode = (e.keyCode ? e.keyCode : e.which);
                if (kcode == 2 || base.videoWrap.hasClass("advert")) return;
                blockTextSelection();
                document.addEventListener("mousemove", trackSeek, false);
                document.addEventListener("touchmove", trackSeek, false);
                document.addEventListener("mouseup", seekEnd, false);
                document.addEventListener("touchend", seekEnd, false);
                trackSeek(e);
                base.scrubbing = true;
                base.wasPlaying = !base.video.paused;
                base.video.pause();
            });

            $(".scrub-bar div", base.videoWrap).on("mouseenter mousemove", function (evt) {
                if (base.videoWrap.hasClass('buffering') || base.videoWrap.hasClass('advert')) return;
                var txt = "", el = $(this), pos = { x: 0, y: 0 }, tooltip = $(".tooltip", base.videoWrap);
                if (evt.pageX - videoOptions.offsetleft > 0) {
                    txt = getTime(evt.pageX);
                }
                if (txt == "") return;
                tooltip.find(".top span").html(txt);
                pos.x = (evt.pageX - (tooltip.width() / 2)) - base.videoWrap.offset().left;
                pos.y = (el.offset().top - tooltip.height()) - base.videoWrap.offset().top;
                tooltip.show().css({ left: pos.x, top: pos.y });
                clearTimeout(tooltipTimeOut);
                tooltipTimeOut = setTimeout(function () { tooltip.hide(); }, 2000);
            }
            );

            $(".scrub-bar div", base.videoWrap).on("mouseleave", function (evt) {
                $(".tooltip", base.videoWrap).hide();
                clearTimeout(tooltipTimeOut);
            });

            function showBuffer(e) {
                $(base.videoWrap).addClass("buffering");
                clearTimeout(timeOut);
                $(".videocontrol", base.videoWrap).addClass("fade-in");
                ignoreFade = true;
            }

            function hideBuffer(e) {
                $(base.videoWrap).removeClass("buffering");
                ignoreFade = false;
            }

            base.video.addEventListener("canplay", hideBuffer);
            base.video.addEventListener("progress", hideBuffer);
            base.video.addEventListener("canplaythrough", hideBuffer);
            base.video.addEventListener("playing", hideBuffer);
            base.video.addEventListener("seeked", hideBuffer);
            base.video.addEventListener("seeking", hideBuffer);
            base.video.addEventListener("waiting", showBuffer);

            function resetVideo() {
                base.self.attr("src", videoSrc);
                base.video.src = videoSrc;
                base.video.preload = "none";
                base.video.removeAttribute("controls");
                base.video.play();
            }
            function clearErrorListener() {
                base.video.removeEventListener('play', checkVideoCanPlay, false);
                base.video.removeEventListener('canplay', checkVideoCanPlay, false);
                base.video.removeEventListener('playing', checkVideoCanPlay, false);
                base.video.removeEventListener('canplaythrough', checkVideoCanPlay, false);
                base.video.removeEventListener('progress', checkVideoCanPlay, false);
                videoRetry = 0;
            }

            function checkVideoCanPlay(e) {
                switch (e.type) {
                    case 'play':
                        // restart countdown
                        clearTimeout(videoError);
                        // only retry on main content, not ad
                        if (base.video.src != videoSrc) {
                            videoRetry = 0;
                            return;
                        }
                        if (!base.videoCanplay && videoRetry < 3) {
                            videoError = setTimeout(function () { resetVideo(); }, videoResetTimer);
                            base.log("checkVideoCanPlay event " + e.type + ", source " + base.video.src + ", videoRetry " + videoRetry);
                            videoRetry++;
                        } else {
                            notFound();
                            base.videoWrap.addClass("error");
                            clearErrorListener();
                        }
                        break;
                    case 'canplay':
                    case 'playing':
                    case 'progress':
                    case 'canplaythrough':
                        // only retry on main content, not ad
                        if (base.video.src != videoSrc) {
                            videoRetry = 0;
                            return;
                        }
                        base.log("checkVideoCanPlay event " + e.type + ", source " + base.video.src + ", videoRetry " + videoRetry);
                        // if main content is playing, clear timer
                        if (base.video.src == videoSrc) {
                            base.videoCanPlay = true;
                            clearTimeout(videoError);
                            clearErrorListener();
                        }
                        break;
                }
            }
            if (!base.videoCanPlay) {
                base.video.addEventListener('play', checkVideoCanPlay, false);
                base.video.addEventListener('canplay', checkVideoCanPlay, false);
                base.video.addEventListener('playing', checkVideoCanPlay, false);
                base.video.addEventListener('canplaythrough', checkVideoCanPlay, false);
                base.video.addEventListener('progress', checkVideoCanPlay, false);
            }

            // Setting parameters
            base.video.loop = videoOptions.loop;

            // we only set autoplay on the video element if adverts are off
            if (videoOptions.autoplay && !videoSettings.configuration.fw_enabled) {
                base.video.autoplay = videoOptions.autoplay;
            }
            setVolume(videoOptions.volume);
            base.video.muted = videoOptions.mute;
            volumeChange();
            setPlayerStyle();
            // force the video to load when src is changed
            base.video.load();
            playerReady();
        }   // end of init function

        function playerReady() {
            $.sky.html5player.onPlayerReady();
            base.videoReady = true;
            if (base.onReadyCall) {
                jQuery.each(base.onReadyCall, function () {
                    this.call(document, jQuery);
                });
            }
            base.onReadyCall = [];
        }


        function raisePlayerEvent(data) {
            if (data.indexOf("Call") <= 0) {
                base.log("Received player message " + data);
                $("#" + base.video.id).trigger(data);
            }
        }

        function postMessageToParent(message) {

            if (self == top) {
                raisePlayerEvent(message);
            }
            else {
                parent.postMessage(message, "*");
            }
        }

        function replaceStringValue(obj, val, rep) {
            for (var e in obj) {
                if (typeof (obj[e]) == "object") {
                    for (var ee in obj[e]) {
                        replaceStringValue(obj[e], val, rep);
                    }
                } else if (typeof (obj[e]) == 'string') {
                    obj[e] = obj[e].replace(val, rep);
                }
            }
        }

        function getVideoSettings(videoId) {
            var myurl = envSettings.base_url + "/config/" + videoId;
            postMessageToParent("Call=" + myurl);
            $.ajax({
                url: myurl,
                dataType: 'jsonp',
                jsonpCallback: "excConfig",
                async: false,
                cache: true,
                success: function (data) {
                    videoSettings = data;
                    // the video category is recorded as site in the config file
                    videoSettings.category = videoSettings.site;
                    videoSettings.site = undefined;
                    extendOptions();

                    if (location.protocol == 'https:') {
                        //we update videoSettings to match the secure protocol
                        replaceStringValue(videoSettings, 'http:', 'https:');
                    }
                    selectPlayer(data.videos, videoId);

                },
                error: function () {
                    notFound();
                }
            });
        }

        function selectPlayer(videos, videoId) {
            videoSource = new $.sky.html5player.videoSourceManager(videos, videoId);
            videoSettings.selectedVideo = videoSource.video;

            setPlayerStyle();
            if (videoSource.videoNotFound) {
                var text = "This video isn't compatible with the device you're currently using.";
                if (!videoSource.isMobile && !videoSource.isTablet)
                    text = "This video isn't compatible with the browser you're currently using.";
                base.log(text);
                displayError(text);
                return;
            }
            // Find & Watch : no advertsiment on mobile & tablets
            if (videoOptions.token == "56ECDC9F-6A1A-A8BE-49AB-AA1D55A52DBD") {
                if (sky.html5player.browsers.isAndroid || sky.html5player.browsers.isiPad || sky.html5player.browsers.isiPhone || !videoSource.supportsFlash) {
                    videoSettings.configuration.fw_enabled = false;
                }
            }
            if ((videoOptions.flash && videoSource.flash) || (!videoSource.video && videoSource.flash)) {
                base.log("selectPlayer - Initializing Flash Player");
                base.videoWrap.html(getFlashTmpl());
                require(
                    [envSettings.base_video_url + "/flashPlayer/js/ext/swfobject.js",
                        envSettings.base_video_url + "/flashPlayer/includes/js/mediaplayer.0.0.9-SNAPSHOT.js"],
                          function () {
                              base.type = "flash";
                              getFlashConfig();
                          }
                );
                return;
            }
            if (videoSource.video) {
                base.log("selectPlayer - Initializing Native HTML5 Video");
                // if xbox or opear, turn adverts off
                if (sky.html5player.browsers.isXbox || sky.html5player.browsers.isOpera) {
                    videoSettings.configuration.fw_enabled = false;
                }
                if (videoOptions.videoId && envSettings.base_url)
                    base.poster.attr("src", envSettings.base_url + '/image/' + videoOptions.videoId + '?secure=' + (location.protocol == 'https:'));
                setVideo(videoSource.video.url);
                return;
            }
        }

        function setVideo(mediaUrl) {
            base.self.attr("src", mediaUrl);
            base.video.src = mediaUrl;
            videoSettings.mediaUrl = mediaUrl;
            videoSrc = mediaUrl;
            base.log("setVideo - Playing " + mediaUrl);
            base.triggerEndEvent = ((videoSrc.indexOf(".mp4") == videoSrc.length - 4) && navigator.userAgent.match(/gt-i9505/i) && navigator.userAgent.match(/android/i)) ? true : false;

            // Add a reverse reference to the DOM object
            base.self.data("sky.html5player", base);

            if (videoOptions && videoSettings) {
                // if freewheel call the plugin
                if (videoSettings.configuration.fw_enabled) {
                    var adFile = (location.protocol == 'https:') ? videoSettings.configuration.fw_admanager_s : videoSettings.configuration.fw_admanager;
                    require([adFile, envSettings.base_video_url + "/plugin/min/jquery.freewheel.js"], function () {
                        base.self.sky_freewheel(videoSettings, videoOptions);
                    });
                }
                // if omniture tracking required and config info available then we call the plugin
                if (videoOptions.tracking) {
                    require([envSettings.base_video_url + "/plugin/jquery.omniture.js"], function () {
                        base.self.sky_omniture(videoSettings, envSettings.base_video_url);
                    });
                }
                // if override css
                if (!videoOptions.css) {
                    setUpcss(videoSettings.category);
                } else if (videoOptions.css != "default") {
                    setUpcss(videoOptions.css);
                }

                base.videoWrap.trigger('timeSet');

                init();
            } else {
                notFound();
            }
        }

        //Flash player config
        function getFlashConfig() {
            $.ajax({
                url: envSettings.base_video_url + "/conf/flash.json",
                dataType: 'jsonp',
                jsonpCallback: "excFlashConfig",
                success: function (json) {
                    var data = json;
                    data.videoPlayerVersions[0].path = envSettings.base_video_url + "/" + data.videoPlayerVersions[0].path;
                    data.expressInstall = envSettings.base_video_url + "/" + data.expressInstall;
                    base.log("getFlashConfig - Playing " + videoSource.flash.url);
                    data.flashvars.mediaUrl = videoSource.flash.url; //envSettings.base_url+"/video/"+videoOptions.videoId+"?type=H264%26secure="+(location.protocol=='https:');


                    data.flashvars.posterFrame = location.protocol + '//static.video.sky.com/posterframes/skychasky.jpg';
                    if (videoSettings.flashPoster)
                        data.flashvars.posterFrame = videoSettings.flashPoster;
                    else if (videoSettings.configuration && videoSettings.configuration.defaultPoster)
                        data.flashvars.posterFrame = videoSettings.configuration.defaultPoster;

                    if (videoOptions.autoplay)
                        data.flashvars.autoPlay = true;
                    if (videoOptions.mute)
                        data.flashvars.volume = '0';
                    data.flashvars.id = videoOptions.videoId;

                    if (!videoOptions.mute) {
                        if (videoOptions.volume) {
                            data.flashvars.volume = "" + parseFloat(videoOptions.volume) * 10;
                        }
                    }

                    if (location.protocol == "https:" && envSettings.player_options_secure)
                        data.flashvars.configPath = envSettings.player_options_secure;
                    else
                        data.flashvars.configPath = envSettings.player_options;

                    if (videoOptions.tracking)
                        data.flashvars.plugin_omniture = encodeURI('{"plugin":{"resource":"' + envSettings.base_video_url + '/flashPlayer/includes/flash/OmniturePlugin_v3.swf?s.configURL=' + envSettings.base_video_url + '/flashPlayer/includes/config/omniture/omnitureOptions-' + videoSettings.configuration.om_account + '.xml"}}');
                    else
                        data.flashvars.plugin_omniture = encodeURI('{"plugin":{"resource":"' + envSettings.base_video_url + '/flashPlayer/includes/flash/OmniturePlugin_v3.swf?s.configURL=' + envSettings.base_video_url + '/flashPlayer/includes/config/omniture/omnitureOptions-notracking.xml"}}');

                    var fw_f_admanager = videoSettings.configuration.fw_enabled;

                    if (!videoSettings.configuration || !videoSettings.configuration.fw_enabled)
                        fw_f_admanager = false;

                    if (fw_f_admanager) {
                        if (location.protocol == "https:" && videoSettings.configuration.fw_f_admanager_s)
                            data.flashvars.plugin_freewheel = encodeURI('{"preload":{"fwAdManager":"' + videoSettings.configuration.fw_f_admanager_s + '"},"target":{"fwEnabled":' + fw_f_admanager + ',"fwAdServer":"' + videoSettings.configuration.fw_f_theServerURL + '","fwSiteSectionId":"' + videoSettings.configuration.fw_theSiteSectionId + '","fwVideoAssetId":"' + videoOptions.videoId + '","fwNetworkId":' + videoSettings.configuration.fw_theNetworkId + ',"fwProfile":"' + videoSettings.configuration.fw_Profile + '","fwVideoFallbackId":30766959}}');
                        else
                            data.flashvars.plugin_freewheel = encodeURI('{"preload":{"fwAdManager":"' + videoSettings.configuration.fw_f_admanager + '"},"target":{"fwEnabled":' + fw_f_admanager + ',"fwAdServer":"' + videoSettings.configuration.fw_f_theServerURL + '","fwSiteSectionId":"' + videoSettings.configuration.fw_theSiteSectionId + '","fwVideoAssetId":"' + videoOptions.videoId + '","fwNetworkId":' + videoSettings.configuration.fw_theNetworkId + ',"fwProfile":"' + videoSettings.configuration.fw_Profile + '","fwVideoFallbackId":30766959}}');
                    }
                    data.flashvars.title = videoSettings.clipTitle;
                    data.flashvars.category = videoSettings.site;
                    data.containerId = "video-container" + $.sky.html5player.playerId;
                    data.noflashId = "video_canvas" + $.sky.html5player.playerId;
                    // added unique id for flash object
                    data.objectId = "SkyMediaPlayer-" + $.sky.html5player.playerId;
                    $('.video-player', base.videoWrap).mediaplayer({ config: data, callback: function () { $.sky.html5player.onPlayerReady(); } });
                    $('.video-player, #' + data.containerId, base.videoWrap).css({ width: '100%', height: '100%' });

                    base.element = $('#' + data.objectId);
                    //                    require([envSettings.base_video_url+"/plugin/min/jquery.resize.js"], function(){
                    //                        if(window.self !== window.top) {
                    //                            $(window).on("resize", function(){
                    //                                base.videoWrap.height(document.documentElement.clientWidth/videoOptions.aspectRatio);
                    //                                base.videoWrap.css('min-height',(document.documentElement.clientWidth/videoOptions.aspectRatio));
                    //                            });
                    //                        } else {
                    //                            base.videoWrap.on("resize", function(){
                    //                                base.videoWrap.height(base.videoWrap.width()/videoOptions.aspectRatio);
                    //                                base.videoWrap.css('min-height',(base.videoWrap.width()/videoOptions.aspectRatio));
                    //                            });
                    //                        }
                    //                    });
                    setPlayerStyle();
                    if (videoOptions.autopause) base.videoWrap.on("click", autopause);
                    if (videoOptions.autoplay) autopause();
                    if (window.addEventListener) {
                        window.addEventListener("message", sky.html5player.receiveFlashMessage, false);
                    }
                    else if (window.attachEvent) {
                        window.attachEvent("message", sky.html5player.receiveFlashMessage);
                    }
                },
                error: function () {
                    notFound();
                }
            });
        }

        function setCurrentTime(seconds) {
            if (seconds <= base.video.duration) { base.video.currentTime = seconds; }
            else { base.video.currentTime = base.video.duration; }
        }

        function receiveMessage(event) {
            base.log("RECEIVE MESSAGE " + event.data);
            if (event.data == "play") {
                toggleplay();
            }
            if (event.data == "pause") {
                toggleplay();
            }
            if (event.data == "mute") {
                togglemute();
            }
            if (event.data == "fullscreen") {
                togglefullscreen();
            }
            if (event.data.indexOf("funcvolume") != -1) {
                base.log("receiveMessage funcvolume");
                //TODO: replace eval call
                //eval(event.data);
            }
        }
        function hideControls(laps) {
            timeOut = setTimeout(function () {
                if (base.videoHasPlayed && !base.video.paused) {
                    $(".videocontrol", base.videoWrap).addClass("fade-out").removeClass("fade-in");
                }
            }, laps);
        }
        function showControls(laps) {
            $(".videocontrol", base.videoWrap).addClass("fade-in").removeClass("fade-out");
            clearTimeout(timeOut);
            if (!ignoreFade) {
                hideControls(laps);
            }
        }

        function setPlayerStyle() {
            var playerWidth = base.self.width();
            base.videoWrap.removeClass("mini medium");
            if (playerWidth < 360 || sky.html5player.isiPhone) { //mini
                base.videoWrap.addClass("mini");
            }
            else if (playerWidth < 944 || sky.html5player.isiPad) {
                base.videoWrap.addClass("medium");
            }
        }

        function autopause() {
            $(".videocontrolcontainer").each(function () {
                var that = this;
                if ($(that).attr('id') != base.videoWrap.attr('id')) {
                    if ($("video", that).length > 0 && $("video", that).get(0).paused == false)
                        $("video", that).get(0).pause();
                    if ($(".video-player", that).length > 0 && $(".video-player", that).data('mediaplayer'))
                        $(".video-player", that).data('mediaplayer').pause();
                }
            });
        }

        function playpause(e) {
            if (!base.videoHasPlayed) {
                base.videoWrap.removeClass("init autoplay");
                base.videoHasPlayed = true;
                base.video.autoplay = false;
                setPlayerStyle();
                videoOptions.offsetleft = Number(base.videoControl.controls.scrubbar.offset().left);
            }
            //            base.wasPlaying = !base.video.paused;
            if (base.video.paused) {
                base.videoControl.controls.playpause.addClass("paused");
                showControls(5000);
                stopTrackingPlayProgress();
                if (base.videoWrap.hasClass("advert")) {
                    postMessageToParent(_parentID + ":State=adPause");
                }
                else {
                    postMessageToParent(_parentID + ":State=pause");
                }
            } else {
                if (videoOptions.autopause) autopause();
                //base.videoWrap.addClass("buffering");
                base.videoControl.controls.playpause.removeClass("paused");
                base.videoWrap.removeClass("init");
                hideControls(5000);
                trackPlayProgress();
                if (base.videoWrap.hasClass("advert")) {
                    postMessageToParent(_parentID + ":State=ad");
                }
                else {
                    postMessageToParent(_parentID + ":State=playing");
                }
            }
        }

        function resetFadeOnVideoControls() {
            $(".videocontrol", base.videoWrap).removeClass("fade-out fade-in");
        }

        function reset() {
            //            base.self.attr("src",videoSrc);
            //            base.video.src=videoSrc;
            base.video.removeAttribute("controls");
            if (base.video.currentTime) {
                base.video.currentTime = 0;
                base.video.pause();
            }
            updatePlayProgress();
            base.videoWrap.addClass("init");
            base.videoControl.controls.playpause.addClass("paused");
            resetFadeOnVideoControls();
        }

        function getVolume() {
            return base.video.volume;
        }

        function setVolumeBar() {
            var ind = base.videoControl.controls.volumebar.length - Math.round(base.video.volume * base.videoControl.controls.volumebar.length),
                last = base.videoControl.controls.volumebar.length;
            base.videoControl.controls.volumebar.removeClass("on");
            volumeControls.volumeLevelToDisplay(ind, last);
        }

        function setVolume(i) {
            i = parseFloat(i);
            if (isNaN(i)) return;
            if (i > 0 && i < 1)
                base.video.volume = i;
            if (i < 0)
                base.video.volume = 0.1;
            if (i > 1)
                base.video.volume = 1;
            volumeControls.setHTMLVideoVolumeParams(i);
        }

        function trackPlayProgress() {
            base.playProgressInterval = setInterval(updatePlayProgress, 200);
            if (base.video.buffered) {
                stopTrackingBufferProgress();
                base.playBufferInterval = setInterval(updateBufferProgress, 500);
            }
        }

        function stopTrackingPlayProgress() {
            clearInterval(base.playProgressInterval);
        }

        function stopTrackingBufferProgress() {
            clearInterval(base.playBufferInterval);
        }

        function updateTimeDisplay() {
            var now = base.video.currentTime, dur = base.video.duration;
            if (base.videoWrap.hasClass("advert")) {
                $(".time .cur", base.videoWrap).html("Advert");
            }
            else {
                $(".time .cur", base.videoWrap).html(formatTime(now));
            }
            if (base.triggerEndEvent && base.video.src == videoSrc) { //mp4 on s4 native browser
                if ((Math.round(parseFloat(now) * 100) / 100) >= (Math.round(parseFloat(dur) * 100) / 100)) {
                    base.log("force trigger event 'ended' " + (Math.round(parseFloat(now) * 100) / 100) + " --- " + (Math.round(parseFloat(dur) * 100) / 100));
                    base.self.trigger('ended');
                }
            }
        }

        function getTime(e) {
            var t = (e - videoOptions.offsetleft) * base.video.duration / base.videoControl.controls.scrubbar.width();
            return (formatTime(t));
        }

        function updatePlayProgress() {
            var handleOffset = base.videoControl.controls.seekhandle.width() / base.videoControl.controls.scrubbar.width();
            //            var currentTime = base.scrubbing?base.cacheTime:base.video.currentTime, duration = base.video.duration;
            var currentTime = base.video.currentTime, duration = base.video.duration;
            var progressOffset = currentTime / duration * 100;
            base.videoControl.controls.progressbar.css("width", progressOffset + "%");
            base.videoControl.controls.seekhandle.css("left", (progressOffset - handleOffset) + "%");
            updateTimeDisplay();
        }

        function updateBufferProgress() {
            var duration = base.video.duration;
            if (base.video.buffered && base.video.buffered.length) {
                for (var i = 0; i < base.video.buffered.length; i++) {
                    $('.buffer', base.videoControl.controls.scrubbar).css("width", (base.video.buffered.end(i) / duration * 100) + "%");
                    if (base.video.buffered.end(i) == duration)
                        stopTrackingBufferProgress();
                }
            }
        }

        // toggleplay with jquery.freewheel.js
        function toggleplay() {
            if (base.videoWrap.hasClass('buffering')) return;
            if (base.video.paused) {
                //html5 play
                base.video.play();
                base.videoWrap.removeClass("init");
            } else {
                if (!base.videoWrap.hasClass("advert")) {
                    //html5 pause
                    base.video.pause();
                }
            }
        }

        function doPlay() {
            if (base.type == "video") {
                base.video.play();
            }
            if (base.type == "flash") {
                sky.html5player.play(base.element.parent('.video-player'));
            }
        }

        function doPause() {
            base.video.pause();
        }

        function togglemute() {
            base.video.muted = !base.video.muted;
            if (base.video.muted) {
                postMessageToParent(_parentID + ":State=mute:true");
            }
            else {
                postMessageToParent(_parentID + ":State=mute:false");
            }
            base.self.data("mute", base.video.muted);
        }

        function setMuted(muted) {
            base.video.muted = muted;
            if (base.video.muted) {
                postMessageToParent(_parentID + ":State=mute:true");
            }
            else {
                postMessageToParent(_parentID + ":State=mute:false");
            }
        }

        function isFullScreen() {
            if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen) || !base.videoWrap.hasClass("full-screen")) {
                return false;
            }
            return true;
        }

        function fullscreenChange(e) {
            if (document.fullScreenElement === false || document.mozFullScreen === false || document.webkitIsFullScreen === false || e.type == "webkitendfullscreen") {
                base.self.attr('controls', 'controls').removeAttr('controls'); //hack to remove native controls
                $("body").removeClass("full-window");
                base.videoWrap.removeClass("full-screen");
                if (sky.html5player.browsers.isiPhone) {
                    base.poster.css("visibility", "visible");
                    $(".initialplaycontrol", base.videoWrap).show();
                }
                base.videoControl.controls.fullscreen.removeClass("full");
                //if(base.wasPlaying)doPlay();
                showControls(5000);
                postMessageToParent(_parentID + ":State=fullscreen:false");
            }
            if (document.fullScreenElement || document.mozFullScreen || document.webkitIsFullScreen || e.type == "webkitbeginfullscreen") {
                $("body").addClass("full-window");
                base.videoWrap.addClass("full-screen");
                base.videoControl.controls.fullscreen.addClass("full");
                if (sky.html5player.browsers.isiPhone) {
                    $(".initialplaycontrol", base.videoWrap).hide();
                    $(".initialplaycontrol", base.videoWrap).show();
                }
                hideControls(5000);
                postMessageToParent(_parentID + ":State=fullscreen:true");
            }
            setPlayerStyle();
            updatePlayProgress();
            playpause();
            return false;
        }


        function togglefullscreen() {
            if (supportsFullscreen() == "fs-off") return;
            if (document.fullScreenElement === false || document.mozFullScreen === false || document.webkitIsFullScreen === false || !base.videoWrap.hasClass("full-screen")) {
                if (base.video.requestFullScreen) {
                    base.videoWrap.get(0).requestFullScreen();
                } else if (base.video.mozRequestFullScreen) {
                    base.videoWrap.get(0).mozRequestFullScreen();
                } else if (base.video.webkitRequestFullScreen) {
                    base.videoWrap.get(0).webkitRequestFullScreen();
                } else if ($("<video></video>").get(0).webkitEnterFullscreen) {
                    base.video.webkitEnterFullscreen();
                } else {
                    base.video.webkitEnterFullscreen();
                }
            } else {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if ($("<video></video>").get(0).webkitExitFullScreen) {
                    base.video.webkitExitFullScreen();
                } else {
                    base.video.webkitCancelFullscreen();
                }
            }
        }

        function seekTo() {
            if (videoOptions.posoffset > 0) {
                base.video.pause();
                base.video.currentTime = videoOptions.posoffset * base.video.duration / $(".scrub-bar > div").width();
                videoOptions.posoffset = -1;
                base.video.play();
                base.video.removeEventListener("loadedmetadata", seekTo, false);
            }
        }

        // Attempt to block the ability to select text while dragging controls
        function blockTextSelection() {
            document.body.focus();
            document.onselectstart = function () { return false; };

        }

        // Turn off text selection blocking
        function unblockTextSelection() {
            document.onselectstart = function () { return true; };
        }

        function funcvolume(volume) {
            if (parseFloat(volume) <= 0 && base.video.muted) {
            } else if (parseFloat(volume) <= 0) {
                base.setVolume(parseFloat(0.1));
                if (!base.video.muted) {
                    togglemute();
                }
            } else {
                base.setVolume(parseFloat(volume));
            }
        }


        function notFound() {
            base.poster.attr("src", "//static.video.sky.com/messages/missing_video-tag.jpg").css('visibility', 'visible');
            base.self.hide();
            base.videoWrap.css('height', 'auto');
            return;
        }

        function formatTime(seconds) {
            if (timeUtilities) return timeUtilities.formatTime(seconds);
        }

        function setUpcss(site) {
            var siteWhiteList = ["skynews", "skysports"];

            if (site != "" && ($.inArray(site, siteWhiteList) != -1)) {
                var fileref = document.createElement("link");
                fileref.setAttribute("rel", "stylesheet");
                fileref.setAttribute("type", "text/css");
                fileref.setAttribute("href", envSettings.base_video_url + "/css/site/" + site + ".css");
                fileref.setAttribute("id", "player-theme");

                if (typeof fileref != "undefined") {
                    document.getElementsByTagName("head")[0].appendChild(fileref);
                    base.videoWrap.addClass(site);
                }
            }
        }

        function displayError(message) {
            var tmpl = '<div class="video-error"><h1>Oops!</h1><div>' + message + '</div></div>';
            base.poster.hide();
            base.self.hide();
            base.videoWrap.css('height', 'auto');
            base.videoWrap.prepend(tmpl).addClass('error');
        }
    };


    function roundTwo(num) {
        return (Math.round(num * 100) / 100);
    }

    function supportsFullscreen() {
        var doc = document.documentElement, classname = "fs-off";
        if ((doc.requestFullScreen || doc.mozRequestFullScreen || doc.webkitRequestFullScreen || $("<video></video>").get(0).webkitEnterFullscreen) && !sky.html5player.browsers.isKindle && !(sky.html5player.browsers.isAndroid && navigator.vendor.toLowerCase().indexOf("opera") > -1))
            classname = "fs-on";
        return classname;
    }

    function supportsVolumeControl() {
        var classname = "vol-on";
        if (sky.html5player.browsers.isiPhone || sky.html5player.browsers.isiPad || sky.html5player.browsers.isKindle || sky.html5player.browsers.isAndroid) {
            classname = "vol-off";
        }
        return classname;
    }

    function getFlashTmpl() {
        //flash player
        return '<div class="video-player"><div class="video-display" id="video-container' + $.sky.html5player.playerId + '"><div id="video_canvas' + $.sky.html5player.playerId + '" style="background:#FFFFFF; visibility: hidden"><p>To view this content you need Flash and Javascript enabled in your browser.</p><p>Please <a href="//get.adobe.com/flashplayer/" title="Download Flash from Adobe" target="_blank">download Flash</a> from the Adobe download website.</p></div></div></div>';
    }

    $.sky.html5player.defaultOptions = {
        offsetleft: 0,
        playProgressInterval: -1,
        timeoffset: -1,
        posoffset: -1,
        autosize: false,
        controls: false,
        volume: 0.5,
        autoplay: false,
        loop: false,
        mute: false,
        tracking: true,
        aspectRatio: 16 / 9,
        guid: '?',
        autopause: true
    };

    $.sky.html5player.playerId = 0;

    $.sky.html5player.player = [];

    $.sky.html5player.onPlayerReady = function () {
        $.sky.html5player.player.shift();
        $.sky.html5player.playerId++;
        if ($.sky.html5player.player.length > 0) {
            var ind = $.sky.html5player.player[0];
            new $.sky.html5player(ind.el, ind.options);
        }
    };

    $.fn.sky_html5player = function (options) {
        if (!$(this).length || $(this).data('sky.html5player')) {
            return;
        }
        $.sky.html5player.player.push({ el: this, options: options });
        if ($.sky.html5player.player.length < 2) {
            new $.sky.html5player(this, options);
        }
        return this;
    };

    $.sky.html5player.ResetPlayer = function (container) {
        this._container = container;
    };

    $.sky.html5player.ResetPlayer.prototype = {
        resetFadeOnVideoControls: function () {
            $(".videocontrol", this._container).removeClass("fade-out");
            $(".videocontrol", this._container).removeClass("fade-in");
        }
    };

    $.sky.html5player.VolumeControls = function (htmlVideo, container) {
        this.MAX_VOLUME = 1;
        this.MIN_VOLUME = 0;
        this.LOW_VOLUME = 0.1;
        this._htmlVideo = htmlVideo;
        this._container = container;
    };

    $.sky.html5player.VolumeControls.prototype = {

        displayMuted: function (isMuted) {
            if (isMuted) {
                $(".sound", this._container).addClass("muted");
            } else {
                $(".sound", this._container).removeClass("muted");
            }
        },
        volumeLevelToDisplay: function (currentVolumeItem, maxVolumeItem) {
            for (var i = currentVolumeItem; i < maxVolumeItem; i++) {
                $(".volume-level li:eq(" + i + ")", this._container).addClass("on");
            }
        },
        convertToTwoDecimalPlaces: function (number) {
            return (Math.round(number * 100) / 100);
        },
        setHTMLVideoVolumeParams: function (volume) {
            if (volume <= this.MAX_VOLUME && volume > this.MIN_VOLUME) {
                this.setHTMLVideoVolume(this.convertToTwoDecimalPlaces(volume));
                this.setHTMLVideoMute(false);
            }
            else if (volume > this.MAX_VOLUME) {
                this.setHTMLVideoVolume(1);
                this.setHTMLVideoMute(false);
            }
            else if (volume <= this.MIN_VOLUME) {
                this.setHTMLVideoVolume(0.1);
                this.setHTMLVideoMute(true);
            }
        },
        setHTMLVideoVolume: function (value) {
            this._htmlVideo.volume = value;
        },
        getHTMLVideoVolume: function () {
            return this._htmlVideo.volume;
        },
        setHTMLVideoMute: function (value) {
            this._htmlVideo.muted = value;
        },
        getHTMLVideoMute: function () {
            return this._htmlVideo.muted;
        },
        setupVolumeBar: function (volumebar) {
            this._volumebar = volumebar;
        },
        setVolumeControl: function (volumeControl) {
            this._volumeControl = volumeControl;
        },
        volumeBarSetGraphic: function () {
            $(".volume-level li", this._container).removeClass("hover inactive");
        },
        /* SET GRAPHICS for click on volume bar, or the plus and minus buttons */
        volumeBarClickSetGraphic: function () {
            this._volumebar.removeClass("on inactive");
            $(".hover", this._container).addClass("on");
        },
        plusClickSetGraphic: function () {
            $(".on", this._volumeControl).first().prev().addClass("on");
        },
        minusClickSetGraphic: function () {
            $(".on", this._volumeControl).first().removeClass("on");
        },
        /* SET VOLUME for click on volume bar, or the plus and minus buttons */
        onVolumebarClickSetVolume: function () {
            this.setHTMLVideoVolumeParams($(".volume-level li.hover", this._container).length / this._volumebar.length);
        },
        onPlusMinusClickSetVolume: function () {
            this.setHTMLVideoVolumeParams($(".volume-level li.on", this._container).length / this._volumebar.length);
        }
    }; // VolumeControls prototype end

    $.sky.html5player.TimeUtilities = function () {
        this.SECONDS_TO_MINUTES = 60;
        this.LIVE = "LIVE";
        this.INITIAL_NUMBER = "00:00";
        this.DOUBLE_DIGIT_START_NUMBER = "10";
        this.ZERO = "0";
        this.INFINITY = 'Infinity';
    };

    $.sky.html5player.TimeUtilities.prototype = {
        formatTime: function (seconds) {
            if (this.isLive(seconds)) {
                return this.LIVE;
            }

            if (!this.secondsAreValid(seconds)) {
                return this.INITIAL_NUMBER;
            }

            seconds = Math.floor(seconds);

            var minutes = this.secondsToMinutes(seconds);
            minutes = this.convertToDoubleDigit(minutes);

            seconds = this.secondsModulus(seconds);
            seconds = this.convertToDoubleDigit(seconds);

            return minutes + ":" + seconds;
        },
        secondsToMinutes: function (seconds) {
            return Math.floor(seconds / this.SECONDS_TO_MINUTES);
        },
        secondsModulus: function (seconds) {
            return Math.floor(seconds % this.SECONDS_TO_MINUTES);
        },
        secondsAreValid: function (seconds) {
            return !(seconds == undefined || isNaN(seconds)) ? true : false;
        },
        isLive: function (seconds) {
            return (seconds == this.INFINITY) ? true : false;
        },
        convertToDoubleDigit: function (digit) {
            return String((digit >= this.DOUBLE_DIGIT_START_NUMBER) ? digit : this.ZERO + digit);
        }
    };

    $.sky.html5player.videoSourceManager = function (list, videoId) {
        this.videos = list;
        this.videoId = videoId;
        this.videoNotFound = false;
        this.flashVideos = {};
        this.nativeVideos = {};
        this.options = { 'large': '576p', 'medium': '360p', 'small': '270p' };
        this.resolutions = ['large', 'medium', 'small'];
        this.supportsFlash = this.checkFlashSupport();
        this.supportsVideo = this.checkVideoSupport();
        this.supportsHLS = this.checkHLSSupport();
        this.isMobile = this.checkIfMobile();
        this.isTablet = this.checkIfTablet() && !this.isMobile;
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function (obj, start) {
                for (var i = (start || 0), j = this.length; i < j; i++) {
                    if (this[i] === obj) { return i; }
                }
                return -1;
            };
        }
        this.init();
    };
    $.sky.html5player.videoSourceManager.prototype = {
        init: function () {
            var mediaSrc;
            //base.log("supports flash ? "+this.supportsFlash+", supports hls ? "+this.supportsHLS+", supports html5 video ? "+this.supportsVideo);
            if (this.videos == undefined && this.videoId == undefined) {
                this.videoNotFound = true;
                //base.log("V N F");
                return;
            }
            if (this.videos == undefined && this.videoId != undefined) {
                this.videoNotFound = true;
                //base.log("V N F");
                return;
            }
            this.preferredRes = this.getPreferredRes();
            this.flashVideos = this.filterFlashVideos();
            this.nativeVideos = this.filterNativeVideos();
            this.getBestMatch();
        },
        checkIfMobile: function () {
            var check = false;
            (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        },
        checkIfTablet: function () {
            var check = false;
            (function (a) { if ((/(android|ipad|kindle)/i).test(a)) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        },
        checkFlashSupport: function () {
            var hasFlash = false;
            try {
                var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                if (fo) hasFlash = true;
            } catch (e) {
                if (navigator.mimeTypes["application/x-shockwave-flash"] != undefined) hasFlash = true;
            }
            return hasFlash;
        },
        checkVideoSupport: function () {
            return !!document.createElement('video').canPlayType;
        },
        checkHLSSupport: function () {
            return !!document.createElement('video').canPlayType && (!!document.createElement('video').canPlayType('application/vnd.apple.mpegURL;video/MP2T') || !!document.createElement('video').canPlayType('application/x-mpegURL;video/MP2T'));
        },
        getPreferredRes: function () {
            var res = 'large';
            if (this.isMobile) res = 'small';
            else if (this.isTablet) res = 'medium';
            return res;
        },
        canPlaySource: function (type) {
            return this.supportsVideo && !!document.createElement('video').canPlayType(type);
        },
        filterFlashVideos: function () {
            var mylist = [];
            mylist = this.getVideosWhere('type', 'video/mp4');
            return mylist;
        },
        filterNativeVideos: function () {
            var mylist = [];
            for (var i = 0; i < this.videos.length; i++) {
                if (this.canPlaySource(this.videos[i].type) && !!this.videos[i].url) {
                    mylist.push(this.videos[i]);
                }
            }
            return mylist;
        },
        getVideosWhere: function (key, value) {
            var mylist = [];
            for (var i = 0; i < this.videos.length; i++) {
                if (this.videos[i][key] == value) {
                    mylist.push(this.videos[i]);
                }
            }
            return mylist;
        },
        filterByResolution: function (videos, res) {
            var mylist = [], index = this.resolutions.indexOf(res);
            while (mylist.length == 0 && index < this.resolutions.length) {
                for (var b = 0; b < videos.length; b++) {
                    if (videos[b].resolution == this.options[this.resolutions[index]]) {
                        mylist.push(videos[b]);
                    }
                }
                index++;
            }
            return mylist;
        },
        getProxyUrl: function (videoId) {
            var mediaSrc = envSettings.base_url + '/video/' + videoId;
            if (sky.html5player.browsers.isFirefox) mediaSrc = mediaSrc + "?type=WEBM";
            mediaSrc += (mediaSrc.indexOf('?') > 0 ? '&' : '?') + 'secure=' + (location.protocol == 'https:');
            return mediaSrc;
        },
        getBestMatch: function () {
            var mylist = [];

            if (this.supportsFlash && this.flashVideos.length > 0) {
                mylist = this.filterByResolution(this.flashVideos, this.preferredRes);
                if (mylist.length > 0)
                    this.flash = mylist[0];
                else
                    this.flash = this.flashVideos[0];
            }

            if (this.supportsHLS) {
                mylist = this.getVideosWhere('resolution', 'Variable');
                if (mylist.length > 0) {
                    this.video = mylist[0];
                    return;
                }
            }

            if (this.supportsVideo && this.nativeVideos.length > 0) {
                mylist = this.filterByResolution(this.nativeVideos, this.preferredRes);
                if (mylist.length > 0) {
                    this.video = mylist[0];
                }
                else {
                    this.video = this.nativeVideos[0];
                }
            }
        },
        get: function (key) {
            return this[key];
        },
        set: function (key, value) {
            if (this.hasOwnProperty(key)) {
                this[key] = value;
            }
        }
    };


    $.sky.html5player.videoControls = function (videoWrap, videoEl, videoOptions, envSettings, videoSettings) {
        this.videoWrap = $(videoWrap);
        this.video = videoEl;
        this.$video = $(videoEl);
        this.videoOptions = videoOptions;
        this.controls = {};
        this.envSettings = envSettings;
        this.videoSettings = videoSettings;
        this.init();
    };
    $.sky.html5player.videoControls.prototype = {
        init: function () {

            var initialplaycontrol = $("<div></div>").addClass("initialplaycontrol");
            initialplaycontrol.append(this.createInitialPlayElement());
            this.videoWrap.append(initialplaycontrol);

            if (this.videoOptions.skin == "transform")
                this.transformControlBuilder();
            else
                this.controlBuilder();

            this.videoOptions.width = this.video.videoWidth;
            this.videoOptions.height = this.video.videoHeight;

            // :active class doesn't work on firefox for the scrub bar button
            if (sky.html5player.browsers.isFirefox) {
                this.controls.seekhandle.mousedown(function () {
                    $(this).addClass('active');
                });
                this.controls.seekhandle.mouseup(function () {
                    $(this).removeClass('active');
                });
            }
        },

        controlBuilder: function () {

            var videocontrol = $("<div></div>").addClass("videocontrol");

            videocontrol.append(this._createTimeControlElement("align-left playpause paused"));
            videocontrol.append(this._createControlElement("align-right fullscreen"));
            videocontrol.append(this._createVolumeElement("align-right sound"));
            videocontrol.append(this._createScrubElement(""));
            this.videoWrap.append(this._createTooltipElement().hide());

            this.videoWrap.append(videocontrol).addClass("init");

            videocontrol = $(".videocontrol", this.videoWrap);

            this.controls = {
                playpause: $(".playpause", this.videoWrap),
                volume: $(".volume", this.videoWrap),
                fullscreen: $(".fullscreen", this.videoWrap),
                volumebar: $(".volume-level li", this.videoWrap),
                seekhandle: $(".scrub-bar .button", this.videoWrap),
                scrubbar: $(".scrub-bar > div", this.videoWrap),
                progressbar: $(".scrub-bar .progress", this.videoWrap),
                mute: $(".volume .mute", this.videoWrap),
                time: $(".time .cur", this.videoWrap)
            };
        },

        transformControlBuilder: function () {
            //transform skin
            this.videoWrap.addClass("sky-transform");

            var videocontrol = $("<div></div>").addClass("video-ctrl");

            if (sky.html5player.browsers.isIE) {
                videocontrol.append($('<div class="play-ctrl paused"><a><img class="playing" src="' + this.getAbsImgPath('new_pause.png') + '"><img class="loading" src="' + this.getAbsImgPath('new_loading_spinner.png') + '"></a></div>'));
            } else {
                videocontrol.append($('<div class="play-ctrl paused"><a><img class="playing" src="' + this.getAbsImgPath('new_pause_spinner.svg') + '"><img class="loading" src="' + this.getAbsImgPath('new_loading_spinner.svg') + '"></a></div>'));
            }
            videocontrol.append($('<div class="time-ctrl"><div class="time"><span class="cur">0:00</span><span class="sep">/</span><span class="dur">0:00</span></div><div class="adText">Advert</div><div class="bufferText">Buffering</div></div>'));
            if (this.videoOptions.hls) {
                videocontrol.append($('<div class="volume-ctrl"></div>').append(this._createHLSVolume()));
            } else {
                videocontrol.append($('<div class="volume-ctrl"></div>').append(this._createHorizontalVolumeControlElement()));
            }
            videocontrol.append($('<div class="fullscreen-ctrl"><a></a></div>'));
            if (this.videoOptions.share) {
                videocontrol.append($('<div class="share-ctrl"><a></a></div>'));
                videocontrol.append(this._createShareElement());
            }
            videocontrol.append($('<div class="progress-ctrl"><div class="loading"></div><div class="buffer"></div><div class="progress"></div><div class="scrub"></div></div>'));
            //            videocontrol.append($("<div class='tooltip' id='tooltip'></div>").append("<div class='top'><span></span></div>").append("<div class='bot'><span class='arrow-border'><span class='arrow-inner'></span></span></div>"));

            this.videoWrap.append(videocontrol).addClass("init");

            this.controls = {
                playpause: $(".play-ctrl", this.videoWrap),
                volume: $(".volume-ctrl", this.videoWrap),
                fullscreen: $(".fullscreen-ctrl", this.videoWrap),
                share: $(".share-ctrl", this.videoWrap),
                seekhandle: $(".progress-ctrl .scrub", this.videoWrap),
                scrubbar: $(".progress-ctrl", this.videoWrap),
                progressbar: $(".progress-ctrl .progress", this.videoWrap),
                mute: $(".volume .mute", this.videoWrap),
                time: $(".time .cur", this.videoWrap),
                volumecontainer: $(".horizontal-volume-container", this.videoWrap),
                volumeoverflowcontainer: $(".horizontal-volume-slider-container-overflow", this.videoWrap),
                volumeimage: $(".horizontal-volume-image", this.videoWrap),
                volumehandle: $(".horizontal-volume-handle", this.videoWrap)
            };

            if (this.videoSettings.configuration.fw_enabled) {
                this.setupAdContentDisplay();
                if (sky.html5player.browsers.isiPhone) {
                    this.videoWrap.append(this._createAdContentDisplayIPhone());
                } else {
                    this.videoWrap.append(this._createAdContentDisplay());
                }
            }

        },

        //So control background should always be black
        createInitialPlayElement: function () {
            var html = "<a><div class='initialplaycontrolbackground'><div class='controlbackground'>";
            if (this.videoOptions.skin == 'transform') html += "<img class='cta_play' src='" + this.getAbsImgPath('play-icon.png') + "'/>";
            else html += "<img class='cta_play' src='" + this.getAbsImgPath('cta_play.svg') + "'/>";
            html += "</div></div></a>";
            return $(html);
        },

        getAbsImgPath: function (relPath) {
            return this.envSettings.base_video_url + '/img/' + relPath;
        },

        _createShareButton: function (attrs) {
            return $("<div></div>")
                .addClass("ctrl-box share-button " + attrs)
                .append($("<div>Share</div>")
                .addClass("ctrl-box-inner")
                .append($("<div></div>")
                .addClass("ctrl-item").append($("<span></span>"))));
        },

        _createShareElement: function () {
            return $("<div class='share'><div class='share-container'>" +
                "<div class='share-image-container'>" +
                "<div class='share-image-frame'><img class='share-image' src='//static.video.sky.com/posterframes/skychasky.jpg' width='100%' ></div></div>" +
                "<div class='share-data'><h1>Share</h1><h2 class='clip-title'></h2><div class='share-platforms'>" +
                "<div class='facebook-link-container'><a class='facebook-link' href='//www.facebook.com' target='_blank'><span></span></a></div>" +
                "<div class='twitter-link-container'><a class='twitter-link' href='//www.twitter.com' target='_blank'><span></span></a></div>" +
                "<div class='googleplus-link-container'><a class='googleplus-link' href='//www.google.com' target='_blank'><span></span></a></div>" +
                "</div><h2>Link</h2><div><input class='share-link' value='unknown'/></div><h2>Embed</h2>" +
                "<div><input type='text' class='embed-link' value='unknown'/></div></div>" +
                "</div></div>");
        },

        _createAdContentDisplay: function () {
            return $("<div></div>")
                .addClass("contentdisplay")
                .append($("<div class='contentposterframe'><img class='contentdisplayposterframe' src='//static.video.sky.com/posterframes/skychasky.jpg' width='100%'/></div><div class='timer'></div>"));
        },

        _createAdContentDisplayIPhone: function () {
            return $("<div></div>")
                .addClass("contentdisplay")
                .append($("<div class='timer'>Your ad will end in 5:00</div>"));
        },

        _createHLSVolume: function () {
            return $("<div class='sound'></div>");
        },

        _createControlElement: function (attrs) {
            return $("<div></div>")
                .addClass("ctrl-box " + attrs)
                .append($("<div></div>")
                .addClass("ctrl-box-inner")
                .append($("<div></div>")
                .addClass("ctrl-item").append($("<span></span>"))));
        },

        _createHorizontalVolumeControlElement: function () {
            return $("<div></div>").addClass("horizontal-volume-container")
                .append($("<div></div>").addClass("horizontal-volume-image").append($("<span></span>")))
                .append($("<div></div>").addClass("horizontal-volume-slider-container-overflow")
                .append($("<div></div>").addClass("horizontal-volume-slider-container")
                .append($("<div>").addClass("horizontal-volume-slider")
                .append($("<div></div>").addClass("horizontal-volume-highlight").append($("<span></span>")))
                .append($("<div></div>").addClass("horizontal-volume-handle").append($("<span></span>")))
                .append($("</div>")))
                .append($("<div></div>").addClass("horizontal-volume-symbol").append($("<span></span>"))))
            );
        },

        _createTimeControlElement: function (attrs) {
            var html = $("<div></div>")
                .addClass("ctrl-box " + attrs)
                .append($("<div></div>")
                .addClass("ctrl-box-inner")
                .append($("<div></div>")
                .addClass("ctrl-item").append(this._createPlayPause()))
                .append($("<div></div>").addClass("time").append($("<div class='cur'>--</div><div class='adText'>Advert</div><div class='sep'>/</div><div class='dur'>--</div>")))
                .append($("<div>Buffering</div>").addClass("buffering")));

            return html;
        },

        _createVolumeElement: function (attrs) {
            return $("<div></div>")
                .addClass("ctrl-box " + attrs)
                .append(
                $("<div></div>")
                    .addClass("ctrl-box-inner")
                    .append($("<ul></ul>")
                    .append($("<li></li>")
                    .addClass("volume")
                    .append($("<a></a>")
                    .addClass("ctrl-item mute").append($("<span></span>")))
                    .append(
                    $("<ul></ul>")
                        .addClass("volume-ctrl")
                        .append("<li class='more'><img src='" + this.getAbsImgPath("volume-plus.svg") + "'/></li>")
                        .append(
                        $("<li></li>")
                            .append($("<ul></ul>").addClass("volume-level")
                            .append($("<li><span></span></li>"))
                            .append($("<li><span></span></li>"))
                            .append($("<li><span></span></li>"))
                            .append($("<li><span></span></li>"))
                            .append($("<li><span></span></li>"))
                            .append($("<li><span></span></li>"))
                            .append($("<li><span></span></li>"))
                            .append($("<li><span></span></li>")))).append("<li class='less'><img src='" + this.getAbsImgPath("volume-minus.svg") + "' style='background-color:white'/></li>")))));
        },

        _createScrubElement: function (attrs) {
            return $("<div></div>")
                .addClass("ctrl-box scrub-bar" + attrs)
                .append($("<div></div>")
                .append($("<div class='loading'><span></span></div>"))
                .append($("<div></div>")
                .addClass("buffer"))
                .append($("<div></div>")
                .addClass("progress"))
                .append($("<div></div>").addClass("button").append($("<div></div>").addClass("highlight"))));
        },

        _createClockElement: function (attrs) {
            return $("<div class='clock white'></div>").addClass(attrs).append("<div class='top'><span></span></div>").append("<div class='bot'><span class='arrow-border'><span class='arrow-inner'></span></span></div>");
        },

        _createTooltipElement: function (attrs) {
            return $("<div class='tooltip white'></div>").addClass(attrs).append("<div class='top'><span></span></div>").append("<div class='bot'><span class='arrow-border'><span class='arrow-inner'></span></span></div>");
        },

        _createPlayPause: function () {
            return '<div><div class="loading"><embed class="spinner" src="' + this.getAbsImgPath('spinner.svg') + '"/></div>' +
                '<div class="playing"><a class="overlay"></a><embed class="cta_pause" src="' + this.getAbsImgPath('cta_pause.svg') + '"/>' +
                '</div><div class="paused"><img class="cta_play" src="' + this.getAbsImgPath('cta_play.svg') + '">' +
                '</div></div>';

        },

        setupAdContentDisplay: function () {
            var contentDisplayPosterImageUrl = this.envSettings.base_url + '/image/' + this.videoOptions.videoId;
            this.setAdContentDisplayPosterImage(contentDisplayPosterImageUrl);
        },

        setAdContentDisplayPosterImage: function (imgSrc) {
            $("img.contentdisplayposterframe", this.videoWrap).attr("src", imgSrc);
        }
    };


})(jQuery);

