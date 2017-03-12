import should from "should";
import {ins, del, mov} from "./string-ops";
import applyOp from "./string-apply";
import {makeOpIns, makeOpDel, makeOpMov} from "./utility";

// op test del then insert
it("del-then-ins", () => {
  let s = "0123456789";

  let op_del = makeOpDel(2, 3);
  let op_ins = makeOpIns(3, "a");

  // apply the del then insert to the string (Ground Truth)
  let s_true = applyOp(s, op_del);
  s_true = applyOp(s_true, op_ins);

  // apply the ins then del use OT
  let s_transform = applyOp(s, op_ins);
  let ops_ot = s_transform(op_del, op_ins);
  for (let op in ops_ot) {
    s_transform = applyOp(s_transform, op);
  }

  // compare the two string
  s_true.should.be.equal(s_transform);
});
