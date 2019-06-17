var { ShaderMaterial } = require('three');

module.exports = ( vertexShader, fragmentShader, uniforms = {} ) => {
    
    return class extends ShaderMaterial {
        
        constructor ( options ) {
            
            super( Object.assign( { vertexShader, fragmentShader, uniforms }, options ) );
            
        }
        
    }
    
}