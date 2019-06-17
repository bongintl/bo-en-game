var THREE = require('three');
var CSSMixin = require('./cssmixin.js');
var CSSRect = require('./cssrect.js');

module.exports = class CSSSprite extends CSSMixin( THREE.CSS3DSprite ) {
    
    constructor ( attrs ) {
        
        super( attrs );
        
        //this.scale.set( 0.88, 0.88, 1 );
        
        this.position.set( attrs.x || 0, attrs.y || 0, attrs.z || 0 );
        
    }
    
    setElement( element ) {
        
        var container = document.createElement('div');
        
        container.classList.add('sprite');
        
        container.appendChild( element );
        
        this.element = container;
        
    }
    
    getShadow( attrs ) {
        
        if( attrs.shadow === 'none' ) return false;
        
        var shadowAttrs = {
            width: attrs.width,
            height: attrs.height,
            x: 0,
            y: attrs.height / 2 + ( attrs.z || 0 ),
            z: -( attrs.z || 0 ),
            classes: ['shadow']
        };
        
        if( attrs.shadow ) {
            
            shadowAttrs.src = attrs.shadow;
            
        } else {
            
            shadowAttrs.color = 'black';
            
        }
        
        var shadow = new CSSRect( shadowAttrs );
        
        return shadow;
        
    }
    
}