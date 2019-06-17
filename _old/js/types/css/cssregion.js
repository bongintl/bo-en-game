var Group = require('../abstract/group.js');
var CSSRect = require('./cssrect.js');

module.exports = class CSSRegion extends Group {
    
    constructor( attrs ){
        
        super( attrs );
        
        if( attrs.content || attrs.color ) {
            
            this.add( new CSSRect({
                x: 0, 
                y: 0,
                width: attrs.width,
                height: attrs.height,
                content: attrs.content,
                color: attrs.color
            }) );
            
        }
        
    }
    
    onCharacterEnter ( character ) {
        
        character.toCSS();
        
    }
    
    onCharacterLeave ( character ) {
        
        character.toGL();
        
    }
    
}