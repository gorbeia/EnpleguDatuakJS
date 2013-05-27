"use strict";
/*global $:false */
/*global google:false */
var App = function(data, selector, defaultOptions) {
  defaultOptions.highlight = typeof defaultOptions.highlight === 'undefined' ? true : defaultOptions.highlight;
  defaultOptions.chart = typeof defaultOptions.chart === 'undefined' ? true : defaultOptions.chart;
  defaultOptions.table = typeof defaultOptions.table === 'undefined' ? true : defaultOptions.table;
  defaultOptions.selector = typeof defaultOptions.selector === 'undefined' ? true : defaultOptions.selector;
  var self = this,
          chart,
          table,
          highlight,
          options,
          recordedEmployment;
  options = {
    title: 'Gizarte Segurantzan afiliazioa Aiaraldean',
    isStacked: true,
    width: defaultOptions.width || 380,
    chartArea: {width: defaultOptions.width - 45 || 335, left: 45, top: 20, height: 300},
    animation: {duration: 600, easing: 'linear'},
    legend: {position: 'in'},
    vAxis: {textStyle: {fontSize: 12}},
    hAxis: {textStyle: {fontSize: 12}}
  };

  recordedEmployment = RecordedEmployment.init(data);

  var drawChart = function(displayData) {
    if (typeof chart !== "undefined") {
      var chartData = google.visualization.arrayToDataTable(displayData.getDetailed());
      chart.draw(chartData, options);
    }
  };
  var drawTable = function(displayData) {
    if (typeof table !== "undefined") {
      var tableData = google.visualization.arrayToDataTable(displayData.getTable());
      table.draw(tableData, options);
    }
  };

  var drawHL = function(displayData) {
    if (typeof highlight !== "undefined") {
      var hl = displayData.getHighLights();
      highlight.find(".total").text(numberWithCommas(hl.current));
      highlight.find(".compare-month span").text(hl.sincePreviousMonth).
              removeClass("positive negative").
              addClass(hl.sincePreviousMonthSign);
      highlight.find(".compare-year span").text(hl.sincePreviousYear).
              removeClass("positive negative").
              addClass(hl.sincePreviousYearSign);
      highlight.find(".month").text(hl.month);
    }
  };
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  var initCallBack = function() {
    initHightlight();
    initChart();
    initTable();
    initSelector();
    self.refresh();
  };
  var initTable = function() {
    if (defaultOptions.table) {
      var tableElement = $('<div/>',
              {
                class: 'chart_table',
                style: 'height: 210px;width:' + defaultOptions.width + 'px;'
              }
      ).appendTo(selector);
      table = new google.visualization.Table(tableElement[0]);
    }
  };
  var initChart = function() {
    if (defaultOptions.chart) {
      var chartElement = $('<div/>',
              {
                class: 'chart_div',
                style: 'height: 360px;width:' + defaultOptions.width + 'px;'
              }
      ).appendTo(selector);
      chart = new google.visualization.AreaChart(chartElement[0]);
    }
  };
  var initHightlight = function() {
    if (defaultOptions.highlight) {
      var highlightElement = $('<div/>',
              {
                class: 'chart_hl'
              }
      ).appendTo(selector);
      highlightElement.append('<h2>Langileak guztira</h2>');
      highlightElement.append('<div class="month">0000/00</div>');
      highlightElement.append('<div class="total">0</div>');
      highlightElement.append('<div class="compare compare-month"><span class="negative">0</span> aurreko hilabetetik</div>');
      highlightElement.append('<div class="compare compare-year"><span class="negative">0</span> aurreko urtetik</div>');
      highlight = highlightElement;
    }
  };
  var initSelector = function() {
    if (recordedEmployment.municipalities.length > 1 && defaultOptions.selector) {
      var selectorElement = $('<div/>',
              {
                class: 'chart_selector',
                style: 'width:' + defaultOptions.width + 'px;margin-top: 10px;text-align: center;'
              }
      ).appendTo(selector);
      jQuery.each(recordedEmployment.municipalities, function(index, value) {
        selectorElement.append("<div class='mselector selected'>" + value.name + "</div> ");
      });
      $("div.mselector").on('click', function() {
        if ($(".chart_selector > .selected").length === 1 && $(this).hasClass('selected')) {
          return;
        }
        $(this).toggleClass("selected");
        var ms = $(this).text();
        recordedEmployment.selectedMunicipalities[ms] = !recordedEmployment.selectedMunicipalities[ms];
        self.refresh();
      });
    }
  };

  /* Public API */
  self.refresh = function() {
    var displayData = recordedEmployment.sum(recordedEmployment);
    drawChart(displayData);
    drawTable(displayData);
    drawHL(displayData);
  };

  /* Init*/
  $(document).ready(function() {
    google.load("visualization", "1", {packages: ["corechart", "table"], callback: initCallBack});
  });
};