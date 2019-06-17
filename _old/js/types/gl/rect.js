var Base3DObject = require('./base.js');
var THREE = require('three');

module.exports = class Rect extends Base3DObject {
    
    getGeometry ( attrs ) {
        
        return new THREE.PlaneGeometry( attrs.width, attrs.height );
        
    }
    
    makeHitTestable () {
        
        var min = new THREE.Vector3( -this.width / 2, -this.height / 2, 0 );
        var max = new THREE.Vector3( this.width / 2, this.height / 2, 0 );
        
        min.applyMatrix4( this.matrixWorld );
        max.applyMatrix4( this.matrixWorld );
        
        var min2d = new THREE.Vector2( min.x, min.z );
        var max2d = new THREE.Vector2( max.x, max.z );
        
        this.hitbox = new THREE.Box2().setFromPoints( [min2d, max2d] );
        
    }
    
    hitTest ( point ) {
        
        return this.hitbox.containsPoint( point );
        
    }
    
}