$(document).ready(function () {
   


    $(".js-accordion-remote").click(function () {
        var href = $(this).attr("href");
        $("a.accordion-heading[data-toggle='" + href + "']").click();
    });


    var wwidth = $(window).width();

    if ($(".section-banner-item.active").length && wwidth <= 970) {
        var offset = $(".editable-content").first().offset();
        $('html, body').animate({
            scrollTop: offset.top - 20
        }, 500);
    }


});