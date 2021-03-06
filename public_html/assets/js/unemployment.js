"use strict";
var Unemployment = new (function() {
  var self = this, data;
  self.municipalities = [];
  self.selectedCouncilCodes = [];

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

  self.sum = function() {
    var length = 0,
            displays = new DisplayData();
    length = data.length;

    for (var i = 0; i < length; i++) {
      var entry = data[i];
      if (self.selectedCouncilCodes.length === 0 ||
              self.selectedCouncilCodes.indexOf(entry.ineCode) > -1) {
        if (displays.data[entry.yearMonth] === undefined) {
          displays.data[entry.yearMonth] = {total: 0};
        }
        displays.data[entry.yearMonth].yearMonth = entry.yearMonth;
        displays.data[entry.yearMonth].total += entry.total;
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
    self.data = [];
    self.getHighLights = function() {
      var keys = Object.keys(self.months),
              len = keys.length,
              highlights = {};
      keys.sort();
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
      output[1].push("Guztira");

      var keys = Object.keys(self.data),
              k, i,
              len = keys.length;
      keys.sort();
      for (i = 0; i < len; i++) {
        k = keys[i];
        output[0].push(k);
        output[1].push(self.data[k].total);
      }
      return output;
    };
    
    self.getTotal = function() {
      var output = [],
              outputRow = [];
      outputRow.push("Hilabetea");
      outputRow.push("Guztira");
      output.push(outputRow);
      var i, len, keys = Object.keys(self.data);
      len = keys.length;
      keys.sort();
      for (i = 0; i < len; i++) {
        outputRow = [];
        outputRow.push(self.data[keys[i]].yearMonth);
        outputRow.push(self.data[keys[i]].total);
        output.push(outputRow);
      }
      return output;
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
    var length = data.length;
//    jasmine.log("length:" + length);
    self.municipalities = {};
    for (var i = 0; i < length; i++) {
//      if (Object.keys(self.municipalities).indexOf(data[i].ineCode) === -1) {
      self.municipalities[data[i].ineCode] = {ineCode: data[i].ineCode};
//      }
    }
    return self;
  };

  return {
    init: self.init
  };
})();

