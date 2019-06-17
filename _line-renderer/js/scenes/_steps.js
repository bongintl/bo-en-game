var {
    Vector3,
    Object3D,
    Geometry,
    BoxGeometry,
    PlaneGeometry,
    CylinderGeometry,
    Scene,
    MeshBasicMaterial
} = require('three');

var {
    Mesh,
    FaceIDs,
    FaceIDOutlineMaterial
} = require('../renderer/index');

var CSG = require('../geometry/csg');

var LAYERS = 1;
var STEP_SIZE = 1;
var TOP_SIZE = 5;
var HOLE_SIZE = 1.5;

module.exports = function(){
    
    var steps = new Geometry();
    
    var size = TOP_SIZE;
    
    for ( var i = 0; i < LAYERS; i++ ) {
        
        var box = new BoxGeometry( size, STEP_SIZE, size );
        
        box.translate( 0, -i * STEP_SIZE, 0 );
        
        steps.merge( box );
        
        size += STEP_SIZE * 2;
        
    }
    
    var hole = new CylinderGeometry( HOLE_SIZE, HOLE_SIZE, 1000, 64 );
    
    var stepsCSG = new CSG( steps );
    
    var holeCSG = new CSG( hole );
    
    var geometry = stepsCSG.subtract( holeCSG ).toGeometry();
    
    geometry = FaceIDs.auto( geometry, .1 );
    
    var material = new MeshBasicMaterial({color: 0x888888});
    var outlineMaterial = new FaceIDOutlineMaterial();
    
    var steps = new Mesh( geometry, material, outlineMaterial );
    
    var scene = new Scene();
    
    scene.add( steps );
    
    return {
        background: 0xffffff,
        camera: {
            position: new Vector3( 0, 0, 15 ),
            fov: 45
        },
        scene,
        tick: dT => {
            
            steps.rotation.x += 0.0001 * dT;
            
        }
        
    }
    
}