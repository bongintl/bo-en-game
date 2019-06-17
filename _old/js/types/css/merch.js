var Group = require('../abstract/group.js');
var CSSRect = require('./cssrect.js');
var CSSSprite = require('./csssprite.js');

module.exports = class Merch extends Group {
    
    constructor ( attrs ) {
        
        super( attrs );
        
        var label = new CSSRect({
            x: 0,
            y: attrs.height * -.375,
            width: attrs.width,
            height: attrs.height / 4,
            classes: ['merch-label'],
            content: `
                <p class="merch-label__name">${attrs.content}</p>
                <p class="merch-label__price">${attrs.price}</p>
            `
        });
        
        var product = new CSSSprite({
            x: 0,
            y: 0,
            width: Math.min( attrs.width, attrs.height ),
            height: Math.min( attrs.width, attrs.height ),
            src: attrs.img,
            shadow: attrs.shadow
        });
        
        this.add( label, product );
        
    }
    
}