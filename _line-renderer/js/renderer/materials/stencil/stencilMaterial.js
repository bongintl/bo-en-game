var { ShaderMaterial } = require('three');

var glslify = require('glslify');

var vertexShader = glslify.file( './stencilVertex.glsl' );
var fragmentShader = glslify.file( './stencilFragment.glsl' );

module.exports = class StencilMaterial extends ShaderMaterial {
    
    constructor ( map, options = {} ) {
        
        super( Object.assign( {
            vertexShader,
            fragmentShader,
            uniforms: {
                map: { value: map }
            },
            transparent: true
        }, options ) );
        
    }
    
}