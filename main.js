/* eslint no-console:0 consistent-return:0 */
"use strict";

var gl;
var colorUniformLocation;
var model = 1; // default line
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
    console.log(rectangular_colors);
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
    
    canvas.addEventListener('click', (evt) => {
        point_clicks.push(getCursorPosition(canvas, evt));

        switch (model) {
            case 1:
                if (point_clicks.length === 2) {
                    addLine(point_clicks[0], point_clicks[1]);

                    point_clicks = [];
                }
                break;
            case 2:
                if (point_clicks.length === 1) {
                    var edge_size = prompt("Input edge size");
                    addRectangle(point_clicks[0], edge_size);

                    point_clicks = [];
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
                }
            case 4:
                if (point_clicks.length == n_polygon) {
                    addPolygon(...point_clicks);

                    point_clicks = [];
                }

                break;
        }
    })
}

window.onload = main;