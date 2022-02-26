"use strict"

var polygons = 0;
var polygons_vertices = [];
var polygons_colors = [];

function addPolygon() {
  polygons++;

  var n = prompt("Input number of vertex");
  n = Number(n);

  var toPush = [];
  for (let i = 0; i < n; i++) {
    var temp = prompt("Input point x");
    var temp2 = prompt("Input point y");
    toPush.push(temp, temp2);
  }

  // vertices
  polygons_vertices.push(toPush);
  // colors sementara random
  polygons_colors.push([Math.random(), Math.random(), Math.random(), 1]);

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