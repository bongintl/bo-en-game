var THREE = require('three');
var Cloner = require('./cloner.js');

module.exports = class Generator extends Cloner {
    
    positionClones ( clones, others ) {
        
        var position = new THREE.Vector2();
        
        others.forEach( object => object.makeHitTestable() );
        
        clones.forEach( clone => {
            
            var times = 0;
            var max = 20;
            
            do {
                
                times++;
                
                this.tryPosition( position );
                
            } while ( others.find( o => o.hitTest( position ) ) && times < max );
            
            if( times === max ) throw new Error('No room for clones', this);
            
            clone.position.x = position.x;
            clone.position.y = position.y;
            
        })
        
        
    }
    
    tryPosition ( v ) {
        
        v.x = Math.random() * this.width - this.width / 2;
        v.y = Math.random() * this.height - this.height / 2;
        
    }
    
}