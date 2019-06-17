var CSSPanel = require('./csspanel.js');
var embed = require('video-embed');

module.exports = class Theater extends CSSPanel {
    
    constructor( attrs ) {
        
        super( attrs );
        
        this.iframe = embed( attrs.src );
        
    }
    
    getStyle ( attrs ) {
        
        return {
            backgroundColor: 'black'
        };
        
    }
    
    onCameraEnter () {
        
        this.element.innerHTML = this.iframe;
        
    }
    
    onCameraLeave () {
        
        this.element.innerHTML = '';
        
    }
    
};