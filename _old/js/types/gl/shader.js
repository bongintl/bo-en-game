var THREE = require('three');
var Base3DObject = require('./base.js');

var vertexShaderSource = `
	varying vec2 vUv;

	void main()
	{
		vUv = uv;
		vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	}
`

module.exports = class Shader extends Base3DObject {
    
    constructor ( attrs ) {
        
        super( attrs );
        
    }
    
    getMaterial( attrs ) {
        
        this.uniforms = this.getUniforms( attrs );
        
        return new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            fragmentShader: this.getSource( attrs ),
            vertexShader: vertexShaderSource,
            transparent: true,
            depthWrite: false
        });
        
    }
    
    getUniforms( attrs ){
        
        return {};
        
    }
    
    getSource( attrs ) {
        
        return null;
        
    }
    
}