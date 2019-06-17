var Cloner = require('./cloner.js');

module.exports = class Grid extends Cloner {
    
    constructor ( attrs ) {
        
        if( attrs.fill ) {
            
            attrs.num = attrs.rows * attrs.cols;
            
        }
        
        super( attrs );
        
    }
    
    positionClones( clones ) {
        
        console.log(clones.length, this)
        
        var {rows, cols} = this.attrs;
        
        var rowHeight = this.height / ( rows - 1 );
        var colWidth = this.width / ( cols - 1 );
        
        clones.forEach( ( clone, i ) => {
            
            var x = i % cols;
            var y = Math.floor( i / rows );
            
            clone.position.x = x * colWidth - this.width / 2;
            clone.position.y = -( y * rowHeight - this.height / 2 );
            
        });
        
    }
    
}