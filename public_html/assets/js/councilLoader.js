"use strict";
/*global $:false */
var CouncilLoader = function(councilCodes) {
  var self = this;
  var url = "http://mongodb-rest.herokuapp.com/opendata/IneCouncils?limit=20&query=";
  var query = {"ineCode": {"$in": councilCodes}};

  self.load = function() {
    return $.getJSON(url + JSON.stringify(query), function(data) {
//            return data;
    });
  };
};

