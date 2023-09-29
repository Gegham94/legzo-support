import * as common from "./common.js";
import GrInfo from "./GrInfo.js";
const System = common.default.System;
const VbrMode = common.default.VbrMode;
const Float = common.default.Float;
const ShortBlock = common.default.ShortBlock;
const Util = common.default.Util;
const Arrays = common.default.Arrays;
const new_array_n = common.default.new_array_n;
const new_byte = common.default.new_byte;
const new_double = common.default.new_double;
const new_float = common.default.new_float;
const new_float_n = common.default.new_float_n;
const new_int = common.default.new_int;
const new_int_n = common.default.new_int_n;
const assert = common.default.assert;

function IIISideInfo() {
  this.tt = [
    [null, null],
    [null, null]
  ];
  this.main_data_begin = 0;
  this.private_bits = 0;
  this.resvDrain_pre = 0;
  this.resvDrain_post = 0;
  this.scfsi = [new_int(4), new_int(4)];

  for (let gr = 0; gr < 2; gr++) {
    for (let ch = 0; ch < 2; ch++) {
      this.tt[gr][ch] = new GrInfo();
    }
  }
}

export default IIISideInfo;
