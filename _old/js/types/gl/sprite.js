var THREE = require('three');
var Rect = require('./rect.js');

var textureCache = {};

var loader = new THREE.TextureLoader();

module.exports = class Sprite extends THREE.Object3D {
    
    constructor( attrs ) {
        
        super();
        
        this.attrs = attrs;
        
        this.position.set( attrs.x || 0, attrs.y || 0, attrs.z || 0 );
        
        var materialParams = {
            depthWrite: false,
            transparent: true
        };
        
        if ( attrs.src ) {
            
            if( textureCache[ attrs.src ] ) {
                
                materialParams.map = textureCache[ attrs.src ];
                
            } else {
                
                var texture = loader.load( attrs.src );
                texture.repeat.y = 2;
                texture.offset.y = -1;
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.premultiplyAlpha = true;
                
                textureCache[ attrs.src ] = materialParams.map = texture;
                
            }
            
        }
        
        var material = new THREE.SpriteMaterial( materialParams );
        
        this.sprite = new THREE.Sprite( material );
        
        this.sprite.scale.set(attrs.width, attrs.height * 2, 0);
        
        this.add( this.sprite );
        
        var shadow = this.getShadow( attrs );
        
        if( shadow ) this.add( shadow );
        
    }
    
    getShadow( attrs ) {
        
        if( attrs.shadow === 'none' ) return false;
        
        var shadowAttrs = {
            width: attrs.width,
            height: attrs.height,
            x: 0,
            y: attrs.height / 2
        };
        
        if( attrs.shadow ) {
            
            shadowAttrs.image = attrs.shadow;
            
        } else {
            
            shadowAttrs.color = 'black';
            
        }
        
        var shadow = new Rect( shadowAttrs );
        
        return shadow;
        
    }
    
    clone () {
        
        return new this.constructor( this.attrs );
        
    }
    
}