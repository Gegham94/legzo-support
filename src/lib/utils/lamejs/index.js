import * as common from "./common.js";
import Lame from "./Lame.js";
import Presets from "./Presets.js";
import GainAnalysis from "./GainAnalysis.js";
import QuantizePVT from "./QuantizePVT.js";
import Quantize from "./Quantize.js";
import Takehiro from "./Takehiro.js";
import Reservoir from "./Reservoir.js";
import MPEGMode from "./MPEGMode.js";
import BitStream from "./BitStream.js";
import Encoder from "./Encoder.js";
import Version from "./Version.js";
import VBRTag from "./VBRTag.js";
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

function GetAudio() {
  let parse;
  let mpg;

  this.setModules = function (parse2, mpg2) {
    parse = parse2;
    mpg = mpg2;
  };
}

function Parse() {
  let ver;
  let id3;
  let pre;

  this.setModules = function (ver2, id32, pre2) {
    ver = ver2;
    id3 = id32;
    pre = pre2;
  };
}

function MPGLib() {}

function ID3Tag() {
  let bits;
  let ver;

  this.setModules = function (_bits, _ver) {
    bits = _bits;
    ver = _ver;
  };
}

export function Mp3Encoder(channels, samplerate, kbps) {
  if (arguments.length != 3) {
    console.error("WARN: Mp3Encoder(channels, samplerate, kbps) not specified");
    channels = 1;
    samplerate = 44100;
    kbps = 128;
  }
  const lame = new Lame();
  const gaud = new GetAudio();
  const ga = new GainAnalysis();
  const bs = new BitStream();
  const p = new Presets();
  const qupvt = new QuantizePVT();
  const qu = new Quantize();
  const vbr = new VBRTag();
  const ver = new Version();
  const id3 = new ID3Tag();
  const rv = new Reservoir();
  const tak = new Takehiro();
  const parse = new Parse();
  const mpg = new MPGLib();

  lame.setModules(ga, bs, p, qupvt, qu, vbr, ver, id3, mpg);
  bs.setModules(ga, mpg, ver, vbr);
  id3.setModules(bs, ver);
  p.setModules(lame);
  qu.setModules(bs, rv, qupvt, tak);
  qupvt.setModules(tak, rv, lame.enc.psy);
  rv.setModules(bs);
  tak.setModules(qupvt);
  vbr.setModules(lame, bs, ver);
  gaud.setModules(parse, mpg);
  parse.setModules(ver, id3, p);

  const gfp = lame.lame_init();

  gfp.num_channels = channels;
  gfp.in_samplerate = samplerate;
  gfp.brate = kbps;
  gfp.mode = MPEGMode.STEREO;
  gfp.quality = 3;
  gfp.bWriteVbrTag = false;
  gfp.disable_reservoir = true;
  gfp.write_id3tag_automatic = false;

  const retcode = lame.lame_init_params(gfp);
  assert(retcode == 0);
  let maxSamples = 1152;
  let mp3buf_size = 0 | (1.25 * maxSamples + 7200);
  let mp3buf = new_byte(mp3buf_size);

  this.encodeBuffer = function (left, right) {
    if (channels == 1) {
      right = left;
    }
    assert(left.length == right.length);
    if (left.length > maxSamples) {
      maxSamples = left.length;
      mp3buf_size = 0 | (1.25 * maxSamples + 7200);
      mp3buf = new_byte(mp3buf_size);
    }

    const _sz = lame.lame_encode_buffer(
      gfp,
      left,
      right,
      left.length,
      mp3buf,
      0,
      mp3buf_size
    );
    return new Int8Array(mp3buf.subarray(0, _sz));
  };

  this.flush = function () {
    const _sz = lame.lame_encode_flush(gfp, mp3buf, 0, mp3buf_size);
    return new Int8Array(mp3buf.subarray(0, _sz));
  };
}

function WavHeader() {
  this.dataOffset = 0;
  this.dataLen = 0;
  this.channels = 0;
  this.sampleRate = 0;
}

function fourccToInt(fourcc) {
  return (
    (fourcc.charCodeAt(0) << 24) |
    (fourcc.charCodeAt(1) << 16) |
    (fourcc.charCodeAt(2) << 8) |
    fourcc.charCodeAt(3)
  );
}

WavHeader.RIFF = fourccToInt("RIFF");
WavHeader.WAVE = fourccToInt("WAVE");
WavHeader.fmt_ = fourccToInt("fmt ");
WavHeader.data = fourccToInt("data");

WavHeader.readHeader = function (dataView) {
  const w = new WavHeader();

  let header = dataView.getUint32(0, false);
  if (WavHeader.RIFF != header) {
    return;
  }
  const fileLen = dataView.getUint32(4, true);
  if (WavHeader.WAVE != dataView.getUint32(8, false)) {
    return;
  }
  if (WavHeader.fmt_ != dataView.getUint32(12, false)) {
    return;
  }
  const fmtLen = dataView.getUint32(16, true);
  let pos = 16 + 4;
  switch (fmtLen) {
    case 16:
    case 18:
      w.channels = dataView.getUint16(pos + 2, true);
      w.sampleRate = dataView.getUint32(pos + 4, true);
      break;
    default:
      throw "extended fmt chunk not implemented";
  }
  pos += fmtLen;
  const data = WavHeader.data;
  let len = 0;
  while (data != header) {
    header = dataView.getUint32(pos, false);
    len = dataView.getUint32(pos + 4, true);
    if (data == header) {
      break;
    }
    pos += len + 8;
  }
  w.dataLen = len;
  w.dataOffset = pos + 8;
  return w;
};

export default {
  Mp3Encoder,
  WavHeader
};
