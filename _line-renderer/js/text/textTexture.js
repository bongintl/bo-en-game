var {
    Vector2,
    CanvasTexture
} = require('three');
var TextMeasurer = require('./textMeasurer');

var memoize = require('lodash/memoize');

var measurer = new TextMeasurer();

var measureHeight = memoize( ( font, size, weight ) => {
    
    return measurer.measureText({
        fontFamily: font,
        fontSize: size + 'px',
        fontWeight: weight,
        text: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    }).height;
    
}, ( font, size, weight ) => {
    
    return font + String( size ) + weight;
    
})

function npo2 ( x ) {
    
    var ret = 1;
    
    while ( ret < x ) ret *= 2;
    
    return ret;
    
}

module.exports = class TextTexture extends CanvasTexture {
    
    constructor ( str = '', options = {} ) {
        
        var defaults = {
            font: "Helvetica",
            size: 100,
            weight: 'normal',
            color: 'black'
        };
        
        options = Object.assign( {}, defaults, options );
        
        var canvas = document.createElement( 'canvas' );
        var ctx = canvas.getContext('2d');
        
        var font = options.weight + ' ' + options.size + 'px ' + options.font;
        
        ctx.font = font;
        
        var textWidth = ctx.measureText( str ).width;
        var textHeight = measureHeight( options.font, options.size, options.weight );
        
        canvas.width = npo2( textWidth );
        canvas.height = npo2( textHeight );
        
        ctx.scale( canvas.width / textWidth, canvas.height / textHeight );
        
        ctx.imageSmoothingEnabled = false;
        
        ctx.textBaseline = 'bottom';
        ctx.font = font;
        ctx.fillStyle = options.color;
        
        ctx.fillText( str, 0, options.size );
        
        super( canvas );
        
        this.textSize = new Vector2( textWidth, textHeight );
        
    }
    
}