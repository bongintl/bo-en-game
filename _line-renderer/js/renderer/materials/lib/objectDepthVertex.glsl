#pragma glslify: objectDepth = require('../lib/objectDepth')

varying vec3 faceColor;
varying vec2 vUv;
varying vec3 vNormal;

void main () {
    
    vec4 position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    
    faceColor.r = objectDepth( projectionMatrix, modelViewMatrix );
    
    vUv = uv;
    vNormal = normalMatrix * normal;
    
    gl_Position = position;
    
}