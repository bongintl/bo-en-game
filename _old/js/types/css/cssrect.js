var THREE = require('three');
var CSSMixin = require('./cssmixin.js');

module.exports = class CSSRect extends CSSMixin( THREE.CSS3DObject ) {
    
    constructor ( attrs ) {
        
        super( attrs );
        
        if( attrs.rotate ) this.rotation.z = THREE.Math.degToRad( attrs.rotate );
        
        this.position.set( attrs.x || 0, attrs.y || 0, attrs.z || 0 );
        
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
    
    getShadow ( attrs ) {
        
        if( !attrs.shadow || attrs.shadow === 'none' ) return false;
        
        var shadowAttrs = {
            width: attrs.width,
            height: attrs.height,
            x: 0,
            y: 0,
            z: -attrs.z
        }
        
        if( attrs.shadow === true ) {
            
            shadowAttrs.color = 'black';
            
        } else {
            
            shadowAttrs.src = attrs.shadow;
            
        }
        
        return new BaseCSSObject( shadowAttrs );
        
    }

}