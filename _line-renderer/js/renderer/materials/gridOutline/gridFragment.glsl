varying vec3 faceColor;
varying vec2 vUv;

uniform vec2 divisions;

void main () {
    
    vec2 latLng = floor( vUv * divisions ) / divisions;
    
    float g = ( latLng.x + latLng.y ) / 2.;
    
    gl_FragColor = vec4( faceColor.r, g, 0., 1. );
    
}