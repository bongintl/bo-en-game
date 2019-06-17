var quadtree = require('./quadtree');

var THREE = require('three');
require('three-obj-loader')( THREE );

var {
    Vector2,
    Vector3,
    Texture,
    Plane,
    TextureLoader,
    OBJLoader,
    Raycaster,
    Object3D,
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    CircleGeometry,
    PlaneGeometry,
    MeshBasicMaterial,
    Mesh,
    AxisHelper
} = THREE;

var renderer = new WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xffffff );
document.body.appendChild( renderer.domElement );

var camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 )
camera.position.y = 20;
camera.up.set( 0, 0, -1 );
camera.lookAt( new Vector3( 0, 0, 0 ) );

var mouse = new Vector2( window.innerWidth / 2, window.innerHeight / 2 );

renderer.domElement.addEventListener( 'mousemove', e => mouse.set( e.clientX, window.innerHeight - e.clientY ) );

var scene = new Scene();

var character = new Object3D();
character.scale.set( .01, .01, .01 );

var objLoader = new OBJLoader();
objLoader.load( 'assets/Drake_OBJ.obj', drake => character.add( drake ) );

// var floor = new Mesh( new PlaneGeometry( 20, 20 ), new MeshBasicMaterial( { color: 0x0000ff } ) )
// floor.rotation.x -= Math.PI / 2;

var quads = new Object3D();

var marker = new Mesh( new CircleGeometry( .2 ), new MeshBasicMaterial( { color: 0xff0000 } ) );
marker.position.y = .1;
marker.rotation.x -= Math.PI / 2;

scene.add( character, quads, marker );

var ah = new AxisHelper(5);
ah.position.y = 1;
scene.add( ah );

var sphericalToCartesian = ( out, radius, inclination, azimuth ) => {
    
    var sinInc = Math.sin( inclination );
    var cosInc = Math.cos( inclination );
    var sinAz = Math.sin( azimuth );
    var cosAz = Math.cos( azimuth );
    
    out.set(
        radius * sinInc * sinAz,
        radius * cosInc,
        radius * sinInc * cosAz
    );
    
}

var doCamera = ( ww, wh, mouse, camera ) => {
    
    var center = new Vector2( ww / 2, wh / 2 );
    var dm = mouse.clone().sub( center );
    var max = Math.min( ww, wh ) / 2;
    dm.divideScalar( max ).clampScalar( -1, 1 );
    
    var mouseAngle = dm.angle();
    var mouseLength = dm.length();
    
    sphericalToCartesian( camera.position, 20, mouseLength * Math.PI / 2, mouseAngle - Math.PI / 2 );
    
    camera.position.add( character.position );
    
    camera.lookAt( character.position );
    
}

var raycaster = new Raycaster();
var plane = new Plane( new Vector3( 0, 1, 0 ), 0 );

var doMarker = ( ww, wh, mouse, camera, marker ) => {
    
    var m = new Vector2(
        ( mouse.x / ww ) * 2 - 1,
        ( mouse.y / wh ) * 2 - 1
    );
    
    raycaster.setFromCamera( m, camera );
    
    var intersect = raycaster.ray.intersectPlane( plane );
    
    if ( intersect ) {
        
        marker.position.x = intersect.x;
        marker.position.z = intersect.z;
        
    }
    
}

var quadPool = [];

var createMesh = address => {
    
    var mesh = new Mesh(
        new PlaneGeometry( 1, 1 ),
        new MeshBasicMaterial()
    );
    
    mesh.rotation.x -= Math.PI / 2;
    
    return mesh;
    
}

var texLoader = new TextureLoader();

var textures = {};

var debugTexture = address => {
    
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = canvas.height = 512;
    ctx.font = '40px Arial';
    ctx.fillStyle = 'red';
    ctx.fillRect(10, 10, 492, 492);
    ctx.fillStyle = 'white';
    ctx.fillText( address, 128, 256 );
    var tex = new Texture( canvas );
    tex.needsUpdate = true;
    return tex;
    
}

var getTexture = address => {
    
    if ( !textures[ address ] ) {
        textures[ address ] = texLoader.load( 'map/' + address + '.jpg' );
    }
    
    return textures[ address ];
    
}

var getQuad = ( address, { center, size } ) => {
    
    var mesh;
    
    if ( quadPool.length ) {
        
        mesh = quadPool.pop();
        
    } else {
        
        mesh = createMesh( address );
        
    }
        
    mesh.scale.set( size, size, size );
    
    mesh.position.copy( center );
    
    mesh.material.map = getTexture( address );
    
    mesh.address = address;
    
    return mesh;
    
}

var retireQuad = q => quadPool.push( q );

renderer.domElement.addEventListener('click', e => {
    character.position.set( marker.position.x, 0, marker.position.z );
})

var render = () => {
    
    requestAnimationFrame( render );
    
    var ww = window.innerWidth;
    var wh = window.innerHeight;
    
    doCamera( ww, wh, mouse, camera );
    
    doMarker( ww, wh, mouse, camera, marker );
    
    var dups = {};
    
    var nextQuads = quadtree( ww, wh, camera, 200, 512 );
    
    quads.children.forEach( q => {
        
        if ( q.address in nextQuads ) {
            
            dups[ q.address ] = true;
            
        } else {
        
            retireQuad( q );
            
            quads.remove( q );
        
        }
        
    })
    
    for ( var addr in nextQuads ) {
        
        if ( dups[ addr ] ) {
            
            continue;
            
        }
        
        var def = nextQuads[ addr ];
        
        quads.add( getQuad( addr, def ) );
        
    }
    
    renderer.render( scene, camera );
    
}

render();