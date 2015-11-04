



$(document).ready(function () {
    if ($(window).width() > 610) {
        $(".large-static.js-group-overlay").mouseenter(function () {
            var self = $(this); //this is the element u hover
            var group = self.attr("data-group");
            $(".js-group-overlay:not('*[data-group=" + group + "]')").addClass("disabled-overlay");
        });

        $(".large-static.js-group-overlay").mouseleave(function () {
            var self = $(this); //this is the element u hover
            var group = self.attr("data-group");
            $(".js-group-overlay:not([data-group='" + group + "'])").removeClass("disabled-overlay");

        });
    }
});



