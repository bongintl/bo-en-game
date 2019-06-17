const float depthScale = 1. / 100.;
const vec4 origin = vec4( 0., 0., 0., 1. );

float objectDepth ( mat4 projectionMatrix, mat4 modelViewMatrix ) {
    
    vec4 position = projectionMatrix * modelViewMatrix * origin;
    
    return position.z * depthScale;
    
}

#pragma glslify: export(objectDepth)