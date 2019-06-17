varying vec2 vUv;
uniform sampler2D map;

void main () {
    
    vec4 tex = texture2D( map, vUv );
    
    tex.a = step( .9, tex.a );
    
    gl_FragColor = tex;
    
}