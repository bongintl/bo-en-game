var shaderMixin = require('../lib/shaderMixin');

var vertexShader = require( '../lib/objectDepthVertex' );

var glslify = require('glslify');
var fragmentShader = glslify.file( '../lib/faceColorFragment.glsl' );

module.exports = shaderMixin( vertexShader, fragmentShader );