"use strict"

var n_polygon; // number of vertex

var polygons = 0;
var polygons_vertices = [];
var polygons_colors = [];

function addPolygon() {
  polygons++;

  const args = arguments;

  var toPush = [];
  for (let i = 0; i < args.length; i++) {
    toPush.push(...args[i]);
  }

  // vertices
  polygons_vertices.push(toPush);
  // colors sementara random
  polygons_colors.push([selected_color.r, selected_color.g, selected_color.b, 1]);

  render();
}

function drawPolygon(vertex, color) {
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);

  // set color
  gl.uniform4f(colorUniformLocation, ...color);

  // draw
  var primitiveType = gl.TRIANGLE_FAN;
  var offset = 0;
  var count = vertex.length/2;
  gl.drawArrays(primitiveType, offset, count);
}