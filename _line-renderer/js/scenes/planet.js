var {
    Vector2,
    Vector3,
    Object3D,
    Scene,
    SphereGeometry,
    MeshBasicMaterial,
    TextureLoader
} = require('three');

var {
    Mesh,
    GridOutlineMaterial,
    StencilMaterial,
    StencilOutlineMaterial,
    DECAL_SETTINGS
} = require('../renderer/index');

var SphericalDecalGeometry = require('../geometry/sphericalDecalGeometry');
var TextTexture = require('../text/textTexture');

var RADIUS = 1;
var SEGMENTS = 64;

var SEGMENT_ANGLE = ( Math.PI * 2 ) / SEGMENTS;
var OVERSHOOT = RADIUS / ( Math.cos( SEGMENT_ANGLE / 2 ) * RADIUS ) * 1.0001;

var WORDS = ['LODNO', 'FRANS', 'TOKTO'];
var TEXT_HEIGHT = .2;

var loader = new TextureLoader();

module.exports = function () {
    
    function gridBall( color, segments, divisions ) {
        
        var sphereGeometry = new SphereGeometry( RADIUS, segments, segments / 2 );
        
        var sphereMaterial = new MeshBasicMaterial({ color });
        
        var sphereOutlineMaterial = new GridOutlineMaterial( divisions );
    
        return new Mesh( sphereGeometry, sphereMaterial, sphereOutlineMaterial );

    }
    
    var planet = gridBall( 0x118690, SEGMENTS, new Vector2( 64, 32 ) );
    
    var surface = new Object3D();
    
    WORDS.forEach( ( word, i ) => {
        
        var textTexture = new TextTexture( word, {
            size: 200,
            color: 'white',
            weight: 'bold'
        });
        
        var size = new Vector2( textTexture.textSize.y, textTexture.textSize.x );
        size.multiplyScalar( TEXT_HEIGHT / size.x );
        
        var halfSize = size.clone().divideScalar( 2 );
        
        var xStep = -Math.PI / 4;
        
        var position = new Vector2( xStep * i, Math.PI / 2 );
        position.sub( halfSize );
        
        var decalGeometry = new SphericalDecalGeometry( RADIUS, SEGMENTS, SEGMENTS / 2, position, size );
        
        var faceVertexUvs = decalGeometry.faceVertexUvs[ 0 ];
        
        faceVertexUvs.forEach( uvs => {
            
            uvs.forEach( uv => {
                
                uv.set( 1 - uv.y, uv.x );
                
            })
            
        });
        
        decalGeometry.uvsNeedUpdate = true;
        
        var decalMaterial = new StencilMaterial( textTexture, DECAL_SETTINGS );
        
        var decalOutlineMaterial = new StencilOutlineMaterial( textTexture, DECAL_SETTINGS );
        
        var decalMesh = new Mesh( decalGeometry, decalMaterial, decalOutlineMaterial );
        
        decalMesh.rotation.z = Math.PI / 2;
        
        surface.add( decalMesh );
        
    })
    
    var landTexture = loader.load('assets/textures/land.png');
    
    var landMaterial = new StencilMaterial( landTexture, DECAL_SETTINGS );
    
    var landOutlineMaterial = new StencilOutlineMaterial( landTexture, DECAL_SETTINGS );
    
    var land = new Mesh( planet.geometry, landMaterial, landOutlineMaterial );
    
    land.scale.set( OVERSHOOT, OVERSHOOT, OVERSHOOT );
    
    surface.add( land );
    
    surface.scale.set( OVERSHOOT, OVERSHOOT, OVERSHOOT );
    
    planet.add( surface );
    
    planet.position.set( 0, -20, 0 );
    
    planet.scale.set( 20, 20, 20 );
    
    var moon = gridBall( 0xeeeeee, SEGMENTS / 4, new Vector2( 20, 10 ) );
    
    moon.position.set( 0, 5, 0 );
    
    moon.scale.set( 2, 2, 2 );
    
    var scene = new Scene();
    
    scene.add( planet, moon );
    
    return {
        background: 0x000000,
        camera: {
            position: new Vector3( 0, 0, 50 ),
            fov: 20
        },
        scene,
        tick: dT => {
            
            surface.rotation.x -= .0001 * dT;
            
        }
        
    };
    
}