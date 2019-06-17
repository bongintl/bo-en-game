var {
    Vector3,
    Scene,
    BoxGeometry,
    MeshBasicMaterial
} = require('three');

var {
    Mesh,
    DepthOutlineMaterial
} = require('../renderer/index');

module.exports = function( r ){
    
    var outlineMaterial = new DepthOutlineMaterial();
    
    var head = new Mesh( new BoxGeometry( r, r, 10 ), new MeshBasicMaterial(), outlineMaterial );
    
    head.position.x = 2;
    
    outlineMaterial.updateBounds( head.geometry );
    
    var scene = new Scene();
    
    scene.add( head );
    
    return {
        background: 0xffffff,
        camera: {
            position: new Vector3( 0, 0, 10 ),
            fov: 45
        },
        scene,
        tick: dT => {
            
            head.scale.z = Math.sin( Date.now() / 1000 ) + 1;
            
        },
        updateCamera: outlineMaterial.updateCamera.bind( outlineMaterial )
        
    }

    
}