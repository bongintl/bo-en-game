var {
    Vector2,
    Vector3,
    Geometry,
    Shape,
    ShapeGeometry,
    ExtrudeGeometry,
    Scene,
    MeshBasicMaterial
} = require('three');

var {
    Mesh,
    FaceIDs,
    FaceIDOutlineMaterial
} = require('../renderer/index');

var CSG = require('../geometry/csg');

var LAYERS = 5;
var STEP_SIZE = 1;
var TOP_SIZE = 5;
var HOLE_SIZE = 1.5;

function stepGeometry( size, holeRadius, thickness ) {
    
    var hSize = size / 2;
    
    var square = new Shape([
        new Vector2( -hSize, hSize ),
        new Vector2( hSize, hSize ),
        new Vector2( hSize, -hSize ),
        new Vector2( -hSize, -hSize )
    ]);
    
    var circle = new Shape();
    
    circle.ellipse( 0, 0, holeRadius, holeRadius, 0, Math.PI * 2 );
    
    square.holes.push( circle );
    
    return new ExtrudeGeometry( square, {
        amount: thickness,
        bevelEnabled: false,
        curveSegments: 16
    });
    
}

module.exports = function(){
    
    var geometry = new Geometry();
    
    var size = TOP_SIZE;
    
    for ( var i = 0; i < LAYERS; i++ ) {
        
        var step = stepGeometry( size, HOLE_SIZE, STEP_SIZE );
        
        step.translate( 0, 0, -i * STEP_SIZE );
        
        geometry.merge( step );
        
        size += STEP_SIZE * 2;
        
    }
    
    geometry.rotateX( -Math.PI / 2 );
    
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