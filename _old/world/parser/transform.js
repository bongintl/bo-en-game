var globalConfig = require('../../config.js');
var config = require('./config.js');
var utils = require('./utils.js');
var fs = require('fs');
var sharp = require('sharp');
var sizeOf = require('image-size');
var without = require('underscore').without;

var SPRITE_TYPES = ['Sprite', 'Panel', 'Theater'];

var GL_TYPES = ['Rect', 'Region', 'Ellipse', 'Image'];

function npo2(x) {
    
    var ret = 1;
    while( ret < x ) ret *= 2;
    return ret;
    
}

function parsePath( path ) {
    
    path = path.split('/');
    
    var file = path[ path.length - 1 ];
    var parts = file.split('.');
    
    return {
        path: path,
        file: file,
        filename: parts[0],
        extension: parts[1]
    }
    
}

module.exports = [
    
    level => {
        
        function pctPosition ( x, of ) {
            
            if( typeof x !== 'string' ) return x;
            
            return pctSize(x, of) - (of/2);
            
        }
        
        function pctSize( x, of ) {
            
            if( typeof x !== 'string' ) return x;
            
            return (parseFloat(x) / 100) * of;
            
        }
        
        var convertMetrics = parent => {
                    
            parent.children.forEach( (child, i) => {
                
                if ( child.attrs.x !== undefined ) {
                    
                    child.attrs.x = pctPosition( child.attrs.x, parent.attrs.width );
                    
                }
                
                if ( child.attrs.y !== undefined ) {
                    
                    child.attrs.y = -pctPosition( child.attrs.y, parent.attrs.height );
                    
                }
                
                if ( child.attrs.width !== undefined ) {
                    
                    child.attrs.width = pctSize( child.attrs.width, parent.attrs.width );
                    
                }
                
                if ( child.attrs.height !== undefined ) {
                    
                    child.attrs.height = pctSize( child.attrs.height, parent.attrs.height );
                    
                } else if ( ['src', 'image'].find( attr => attr in child.attrs ) ) {
                    
                    var src = child.attrs.src || child.attrs.image;
                    
                    var size;
                    
                    try {
                        size = sizeOf( src );
                    } catch(e) {
                        
                    }
                    
                    if( size ) {
                        
                        child.attrs.height = size.height * ( child.attrs.width / size.width );
                        
                    }
                    
                }
                
                convertMetrics( child );
                
            });
        
        };
        
        convertMetrics( level );
        
    },
    
    world => {
        
        utils.find( world, 'Text' ).forEach( text => {
            
            text.attrs.size *= config.BASE_FONT_SIZE;
            
        })
        
    },
    
    world => {
        
        var imgdefs = [];

        var destRoot = config.ASSET_PATH + config.RESIZED_DIR;
        
        utils.find( world, 'Image' ).forEach( image => {
            
            var src = image.attrs.src;
            
            var fileinfo = parsePath( src );
            
            var file = fileinfo.file;
            var extension = fileinfo.extension;
            var filename = fileinfo.filename;
            
            var dimensions = sizeOf( src );
            
            var srcWidth = dimensions.width;
            var srcHeight = dimensions.height;
            var destWidth = image.attrs.width;
            var destHeight = image.attrs.height;
            
            var srcRatio = srcHeight / srcWidth;
            var destRatio = destHeight / destWidth;
            
            var cropX, cropY, cropWidth, cropHeight, scale;
            
            if( srcRatio > destRatio ) {
                cropWidth = srcWidth;
                cropHeight = Math.floor( srcWidth * destRatio );
                cropX = 0;
                cropY = Math.floor( ( srcHeight - cropHeight ) / 2 );
                scale = destWidth / cropWidth;
            } else {
                cropWidth = Math.floor( srcHeight / destRatio );
                cropHeight = srcHeight;
                cropX = Math.floor( ( srcWidth - cropWidth ) / 2 );
                cropY = 0;
                scale = destHeight / cropHeight;
            }
            
            var cropRight = cropX + cropWidth;
            var cropBottom = cropY + cropHeight;
            
            var tileSize = Math.min( globalConfig.MAX_TEXTURE_SIZE, Math.floor( globalConfig.MAX_TEXTURE_SIZE / scale ) );
            
            var tiles = [];
            
            var tileY = cropY;
            
            while ( tileY < cropBottom ) {
                
                var tileX = cropX;
                var height = tileY + tileSize <= cropBottom ? tileSize : cropHeight % tileSize;
                
                while ( tileX < cropRight ) {
                    
                    var width = tileX + tileSize <= cropRight ? tileSize : cropWidth % tileSize;
                    
                    tiles.push({
                        sx: tileX,
                        sy: tileY,
                        swidth: width,
                        sheight: height,
                        x: (tileX - cropX) * scale,
                        y: (tileY - cropY) * scale,
                        width: width * scale,
                        height: height * scale
                    })
                    
                    tileX += tileSize;
                    
                }
                
                tileY += tileSize;
                
            }
            
            tiles = tiles.map( tile => {
                
                var widths = [];
                var heights = [];
                
                var zw = npo2( tile.width );
                var zh = npo2( tile.height );
                
                var max = npo2( tile.swidth )
                
                for ( var i = 0; i < globalConfig.ZOOM_LEVELS; i++ ) {
                    
                    if( zw <= max ) {
                    
                        widths.push( zw );
                        heights.push( zh );
                        
                    }
                    
                    zw /= 2;
                    zh /= 2;
                    
                    if( zw < 1 || zh < 1 ) break;
                    
                }
                
                tile.iwidths = widths.reverse();
                tile.iheights = heights.reverse();
                
                return tile;
                
            }).map( tile => {
                
                var srcs = [];
                
                for( var i = 0; i < tile.iwidths.length; i++ ) {
                    
                    var dest = destRoot + [
                        filename,
                        tile.sx,
                        tile.sy,
                        tile.swidth,
                        tile.sheight,
                        tile.iwidths[ i ],
                        tile.iheights[ i ]
                    ].join('_') + '.' + extension;
                    
                    if( imgdefs.map(def => def.dest).indexOf( dest ) === -1 ){
                        
                        imgdefs.push({
                            dest,
                            src,
                            sx: tile.sx,
                            sy: tile.sy,
                            swidth: tile.swidth,
                            sheight: tile.sheight,
                            width: tile.iwidths[ i ],
                            height: tile.iheights[ i ]
                        });
                        
                    }
                    
                    srcs.push( dest );
                    
                }
                
                return {
                    x: tile.x,
                    y: tile.y,
                    width: tile.width,
                    height: tile.height,
                    srcs
                }
                
            })
            
            if( tiles.length === 1 ) {
                
                image.attrs.srcs = tiles[ 0 ].srcs;
                
            } else {
                
                console.log( 'Split ' + file + ' into ' + tiles.length + ' tiles' );
                
                image.type = 'Group';
                
                image.children = tiles.map( tile => {
                    
                    return {
                        type: 'Image',
                        attrs: {
                            x: tile.x - image.attrs.width / 2 + tile.width / 2,
                            y: -tile.y + image.attrs.height / 2 - tile.height / 2,
                            width: tile.width,
                            height: tile.height,
                            srcs: tile.srcs
                        },
                        children: []
                    }
                    
                }).concat( image.children );
                
            }
            
        });
        
        utils.find( world, ['Rect', 'Sprite', 'Panel'] ).forEach( sprite => {
            
            [ 'src', 'shadow', 'image' ].forEach( attr => {
                
                var src = sprite.attrs[ attr ];
                
                if( !src || src === 'none' ) return;
                
                var fileinfo = parsePath( src );
                
                var file = fileinfo.file;
                var extension = fileinfo.extension;
                var filename = fileinfo.filename;
                
                var dimensions = sizeOf( src );
                
                var imageWidth = dimensions.width;
                var imageHeight = dimensions.height;
                
                var spriteWidth = sprite.attrs.width;
                var spriteHeight = sprite.attrs.height;
                
                var resizedWidth = npo2( Math.min( spriteWidth, imageWidth ) );
                var resizedHeight = npo2( Math.min( spriteHeight, imageHeight ) );
                
                var dest = destRoot + [ filename, resizedWidth, resizedHeight ].join('_') + '.' + extension;
                
                sprite.attrs[ attr ] = dest;
                
                imgdefs.push({
                    src, dest,
                    sx: 0, sy: 0,
                    swidth: imageWidth, sheight: imageHeight,
                    width: resizedWidth, height: resizedHeight - 1,
                    extend: true
                })
                
            })
            
        });
        
        fs.readdirSync( destRoot ).forEach( oldFile => {
            
            var path = destRoot + oldFile;
            
            var def = imgdefs.find( def => def.dest === path );
            
            if( def ) {
                imgdefs = without( imgdefs, def );
            }
            
        });
        
        imgdefs.forEach( def => {
            
            var image = sharp( def.src )
                .extract({
                    left: def.sx,
                    top: def.sy,
                    width: def.swidth,
                    height: def.sheight
                })
                .ignoreAspectRatio()
                .resize(def.width, def.height)
                
            if( def.extend ) {
                
                image
                    .background({r: 0, g: 0, b: 0, a: 0})
                    .extend({top: 0, bottom: 1, left: 0, right: 0})
            }
            
            image
                .sharpen()
                .toFile( def.dest, e => {
                    
                    if ( e ) {
                        console.log( e, def );
                    } else {
                        console.log('Resized ' + def.dest );
                    }
                    
                });
            
        });
        
    }
    
];
    