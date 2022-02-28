"use strict"

var lines = 0;
var lines_vertices = [];
var lines_colors = [];

function addLine(start, end) {
  lines++;

  // vertices
  lines_vertices.push([...start, ...end]);

  lines_colors.push([selected_color.r, selected_color.g, selected_color.b, 1]);
  
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