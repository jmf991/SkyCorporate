var Forms = {
    FileUpload: function () {
        if ($('.uploader-wrapper').length) {
            $('.uploader-wrapper').fineUploader(
            {
                request: {
                    endpoint: '/ajax/uploader.ashx'
                },
                failedUploadTextDisplay: {
                    mode: 'custom',
                    maxChars: 40,
                    responseProperty: 'error',
                    enableTooltip: true
                },
                multiple: true,
                text: {
                    cancelButton: 'X',
                    uploadButton: 'Click here or drag your files',
                    dragZone: 'Drop the files'
                }
            }).on('complete', function (event, id, fileName, responseJSON) {
            }).on('submit', function (event, id, fileName, responseJSON) {
            });
        }
    },
    AvoidFormPost: function () {
        $("#gt__gtform").submit(function (event) {
            event.preventDefault();
            var dataString = $(".js-form-wrapper").find("input,textarea,select").serialize();
            $.ajax({
                url: "/ajax/handler.aspx",
                data: dataString,
                type: 'POST',
                success: function (data) {
                    $(".js-form-target").html(data);
                    Forms.FileUpload();
                }
            });
        });
    },
    ShowPrevStep: function (step) {
        var dataString = $(".js-form-wrapper").find("input,textarea,select").serialize();
        dataString = dataString + "&goToStep=" + step;
        $.ajax({
            url: "/ajax/handler.aspx",
            data: dataString,
            type: 'POST',
            success: function (data) {
                $(".js-form-target").html(data);
                Forms.FileUpload();
            }
        });
    },
    SignupNewsLetter: function (step) {
        $("#gt__gtform").submit(function (event) {
            var dataString = $(".js-newsletter-form-wrapper").find("input,textarea,select").serialize();
            event.preventDefault();
            dataString = dataString + "&event=signupnewsletter";
            $.ajax({
                url: "/ajax/handler.aspx",
                data: dataString,
                type: 'POST',
                success: function (data) {
                    $(".js-newsletter-form-wrapper").html(data);
                }
            });
        });
    },
    AlertCategoriesCheckboxes: function () {
        $(".js-checkbox-cat-trigger").change(function () {
            var category = $(this);
            var targets = $("." + category.attr("data-target"));
            targets.each(function () {
                if (category.is(":checked")) {
                    if (!$(this).hasClass("disabled-by-type")) {
                        $(this).prop("checked", true);
                    }
                    $(this).removeClass("disabled-by-category");
                } else {
                    $(this).prop("checked", false).addClass("disabled-by-category");
                }

            });
        });
        $(".js-checkbox-type-trigger").change(function () {
            var type = $(this);
            var targets = type.closest(".js-checkboxes-group").find(".js-sub-checkboxes-wrapper input");
            targets.each(function () {
                if (type.is(":checked")) {
                    if (!$(this).hasClass("disabled-by-category")) {
                        $(this).prop("checked", true);
                    }
                    $(this).removeClass("disabled-by-type");
                } else {
                    $(this).prop("checked", false).addClass("disabled-by-type");
                }
            });
        });
    }
};