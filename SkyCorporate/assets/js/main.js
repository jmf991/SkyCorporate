/********** START MAIN **********/
$(document).ready(function () {
    Functions.BindNavigationEvents();
    Functions.BindSearch();
    Functions.Socials.latestTweetsBar.bindEvents();
    Functions.EventsCalendar.BindEvents();
    Functions.FixToolKitLightbox();
    Functions.ResponsiveMappedImage();
    Functions.EntryIframeVideo();
    Functions.SlidingBanner();
    Functions.TextCarousel();
    Functions.ImpulsesEvents();
    Functions.CookiesBanner();
    Forms.AlertCategoriesCheckboxes();
    MediaWidget.init();

    var filters = new Filters();
    filters.BindEvents();
    var charts = new Charts();
    charts.Initialize();


    

});
/********** END MAIN **********/