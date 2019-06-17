varying vec2 vUv;

void main () {
    
    vec4 position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    
    vUv = uv;
    
    gl_Position = position;
    
}