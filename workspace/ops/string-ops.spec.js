require('should');
import {ins, del, mov} from "./string-ops";

it("example test", () => {
  ({ha: true}).should.have.property('ha');
});

it("ins-one-string", () => {
  ins("ha", 0, "a").should.be.equal("aha");
});

xit("del-string", () => {});
