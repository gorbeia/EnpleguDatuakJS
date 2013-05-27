"use strict";
/*global $:false */
/*global jQuery:false */
var StaticDataLoader = function() {
    var self = this;
    self.load = function(url) {
        var json;
        $.ajax({
            'async': false,
            'global': false,
            'url': url,
            'dataType': "json",
            'success': function(data) {
                json = data;
            }
        });
        return json.data;
    };
};