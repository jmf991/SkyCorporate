<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="T00-landingpage.aspx.cs" Inherits="SkyCorporate.new_templates.T00_landingpage" %>

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
                    <li><i class="skycon-chevron" aria-hidden="true"></i>
                        <a href="#">
                            Lorem ipsum</a></li>
                    <li><i class="skycon-chevron" aria-hidden="true"></i>
                        <a href="#">
                            Lorem ipsum</a></li>
                </ul>
            </aside>
            <div class="skycom-container clearfix relative">
                <div class="alpha skycom-12">
                    <h2 class="section-title smaller">Product life cycle</h2>
                    
                </div>
                <!-- /skycom-12 -->
            </div>
            <!-- /skycom-container -->
            <div class="skycom-container clearfix">
                <div class="alpha skycom-12">
                    <section class="module clearfix tabs-container page-nav whole-page" data-function="tabs" id='whole-page-nav-tabs'>
                        <h2 class="speak">This is a screenreader header for tabs</h2>
                        <ul class="tabs clearfix" role="tablist">
                            <li id="whole-page-first-tab" aria-label="first" role="tab" class="tab">
                                <a href="#!whole-page-first" class="ellipsis internal-link active">
                                    <span>Product life cycle</span></a>
                            </li>
                        </ul>
                        <div class="dropdown-tab-select">
                            <div aria-hidden="true" class="medium selector">
                                &hellip;</div>
                            <ul class="more-tabs"></ul>
                        </div>
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
        </div>
        <!-- /content-head -->

        <!--#include virtual="/statics/content/lifecicleSlider/slider.htm"-->

         <!--#include virtual="/statics/content/lifecicleSlider/slider.htm"-->
        


        
    </div>
    <!-- /content -->

    <!--#include virtual="/statics/master/footer.htm"-->
</body>
</html>