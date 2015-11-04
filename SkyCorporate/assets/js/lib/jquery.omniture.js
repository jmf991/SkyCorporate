(function ($) {
    $.sky_omniture = function (element, configObject, baseVideoUrl) {

        var el = element;
        var videoplaying = false;

        if (typeof SKY_TRACKING === "undefined") {
            window.SKY_TRACKING = {
                site: document.domain ? document.domain : document.location.href,
                section: document.domain ? document.URL.substring(document.domain.length + 7) : document.location.href,
                headline: document.title,  //video title goes here
                contentType: "video",
                contentId: "1",  // optional - video id
                account: "Default"
            };
        }

        var videosettings = {
            category: "sitecategory",
            mediaUrl: "defaultUrl",
            clipTitle: "Default",
            type: "proxy",
            guid: "1",
            videoFormat: "proxy",
            provider: "internet",
            site: document.domain ? document.domain : document.location.href
        };

        var mediaparams;

        element.data("sky_omniture", this);

        var log = function (msg) {
            if (window.console && sky.html5player.log_level > 0) {
                console.log("[skyplayer - omniture] " + configObject.guid + ": " + msg);
                if (sky.html5player.log_container) {
                    $("." + sky.html5player.log_container).append("<div>[skyplayer  - omniture] " + configObject.guid + ": " + msg + "</div>");
                }
            }
        };

        var omnitureHandler = function (e) {
            // we're only tracking events fired when the main content, not the adverts
            if (element.data("sky.html5player.advert")) return;

            var currentTime;
            if (element[0].currentTime > 0) {
                currentTime = element[0].currentTime;
            } else {
                currentTime = 0;
            }
            var stringvalues = "event[" + e.type + "] src:" + element[0].src + " currentTime:" + currentTime + " duration:" + element[0].duration + " \n";
            log(stringvalues);

            if (e.type == "loadedmetadata") {
                // don't do anything at this time.
                log("omnitureHandler - loadedmetatdata");
            }
            if (e.type == "seeking" && videoplaying) {
                s_bskyb.Media.stop(mediaparams.Media.name, currentTime);
            }
            if (e.type == "play" && videoplaying) {
                s_bskyb.Media.play(mediaparams.Media.name, currentTime);
            }
            if (e.type == "play" && !videoplaying) {
                videoplaying = true;
                var medialength = element[0].duration ? element[0].duration : configObject.duration;
                s_bskyb.Media.open(mediaparams.Media.name, medialength, mediaparams.Media.playerName);
                s_bskyb.Media.play(mediaparams.Media.name, currentTime);
            }
            if (e.type == "seeked" && videoplaying) {
                s_bskyb.Media.play(mediaparams.Media.name, currentTime);
            }
            if (e.type == "pause" && videoplaying) {
                s_bskyb.Media.stop(mediaparams.Media.name, currentTime);
                if (currentTime == element[0].duration) {
                    log("event[" + e.type + "] | src: " + e.target.src + " calling close method");
                    videoplaying = false;
                    s_bskyb.Media.close(mediaparams.Media.name);
                }
            }
            if (e.type == "ended") {
                videoplaying = false;
                s_bskyb.Media.stop(mediaparams.Media.name, currentTime);
                s_bskyb.Media.close(mediaparams.Media.name);
            }
        };

        var setTrackingOn = function () {
            log("setTrackingOn");
            element[0].addEventListener('loadedmetadata', omnitureHandler, false);
            element[0].addEventListener('durationchange', omnitureHandler, false);
            element[0].addEventListener('seeked', omnitureHandler, false);
            element[0].addEventListener('seeking', omnitureHandler, false);
            element[0].addEventListener('play', omnitureHandler, false);
            element[0].addEventListener('pause', omnitureHandler, false);
            element[0].addEventListener('ended', omnitureHandler, false);
        };

        var setTrackingOff = function () {
            log("setTrackingOff");
            element[0].removeEventListener('loadedmetadata', omnitureHandler, false);
            element[0].removeEventListener('durationchange', omnitureHandler, false);
            element[0].removeEventListener('seeked', omnitureHandler, false);
            element[0].removeEventListener('seeking', omnitureHandler, false);
            element[0].removeEventListener('play', omnitureHandler, false);
            element[0].removeEventListener('pause', omnitureHandler, false);
            element[0].removeEventListener('ended', omnitureHandler, false);
        };

        var setMediaModule = function () {
            s_bskyb.loadModule("Media");

            for (var prop in mediaparams) {

                if (typeof (mediaparams[prop]) == "object") {
                    for (var prop1 in mediaparams[prop]) {
                        s_bskyb[prop][prop1] = mediaparams[prop][prop1];
                        //console.log("s_bskyb["+prop+"]["+prop1+"] = mediaparams ["+prop+"]["+prop1+"] {"+mediaparams[prop][prop1]+"}" );
                    }
                } else {
                    s_bskyb[prop] = mediaparams[prop];
                    //console.log("s_bskyb["+prop+"] = mediaparams ["+prop+"] {"+mediaparams[prop]+"}" );
                }
            }
            setTrackingOn();
        };

        this.init = function (configObject, baseVideoUrl) {
            log("Omniture tracking initialisation");

            var videoMetaInfo = {};
            videoMetaInfo.category = configObject.category ? configObject.category : "category";
            videoMetaInfo.mediaUrl = configObject.mediaUrl ? configObject.mediaUrl : "mediaUrl";
            videoMetaInfo.clipTitle = configObject.clipTitle ? configObject.clipTitle : "clipTitle";
            videoMetaInfo.guid = configObject.guid;
            videoMetaInfo.videoFormat = configObject.selectedVideo.resolution + "|" + configObject.selectedVideo.bitRate + "|" + configObject.selectedVideo.type;
            videoMetaInfo.type = "video";
            videoMetaInfo.provider = videoMetaInfo.guid != "guid" ? "skyvideolibrary" : "provider";

            log("Omniture tracking videoMetaInfo " + JSON.stringify(videoMetaInfo));

            SKY_TRACKING.contentId = configObject.guid;
            SKY_TRACKING.account = configObject.configuration.om_account;
            SKY_TRACKING.site = configObject.site ? configObject.site : (document.domain ? document.domain : document.location.href);
            log("account is " + SKY_TRACKING.account);

            mediaparams = {
                Media: {
                    name: videoMetaInfo.clipTitle,
                    trackWhilePlaying: true,
                    autoTrack: true,
                    playerName: "html5player",
                    trackMilestones: "0,25,50,75",
                    trackVars: "hier5,eVar10,eVar28,eVar70,eVar71,eVar72,eVar73,eVar74,prop26,prop70,prop71,prop72,prop73,prop74"
                },
                hier5: videoMetaInfo.category,
                eVar10: videoMetaInfo.mediaUrl,
                eVar28: videoMetaInfo.clipTitle,
                eVar70: videoMetaInfo.category,
                eVar71: videoMetaInfo.type,
                eVar72: videoMetaInfo.guid,
                eVar73: videoMetaInfo.category,
                eVar74: videoMetaInfo.videoFormat,
                prop26: videoMetaInfo.clipTitle,
                prop70: videoMetaInfo.category,
                prop71: videoMetaInfo.type,
                prop72: videoMetaInfo.guid,
                prop73: videoMetaInfo.category,
                prop74: videoMetaInfo.videoFormat
            };

            //            if ( "undefined" === typeof window.s_bskyb && "undefined" === typeof window.analytics) {
            require([baseVideoUrl + "/plugin/s_code.js"], function () {
                log("Omniture tracking s_bskyb||analytics is undefined , calling s_code.js ");
                setMediaModule();
            });
            //            } else {
            //                setMediaModule();
            //            }

        };

        //init - end
        this.init(configObject, baseVideoUrl);

    };

    $.fn.sky_omniture = function (configObject, baseVideoUrl) {
        return this.each(function () {
            (new $.sky_omniture($(this), configObject, baseVideoUrl));
        });
    };

})(jQuery);