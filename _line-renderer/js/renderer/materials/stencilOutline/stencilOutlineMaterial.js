var { ShaderMaterial } = require('three');

var vertexShader = require( '../lib/objectDepthVertex' );

var glslify = require('glslify');
var fragmentShader = glslify.file( './stencilOutlineFragment.glsl' );

module.exports = class StencilOutlineMaterial extends ShaderMaterial {
    
    constructor ( map, options = {} ) {
        
        super( Object.assign( {
            vertexShader,
            fragmentShader,
            uniforms: {
                map: { value: map },
                seed: { value: Math.random() }
            },
            transparent: true
        }, options ) );        
    }
    
}