varying vec3 faceColor;
varying vec2 vUv;
uniform sampler2D map;
uniform float seed;

void main () {
    
    float alpha = step( .9, texture2D( map, vUv ).a );
    
    gl_FragColor = vec4( faceColor.r, seed, 0., alpha );
    
}