import "should";
import {OpSet} from "./utils";

it("OpSet should return concatenated input arguments", ()=>{
  OpSet(0, 1, 2).should.eql([0, 1, 2]);
});

it("OpSet should concatenate ops", ()=>{
  OpSet([0, 'haha'], [1, 0], [2, {d:1}])
    .should.eql([0, 'haha', 1, 0, 2, {d:1}]);
});
