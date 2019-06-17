var fs = require('fs');
var sharp = require('sharp');
var sizeOf = require('image-size');

var TILE_SIZE = 512;
var src = 'map/original.jpg';

var size = sizeOf( src ).width;

function slice ( address, left, top, size ) {
    
    sharp( src )
        .extract({
            top,
            left,
            width: size,
            height: size
        })
        .resize( size, size )
        .toFile( 'map/' + address + '.jpg', e => {
            
            if ( e ) {
                
                console.log( 'Error saving ' + address, e );
                
            } else {
                
                console.log( 'Saved ' + address );
                
            }
            
        })
        
    if ( size > TILE_SIZE ) {
        
        var halfSize = size / 2;
        
        slice( address + '0', left, top, halfSize );
        
        slice( address + '1', left + halfSize, top, halfSize );
        
        slice( address + '2', left, top + halfSize, halfSize );
        
        slice( address + '3', left + halfSize, top + halfSize, halfSize );
        
    }
    
}

slice( "0", 0, 0, size );