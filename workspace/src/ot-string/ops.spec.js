import "should";
import {ins, del, mov} from "./ops";

// ins test
it("ins-string-at-beginning", () => {
  ins("ha", 0, "a").should.be.equal("aha");
  ins("hi", 0, "b").should.be.equal("bhi");
});

it("ins-string-at-middle", () => {
  ins("0123456789", 3, "x").should.be.equal("012x3456789");
});

// del test
it("del-string-at-beginning", () => {
  del("01234", 0).should.be.equal("1234");
});

it("del-string-at-beginning2", () => {
  del("01234", 0, 3).should.be.equal("34");
});

// mov test
it("mov-char", () => {
  mov("012345", 0, 1, 6).should.be.equal("123450");
  mov("012345", 0, 1, 3).should.be.equal("120345");
});

it("mov-string", () => {
  mov("012345", 0, 2, 6).should.be.equal("234501");
  mov("012345", 1, 2, 4).should.be.equal("031245");
});

it("mov-string-backward", () => {
  mov("0123456789", 5, 2, 1).should.be.equal("0561234789");

});
