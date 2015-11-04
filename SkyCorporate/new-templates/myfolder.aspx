<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="myfolder.aspx.cs" Inherits="SkyCorporate.new_templates.myfolder" %>

<!doctype html>
<html>
<!--#include virtual="/statics/master/head.htm"-->

<body class="grid-1140">
    <!--#include virtual="/statics/master/header.htm"-->
    <div id="content">

        <div class="content-head">
            <aside id="skycom-breadcrumb" class="skycom-container clearfix">
                <h2 class="speak">Navigational Trail</h2>
                <ul>
                    <li>
                        <i class="skycon-chevron" aria-hidden="true"></i>
                        <a href="#">Lorem ipsum</a>
                    </li>
                    <li>
                        <i class="skycon-chevron" aria-hidden="true"></i>
                        <a href="#">Lorem ipsum</a>
                    </li>
                </ul>
            </aside>
            <div class="skycom-container clearfix relative">
                <div class="alpha skycom-12">
                    <h2 class="section-title smaller">Image & Video Library</h2>

                </div>
                <!-- /skycom-12 -->
            </div>
            <!-- /skycom-container -->
            <div class="skycom-container clearfix">
                <div class="alpha skycom-12">
                    <section class="module clearfix tabs-container page-nav whole-page" data-function="tabs" id="whole-page-nav-tabs">
                        <h2 class="speak">This is a screenreader header for tabs</h2>
                        <ul class="tabs clearfix" role="tablist">
                            <li id="whole-page-first-tab" aria-label="first" role="tab" class="tab">
                                <a href="#!whole-page-first" class="ellipsis internal-link">
                                    <span>Product 1</span></a>
                            </li>
                            <li id="whole-page-second-tab" aria-label="second" role="tab" class="tab">
                                <a href="#!whole-page-second" class="ellipsis internal-link">
                                    <span>Product 2</span></a>
                            </li>
                            <li id="whole-page-third-tab" aria-label="third" role="tab" class="tab">
                                <a href="#!whole-page-third" class="ellipsis internal-link active">
                                    <span>Product 3</span></a>
                            </li>
                            <li id="whole-page-forth-tab" aria-label="forth" role="tab" class="tab">
                                <a href="#!whole-page-forth" class="ellipsis internal-link">
                                    <span>Product 4</span></a>
                            </li>
                            <li id="whole-page-fifth-tab" aria-label="fifth" role="tab" class="tab">
                                <a href="#!whole-page-fifth" class="ellipsis internal-link">
                                    <span>Product 5</span></a>
                            </li>
                            <li id="whole-page-sixth-tab" aria-label="sixth" role="tab" class="tab">
                                <a href="#!whole-page-sixth" class="ellipsis internal-link">
                                    <span>Product 6</span></a>
                            </li>
                            <li id="whole-page-seventh-tab" aria-label="seventh" role="tab" class="tab">
                                <a href="#!whole-page-seventh" class="ellipsis internal-link">
                                    <span>Product 7</span></a>
                            </li>
                            <li id="whole-page-eighth-tab" aria-label="eighth" role="tab" class="tab">
                                <a href="#!whole-page-eighth" class="ellipsis internal-link">
                                    <span>Product 8</span></a>
                            </li>
                            <li id="whole-page-ninth-tab" aria-label="ninth" role="tab" class="tab">
                                <a href="#!whole-page-ninth" class="ellipsis internal-link">
                                    <span>Product 9</span></a>
                            </li>
                        </ul>
                    </section>
                </div>
                <!-- /skycom-12 -->
            </div>
            <!-- /skycom-container -->
            <script>
                require(['toolkit'], function () {
                    $('#whole-page-nav-tabs').inPageNav();
                });
            </script>
            <div class="skycom-12 m40 sky-form">
                <p class="pod-title">Welcome to your saved images folder.</p>
                <a href="#" class="btn">Download all images</a>
                <a href="#" class="btn">Download all images</a>
                <a href="#" class="btn btn--secondary">Empty folder</a>
            </div>
        </div>
        <!-- /content-head -->

        <div class="skycom-container clearfix impulses-wrapper">
            <div class="skycom-4 alpha">
                <!--#include virtual="/statics/content/modules/imagebox.html"-->
            </div>
            <div class="skycom-4">
                <!--#include virtual="/statics/content/modules/imagebox.html"-->
            </div>
            <div class="skycom-4">
                <!--#include virtual="/statics/content/modules/imagebox.html"-->
            </div>
            <div class="skycom-4  alpha">
                <!--#include virtual="/statics/content/modules/imagebox.html"-->
            </div>
            <div class="skycom-4">
                <!--#include virtual="/statics/content/modules/imagebox.html"-->
            </div>
            <div class="skycom-4">
                <!--#include virtual="/statics/content/modules/imagebox.html"-->
            </div>
            <div class="skycom-4 alpha">
                <!--#include virtual="/statics/content/modules/imagebox.html"-->
            </div>
            <div class="skycom-4">
                <!--#include virtual="/statics/content/modules/imagebox.html"-->
            </div>
            <div class="skycom-4">
                <!--#include virtual="/statics/content/modules/imagebox.html"-->
            </div>
            <div class="clearfix"></div>






        </div>
        <div class="clearfix"></div>
    </div>

    <!--#include virtual="/statics/content/modules/downloadpopup.html"-->

    <!-- /content -->

    <!--#include virtual="/statics/master/footer.htm"-->
</body>
</html>
