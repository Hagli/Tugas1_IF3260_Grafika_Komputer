"use strict"

var rectangles = 0;
var rectangles_vertices = [];
var rectangles_colors = [];

function addRectangle() {
  rectangles++;

  var x1 = prompt("Input start point x");
  var y1 = prompt("Input start point y");
  var edge_size = prompt("Input edge size");

  var x2 = Number(x1) + Number(edge_size);
  x2 = String(x2);
  var y2 = Number(y1) + Number(edge_size);
  y2 = String(y2);

  // vertices
  rectangles_vertices.push([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2,
  ]);
  // colors sementara random
  rectangles_colors.push([Math.random(), Math.random(), Math.random(), 1]);

  console.log(rectangles_vertices);
  render();
}

function drawRectangle(vertex, color) {
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);

  // set color
  gl.uniform4f(colorUniformLocation, ...color);

  // draw
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 6;
  gl.drawArrays(primitiveType, offset, count);
}