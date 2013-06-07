"use strict";
/*global $:false */
var parseCouncilCodesFromUrl = function() {
  var councilCodes;
  var ccParam = $.getUrlVar('councilCodes');
  if (typeof ccParam !== "undefined") {
    councilCodes = JSON.parse(ccParam);
  } else {
    councilCodes = ["01001", "01002"];
  }
  return councilCodes;
};

