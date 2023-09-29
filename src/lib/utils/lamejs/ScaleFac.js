// package mp3;

/**
 * Layer III side information.
 *
 * @author Ken
 *
 */

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

function ScaleFac(arrL, arrS, arr21, arr12) {
  this.l = new_int(1 + Encoder.SBMAX_l);
  this.s = new_int(1 + Encoder.SBMAX_s);
  this.psfb21 = new_int(1 + Encoder.PSFB21);
  this.psfb12 = new_int(1 + Encoder.PSFB12);
  const l = this.l;
  const s = this.s;

  if (arguments.length == 4) {
    // public ScaleFac(final int[] arrL, final int[] arrS, final int[] arr21,
    //    final int[] arr12) {
    this.arrL = arguments[0];
    this.arrS = arguments[1];
    this.arr21 = arguments[2];
    this.arr12 = arguments[3];

    System.arraycopy(
      this.arrL,
      0,
      l,
      0,
      Math.min(this.arrL.length, this.l.length)
    );
    System.arraycopy(
      this.arrS,
      0,
      s,
      0,
      Math.min(this.arrS.length, this.s.length)
    );
    System.arraycopy(
      this.arr21,
      0,
      this.psfb21,
      0,
      Math.min(this.arr21.length, this.psfb21.length)
    );
    System.arraycopy(
      this.arr12,
      0,
      this.psfb12,
      0,
      Math.min(this.arr12.length, this.psfb12.length)
    );
  }
}

export default ScaleFac;
