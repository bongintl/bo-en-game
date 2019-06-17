var Rect = require('./rect.js');

var page = require('page');

module.exports = class Door extends Rect {
    
    constructor( attrs ) {
        
        super( attrs );
        
        if( attrs.hidden ) {
            
            this.visible = false;
            
            this.onWin = progress => this.visible = progress === 1;
            
        }
        
    }
    
    onCharacterEnter () {
        
        if( this.visible ) page( this.attrs.to );
        
    }
    
}