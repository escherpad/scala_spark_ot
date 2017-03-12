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

// op test del then insert
it("del-then-ins0", () => {
  let s = "0123456789";

  let op_del = makeOpDel(0, 3);
  let op_ins = makeOpIns(4, "a");

  let ops_ot = transform(op_ins, op_del);
  ops_ot.should.be.a.Array();

  let ops0 = [op_del, op_ins];
  let ops1 = [op_ins].concat(ops_ot);

  applyAndCompare(s, ops0, ops1);
});

it("del-then-ins0", () => {
  let s = "0123456789";

  let op_del = makeOpDel(0, 3);
  let op_ins = makeOpIns(4, "a");

  let ops_ot = transform(op_ins, op_del);
  ops_ot.should.be.a.Array();

  let ops0 = [op_del, op_ins];
  let ops1 = [op_ins].concat(ops_ot);

  applyAndCompare(s, ops0, ops1);
});


it("del-then-ins1", () => {
  let s = "0123456789";

  let op_del = makeOpDel(2, 3);
  let op_ins = makeOpIns(3, "a");

  let ops_ot = transform(op_ins, op_del);
  ops_ot.should.be.a.Array();

  let ops0 = [op_del, op_ins];
  let ops1 = [op_ins].concat(ops_ot);

  applyAndCompare(s, ops0, ops1);
});
