import * as common from "./common.js";
import * as GainAnalysis from "./GainAnalysis.js";
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

function ReplayGain() {
  this.linprebuf = new_float(GainAnalysis.MAX_ORDER * 2);
  /**
   * left input samples, with pre-buffer
   */
  this.linpre = 0;
  this.lstepbuf = new_float(
    GainAnalysis.MAX_SAMPLES_PER_WINDOW + GainAnalysis.MAX_ORDER
  );
  /**
   * left "first step" (i.e. post first filter) samples
   */
  this.lstep = 0;
  this.loutbuf = new_float(
    GainAnalysis.MAX_SAMPLES_PER_WINDOW + GainAnalysis.MAX_ORDER
  );
  /**
   * left "out" (i.e. post second filter) samples
   */
  this.lout = 0;
  this.rinprebuf = new_float(GainAnalysis.MAX_ORDER * 2);
  /**
   * right input samples ...
   */
  this.rinpre = 0;
  this.rstepbuf = new_float(
    GainAnalysis.MAX_SAMPLES_PER_WINDOW + GainAnalysis.MAX_ORDER
  );
  this.rstep = 0;
  this.routbuf = new_float(
    GainAnalysis.MAX_SAMPLES_PER_WINDOW + GainAnalysis.MAX_ORDER
  );
  this.rout = 0;
  /**
   * number of samples required to reach number of milliseconds required
   * for RMS window
   */
  this.sampleWindow = 0;
  this.totsamp = 0;
  this.lsum = 0;
  this.rsum = 0;
  this.freqindex = 0;
  this.first = 0;
  this.A = new_int(0 | (GainAnalysis.STEPS_per_dB * GainAnalysis.MAX_dB));
  this.B = new_int(0 | (GainAnalysis.STEPS_per_dB * GainAnalysis.MAX_dB));
}

export default ReplayGain;
