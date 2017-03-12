import should from "should";
import {ins, del, mov} from "./string-ops";
import {applyOp} from "./string-apply";
import {makeOpIns, makeOpDel, makeOpMov} from "./utility";
import {transform, transfromIndex, transformCursor} from "./string-transform";

function applyAndCompare(s, ops0, ops1) {
  var s_true = s;
  var s_transform = s;

  for (let op in ops0) {
    s_true = applyOp(s_true, op);
  }

  for (let op in ops1) {
    s_transform = applyOp(s_transform, op);
  }

  s_true.should.be.a.String();
  s_transform.should.be.a.String();
  s_true.should.equal(s_transform);
}

function buildTestOpList(op0, op1) {
  let ops_ot = transform(op0, op1);
  ops_ot.should.be.a.Array();
  let ops = [op0].concat(ops_ot);
  return ops;
}

function testOpPair(s, op0, op1) {
  let ops0 = [op0, op1];
  let ops1 = buildTestOpList(op0, op1);
  applyAndCompare(s, ops0, ops1);
}

// op test
// del then insert
it("del-then-ins0", () => {
  let s = "0123456789";

  let op0 = makeOpDel(0, 3);
  let op1 = makeOpIns(4, "ab");

  testOpPair(s, op0, op1);
});

it("del-then-ins1", () => {
  let s = "0123456789";

  let op0 = makeOpDel(2, 3);
  let op1 = makeOpIns(3, "ab");

  testOpPair(s, op0, op1);
});


it("del-then-ins2", () => {
  let s = "0123456789";

  let op0 = makeOpDel(6, 3);
  let op1 = makeOpIns(4, "ab");

  testOpPair(s, op0, op1);
});

// del then del
it("del-then-del0", () => {
  let s = "0123456789";
  let op0 = makeOpDel(0, 3);
  let op1 = makeOpDel(4, 2);

  testOpPair(s, op0, op1);
});

it("del-then-del1", () => {
  let s = "0123456789";
  let op0 = makeOpDel(2, 3);
  let op1 = makeOpDel(3, 2);

  testOpPair(s, op0, op1);
});


it("del-then-del2", () => {
  let s = "0123456789";

  let op0 = makeOpDel(6, 3);
  let op1 = makeOpDel(4, 2);

  testOpPair(s, op0, op1);
});


// ins then del
it("ins-then-del0", () => {
  let s = "0123456789";

  let op0 = makeOpIns(4, "ab");
  let op1 = makeOpDel(6, 3);

  testOpPair(s, op0, op1);
});

it("ins-then-del1", () => {
  let s = "0123456789";

  let op0 = makeOpIns(4, "ab");
  let op1 = makeOpDel(0, 3);

  testOpPair(s, op0, op1);
});

// ins then ins test
it("ins-then-ins0", () => {
  let s = "0123456789";

  let op0 = makeOpIns(4, "ab");
  let op1 = makeOpIns(6, 3);

  testOpPair(s, op0, op1);
});

it("ins-then-ins1", () => {
  let s = "0123456789";

  let op0 = makeOpIns(4, "ab");
  let op1 = makeOpIns(0, 3);

  testOpPair(s, op0, op1);
});
