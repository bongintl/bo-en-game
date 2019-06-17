var { PerspectiveCamera } = require('three');

var { Renderer } = require('./renderer/index');

var renderer = new Renderer();
renderer.setPixelRatio( 2 )
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100 );
camera.matrixAutoUpdate = false;

var scene = require('./scenes/hair')();

scene.scene.autoUpdate = false;

if ( scene.camera.position ) camera.position.copy( scene.camera.position );
if ( scene.camera.target ) camera.lookAt( scene.camera.target );
if ( scene.camera.fov ) camera.fov = scene.camera.fov;
if ( scene.background ) renderer.setClearColor( scene.background );
if ( scene.outlineColor ) renderer.setOutlineColor( scene.outlineColor );
if ( scene.updateCamera ) scene.updateCamera( camera );

var then = Date.now();

function render () {
    
    var now = Date.now();
    var dT = now - then;
    then = now;
    
    requestAnimationFrame( render );
    
    scene.tick( dT, camera );

    renderer.render( scene.scene, camera );
    
}

render();
