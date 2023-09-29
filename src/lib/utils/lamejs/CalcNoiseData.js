import * as common from "./common.js";
const new_float = common.default.new_float;
const new_int = common.default.new_int;
const assert = common.default.assert;

function CalcNoiseData() {
  this.global_gain = 0;
  this.sfb_count1 = 0;
  this.step = new_int(39);
  this.noise = new_float(39);
  this.noise_log = new_float(39);
}

export default CalcNoiseData;
