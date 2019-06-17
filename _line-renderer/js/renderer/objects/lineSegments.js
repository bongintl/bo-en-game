var { LineSegments, MeshBasicMaterial } = require('three');

var invisibleMaterial = new MeshBasicMaterial( { transparent: true, opacity: 0 } );

module.exports = class OutlinedLineSegments extends LineSegments {
    
    constructor ( geometry, visibleMaterial, outlineMaterial = invisibleMaterial ) {
        
        super( geometry, visibleMaterial );
        
        this.visibleMaterial = visibleMaterial;
        this.outlineMaterial = outlineMaterial;
        
        this.onAfterRender = this._onAfterRender;
        
    }
    
    _onAfterRender ( renderer ) {

        if ( renderer.renderingOutlinesNext ) {
            
            this.material = this.outlineMaterial;
            
        } else {
            
            this.material = this.visibleMaterial;
            
        }
        
    }
    
}