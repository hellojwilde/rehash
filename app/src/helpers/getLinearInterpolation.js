function getLinearInterpolation(inx, in1, in2, out1, out2) {
  var outx = out1 + ((out2 - out1) * ((inx - in1) / (in2 - in1)));

  if (out1 > out2) {
    return Math.min(Math.max(outx, out2), out1);
  } else {
    return Math.min(Math.max(outx, out1), out2);
  }
}

module.exports = getLinearInterpolation;
