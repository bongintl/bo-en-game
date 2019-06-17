var {
    Vector2,
    Vector3,
    Scene,
    Geometry,
    SphereGeometry,
    MeshBasicMaterial,
    ShaderMaterial,
    TextureLoader
} = require('three');

var {
    Mesh,
    SolidOutlineMaterial,
    LineSegments
} = require('../renderer/index');

var glslify = require('glslify');
var vertexShader = glslify.file( './hairVertex.glsl' );

var TextTexture = require('../text/textTexture');

var fragmentShader = `

void main () {
    
    gl_FragColor = vec4( 0., 0., 0., 1. );
    
}

`;

var RADIUS = 3;
var HAIR_LENGTH = .04;
var HAIRS = 100000;
var MAX_INCLINATION = Math.PI / 2;

var loader = new TextureLoader();

module.exports = function () {
    
    var sphereGeometry = new SphereGeometry( RADIUS, 64, 64 );
    var sphereMaterial = new MeshBasicMaterial( { color: 0xdeccca } );
    var sphereOutlineMaterial = new SolidOutlineMaterial();
    
    var sphere = new Mesh( sphereGeometry, sphereMaterial, sphereOutlineMaterial );
    
    var hairGeometry = new Geometry();
    
    var r1 = RADIUS;
    var r2 = RADIUS + HAIR_LENGTH;

    for ( var i = 0; i < HAIRS; i++ ) {
        
        var inclination = Math.random() * MAX_INCLINATION;
        var azimuth = Math.acos( Math.random() * 2 - 1 );
        
        hairGeometry.vertices.push(
            new Vector3(
                azimuth,
                inclination,
                0
            ),
            new Vector3(
                azimuth,
                inclination,
                HAIR_LENGTH
            )
        )
    }
    
    var mask = loader.load('assets/textures/hair2.png');
    
    var hairMaterial = new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            time: { value: 0 },
            offset: { value: 0 },
            velocity: { value: 0 },
            radius: { value: RADIUS },
            maxInclination: { value: MAX_INCLINATION },
            mask: { value: mask },
            maskScale: { value: new Vector2(1, 2) }
        }
    });

    var hair = new LineSegments( hairGeometry, hairMaterial );
    
    // hair.rotation.x = Math.PI / 2
    
    hair.rotation.y = Math.PI / -2;
    
    // hair.rotation.x = Math.PI / 2;
    
    var scene = new Scene();
    
    scene.add( sphere, hair );
    
    window.addEventListener('mousewheel', e => {
        
        hairMaterial.uniforms.offset.value += e.deltaY / 2000;
        
    })
    
    return {
        background: 0x555555,
        camera: {
            position: new Vector3(-.5, 3, 4.5),
            target: new Vector3(1.5,0,-1),
            fov: 80
        },
        scene,
        tick: (dT, camera) => {
            
            // camera.position.y += .001;
            
            hairMaterial.uniforms.time.value += dT / 1000;
            // hairMaterial.uniforms.offset.value += dT / 8000;
            
            // hair.rotation.z += .005;
            
        }
    }
    
}