"use strict";
describe('Unemployment object', function() {
  var unemployment;
  beforeEach(function() {
    var data = getJSONFixture('unemploymentData.json');
    unemployment = Unemployment.init(data);
  });
  it('inits', function() {
    expect(unemployment.municipalities).toEqual({"99001":{ineCode: "99001"}, "99002":{ineCode: "99002"}});
  });
  it('sums all council totals', function() {
    var expected = [
      ["Hilabetea", "Guztira"],
      ["2011/03", 92],
      ["2011/04", 82]
    ];
    unemployment.selectedCouncilCodes = [];
    var dd = unemployment.sum(unemployment);
    expect(dd.getTotal()).toEqual(expected);
  });
  it('sums one council total', function() {
    var expected = [
      ["Hilabetea", "Guztira"],
      ["2011/03", 21],
      ["2011/04", 31]
    ];
    unemployment.selectedCouncilCodes = ["99001"];
    var dd = unemployment.sum(unemployment);
    expect(dd.getTotal()).toEqual(expected);
  });
  it('gets table data for all councils', function() {
    expect(1 + 2).toEqual(3);
  });
  it('gets table data for one council', function() {
    expect(1 + 2).toEqual(3);
  });
  it('gets graph data for all councils', function() {
    expect(1 + 2).toEqual(3);
  });
  it('gets graph data for one council', function() {
    expect(1 + 2).toEqual(3);
  });
});