var THREE = require('three');

module.exports = class Origin extends THREE.Object3D {
    
    constructor ( attrs ) {
        
        super();
        
        this.position.set( attrs.x, attrs.y, 0 );
        
    }
    
}