"use strict";
/*global $:false */
var SSEmploymentLoader = function() {
    var self = this,
            councilCodes;
    var ccParam = $.getUrlVar('councilCodes');
    if (typeof ccParam !== "undefined") {
        councilCodes = JSON.parse(ccParam);
    } else {
        councilCodes = ["01001","01002"];
    }
    var url = "http://mongodb-rest.herokuapp.com/opendata/SSLastDayOfMonthByCouncil?query=";
    var query = {"councilCode": {"$in": councilCodes}};

    self.load = function(f) {
        return $.getJSON(url + JSON.stringify(query), function(data) {
//            return data;
//console.log(data);
        });
    };
};

