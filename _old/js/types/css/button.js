var CSSRect = require('./cssrect.js');

module.exports = class Button extends CSSRect {
    
    onCharacterEnter () {
        
        this.element.classList.add('on');
        
    }
    
    onCharacterLeave () {
        
        this.element.classList.remove('on');
        
    }
    
}