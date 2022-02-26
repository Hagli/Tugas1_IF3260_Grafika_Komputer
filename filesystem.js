"use strict"

const save = () => {
  // var fs = require('fs');

  var toSave = {
    "lines": lines,
    "lines_vertices": lines_vertices,
    "lines_colors": lines_colors,
    "rectangles": rectangles,
    "rectangles_vertices": rectangles_vertices,
    "rectangles_colors": rectangles_colors,
    "polygons": polygons,
    "polygons_vertices": polygons_vertices,
    "polygons_colors": polygons_colors
  }

  // fs.writeFile("save.json", JSON.stringify(toSave));

  // var uriContent = "data:application/json," + encodeURIComponent(JSON.stringify(toSave));
  // window.open(uriContent, 'save.json');

  var element = document.createElement('a');
  element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(toSave)));
  element.setAttribute('download', 'file.json');

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

document.getElementById("load").addEventListener('change', (evt) => {
  var file = evt.target.files[0];
  var fr = new FileReader();
  fr.readAsText(file);
  fr.onload = receivedText;

  function receivedText(e) {
    let fromfile = e.target.result;
    var data = JSON.parse(fromfile);
    console.log(data);

    lines = data.lines;
    lines_vertices = data.lines_vertices;
    lines_colors = data.lines_colors;

    rectangles = data.rectangles;
    rectangles_vertices = data.rectangles_vertices;
    rectangles_colors = data.rectangles_colors;

    polygons = data.polygons;
    polygons_vertices = data.polygons_vertices;
    polygons_colors = data.polygons_colors;

    render();
  }
})