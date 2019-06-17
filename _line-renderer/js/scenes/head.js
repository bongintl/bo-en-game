var {
    Vector3,
    Scene,
    JSONLoader,
    TextureLoader,
    Geometry,
    MeshBasicMaterial,
    NearestFilter
} = require('three');

var {
    Mesh,
    DepthOutlineMaterial
} = require('../renderer/index');

var jsonLoader = new JSONLoader();
var textureLoader = new TextureLoader();

module.exports = function(){
    
    var diffuseTexture = textureLoader.load( 'assets/textures/head_diffuse.png' );
    
    diffuseTexture.minFilter = diffuseTexture.magFilter = NearestFilter;
    
    var outlineTexture = textureLoader.load( 'assets/textures/head_regions.png' );
    
    var outlineMaterial = new DepthOutlineMaterial({map: outlineTexture});
    
    var head = new Mesh( new Geometry(), new MeshBasicMaterial({color: 0xffffff}), outlineMaterial );
    
    jsonLoader.load('assets/models/LeePerrySmith.json', ( geometry, materials ) => {
        
        head.geometry = geometry;
        
        outlineMaterial.updateBounds( geometry );

    });
    
    var scene = new Scene();
    
    scene.add( head );
    
    // head.rotation.y += Math.PI / 2;
    
    return {
        background: 0xffffff,
        camera: {
            position: new Vector3( 0, 0, 12 ),
            target: new Vector3(),
            fov: 45
        },
        scene,
        tick: dT => {
            
            head.rotation.y += 0.0005 * dT;
            
        },
        updateCamera: outlineMaterial.updateCamera.bind( outlineMaterial )
        
    }

    
}