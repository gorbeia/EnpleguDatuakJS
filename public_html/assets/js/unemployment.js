"use strict";
var Unemployment = new (function() {
  var self = this, data;
  self.municipalities = [];
  self.selectedMunicipalities = {};

  self.findOrCreateMunicipality = function(_app, _municipality) {
    var parent = _app;
    var length = parent.municipalities.length;
    for (var i = 0; i < length; i++) {
      if (parent.municipalities[i].name === _municipality) {
        return parent.municipalities[i];
      }
    }
    var m = new Municipality(_municipality);
    parent.municipalities.push(m);
    parent.selectedMunicipalities[m.name] = true;
    return m;
  };

  self.sum = function(_app) {
    var parent = _app;
    var self = this;
    var length = 0,
            m = null,
            periodLength = 0,
            displays = new DisplayData(),
            municipalities;
    municipalities = parent.municipalities;
    length = municipalities.length;
    for (var i = 0; i < length; i++) {
      m = self.municipalities[i];
      if (parent.selectedMunicipalities[m.name] === false)
        continue;
      periodLength = m.periods.length;
      for (var j = 0; j < periodLength; j++) {
        if (displays.months[m.periods[j].time] === undefined) {
          displays.months[m.periods[j].time] = new MonthData();
        }
        var display = displays.months[m.periods[j].time];
        display.general += parseInt(m.periods[j].data.general, 10);
        display.farming += parseInt(m.periods[j].data.farming, 10);
        display.sea += parseInt(m.periods[j].data.sea, 10);
        display.coal += parseInt(m.periods[j].data.coal, 10);
        display.house += parseInt(m.periods[j].data.house, 10);
        display.freelance += parseInt(m.periods[j].data.freelance, 10);
        display.total += parseInt(m.periods[j].data.total, 10);
      }
    }

    return displays;
  };


  var Municipality = function(_name) {
    var self = this;
    self.name = _name;
    self.periods = [];
  };

  var Period = function(_time) {
    var self = this;
    self.time = _time;
  };

  var DisplayData = function() {
    var self = this;
    self.months = [];
    self.getHighLights = function() {
      var keys = Object.keys(self.months),
              len = keys.length,
              highlights = {};
      keys.sort();
//            console.log(keys[len - 1]);
//            console.log(self.months[keys[len - 1]]);
      var current = self.months[keys[len - 1]].total;
      var previousMonth = self.months[keys[len - 2]].total;
      var previousYear = self.months[keys[len - 13]].total;
      highlights.current = current;
      highlights.sincePreviousMonth = Math.abs(current - previousMonth);
      highlights.sincePreviousMonthSign = (current - previousMonth) > 0 ? "positive" : "negative";
      highlights.sincePreviousYear = Math.abs(current - previousYear);
      highlights.sincePreviousYearSign = (current - previousYear) > 0 ? "positive" : "negative";
      highlights.month = keys[len - 1];
      return highlights;
    };
    self.getDetailed = function() {
      var tmpArray = [],
              tmpRow = [],
              output = [],
              outputRow = [],
              farmingSum = 0,
              houseSum = 0,
              seaSum = 0,
              coalSum = 0,
              freelanceSum = 0;
      var keys = Object.keys(self.months),
              k, i,
              len = keys.length;
      keys.sort();
      for (i = 0; i < len; i++)
      {
        k = keys[i];
        tmpRow = [];
        tmpRow.push(k);
        tmpRow.push(self.months[k].general);
        tmpRow.push(self.months[k].farming);
        farmingSum += self.months[k].farming;
        tmpRow.push(self.months[k].sea);
        seaSum += self.months[k].sea;
        tmpRow.push(self.months[k].coal);
        coalSum += self.months[k].coal;
        tmpRow.push(self.months[k].house);
        houseSum += self.months[k].house;
        tmpRow.push(self.months[k].freelance);
        freelanceSum += self.months[k].freelance;
        tmpArray.push(tmpRow);
      }
      outputRow = [];
      outputRow.push("Hilabetea");
      outputRow.push("Orokorra");
      if (farmingSum > 0)
        outputRow.push("Nekazaritza");
      if (seaSum > 0)
        outputRow.push("Itsasoa");
      if (coalSum > 0)
        outputRow.push("Ikatza");
      if (houseSum > 0)
        outputRow.push("Etxeko langileak");
      if (freelanceSum > 0)
        outputRow.push("Autonomoak");
      output.push(outputRow);
      for (i = 0; i < len; i++) {
        outputRow = [];
        outputRow.push(tmpArray[i][0]);
        outputRow.push(tmpArray[i][1]);
        if (farmingSum > 0)
          outputRow.push(tmpArray[i][2]);
        if (seaSum > 0)
          outputRow.push(tmpArray[i][3]);
        if (coalSum > 0)
          outputRow.push(tmpArray[i][4]);
        if (houseSum > 0)
          outputRow.push(tmpArray[i][5]);
        if (freelanceSum > 0)
          outputRow.push(tmpArray[i][6]);
        output.push(outputRow);
      }
      return output;
    };
    self.getTable = function() {
      var output = [];

      output[0] = [];
      output[0].push("Hilabetea");
      output[1] = [];
      output[1].push("Orokorra");
      output[2] = [];
      output[2].push("Nekazaritza");
      output[3] = [];
      output[3].push("Itsasoa");
      output[4] = [];
      output[4].push("Ikatza");
      output[5] = [];
      output[5].push("Etxeko langileak");
      output[6] = [];
      output[6].push("Autonomoak");
      output[7] = [];
      output[7].push("Guztira");

      var keys = Object.keys(self.months),
              k, i,
              len = keys.length;
      keys.sort();
      for (i = 0; i < len; i++)
      {
        k = keys[i];
        output[0].push(k);
        output[1].push(parseTableNumber(self.months[k].general));
        output[2].push(parseTableNumber(self.months[k].farming));
        output[3].push(parseTableNumber(self.months[k].sea));
        output[4].push(parseTableNumber(self.months[k].coal));
        output[5].push(parseTableNumber(self.months[k].house));
        output[6].push(parseTableNumber(self.months[k].freelance));
        output[7].push(parseTableNumber(self.months[k].total));
      }
      return output;
    };
    var parseTableNumber = function(number) {
      if (number === 1)
        return "<5";
      return "" + number;
    };
    self.getTotal = function() {
      var output = [],
              outputRow = [];
      outputRow.push("Guztira");
      output.push(outputRow);
      var keys = Object.keys(self.months),
              k, i,
              len = keys.length;
      keys.sort();
      for (i = 0; i < len; i++)
      {
        k = keys[i];
        outputRow = [];
        outputRow.push(k);
        outputRow.push(self.months[k].total);
        output.push(outputRow);
      }
    };
  };

  var MonthData = function() {
    var self = this;
    self.general = 0;
    self.farming = 0;
    self.sea = 0;
    self.coal = 0;
    self.house = 0;
    self.freelance = 0;
    self.total = 0;
  };
  
  self.init = function(initialData) {
    data = initialData;
  };

  return {
    init: self.init
  };
})();

