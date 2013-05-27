"use strict";
/*global $:false */
var ServiceDataLoader = function() {
    var self = this;
    self.load = function() {
        var cloader = new CouncilLoader();
        var ssloader = new SSEmploymentLoader();
        var output2 = [];
        // Create a new Deferred.
        var dfd = new $.Deferred();
        output2.push(["Council", "Month", "general", "farming", "house", "sea", "coal", "freelance", "total"]);
        $.when(cloader.load(), ssloader.load()).done(function(c, s) {
            var cLength = c[0].length;
            var sLength = s[0].length;
            for (var i = 0; i < sLength; i++) {
                var monthCouncilDataOrig = s[0][i];
                var monthCouncilData = {};
                for (var j = 0; j < cLength; j++) {
                    if (c[0][j].ineCode === monthCouncilDataOrig.councilCode) {
                        monthCouncilData.council = c[0][j].name;
                        break;
                    }
                }
                monthCouncilData.month = monthCouncilDataOrig.yearMonth;
                monthCouncilData.general = monthCouncilDataOrig.general;
                monthCouncilData.farming = monthCouncilDataOrig.agrario;
                monthCouncilData.sea = monthCouncilDataOrig.mar;
                monthCouncilData.coal = monthCouncilDataOrig.carbon;
                monthCouncilData.house = monthCouncilDataOrig.hogar;
                monthCouncilData.freelance = monthCouncilDataOrig.autonomos;
                monthCouncilData.total = monthCouncilDataOrig.total;
                output2.push([
                    monthCouncilData.council,
                    monthCouncilData.month,
                    monthCouncilData.general,
                    monthCouncilData.farming,
                    monthCouncilData.house,
                    monthCouncilData.sea,
                    monthCouncilData.coal,
                    monthCouncilData.freelance,
                    monthCouncilData.total
                ]);
            }
            dfd.resolve(output2);
        });
        return dfd.promise();
    };
};