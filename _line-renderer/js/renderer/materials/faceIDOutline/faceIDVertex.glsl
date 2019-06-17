#pragma glslify: objectDepth = require('../lib/objectDepth')

attribute float outlineGroupID;
varying vec3 faceColor;

void main () {
    
    vec4 position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    
    faceColor.r = objectDepth( projectionMatrix, modelViewMatrix );
    faceColor.g = outlineGroupID;
    
    gl_Position = position;
    
}