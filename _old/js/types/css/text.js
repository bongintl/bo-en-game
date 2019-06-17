var CSSRect = require('./cssrect.js');

module.exports = class Text extends CSSRect {
    
    getStyle ( attrs ) {
        
        return {
            color: attrs.color || 'black',
            fontSize: attrs.size ? attrs.size + 'px' : '100px',
            fontFamily: attrs.font || 'Helvetica, sans-serif',
            textAlign: attrs.align || 'left'
        }
        
    }
    
    getTemplate ( attrs ) {
        
        return `<div>${attrs.content}</div>`;
        
    }
    
}