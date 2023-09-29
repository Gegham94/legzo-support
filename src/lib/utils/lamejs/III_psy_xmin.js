import Encoder from "./Encoder.js";
import * as common from "./common.js";
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

function III_psy_xmin() {
  this.l = new_float(Encoder.SBMAX_l);
  this.s = new_float_n([Encoder.SBMAX_s, 3]);

  const self = this;
  this.assign = function (iii_psy_xmin) {
    System.arraycopy(iii_psy_xmin.l, 0, self.l, 0, Encoder.SBMAX_l);
    for (let i = 0; i < Encoder.SBMAX_s; i++) {
      for (let j = 0; j < 3; j++) {
        self.s[i][j] = iii_psy_xmin.s[i][j];
      }
    }
  };
}

export default III_psy_xmin;
