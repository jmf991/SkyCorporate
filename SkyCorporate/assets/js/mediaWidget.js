var MediaWidget = function () {
    var self = this;
    var displayLink = '.js-display-link';
    var displayImage = '.js-display-image';
    var displayTitle = '.js-display-title';
    var displayText = '.js-display-text';
    var mediaTrigger = '.js-media-trigger';
    self.init = function () {
        self.events();
    };
    self.events = function () {
        $(mediaTrigger).click(function () {
            var that = this;
            self.setActive(that);
            self.setDisplay(that);
            return false;
        });
        $(mediaTrigger).mouseenter(function () {
            var that = this;
            self.setDisplay(that);
            return false;
        });
        $(mediaTrigger).mouseleave(function () {
            var that = $(mediaTrigger + ".active");
            self.setDisplay(that);
            return false;
        });
    };
    self.setActive = function (that) {
        $(mediaTrigger).removeClass('active');
        $(that).addClass('active');
    };
    self.setDisplay = function (that) {
        $(displayLink).attr('href', $(that).attr('href'));
        $(displayImage).attr('src', $(that).attr('data-image'));
        $(displayTitle).html($(that).attr('data-title'));
        $(displayText).html($(that).attr('data-text'));
        $(displayTitle + "," + displayText).removeClass("black-color").removeClass("white-color");
        $(displayTitle + "," + displayText).addClass($(that).attr('data-color'));
    };
    return this;
} ();