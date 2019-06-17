var THREE = require('three');
var Promise = require('promise');
var types = require('./types/index.js');
var utils = require('./lib/utils.js');

var box2 = new THREE.Box2();

var matrix = new THREE.Matrix4();

var v2 = new THREE.Vector2();

var v3s = [
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3()
]

var screen = new THREE.Box2(
    new THREE.Vector2( -1, -1 ),
    new THREE.Vector2( 1, 1 )
)

function getWorldCorners( object ) {
    
    var hw = object.width / 2;
    var hh = object.height / 2;
    
    return [
        new THREE.Vector3( -hw, -hh, 0 ),
        new THREE.Vector3( -hw, hh, 0 ),
        new THREE.Vector3( hw, -hh, 0 ),
        new THREE.Vector3( hw, hh, 0 )
    ].map( v => v.applyMatrix4( object.matrixWorld ) );
    
}

module.exports = class Level extends THREE.Object3D {
    
    constructor ( path, object ) {
        
        function create( obj ) {
            
            var Ctor = types[ obj.type ];
            
            if( !Ctor ) {
                
                throw new Error( obj.type + ' is not a thing' );
                
            }
            
            var instance = new Ctor( obj.attrs );
            
            if( obj.children.length ) instance.add( ...obj.children.map( create ) );
            
            return instance;
            
        }
        
        super();
        
        this.path = path;
        
        if( object.children.length ) this.add( ...object.children.map( create ) );
        
        if( object.attrs.background ) {
            
            this.background = new THREE.Color( object.attrs.background );
            
        } else {
            
            this.background = null;
            
        }
        
        this.rotation.x = -Math.PI / 2;
        
        this.won = !!object.attrs.won;
        
    }
    
    filter ( fn ) {
        
        if( typeof fn === 'string' ) {
            
            var ctor = types[ fn ];
            
            fn = x => x instanceof ctor;
            
        }
        
        var found = [];
        
        this.traverse( child => {
            
            if( child !== this && fn( child ) ) found.push( child );
            
        })
        
        return found;
        
    }
    
    init ( game ) {
        
        this.updateMatrixWorld( true );
        
        this.filter( object => object instanceof types.Cloner ).forEach( cloner => cloner.createClones() );
        
        var depth = 0;
        
        var offsets = [];
        
        function setPolygonOffsets( object ) {
            
            if(
                object.material &&
                !(object instanceof THREE.Sprite) &&
                Math.abs( object.getWorldPosition().y ) <= .1
            ) {
                
                if( !offsets[ depth ] ) offsets[ depth ] = 0;
                
                object.material.polygonOffset = true;
                object.material.polygonOffsetFactor = depth * -1 + offsets[ depth ] * -.001;
                
                offsets[ depth ]++;
            }
            
            depth++;
            
            object.children.forEach( setPolygonOffsets );
            
            depth--;
            
        }
        
        //setPolygonOffsets( this );
        
        this.children.forEach( region => region.makeHitTestable() );
        
        this.cameraCheckObjects = this.filter( object => {
            
            return (
                object.onCameraEnter ||
                object.onCameraLeave ||
                object.onCameraMove
            );
        
        }).map( object => {
            
            object.onScreen = false;
            
            object.worldCorners = getWorldCorners( object );
            
            return object;
            
        });
        
        this.characterCheckObjects = this.filter( object => {
            
            return (
                object.onCharacterEnter ||
                object.onCharacterLeave ||
                object.onCharacterStop ||
                object.onCharacterMove
            )
            
        }).map( object => {
            
            object.characterOn = false;
            
            return object;
            
        });
        
        this.impassableObjects = this.filter( object => {
            
            return object.impassable;
            
        });
        
        this.characterCheckObjects.concat( this.impassableObjects ).forEach( object => {
            
            if( object.makeHitTestable ) object.makeHitTestable();
            
        });
        
        this.resizingObjects = this.filter( object => object.onResize );
        
        this.updatingObjects = this.filter( object => object.onFrame );
        
        this.winObjects = this.filter( object => object.onWin );
        
        var camera = game.camera;
        
        camera.updateMatrixWorld();
        camera.updateProjectionMatrix();
        
        var corners = this.children.reduce( (arr, child) => {
            
            return arr.concat( getWorldCorners( child ) )
            
        }, [] );
        
        this.center = corners.reduce( (prev, curr) => {
            
            return prev.clone().add(curr);
            
        }).divideScalar( corners.length );
        
        var screenCorners = corners
            .map( corner => corner.project( camera ) )
        
        this.screenSize = screenCorners.reduce( (box, corner) => {
                
                return box.expandByPoint( corner )
                
            }, new THREE.Box2() ).getSize();
            
        this.screenSize.x *= game.renderer.width / 2;
        this.screenSize.y *= game.renderer.height / 2;
        
        return Promise.all(
            this.filter( x => x.preload ).map( x => x.preload() )
        );
        
    }
    
    onResize ( w, h, camera ) {
        
        this.resizingObjects.forEach( object => object.onResize( w, h, camera ) )
        
    }
    
    checkPath ( from, to ) {
        
        var dSq = from.distanceToSquared( to );
        
        var obstructed = false;
        
        this.impassableObjects.forEach( object => {
            
            if ( !object.visible ) return;
            
            var i = utils.collideLineWithBox( object.hitbox, from, to );
            
            if ( i === false ) return;
            
            obstructed = true;
            
            var d = from.distanceToSquared( i );
            
            if( d < dSq ) {
                
                to = i;
                
                dSq = d;
                
            }
            
        });
        
        if( obstructed ) {
            
            var d = to.clone().sub( from );
            
            return from.clone().add( d.setLength( d.length() - 20 ) );
            
        }
        
        return to;
        
    }
    
    update ( now, dT, game ) {
        
        var camera = game.camera;
        var character = game.character;
        
        matrix.multiplyMatrices( camera.projectionMatrix, matrix.getInverse( camera.matrixWorld ) );
        
        this.cameraCheckObjects.forEach( object => {
            
            object.worldCorners.forEach( (corner, i) => {
                
                v3s[ i ].copy( corner ).project( camera );
                
            });
            
            box2.setFromPoints( v3s );
            
            var onScreen = screen.intersectsBox( box2 );
            
            if( onScreen ) {
                
                if( !object.onScreen ) {
                
                    object.onScreen = true;
                
                    if( object.onCameraEnter ) object.onCameraEnter( camera, game );
                
                }
                
                if( object.onCameraMove ) object.onCameraMove( camera, game );
                
            } else if( object.onScreen ) {
                
                object.onScreen = false;
                
                if( object.onCameraLeave ) object.onCameraLeave( camera, game );
                
            }
            
        });
        
        var characterPosition2D = v2.set( character.position.x, character.position.z );
        
        this.characterCheckObjects.forEach( object => {
            
            var on = object.hitTest( characterPosition2D );
            
            if( on ) {
                
                if( !object.characterOn ) {
                    
                    object.characterOn = true;
                
                    if( object.onCharacterEnter ) object.onCharacterEnter( character, game );
                    
                }
                
                if( object.onCharacterMove ) object.onCharacterMove( character, game );
                
                if ( character.walking ) {
                    
                    object.characterStopped = false;
                    
                } else if( !object.characterStopped ) {
                    
                    object.characterStopped = true;
                    
                    if( object.onCharacterStop ) object.onCharacterStop( character, game );
                    
                }
                
            } else if( object.characterOn ) {
                
                object.characterOn = false;
                
                if( object.onCharacterLeave ) object.onCharacterLeave( character, game );
                
            }
            
        });
        
        this.updatingObjects.forEach( object => object.onFrame( now, dT, game ) );
        
    }
    
    win ( progress, game ) {
        
        this.winObjects.forEach( object => object.onWin( progress, game ) );
        
    }
    
}

// var Vector2 = require('./vendor/vector2.js');
// var Box2 = require('./vendor/box2.js');
// var { PREFIXED_TRANSFORM } = require('./lib/utils.js');

// var types = {
//     Region: require('./types/region.js'),
//     Rect: require('./types/rect.js'),
//     Ellipse: require('./types/ellipse.js'),
//     Text: require('./types/text.js'),
//     Image: require('./types/image.js'),
//     Song: require('./types/song.js'),
//     Sprite: require('./types/sprite.js'),
//     Panel: require('./types/panel.js'),
//     Theater: require('./types/theater.js')
// }

// module.exports = class World {
    
//     constructor ( config, context ) {
        
//         this.position = new Vector2();
        
//         this.box = new Box2(
//             this.position,
//             new Vector2( config.attrs.width, config.attrs.height )
//         )
        
//         this.element = context.worldElement;
//         this.children = this.create( config.children, context );
        
//         //this.regions.forEach( region => this.element.appendChild(region.element) );
        
//     }
    
//     create ( config, context ) {
        
//         return config.map( cfg => {
        
//             var Ctor = types[ cfg.type ];
            
//             var instance = new Ctor( cfg.attrs, context );
            
//             instance.addChildren( this.create( cfg.children, context ) )
            
//             return instance;
            
//         });
        
//     }
    
//     each( fn ) {
        
//         var walk = ( item, i ) => {
            
//             fn( item, i );
            
//             item.children.forEach( walk );
            
//         }
        
//         this.children.forEach( walk );
        
//     }
    
//     find( fn ) {
        
//         if( typeof fn === 'string' ) {
            
//             var type = fn.toLowerCase();
            
//             fn = x => x.getName().toLowerCase() === type;
            
//         }
        
//         var found = [];
        
//         var reducer = (ret, item) => {
            
//             if( fn(item) ) ret.push( item );
            
//             return item.children.reduce( reducer, ret );
            
//         }
        
//         return this.children.reduce( reducer, [] );
        
//     }
    
// }