import * as common from "./common.js";
import Encoder from "./Encoder.js";
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

// package mp3;

/**
 * Variables used for --nspsytune
 *
 * @author Ken
 *
 */
function NsPsy() {
  this.last_en_subshort = new_float_n([4, 9]);
  this.lastAttacks = new_int(4);
  this.pefirbuf = new_float(19);
  this.longfact = new_float(Encoder.SBMAX_l);
  this.shortfact = new_float(Encoder.SBMAX_s);

  /**
   * short block tuning
   */
  this.attackthre = 0;
  this.attackthre_s = 0;
}

export default NsPsy;
