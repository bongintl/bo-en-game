var Promise = require('promise');

function wait( delay ) {
    
    return new Promise( resolve => setTimeout( resolve, delay ) );
    
}

function collideLineWithBox( box, from, to ) {
    
    var delta = to.clone().sub( from );
    
    var min = 0;
    var max = 1;
    
    var t0, t1;
    
    if( delta.x === 0 ) {
        
        if ( from.x < box.min.x || from.x > box.max.x ) return false;
        
    } else {
        
        if ( delta.x > 0 ) {
            
            t0 = ( box.min.x - from.x ) / delta.x;
            t1 = ( box.max.x - from.x ) / delta.x;
            
        } else {
            
            t0 = ( box.max.x - from.x ) / delta.x;
            t1 = ( box.min.x - from.x ) / delta.x;
            
        }
        
        if ( t0 > min ) min = t0;
        if ( t1 < max ) max = t1;
        
        if ( min > max || max < 0 ) return false;
        
    }
    
    if ( delta.y === 0 ) {
        
        if ( from.y < box.min.y || from.y > box.max.y ) return false;
        
    } else {
        
        if ( delta.y > 0 ) {
            
            t0 = ( box.min.y - from.y ) / delta.y;
            t1 = ( box.max.y - from.y ) / delta.y;
            
        } else {
            
            t0 = ( box.max.y - from.y ) / delta.y;
            t1 = ( box.min.y - from.y ) / delta.y;
            
        }
        
        if ( t0 > min ) min = t0;
        if ( t1 < max ) max = t1;
        
        if ( min > max || max < 0 ) return false;
        
    }
    
    delta.multiplyScalar( min );
    
    return from.clone().add( delta );
    
}

function clamp( x, min, max ) {
    
    return Math.max( min, Math.min( max, x ) );
    
}

function normalize( x, min, max ) {
    
    return clamp( (x - min) / (max - min), 0, 1);
    
}

function scale ( x, oldMin, oldMax, newMin, newMax ) {
    
    return newMin + normalize( x, oldMin, oldMax ) * ( newMax - newMin );
    
}

module.exports = { collideLineWithBox, wait, normalize, scale, clamp };