import "should";
import {applyOp} from "./apply";
import {ins, del, mov} from "./ops";
import {Ins, Del, Mov} from "./utility";

// test insert operation
it("apply-insert", () => {
  let s = "0123456789";
  let pos = 3;
  let value = "x";

  let s_true = ins(s, pos, value);
  let op_ins = Ins(pos, value);
  let s_apply = applyOp(s, op_ins);

  s_true.should.be.equal(s_apply);
});

// test delete operation
it("apply-del", () => {
  let s = "0123456789";
  let pos = 3;
  let length = 2;

  let s_true = del(s, pos, length);
  let op_del = Del(pos, length);
  let s_apply = applyOp(s, op_del);

  s_true.should.be.equal(s_apply);
});

// test move operation
it("apply-mov", () => {
  let s = "0123456789";
  let pos = 3;
  let value = "x";
  let des = 6;

  let s_true = mov(s, pos, value, des);
  let op_mov = Mov(pos, value, des);
  let s_apply = applyOp(s, op_mov);

  s_true.should.be.equal(s_apply);
});
