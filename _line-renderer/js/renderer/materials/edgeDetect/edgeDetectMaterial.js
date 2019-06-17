var { ShaderMaterial, Vector2, Color } = require('three');

var glslify = require('glslify');
var fragmentShader = glslify.file( './edgeDetectFragment.glsl' );

module.exports = class OutlineMaterial extends ShaderMaterial {
    
    constructor ( { edgeFBO, colorFBO, texture }, options = {} ) {
        
        super(Object.assign({
            fragmentShader,
            uniforms: {
                resolution: { value: new Vector2() },
                time: { value: 0 },
                edgeFBO: { value: edgeFBO.texture },
                colorFBO: { value: colorFBO.texture },
                texture: { value: texture },
                outlineColor: { value: new Color( 0x000000 ) }
            },
            depthWrite: false,
            depthTest: false,
            transparent: true
        }, options ))
        
    }
    
}