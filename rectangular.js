"use strict"

var rectangular = 0;
var rectangular_vertices = [];
var rectangular_colors = [];

function addRectangular(start, height,width) {
  rectangular++;

  var x1 = start[0]; var y1 = start[1];  

  var x2 = Number(x1) + Number(width);
  x2 = String(x2);
  var y2 = Number(y1) + Number(height);
  y2 = String(y2);

  // vertices
  rectangular_vertices.push([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2,
  ]);
  // colors sementara random
  console.log(selected_color.r);
  console.log(selected_color.g);
  console.log(selected_color.b);
  rectangular_colors.push([selected_color.r, selected_color.g, selected_color.b, 1]);

  render();
}

// function draw rectangular using drawrectangle