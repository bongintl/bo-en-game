var THREE = require('three');
var Promise = require('promise');
var page = require('page');
var cookies = require('js-cookie');
var rAF = require('./lib/rAF.js');
var tween = require('./lib/tween.js');
var eases = require('eases');
var utils = require('./lib/utils.js');

var Renderer = require('./renderer.js');
var Camera = require('./camera.js');
var Level = require('./level.js');
var Character = require('./character.js');
var Player = require('./player.js');

var v3s = [
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3()
]

module.exports = class BoEngine {
    
    constructor ( element, levels ) {
        
        this.element = element;
        
        this.levels = levels;
        
        this.level = null;
        
        this.renderer = new Renderer( this.element );
        this.camera = new Camera( 0, 0, 0, 0, 1, 1000000 );
        this.scene = new THREE.Scene();
        this.character = new Character();
        this.raycaster = new THREE.Raycaster();
        this.plane = new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), 0 )
        this.mouse = new THREE.Vector2();
        this.mouseWorld = new THREE.Vector2();
        this.player = new Player();
        
    }
    
    init () {

        this.scene.autoUpdate = false;
        
        window.addEventListener( 'resize', this.onResize.bind(this) );
        
        this.onResize();
        
        this.element.addEventListener( 'click', this.onClick.bind(this) );
        
        //this.element.addEventListener( 'mousemove', this.onMousemove.bind(this) );
        
        this.element.addEventListener( 'mousewheel', this.onMousewheel.bind(this) );
        
        rAF.start( this.tick.bind( this ) );
        
        this.load();
        
        console.log('BoEngine 0.0.1');
        
    }
    
    load () {
        
        var saved = cookies.getJSON('boen') || {};
        
        for( var path in this.levels ) {
            
            if( !( path in saved ) ) {
                
                saved[ path ] = false;
                
            }
            
        }
        
        this.won = saved;
        
    }
    
    save ( path ) {
        
        this.won[ path ] = true;
        
        cookies.set('boen', this.won);
        
    }
    
    onResize () {
        
        var w = this.element.clientWidth;
        var h = this.element.clientHeight;
        
        this.renderer.setSize( w, h );
        
        this.camera.setSize( w, h );
        
        if( this.level ) {
            
            this.level.onResize( w, h, this.camera );
            
            console.log(this.level.screenSize);
            
            console.log( Math.min( w / this.level.screenSize.x, h / this.level.screenSize.y ) );
            
            this.camera.setMinZoom( Math.min( w / this.level.screenSize.x, h / this.level.screenSize.y ) );
            
        }
        
    }
    
    setMouse ( event ) {
        
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	    
	    this.raycaster.setFromCamera( this.mouse, this.camera );
	    
	    var intersect = this.raycaster.ray.intersectPlane( this.plane );
	    
	    if( intersect ) this.mouseWorld.set( intersect.x, intersect.z );
        
    }
    
    onClick ( e ) {
        
        if( !this.level ) return;
        
        this.setMouse( e );
        
        var intersections = this.raycaster.intersectObjects( this.scene.children, true );
        
        var preventCharacterMove = false;
        
        intersections.forEach( intersection => {
            
            if(
                intersection.object.onClick &&
                intersection.object.onClick( this ) === false
            ) {
                preventCharacterMove = true;
            } else if ( intersection.object === this.character.sprite ) {
                
                preventCharacterMove = true;
                this.character.onClick( this );
                
            }
            
        });
        
        if( !preventCharacterMove ) {
            
            var from = new THREE.Vector2( this.character.position.x, this.character.position.z );
            
            this.character.walkTo( this.level.checkPath( from, this.mouseWorld ) );
            
        }
        
    }
    
    onMousewheel ( e ) {
        
        this.camera.setZoom( this.camera.zoom + e.deltaY * 0.001 );
        
    }
    
    tick ( now, dT ) {
        
        this.camera.update();
        this.level.update( now, dT, this );
        this.renderer.render( this.scene, this.camera );
        
    }
    
    loadLevel ( path ) {
        
        var afterFadeout;
        
        if( this.level ) {
            
            afterFadeout = utils.wait(1000);
            
            this.element.classList.add('fade-out');
            
        } else {
            
            afterFadeout = Promise.resolve();
            
        }
        
        afterFadeout.then(() => {
            
            if( !this.level ) this.init();
            
            console.log('init');
            
            if( path === '/' && !this.won['/hello'] ) {
                
                page( '/hello' );
                
                return;
                
            }
            
            this.renderer.clearScene( this.scene );
            
            if( !(this.levels[ path ] instanceof Level) ) {
                
                this.levels[ path ] = new Level( path, this.levels[ path ] );
                
            }
            
            this.level = this.levels[ path ];
            this.level.init( this );
            this.level.win( 0, this );
            
            this.camera.reset();
            this.camera.updateMatrixWorld();
            
            this.scene.add( this.level, this.character );
            this.renderer.setupScene( this.scene );
            this.scene.background = this.level.background;
            
            this.onResize();
            
            var origin = this.level.filter('Origin');
            if( !origin.length ) throw new Error( 'Level ' + path + ' has no origin' );
            
            this.character.position.copy( origin[0].getWorldPosition() );
            this.camera.focus.copy( this.character.position );
            this.camera.follow( this.character.position );
            
            if( path !== '/' ) this.player.pause();
            
            this.element.classList.remove('fade-out');
            
        });
        
    }
    
    winLevel () {
        
        this.character.canWalk = false;
        
        return tween( 0, 1, 10000, x => {
            
            var eased = eases.cubicIn(x);
            
            this.camera.angle = Math.PI / 4 + ( eased * Math.PI * 8 );
            
            this.level.win( x, this );
            
        }).then( () => {
            
            this.level.won = true;
            
            this.character.canWalk = true;
            
            this.save( this.level.path );
            
        })
        
    }
    
}

window.forget = () => { cookies.set('boen', false) }