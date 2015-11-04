<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="T00-landingpage.aspx.vb" Inherits="SkyCorporate.T00_landingpage" %>

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
        

        <div class="skycom-container clearfix lightgrey-bg margin-bottom-40">
            <div class="skycom-12 alpha clearfix ">

                <div class="padding-20">

                    <h3 class="pod-title smaller row-title">Sustainable products approach</h3>
                    <p>At Sky we set out to make our products more sustainable, and put in place fundamental building blocks to achieve that. The core elements of Sky’s Better Products Programme include:</p>
                    <ul>
                        <li>Using Life Cycle Assessment techniques to understand the environmental impact of our products from cradle to grave, i.e    extraction of material resources through manufacture, use to  disposal, from an environmental impacts perspective, as well as greenhouse gas emissions.</li>
                        <li>Developing tools and training to embed eco-design and enable decision making across the entire products </li>
                    </ul>
                    <p>We have identified where we have the biggest environmental impact, and where we have the most influence.</p>
                    <h3 class="pod-title smaller row-title">Life cycle assessment findings</h3>
                    <p>Below is the breakdown of greenhouse gas emissions for the Sky+ HD box by life cycle stage. We’ve modelled this based on  a technical design life of ten years, as we have designed for longevity. The electricity consumed in use accounts for the majority of Green House Gas emissions, and we are making great strides to make the product more efficient without compromising functionality.</p>
                    <p>Of the other life cycle stages, we have identified that the next biggest impact lies with the manufacture of components and the supply chain. Sky+ HD Box GHG emissions contribution from components:  5.5% of the total (Percent %)</p>
                

                    <div class="skycom-6 alpha">
                        <p><strong>Lorem ipsum</strong></p>
                        <p>Lorem ipsum</p>
                                    <img src="/assets2015/images/samples/Untitled-2.jpg" alt="Lorem ipsum" />
                                
                    </div>
                     <div class="skycom-6 ">
                        <p><strong>Lorem ipsum</strong></p>
                        <p>Lorem ipsum</p>
                        <img src="/assets2015/images/samples/Untitled-3.jpg" alt="Lorem ipsum" />
                                
                    </div>
                </div>

            </div>
            <!-- /skycom-12 -->
        </div>
        <!-- /skycom-container -->

        
        <!--#include virtual="/statics/content/accordions/accordion.htm"-->

        
    </div>
    <!-- /content -->

    <!--#include virtual="/statics/master/footer.htm"-->
</body>
</html>