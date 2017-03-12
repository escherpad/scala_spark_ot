import React, {Component} from "react";
import {findDOMNode} from "react-dom";
import debounce from "lodash.debounce";

const COMMAND_KEYS = {
  8: "BACKSPACE",
  9: "TAB",
  13: "ENTER",
  16: "SHIFT",
  17: "CTRL",
  18: "ALT",
  19: "PAUSE/BREAK",
  27: "ESCAPE",
  // 32: "SPACE", // comment out to allow input of `space`.
  33: "PAGE-UP",
  34: "PAGE-DOWN",
  35: "END",
  36: "HOME",
  37: "LEFT-ARROW",
  38: "UP-ARROW",
  39: "RIGHT-ARROW",
  40: "DOWN-ARROW",
  45: "INSERT",
  46: "DELETE",
  91: "LEFT-WINDOW",
  92: "RIGHT-WINDOW",
  93: "SELECT",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
};
const style = {};
export default class Caret extends Component {
  constructor() {
    super();
    this.onInput = this._onInput.bind(this);
    this.onKeyDown = this._onKeyDown.bind(this);
    this.onCompositionStart = this._onCompositionStart.bind(this);
    this.onCompositionEnd = this._onCompositionEnd.bind(this);
    this.dispatch = debounce(this._dispatch.bind(this), 0);
  }

  componentDidMount() {
    this.nativeElement = findDOMNode(this);
    if (this.props.focus) this.nativeElement.focus();
  }

  _dispatch(command, value, options) {
    if (typeof this.props.onChange === 'function') this.props.onChange(command, value, options);
    this.nativeElement.innerHTML = '';
  }

  _onKeyDown(e) {
    if (this.isComposing) return;
    let command = COMMAND_KEYS[e.which];
    if (!command) return;
    e.preventDefault();
    e.persist();
    this._dispatch(command, e);
  }

  _onInput(e) {
    if (this.isComposing) return;
    this.dispatch("INPUT", this.nativeElement.innerHTML);
  }

  _onCompositionStart() {
    this.isComposing = true;
  }

  _onCompositionEnd() {
    this.dispatch("INPUT", this.nativeElement.innerHTML);
    this.isComposing = false;
  }

  render() {
    return <span style={style}
                 contentEditable="true"
                 autoFocus="true"
                 onKeyDown={this.onKeyDown}
                 onInput={this.onInput}
                 onCompositionStart={this.onCompositionStart}
                 onCompositionEnd={this.onCompositionEnd}
    />
  }
}
