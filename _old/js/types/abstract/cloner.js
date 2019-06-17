var Group = require('./group.js');

module.exports = class Cloner extends Group {
    
    createClones () {
        
        var toClone = [];
        var others = [];
        
        this.children.forEach( object => {
            
            if( object.attrs.x === undefined || object.attrs.y === undefined ) {
            
                toClone.push( object );
            
            } else {
                
                others.push( object );
                
            }
            
        });
        
        var numClones = this.attrs.num || toClone.length;
        
        var clones = [];
        
        for ( var i = 0; i < numClones; i++ ) {
            
            var object = toClone[ i % toClone.length ];
            
            if ( i > toClone.length - 1 ) {
                
                object = object.clone();
                
                this.add( object );
                
            }
                
            clones.push( object );
            
        }
        
        // if ( this.attrs.num ) {
            
        //     numClones = Math.round( this.attrs.num / toClone.length );
            
        // } else {
            
        //     numClones = 1;
            
        // }
        
        
        
        // toClone.forEach( object => {
            
        //     for( var i = 0; i < numClones; i++ ) {
                
        //         clones.push( i === 0 ? object : object.clone() );
                
        //     }
            
        //     this.remove( object );
            
        // })
        
        this.positionClones( clones, others );
        
        //clones.forEach( clone => this.add( clone ) );
        
        this.clones = clones;
        
    }
    
};