var { Vector2, ShaderMaterial } = require('three');
var vertexShader = require('../lib/objectDepthVertex');

var glslify = require('glslify');
var fragmentShader = glslify.file('./gridFragment.glsl');

module.exports = class GridOutlineMaterial extends ShaderMaterial {
    
    constructor ( divisions = new Vector2(10, 10), options = {} ) {
        
        super( Object.assign({
            vertexShader,
            fragmentShader,
            uniforms: {
                divisions: { value: divisions }
            }
        }, options ));
        
    }
    
};