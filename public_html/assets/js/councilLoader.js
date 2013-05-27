"use strict";
/*global $:false */
var CouncilLoader = function() {
    var self = this,
            councilCodes;
    var ccParam = $.getUrlVar('councilCodes');
    if (typeof ccParam !== "undefined") {
        councilCodes = JSON.parse(ccParam);
    } else {
        councilCodes = ["01001","01002"];
    }
    var url = "http://mongodb-rest.herokuapp.com/opendata/IneCouncils?limit=20&query=";
    var query = {"ineCode": {"$in": councilCodes}};

    self.load = function() {
        return $.getJSON(url + JSON.stringify(query), function(data) {
//            return data;
        });
    };
};

