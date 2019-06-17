var THREE = require('three');
var howler = require('howler');

var Sprite = require('./types/gl/sprite.js');
var CSSSprite = require('./types/css/csssprite.js');

var tween = require('./lib/tween.js');

var attrs = {
    x: 0, y: 0,
    width: 10,
    height: 20,
    src: 'assets/character_white.png',
    classes: ['character']
}

var sounds = [];

for ( var i = 0; i < 14; i++ ) {
    
    sounds.push( new howler.Howl({
        src: ['assets/sfx/donk' + i + '.mp3']
    }))
    
}

var nextSound = null;

setInterval( function() {
    
    if( nextSound ) nextSound.play();
    
    nextSound = null;
    
}, 545 );

class GLCharacter extends Sprite {
    
    constructor() {
        
        super( attrs );
        
        var material = this.sprite.material;
        
        material.blending = THREE.CustomBlending;
        material.blendSrc = THREE.OneMinusDstColorFactor;
        material.blendDst = THREE.OneMinusSrcAlphaFactor;
        material.blendEquation = THREE.AddEquation;
        material.transparent = true;
        
    }
    
    getShadow( attrs ) {
        
        var shadow = super.getShadow( attrs );
        
        shadow.material.depthWrite = true;
        
        shadow.position.y = 0;
        shadow.position.z = -attrs.height / 2;
        
        shadow.rotation.x = Math.PI / 2;
        
        return shadow;
        
    }
    
    onClick( game ) {
        
        game.player.toggle();
        
    }
    
}

class CSSCharacter extends CSSSprite {
    
    constructor() {
        
        super( attrs );
        
    }
    
    getShadow ( attrs ) {
        
        var shadow = super.getShadow( attrs );
        
        shadow.position.y = 0;
        shadow.position.z = -attrs.height / 2;
        
        shadow.rotation.x = Math.PI / 2;
        
        return shadow;
        
    }
    
}

module.exports = class Character extends THREE.Object3D {
    
    constructor () {
        
        super();
        
        this.glSprite = new GLCharacter();
        this.cssSprite = new CSSCharacter();
        
        this.isCSS = true;
        this.toGL();

        this.walking = false;
        this.canWalk = true;
        
        this.add( this.glSprite, this.cssSprite );
        
    }
    
    toCSS () {
        
        if ( this.isCSS ) return;
        
        this.glSprite.visible = false;
        
        this.cssSprite.element.style.display = 'block';
        this.cssSprite.children[0].element.style.display = 'block';
        
        this.isCSS = true;
        
    }
    
    toGL () {
        
        if ( !this.isCSS ) return;
        
        this.glSprite.visible = true;
        
        this.cssSprite.element.style.display = 'none';
        this.cssSprite.children[0].element.style.display = 'none';
        
        this.isCSS = false;
        
    }
    
    walkTo( to ) {
        
        if( !this.canWalk ) return;
        
        this.walking = true;
        
        var from = this.position.clone();
        to = new THREE.Vector3( to.x, 0, to.y );
        var distance = from.distanceTo( to );
        var duration = Math.abs( distance * 3 );
        
        if( !nextSound ) nextSound = sounds[ Math.floor( Math.random() * sounds.length ) ];
        
        return tween( 'characterWalk', 0, 1, duration, x => {
            
            this.position.lerpVectors( from, to, x );
            this.updateMatrixWorld();
            
        }).then(() => this.walking = false);
        
    }
    
}

