var THREE = require('three');
require('./vendor/three.cssrenderer.js')(THREE);

var Level = require('./level.js');
var BoRenderer = require('./renderer.js');
var Character = require('./types/character.js');

var data = require('./world.json');

var ww = window.innerWidth;
var wh = window.innerHeight;

var renderer = new BoRenderer();
var level = new Level( data );
//var camera = new THREE.PerspectiveCamera( 20, ww/wh, 1, 1000000 );
var camera = new THREE.OrthographicCamera( -ww/2, ww/2, wh/2, -wh/2, 1, 1000000 );

var a = Math.PI/4;
var d = 100000;
var z = 2;

var scene = new THREE.Scene();

var character = new Character(1000, 1000);

renderer.setSize( ww, wh );
renderer.appendTo( document.body );

var focus = new THREE.Vector3().copy( character.position );

camera.position.set( focus.x + Math.cos(a) * d, focus.y + d * .6, focus.z + Math.sin(a) * d );
camera.lookAt( focus );
camera.updateProjectionMatrix();
camera.updateMatrixWorld();

function tick () {
    
    camera.zoom = z;
    
    focus.lerpVectors( focus.clone(), character.getWorldPosition(), 0.1 );
    
    camera.position.set( focus.x + Math.cos(a) * d, focus.y + d * .6, focus.z + Math.sin(a) * d );
    camera.lookAt( focus );
    camera.updateProjectionMatrix();
    
    level.update( camera, character );
    
    renderer.render( scene, camera );
    
    //a += 0.01;
    
    requestAnimationFrame(tick);
    
}

var raycaster = new THREE.Raycaster();

var mouse = new THREE.Vector2();

var Ellipse = require('./types/ellipse.js');

//var pointer = new Ellipse({x: 0, y: 0, width: 10, height: 10, color: 'white'});

scene.add( level, character );

level.init().then( () => console.log('hi') );

renderer.setupScene( scene );

function getWorldIntersect( event ) {
    
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;		
	
	raycaster.setFromCamera( mouse, camera )
    
    var intersects = raycaster.intersectObjects( level.children );
    
    if( intersects.length ) {
        
        var point = intersects[0].point;
        
        return new THREE.Vector2( point.x, point.z );
        
    }
    
    return false;
    
}

window.addEventListener('click', function(e){
    
    var to = getWorldIntersect( e );
    
    if( to ) {
        
        var from = new THREE.Vector2( character.position.x, character.position.z );
        
        character.walkTo( level.checkPath( from, to ) );
        
    }
    
})

window.addEventListener('mousemove', function(e){
    
    var point = getWorldIntersect( e );
    
    //pointer.position.copy( point );
    
})

tick();

window.addEventListener( 'mousewheel', e => {
    
    camera.updateProjectionMatrix();
});