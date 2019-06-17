var { Mesh, MeshBasicMaterial } = require('three');

var invisibleMaterial = new MeshBasicMaterial( { visible: false } );

module.exports = class OutlinedMesh extends Mesh {
    
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