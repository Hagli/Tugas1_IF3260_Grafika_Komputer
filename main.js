/* eslint no-console:0 consistent-return:0 */
"use strict";

var gl;
var colorUniformLocation;
var model = 0; // default line
var point_clicks = [];

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function resizeCanvasToDisplaySize(canvas) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    const needResize = canvas.width !== displayWidth ||
        canvas.height !== displayHeight;

    if (needResize) {
        // Make the canvas the same size
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }

    return needResize;
}

function chooseModel(idx) {
    model = idx; 
    point_clicks = [];
}

function getCursorPosition(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(evt.clientX - rect.left);
    const y = evt.clientY - rect.top;

    return [x, y];
}

function render() {
    //console.log(rectangular_colors);
    // lines
    for (let i=0; i < lines; i++) {
        drawLine(lines_vertices[i], lines_colors[i]);
    }

    // rectangles
    for (let i=0; i < rectangles; i++) {
        drawRectangle(rectangles_vertices[i], rectangles_colors[i]);
    }

    // polygons
    for (let i=0; i < polygons; i++) {
        drawPolygon(polygons_vertices[i], polygons_colors[i]);
    }

    for (let i=0; i < rectangular; i++) {
        drawRectangle(rectangular_vertices[i], rectangular_colors[i]);
    }
}

//nvert - Number of vertices in the polygon. Whether to repeat the first vertex at the end is discussed below.
//vertx, verty - Arrays containing the x- and y-coordinates of the polygon's vertices.
//testx, testy - X- and y-coordinate of the test point.
function pnpoly( nvert, vertx, verty, testx, testy ) {
    var i, j, c = false;
    for( i = 0, j = nvert-1; i < nvert; j = i++ ) {
        if( ( ( verty[i] > testy ) != ( verty[j] > testy ) ) &&
            ( testx < ( vertx[j] - vertx[i] ) * ( testy - verty[i] ) / ( verty[j] - verty[i] ) + vertx[i] ) ) {
                c = !c;
        }
    }
    return c;
}

function main() {
    var canvas = document.getElementById("c");
    gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // Get the strings for our GLSL shaders
    var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
    var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

    // create GLSL shaders, upload the GLSL source, compile the shaders
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // setup GLSL program
    var program = createProgram(gl, vertexShader, fragmentShader);

    // look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    // look up uniform locations
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    colorUniformLocation = gl.getUniformLocation(program, "u_color");

    // Create a buffer to put three 2d clip space points in
    var positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);

    // set the resolution
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    var drag = false;
    var shape;
    var shape_int;
    var int;

    canvas.addEventListener('mousedown', (evt) => {
        for (let i = 0; i < lines_vertices.length; i++) {
            for (let j = 0; j < lines_vertices[i].length; j = j+2){
                //console.log(Math.pow(Number(lines_vertices[i][j])-evt.x,2)+Math.pow(Number(lines_vertices[i][j+1])-evt.y,2));
                if (Math.pow(Number(lines_vertices[i][j])-evt.layerX,2)+Math.pow(Number(lines_vertices[i][j+1])-evt.layerY,2) < 50){
                    drag = true;
                    shape = 0; //line
                    shape_int = i;
                    int = j;
                    return;
                }
            }
        }
        for (let i = 0; i < rectangles_vertices.length; i++) {
            for (let j = 0; j < rectangles_vertices[i].length; j = j+2){
                //console.log(Math.pow(Number(lines_vertices[i][j])-evt.x,2)+Math.pow(Number(lines_vertices[i][j+1])-evt.y,2));
                if (Math.pow(Number(rectangles_vertices[i][j])-evt.layerX,2)+Math.pow(Number(rectangles_vertices[i][j+1])-evt.layerY,2) < 50){
                    drag = true;
                    shape = 1; //rectangle
                    shape_int = i;
                    int = j;
                    return;
                }
            }
        }
        for (let i = 0; i < rectangular_vertices.length; i++) {
            for (let j = 0; j < rectangular_vertices[i].length; j = j+2){
                if (Math.pow(Number(rectangular_vertices[i][j])-evt.layerX,2)+Math.pow(Number(rectangular_vertices[i][j+1])-evt.layerY,2) < 50){
                    drag = true;
                    shape = 2; //rectangular
                    shape_int = i;
                    int = j;
                    return;
                }
            }
        }
        for (let i = 0; i < polygons_vertices.length; i++) {
            for (let j = 0; j < polygons_vertices[i].length; j = j+2){
                if (Math.pow(Number(polygons_vertices[i][j])-evt.layerX,2)+Math.pow(Number(polygons_vertices[i][j+1])-evt.layerY,2) < 50){
                    drag = true;
                    shape = 3; //polygon
                    shape_int = i;
                    int = j;
                    return;
                }
            }
        }
    })

    canvas.addEventListener('mousemove', (evt) => {
        if (drag){
            switch (shape){
                case 0:
                    lines_vertices[shape_int][int] = evt.layerX;
                    lines_vertices[shape_int][int+1] = evt.layerY;
                    render();
                    break;
                //may break at times, the one for rectangle
                case 1:
                    switch(int){
                        case 2:
                            rectangles_vertices[shape_int][8] = evt.layerX;
                            rectangles_vertices[shape_int][9] = evt.layerY;
                            break;
                        case 4:
                            rectangles_vertices[shape_int][6] = evt.layerX;
                            rectangles_vertices[shape_int][7] = evt.layerY;
                            break;
                        case 6:
                            rectangles_vertices[shape_int][4] = evt.layerX;
                            rectangles_vertices[shape_int][5] = evt.layerY;
                            break;
                        case 8:
                            rectangles_vertices[shape_int][2] = evt.layerX;
                            rectangles_vertices[shape_int][3] = evt.layerY;
                            break;
                    }
                    rectangles_vertices[shape_int][int] = evt.layerX;
                    rectangles_vertices[shape_int][int+1] = evt.layerY;
                    render();
                    break;
                case 2:
                    switch(int){
                        case 2:
                            rectangular_vertices[shape_int][8] = evt.layerX;
                            rectangular_vertices[shape_int][9] = evt.layerY;
                            break;
                        case 4:
                            rectangular_vertices[shape_int][6] = evt.layerX;
                            rectangular_vertices[shape_int][7] = evt.layerY;
                            break;
                        case 6:
                            rectangular_vertices[shape_int][4] = evt.layerX;
                            rectangular_vertices[shape_int][5] = evt.layerY;
                            break;
                        case 8:
                            rectangular_vertices[shape_int][2] = evt.layerX;
                            rectangular_vertices[shape_int][3] = evt.layerY;
                            break;
                    }
                    rectangular_vertices[shape_int][int] = evt.layerX;
                    rectangular_vertices[shape_int][int+1] = evt.layerY;
                    render();
                    break;
                case 3:
                    polygons_vertices[shape_int][int] = evt.layerX;
                    polygons_vertices[shape_int][int+1] = evt.layerY;
                    render();
                    break;
            }
        }
    })

    canvas.addEventListener('mouseup', (evt) => {
        drag = false;
    })

    canvas.addEventListener('click', (evt) => {
        point_clicks.push(getCursorPosition(canvas, evt));

        switch (model) {
            case 1:
                if (point_clicks.length === 2) {
                    addLine(point_clicks[0], point_clicks[1]);

                    point_clicks = [];

                    model = 0;
                }
                break;
            case 2:
                if (point_clicks.length === 1) {
                    var edge_size = prompt("Input edge size");
                    addRectangle(point_clicks[0], edge_size);

                    point_clicks = [];

                    model = 0;
                }

                break;
            case 3:
                if (point_clicks.length ===1){
                    var width_size = prompt("Input Width size");
                    var height_size = prompt("Input Height size");
                    addRectangular(point_clicks[0], height_size, width_size);
                    console.log("aaaa");
                    // getcolor();
                    point_clicks = [];

                    model = 0;
                }
            case 4:
                if (point_clicks.length == n_polygon) {
                    addPolygon(...point_clicks);

                    point_clicks = [];

                    model = 0;
                }

                break;
            default:
                for(let i = 0; i < polygons_vertices.length; i++){
                    let listX = [];
                    let listY = [];
                    for (let j = 0; j < polygons_vertices[i].length; j = j+2){
                        listX.push(polygons_vertices[i][j]);
                        listY.push(polygons_vertices[i][j+1]);
                    }
                    if (pnpoly(polygons_vertices[i].length/2,listX,listY,evt.layerX,evt.layerY)){
                        polygons_colors[i] = [selected_color.r, selected_color.g, selected_color.b, 1];
                        render();
                    }
                }
                break;
        }
    })
}

window.onload = main;