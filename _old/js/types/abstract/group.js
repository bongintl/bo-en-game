var THREE = require('three');

var Rect = require('../gl/rect.js');

class Group extends THREE.Object3D {
    
    constructor( attrs ) {
        
        super();
        
        this.attrs = attrs;
        
        this.width = attrs.width;
        this.height = attrs.height;
        
        this.position.set( attrs.x || 0, attrs.y || 0, attrs.z || 0 );
        
        if ( attrs.rotate ) this.rotation.z = THREE.Math.degToRad( attrs.rotate );
        
    }
    
    clone() {
        
        var group = new this.constructor( this.attrs );
        
        this.children.map( child => child.clone() ).forEach( clone => group.add(clone) );
        
        return group;
        
    }
    
}

Group.prototype.makeHitTestable = Rect.prototype.makeHitTestable;
Group.prototype.hitTest = Rect.prototype.hitTest;

module.exports = Group;