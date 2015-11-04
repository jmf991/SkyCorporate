var Charts = function () {
    var self = this;

    var chartWrapper = $(".js-chart-wrapper");

    var exportinParameters = {
        buttons: {
            contextButton: {
                menuItems: [{
                    text: 'Export to PDF',
                    onclick: function () {
                        this.exportChart({
                            type: 'application/pdf',
                            filename: 'my-pdf'
                        });
                    }
                }, {
                    text: 'Print',
                    onclick: function () {
                        this.print();
                    },
                    separator: false
                }]
            }
        },
        chartOptions: {
            legend: {
                enabled: false
            },
            xAxis: {
                labels: {
                    enabled: true
                }
            }
        }
    };

    this.Initialize = function (trigger) {
        if (chartWrapper.length > 0) {
            chartWrapper.each(function (index) {
                var thisWrapper = $(this);
                var thisChartData = self.getWrapperData(thisWrapper);
                self.renderChart(thisChartData, thisWrapper.find(".js-chart-area"));
            });
        };
    };

    this.getWrapperData = function (thisWrapper) {
        var chartTitleY = thisWrapper.find(".js-chartTitleY").val();
        var chartType = thisWrapper.find(".js-chartType").val();
        var chartSeries = thisWrapper.find(".js-chartSerie");
        var chartXvalues = thisWrapper.find(".js-chartXvalues").val().split(",");
        var chartAltTypeSeries = thisWrapper.find(".js-chartAltSerie");
        var i = 0;

        $.each( chartXvalues, function( entry ) { 
            if (entry == "") {
                chartXvalues[i] == null;
            }
            i++;
        });
        i = 0;
        var seriesData = new Array();
        var legends = new Array();
        var i = 0;


        if (chartSeries.length == 1 && chartType == "bar") {
            var self = chartSeries;
            var dataItem = self.val();
            var serieTitle = self.attr("data-serieTitle");
            var color = self.attr("data-color");
            var serieValuesStrings = self.val().split(",");
            var serieValues = new Array();
            for (var j = 0; j < serieValuesStrings.length; j++) {
                if (serieValuesStrings[j] != "") {
                    serieValues.push(parseFloat(serieValuesStrings[j]));
                } else {
                    serieValues.push(null);
                }
            }

            if (chartType == "bar" && (color == undefined || color == "")) {

                serieValues = serieValues

                for (var j = 0; j < serieValues.length; j++) {
                    if (j == 0) {
                        serieValues[j] = {
                            name: chartXvalues[j],
                            color: {
                                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                stops: [
                                    [0, '#0952A4'],
                                    [1, '#A13384']
                                ]
                            },
                            y: serieValues[j]
                        }
                    }
                }
                seriesData[i] = {
                    name: serieTitle,
                    data: serieValues,
                    color: {
                        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                        stops: [
                                    [0, '#ADACAE'],
                                    [1, '#EEECEC']
                                ]
                    }
                }
            }
            else {
                if (color !== undefined && color != "") {
                    seriesData[i] = {
                        name: serieTitle,
                        data: serieValues,
                        color: color
                    }
                } else {
                    seriesData[i] = {
                        name: serieTitle,
                        data: serieValues
                    }
                }
            }

            var serieType = self.attr("data-serieType");
            if (serieType !== undefined && serieType != "" && serieType != "null") {
                seriesData[i] = {
                    name: serieTitle,
                    data: serieValues,
                    type: serieType
                }
            }
        }
        else {
            chartSeries.each(function () {
                var dataItem = $(this).val();
                var serieTitle = $(this).attr("data-serieTitle");
                var color = $(this).attr("data-color");
                var serieValuesStrings = $(this).val().split(",");
                var serieValues = new Array();
                for (var j = 0; j < serieValuesStrings.length; j++) {
                    if (serieValuesStrings[j] != "") {
                        serieValues.push(parseFloat(serieValuesStrings[j]));
                    } else {
                        serieValues.push(null);
                    }
                }

                if (chartType == "bar" && (color == undefined || color == "")) {
                    seriesData[i] = {
                        name: serieTitle,
                        data: serieValues,
                        color: {
                            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                            stops: [
                                [0, '#0952A4'],
                                [1, '#A13384']
                            ]
                        }
                    }
                }
                else {
                    if (color !== undefined && color != "") {

                        if (chartType == "bar") {
                            seriesData[i] = {
                                name: serieTitle,
                                data: serieValues,
                                color: {
                                    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                    stops: [
                                    [0, '#ADACAE'],
                                    [1, '#EEECEC']
                                ]
                                }
                                
                            }
                        }
                        else {
                            seriesData[i] = {
                                name: serieTitle,
                                data: serieValues,
                                color: color
                            }
                        }
                    } else {
                        seriesData[i] = {
                            name: serieTitle,
                            data: serieValues
                        }
                    }
                }

                var serieType = $(this).attr("data-serieType");
                if (serieType !== undefined && serieType != "" && serieType != "null") {
                    seriesData[i] = {
                        name: serieTitle,
                        data: serieValues,
                        type: serieType
                    }
                }
                legends[i] = serieTitle;
                i++;
            });
        }

        var thisCharData = {
            chartType: chartType,
            legends: legends,
            chartTitleY: chartTitleY,
            chartXvalues: chartXvalues,
            seriesData: seriesData
        };
        return thisCharData;
    };

    this.getTargetLines = function (chartWrapper) {
        var targetLines = chartWrapper.closest(".js-chart-wrapper").find(".js-chartPlotLine");
        var targetLinesData = new Array();
        var i = 0;
        if (targetLines.length) {
            targetLines.each(function () {
                var plotData = {
                    value: $(this).val(),
                    color: $(this).attr("data-color"),
                    width: 2,
                    zIndex: 4,
                    label: { text: $(this).attr("data-serieTitle") }
                };
                targetLinesData[i] = plotData;
                i++;
            });
            return targetLinesData;

        } else {
            return null;
        }

    }

    this.getMaxYValue = function (chartWrapper) {
        var maxValueInput = chartWrapper.closest(".js-chart-wrapper").find(".js-maxYvalue");
        if (maxValueInput.length && maxValueInput.val() !== undefined && maxValueInput.val() != "") {
            return parseInt(maxValueInput.val());
        } else {
            return null;
        }
    }

    this.getChartHeight = function (chartWrapper) {
        var maxHeightInput = chartWrapper.closest(".js-chart-wrapper").find(".js-height");
        if (maxHeightInput.length && maxHeightInput.val() !== undefined && maxHeightInput.val() != "") {
            return parseInt(maxHeightInput.val());
        } else {
            return null;
        }
    }

    this.renderChart = function (chartData, chartWrapper) {
        switch (chartData.chartType) {
            case "column":
                self.drawColumnChart(chartData, chartWrapper);
                break;
            case "stacked":
                self.drawStackedChart(chartData, chartWrapper);
                break;
            case "line":
                self.drawLineChart(chartData, chartWrapper);
                break;
            case "pie":
                self.drawPieChart(chartData, chartWrapper);
                break;
            case "bar":
                self.drawBarChart(chartData, chartWrapper);
                break;
            default:
                self.drawColumnChart(chartData, chartWrapper);
                break;
        }
    };

    this.drawPieChart = function (chartData, chartWrapper) {
        var chartSeries = chartWrapper.closest(".js-chart-wrapper").find(".js-chartSerie");
        var seriesData = new Array();
        var i = 0;
        chartSeries.each(function () {
            var dataItem = $(this).val();
            var serieTitle = $(this).attr("data-serieTitle");
            var serieValues = parseFloat($(this).attr("value"));
            var serieColor = $(this).attr("data-color") !== undefined && $(this).attr("data-color") != "" ? $(this).attr("data-color") : null;
            seriesData[i] = {
                name: serieTitle,
                y: serieValues,
                color: serieColor
            };
            i++;
        });

        chartWrapper.highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                height: self.getChartHeight(chartWrapper)
            },
            title: {
                text: chartData.chartTitleY
            },
            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: chartData.chartTitleY,
                data: seriesData
            }],
            exporting: exportinParameters
        });
    }

    this.drawStackedChart = function (chartData, chartWrapper) {
        var plotLines = self.getTargetLines(chartWrapper);

        chartWrapper.highcharts({
            chart: { type: "column", height: self.getChartHeight(chartWrapper) },
            title: { text: '', x: -20 },
            subtitle: { text: '', x: -20 },
            xAxis: { categories: chartData.chartXvalues },
            yAxis: {
                title: { text: chartData.chartTitleY },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                },
                plotLines: plotLines,
                labels: {
                    formatter: function () {
                        return FormatValueWithCommas(this.value);
                    }
                },
                max: self.getMaxYValue(chartWrapper)
            },
            tooltip: { formatter:
                            function () {
                                if (this.x.length > 0)
                                    return '<b>' + this.x + '</b><br/>' + this.series.name + ': ' + FormatValueWithCommas(this.y) + '<br/>';
                                else
                                    return '<b>' + this.x + '</b>' + this.series.name + ': ' + FormatValueWithCommas(this.y) + '<br/>';
                            }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            textShadow: '0 0 3px black, 0 0 3px black'
                        }
                    },
                    pointWidth: 75,
                    pointPadding: 0
                }
            },
            series:
                chartData.seriesData,
            exporting: exportinParameters
        });
    }

    this.drawLineChart = function (chartData, chartWrapper) {
        chartWrapper.highcharts({
            title: { text: '', x: -20 },
            subtitle: { text: '', x: -20 },
            xAxis: {
                categories: chartData.chartXvalues,
                labels: {
                    rotation: (chartData.chartXvalues.length >= 5) ? -90 : 0
                }
            },
            yAxis: {
                title: { text: chartData.chartTitleY },
                plotLines: self.getTargetLines(chartWrapper),
                labels: {
                    formatter: function () {
                        return FormatValueWithCommas(this.value);
                    }
                },
                max: self.getMaxYValue(chartWrapper)
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: false
                    }
                }
            },
            tooltip: { valueSuffix: '' },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: chartData.seriesData,
            exporting: exportinParameters
        });
    }

    this.drawColumnChart = function (chartData, chartWrapper) {
        var plotLines = self.getTargetLines(chartWrapper);
        chartWrapper.highcharts({
            chart: { type: "column", height: self.getChartHeight(chartWrapper) },
            title: { text: '', x: -20 },
            subtitle: { text: '', x: -20 },
            xAxis: { categories: chartData.chartXvalues },
            yAxis: {
                title: { text: chartData.chartTitleY },
                plotLines: plotLines,
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                },
                max: self.getMaxYValue(chartWrapper)
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.2f}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.1,
                    borderWidth: 0
                }
            },
            series:
                chartData.seriesData,
            exporting: exportinParameters
        });
    }

    this.drawBarChart = function (chartData, chartWrapper) {
        var plotLines = self.getTargetLines(chartWrapper);
        chartWrapper.highcharts({
            chart: { type: "bar", height: self.getChartHeight(chartWrapper) },
            title: { text: '', x: -20 },
            subtitle: { text: '', x: -20 },
            xAxis: { categories: chartData.chartXvalues,
                lineWidth: 0,
                minorGridLineWidth: 0,
                lineColor: 'transparent',
                minorTickLength: 0,
                tickLength: 0
            },
            yAxis: {
                gridLineWidth: 0,
                title: { text: chartData.chartTitleY },
                plotLines: plotLines,
                labels: {
                    //                    formatter: function () {
                    //                        return this.value;
                    //                                        }
                    enabled: false
                },
                max: self.getMaxYValue(chartWrapper)
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.2f}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.1,
                    borderWidth: 0
                },
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                enabled: true
            },
            series:
                chartData.seriesData,
            exporting: exportinParameters
        });
    }


    function FormatValueWithCommas(nStr) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }
}
