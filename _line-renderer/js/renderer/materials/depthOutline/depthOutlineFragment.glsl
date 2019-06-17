varying vec3 faceColor;
varying vec3 vNormal;
varying vec2 vUv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform sampler2D map;

uniform float seed;

// x, y, z, radius of bounding sphere
uniform vec4 bounds;

uniform vec2 cameraNearFar;

const float depthScale = 1. / 100.;

float map0to1 ( float value, float inMin, float inMax ) {
    return (value - inMin) / (inMax - inMin);
}

void main () {
    
    float objCenterZ = ( projectionMatrix * modelViewMatrix * vec4( bounds.xyz, 1.0 ) ).z;
    
    float objNear = objCenterZ - bounds.w;
    float objFar = objCenterZ + bounds.w;
    
    float cameraNear = cameraNearFar.x;
    float cameraFar = cameraNearFar.y;
    float cameraDepth = cameraFar - cameraNear;
    
    float objClipNear = map0to1( objNear, cameraNear, cameraFar );
    float objClipFar = map0to1( objFar, cameraNear, cameraFar );
    
    float z = ( 1. / gl_FragCoord.w ) / cameraDepth;
    
    float objClipDepth = map0to1( z, objClipNear, objClipFar );
    
    vec4 tex = texture2D( map, vUv );
    
    gl_FragColor = vec4( faceColor.r, tex.g, objClipDepth, 1.);
    
    // gl_FragColor = vec4( tex.rgb, 1.);
    
}