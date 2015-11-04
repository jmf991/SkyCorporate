var Filters = function (options) {
    /*variables*/
    var self = this;
    this.resultsWrapper = ".js-results-wrapper";
    this.reloadClickTriggerSelector = ".js-click-filter-trigger"; //for clickable trigger
    this.reloadChangeTriggerSelector = ".js-change-filter-trigger"; //for onchange triggers
    this.reloadFieldInputSelector = ".js-field-filter-input"; //for clickable that gets the value of a field
    this.reloadFieldTriggerSelector = ".js-field-filter-trigger"; //for fields
    this.loadMoreTriggerSelector = ".js-load-more-trigger";
    this.resetFiltersTrigger = ".js-reset-filters-trigger";
    this.removeFilterTrigger = ".js-remove-filter-trigger";
    this.inputs = ["currentPagePiD", "parentFolderPiD", "categoriesPiD", "assetType", "authorPid", "queryString", "orderBy", "take", "skip"]
    this.ajaxLoadingHTML = "<div class='spinner-blue ajax-loading'><p>Please wait...</p></div>";
    this.twitterImpulseAjaxLoadingHTML = "<div class='spinner-blue twitter-ajax-loading'><p>Please wait...</p></div>";
    this.twitterImpulseWrapper = ".js-twitter-impulse";
    this.categoryFilterItem = ".js-category-filter-item";

    /*functions*/
    /*******************************/
    /*bind the events*/
    this.BindEvents = function () {
        $("body").on("click", self.reloadClickTriggerSelector, function (e) {
            e.preventDefault();
            self.updateFilters($(this));
            self.reloadResults($(this), true);
        });
        $("body").on("click", self.loadMoreTriggerSelector, function (e) {
            e.preventDefault();
            $(this).remove();
            self.updateFilters($(this));
            self.reloadResults($(this), false);
        });
        $("body").on("change", self.reloadChangeTriggerSelector, function (e) {
            e.preventDefault();
            self.updateFilters($(this));
            self.reloadResults($(this), true);
        });
        $("body").on("click", self.reloadFieldTriggerSelector, function (e) {
            e.preventDefault();
            var inputSelector = $(this).attr("data-source");
            if ($(inputSelector).val() != "") {
                self.updateFilters($(inputSelector));
                self.reloadResults($(inputSelector), true);
            }
        });
        $("body").on("click", self.resetFiltersTrigger, function (e) {
            e.preventDefault();
            self.resetAllFilters($(this));
            self.reloadResults($(this), true);
        });
        $("body").on("click", self.removeFilterTrigger, function (e) {
            e.preventDefault();
            self.removeActiveFilter($(this));
            self.reloadResults($(this), true);
        });
        $("body").on("focus", self.reloadFieldInputSelector, function (e) {
            $(this).bind('keypress', function (e) {
                if (e.keyCode == 13) {
                    e.preventDefault();
                    var inputSelector = $(this).attr("data-source");
                    self.updateFilters($(this));
                    self.reloadResults($(this), true);
                }
            });
        });
        $("body").on("click", self.categoryFilterItem, function (e) {
            e.preventDefault();
            self.reloadTweets($(this));
        });

//        if (!isIOS()) {
//            window.onpopstate = function () {
//                location.reload(true);
//            };
//        }

    };

    /*update the hidden and visible filters*/
    this.updateFilters = function (trigger) {
        var targetString = trigger.attr("data-target");
        var targetInput = $("#input_" + targetString);
        var currentValue = targetInput.val();
        var newValue = self.getTriggerValue(trigger);

        if (targetInput.hasClass("js-multiple-values") && currentValue !== undefined && currentValue != "") {
            if ((currentValue.indexOf(newValue) == -1))
                targetInput.val(currentValue + "," + newValue);
        } else {
            targetInput.val(newValue);
        }
        updateQueryStringParameter(trigger.attr("data-target"), targetInput.val());
    };


    /*reload twitter impulses by selected category*/
    this.reloadTweets = function (trigger) {
        if ($(".js-twitter-impulse").length) {
            var newValue = self.getTriggerValue(trigger);
            if (!trigger.hasClass("js-load-more-trigger")) {
                dataString = "event=reloadTweetImpulse&target=" + trigger.attr("data-target") + "&value=" + newValue;
                $(self.twitterImpulseWrapper).html(self.twitterImpulseAjaxLoadingHTML);
                $.ajax({
                    url: "/ajax/handler.aspx",
                    data: dataString,
                    type: 'POST',
                    success: function (data) {
                        $(self.twitterImpulseWrapper).html(data);
                        $('.twitter-ajax-loading').remove();
                    }
                });
            }
        }
    };


    /*remove active filter*/
    this.removeActiveFilter = function (trigger) {
        $(".active-filter").removeClass("active-filter");
        var dataTarget = trigger.attr("data-target");
        var targetInput = $("#input_" + dataTarget);

        var currentInputValue = targetInput.val();
        var newInputValue = targetInput.attr("data-default");
        if (targetInput.hasClass("js-multiple-values")) {
            newInputValue = currentInputValue.replace("," + trigger.attr("data-value"), "").replace(trigger.attr("data-value"), "");
        }
        targetInput.val(newInputValue);
        trigger.closest(".js-active-filter-item").remove();

        updateQueryStringParameter(trigger.attr("data-target"), newInputValue);

        if ($(".js-active-filters-impulse").find(".js-active-filter-item").length <= 0) {
            $(".js-active-filters-impulse").hide();
        }
    };


    /*reset filters filter*/
    this.resetAllFilters = function (trigger) {
        $(".active-filter").removeClass("active-filter");
        $(".js-filtes-wrapper").find("*").each(function () {
            $(this).val($(this).attr("data-default"));
        });
        $('.js-field-filter-input').val('');
        $(".js-active-filters-wrapper").html("");
        $(".js-active-filters-impulse").hide();
    };


    /*returns the value of the trigger*/
    this.getTriggerValue = function (trigger) {
        if (trigger.is("input") || trigger.is("textarea") || trigger.is("select")) {
            newValue = trigger.val();
        } else {
            newValue = trigger.attr("data-value");
        }
        return newValue;
    };


    /*reloads the results into the results wrapper*/
    this.reloadResults = function (trigger, reset) {

        if ($(".hide-on-filter").is(":visible")) {
            var takeDefault = parseInt($("#input_take").attr("data-default")) * 2 - $(".js-featured-entry").length;
            $("#input_take").attr("data-default", takeDefault);
            reset = true;
        }

        $(".hide-on-filter").hide();

        if (trigger !== null && trigger !== undefined) {
            var triggerTarget = trigger.attr("data-target");
            $("*[data-target=" + triggerTarget + "]").removeClass("active-filter");
            trigger.addClass("active-filter");
        }

        /*make ajax call*/
        if (reset) {
            $(self.resultsWrapper).html("");
            $("#input_take").val($("#input_take").attr("data-default"));
            $("#input_skip").val(0);
        }

        /*get current values*/
        var dataSerializeInputs = $(".filters").find("input, select, textarea").serialize();
        var resetParameter = reset ? "&reset=true" : "";

        var dataString = dataSerializeInputs + resetParameter;
        $(self.resultsWrapper).append(self.ajaxLoadingHTML);

        $.ajax({
            url: "/ajax/handler.aspx",
            data: dataString,
            type: 'POST',
            success: function (data) {
                if (reset)
                    $(self.resultsWrapper).hide().html(data).show();
                else
                    $(self.resultsWrapper).append(data);
                $('.ajax-loading').remove();
            }
        });
    };
}
