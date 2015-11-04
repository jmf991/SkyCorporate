var Functions = {
    /*bind search*/
    BindSearch: function () {
        $(".js-search-trigger").click(function (e) {
            var field = $(".js-searchField");
            if (field.val() != "" && field.val() !== undefined) {
                var queryDelimiter = "?";
                if (field.attr("data-searchurl").indexOf("?")) {
                    queryDelimiter = "&";
                }

                window.location.href = field.attr("data-searchurl") + queryDelimiter + "search=" + field.val();
            }
        });
        $(".js-searchField").focus(function () { $(this).bind('keypress', function (e) { if (e.keyCode == 13) { e.preventDefault(); $(".js-search-trigger").click(); } }); });
    },
    ajax: {
        addAjaxLoader: function (target) {
            /*adds ajax loader icon*/
            if (target !== undefined) {
                var targetPosition = target.offset();
                var targetWidth = target.width();
                $(target).append("<div class='spinner-blue ajax-loading'><p>Please wait...</p></div>");
            } else {
                $("body").append("<div class='spinner-blue ajax-loading'><p>Please wait...</p></div>");
            }
        },
        removeAjaxLoader: function (target) {
            $('.ajax-loading').remove();
        }
    },
    BindNavigationEvents: function () {
        $('.navigation-trigger').click(function () {
            if ($('.navigation').hasClass('active')) {
                $('.navigation').removeClass('active');
            } else {
                $('.navigation').addClass('active');
            }
            return false;
        });

        $('.twitter-menu-trigger').click(function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active').text('Edit');
                $('.twitter-edit-container').slideUp();
            } else {
                $(this).addClass('active').text('Done');
                $('.twitter-edit-container').slideDown();
            }
            return false;
        });

        $('.js-redirect-dropdown').change(function (e) {
            e.preventDefault();
            var redirectionUrl = $(this).val();
            window.location.href = redirectionUrl;
        });
    },
    Socials: {
        loadSocialsAjax: function (elementID) {
            var socialsWrapper = $("#js-ajaxSocials" + elementID);
            var dataString = "event=loadSocialsAjax&pid=" + elementID;
            $.ajax({
                url: "/ajax/handler.aspx",
                data: dataString,
                type: 'POST',
                success: function (data) {
                    socialsWrapper.html(data);
                }
            });
        },
        latestTweetsBar: {
            bindEvents: function () {
                $(".js-reload-tweets-account").click(function (e) {
                    e.preventDefault();
                    var pid = $(this).attr("data-pid");
                    Functions.Socials.latestTweetsBar.reloadTweets(pid);
                    $(this).closest(".edit-list").find(".active").removeClass("active");
                    $(this).parent().addClass('active');
                });
            },
            reloadTweets: function (accountPid) {
                var socialsWrapper = $(".js-twitter-feed-wrapper");
                var dataString = "event=reloadTweets&pid=" + accountPid;
                socialsWrapper.html("");
                Functions.ajax.addAjaxLoader(socialsWrapper);
                $.ajax({
                    url: "/ajax/handler.aspx",
                    data: dataString,
                    type: 'POST',
                    success: function (data) {
                        Functions.ajax.removeAjaxLoader();
                        socialsWrapper.html(data);
                    }
                });
            }
        }
    },
    EventsCalendar: {
        Download: function (trigger) {
            var eventPiD = encodeURI(trigger.attr("data-PiD"));
            window.open("/ajax/handler.aspx?event=getEventIcal&eventPID=" + eventPiD);
        },
        BindEvents: function (trigger) {
            $('.addToCalendar').click(function (e) { e.preventDefault(); Functions.EventsCalendar.Download($(this)); });
        }
    },
    FixToolKitLightbox: function () {
        $("body").on("click", ".js-ajax-lightbox", function (e) { e.preventDefault(); });
        $("body").on("click", ".js-lightbox", function (e) { e.preventDefault(); });
    },
    ResponsiveMappedImage: function () {
        $('img[usemap]').rwdImageMaps();
    },
    EntryIframeVideo: function () {
        $("body").on("click", ".js-iframe-trigger", function (e) {
            var trigger = $(this);
            var iframe = trigger.parent().find(".js-iframe-hidden");
            iframe.fadeIn();
        });
    },
    SlidingBanner: function () {
        if ($('.slides-wrapper').length) {
            function sliderChange(args) {

                $('.js-slide-indicator.active').removeClass('active');

                $('.sliding-banner .indicators .js-slide-indicator:eq(' + (args.currentSlideNumber - 1) + ')').addClass('active');
                $('.sliding-banner .nav-wrapper .js-slide-indicator:eq(' + (args.currentSlideNumber - 1) + ')').addClass('active');

                $('.js-slidingbanner-captions-wrapper .js-slide-caption').removeClass('active');
                $('.js-slidingbanner-captions-wrapper .js-slide-caption:eq(' + (args.currentSlideNumber - 1) + ')').addClass('active');
                
            }
            
            $('.slides-wrapper').iosSlider({
                snapToChildren: true,
                onSlideChange: sliderChange,
                autoSlide: true,
                navSlideSelector: $('.js-slide-indicator'),
                infiniteSlider: true,
                autoSlideTimer: 5000,
                autoSlideTransTimer: 1000
            });

            $('.js-slidingbanner-captions-wrapper .js-slide-caption:eq(0)').addClass('active');

            $('.sliding-banner .nav-wrapper .js-slide-indicator').hover(function () {
                var index = $(this).attr("data-index");
                $('.slides-wrapper').iosSlider('goToSlide', index);
            });
        }
    },
    TextCarousel: function () {
        if ($('.js-text-slides').length) {
            function sliderChange(args) {
                $('.js-slide-indicator.active').removeClass('active');
                $('.sliding-banner .indicators .js-slide-indicator:eq(' + (args.currentSlideNumber - 1) + ')').addClass('active');
                var newHeight = $(".slide-item-" + args.currentSlideNumber).height();
                $('.js-text-slides').animate({ height: newHeight });
            }
            $('.js-text-slides').iosSlider({
                snapToChildren: true,
                onSlideChange: sliderChange,
                autoSlide: true,
                navSlideSelector: $('.js-slide-indicator'),
                infiniteSlider: true,
                autoSlideTimer: 4000,
                autoSlideTransTimer: 1000
            });

            var newHeight = $(".slide-item-1").height();
            $('.js-text-slides').animate({ height: newHeight });


        }
    },
    ImpulsesEvents: function () {
        /*show more contributors impulse*/
        $("body").on("click", ".js-show-more .js-trigger", function (e) {
            e.preventDefault();
            var wrapper = $(this).closest(".js-show-more");
            var content = wrapper.find(".js-show-more-content");
            $(this).hide();
            content.slideDown();
        });
    },
    CookiesBanner: function () {
        $("body").on("click", ".cookie-banner-close", function (e) {
            e.preventDefault();
            setCookie("ck-disclaimer", "1", 90);
            $(".cookie-banner").hide();
        });
    }
}


function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString() + ";path=/");
    document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1) {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1) {
        c_value = null;
    }
    else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start, c_end));
    }
    return c_value;
}

/*UPDATE URL AND PUSH STATE*/
/*******************************/
function updateQueryStringParameter(key, value) {
    var uri = window.location.href;
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    var newUri = uri;
    if (uri.match(re)) {
        newUri = uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        newUri = uri + separator + key + "=" + value;
    }
    //window.location.href = newUri;
    if (window.history.pushState !== undefined)
        window.history.pushState("", "", newUri);
}

function QueryStringGetParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/*DETECT IOS USERS*/
/*******************************/
function isIOS() {
    return (
        (navigator.userAgent.match(/(iPod|iPhone|iPad)/))
    );
}