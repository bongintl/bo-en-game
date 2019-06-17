var {
    ShaderMaterial,
    Vector2,
    Vector4,
    Texture,
    NearestFilter
} = require('three');

var vertexShader = require( '../lib/objectDepthVertex' );

var glslify = require('glslify');
var fragmentShader = glslify.file( './depthOutlineFragment.glsl' );

module.exports = class DepthOutlineMaterial extends ShaderMaterial {
    
    constructor ( map, options = {} ) {
        
        map = map || new Texture();
        
        map.minFilter = map.magFilter = NearestFilter;
        
        super( Object.assign( {
            vertexShader,
            fragmentShader,
            uniforms: {
                map: { value: map },
                seed: { value: Math.random() },
                cameraNearFar: { value: new Vector2(0, 1) },
                bounds: { value: new Vector4() }
            }
        }, options ) );        
    }
    
    updateBounds ( geometry ) {
        
        geometry.computeBoundingSphere();
        
        var sphere = geometry.boundingSphere;
        var center = sphere.center;
        
        this.uniforms.bounds.value.set( center.x, center.y, center.z, sphere.radius );
        
    }
    
    updateCamera ( camera ) {
        
        this.uniforms.cameraNearFar.value.set( camera.near, camera.far );
        
    }
    
}