"use strict"

var lines = 0;
var lines_vertices = [];
var lines_colors = [];

function addLine() {
  lines++;
  var x1 = prompt("Input x1");
  var y1 = prompt("Input y1");
  var x2 = prompt("Input x2");
  var y2 = prompt("Input y2");

  // vertices
  lines_vertices.push([x1,y1,x2,y2]);
  // colors sementara random
  lines_colors.push([Math.random(), Math.random(), Math.random(), 1]);

  render();
}

function drawLine(vertex, color) {
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);

  // set color
  gl.uniform4f(colorUniformLocation, ...color);

  // draw
  var primitiveType = gl.LINES;
  var offset = 0;
  var count = 2;
  gl.drawArrays(primitiveType, offset, count);
}