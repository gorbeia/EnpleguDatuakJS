"use strict";
/*global $:false */
var SSEmploymentLoader = function(councilCodes) {
    var self = this;
    var url = "http://mongodb-rest.herokuapp.com/opendata/SSLastDayOfMonthByCouncil?query=";
    var query = {"councilCode": {"$in": councilCodes}};

    self.load = function(f) {
        return $.getJSON(url + JSON.stringify(query), function(data) {
//            return data;
//console.log(data);
        });
    };
};

