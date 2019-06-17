var Base3DObject = require('./base.js');
var THREE = require('three');

var SEG_LENGTH = 3;

module.exports = class Ellipse extends Base3DObject {
    
    getGeometry ( attrs ) {
        
        var c = attrs.width * Math.PI;
        
        var segs = Math.floor( c / SEG_LENGTH );
        
        var geometry = new THREE.CircleGeometry( attrs.width / 2, segs );
        
        return geometry;
        
    }
    
    makeHitTestable(){
        
        var p = new THREE.Vector3().applyMatrix4( this.matrixWorld );
        
        this.position2d = new THREE.Vector2( p.x, p.z );
        
        this.rSquared = Math.pow( this.width / 2, 2 );
        
    }
    
    hitTest ( point ) {
        
        return point.distanceToSquared( this.position2d ) <= this.rSquared;
        
    }
    
}