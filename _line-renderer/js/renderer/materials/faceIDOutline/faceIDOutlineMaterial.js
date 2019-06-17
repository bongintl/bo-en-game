var shaderMixin = require('../lib/shaderMixin');

var glslify = require('glslify');
var vertexShader = glslify.file( './faceIDVertex.glsl' );
var fragmentShader = glslify.file( '../lib/faceColorFragment.glsl' );

module.exports = shaderMixin( vertexShader, fragmentShader );