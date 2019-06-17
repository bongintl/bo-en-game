var Promise = require('promise');
var config = require('../../config.js');
var {debounce} = require('underscore');

module.exports = class ImageManager {
    
    constructor ( options ) {
        
        this.srcs = options.srcs.map( src => {
            return { src: src, state: 'unloaded', result: false }
        });
        
        this.transform = options.transform || ((img, src) => src);
        this.onChange = options.onChange;
        this.useLargest = options.useLargest || false;
        
        this.zoom = -1;
        
        this.curr = -1;
        this.largest = -1;
        
        this.debouncedUpdate = debounce( this.update, 500 );

    }
    
    load( idx ) {
        
        var obj = this.srcs[ idx ];
        
        obj.state = 'loading';
        
        return new Promise( resolve => {
            
            var img = new Image();
            
            img.onload = () => {
                this.largest = Math.max( idx, this.largest );
                obj.state = 'loaded';
                obj.result = this.transform( img, obj.src );
                resolve( obj );
            };
            
            img.src = obj.src;
            
        })
        
    }
    
    setZoom ( zoom ) {
        
        if( this.zoom === zoom ) return;
        
        this.zoom = zoom;
        
        this.debouncedUpdate();
        
    }
    
    change ( idx ) {
        
        if( idx !== this.curr ) {
            
            this.curr = idx;
            
            this.onChange( this.srcs[ idx ].result );
            
        }
        
    }
    
    update () {
        
        var idx = 0;
        var z = 1 / config.ZOOM_LEVELS;
        
        while( z < this.zoom ) {
            z *= 2;
            idx++;
        }
        
        idx = Math.min( idx, this.srcs.length - 1 );
        
        if( this.useLargest ) idx = Math.max( this.largest, idx );
        
        var img = this.srcs[ idx ];
        
        if( img.state === 'loaded' ) {
            
            this.change( idx );
            
        } else {
            
            if( img.state === 'unloaded' ) {
                
                this.load( idx ).then( () => this.update() );
                
            }
            
            for( var i = idx; i >= 0; i-- ) {
                
                if( this.srcs[ i ].state === 'loaded' ) {
                    
                    this.change( i );
                    break;
                    
                }
                
            }
            
        }
        
    }
    
}