var {
    Object3D,
    BoxGeometry,
    MeshBasicMaterial
} = require('three');

var {
    FaceIDs,
    FaceIDOutlineMaterial,
    Mesh
} = require('../renderer/index');

module.exports = function () {
    
    var group = new Object3D();
    
    var geometry = FaceIDs.auto( new BoxGeometry( .5, .5, .5 ) );
    var outlineMaterial = new FaceIDOutlineMaterial();

    for ( var x = -5; x <= 5; x++ ) {
        
        for( var y = -5; y <= 5; y++ ) {
            
            for ( var z = -5; z <= 5; z++ ) {
                
                var cube = new Mesh(
                    geometry,
                    new MeshBasicMaterial({ color: Math.random() * 0xffffff }),
                    outlineMaterial
                )
                
                cube.position.set( x, y, z );
                
                group.add( cube );
                
            }
            
        }
        
    }
    
    return group;
    
}