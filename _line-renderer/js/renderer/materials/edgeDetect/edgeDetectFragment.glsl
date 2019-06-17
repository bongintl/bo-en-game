uniform sampler2D edgeFBO;
uniform sampler2D colorFBO;
uniform sampler2D texture;
uniform vec2 resolution;
uniform vec3 outlineColor;
uniform float time;

#define MIN_FLOAT 0.00001

float diff ( vec3 c1, vec3 c2 ) {
    
    float objDepthDiffPos = max( c2.r - c1.r, 0. );
    
    float objDepthDiffNeg = -min( c2.r - c1.r, 0. );
    
    float idDiff = max( c2.g - c1.g, 0. );
    
    float depthDiff = -min( c2.b - c1.b, 0. );
    
    depthDiff = step( 1. / 255., depthDiff );
    
    return objDepthDiffPos + depthDiff + idDiff * float( objDepthDiffNeg == 0. );
    
}

float edge ( sampler2D tex, vec2 p, vec2 px ) {
    
    vec3 s1 = texture2D( tex, p ).rgb;
    vec3 s2 = texture2D( tex, p + px * vec2( 1., 0. ) ).rgb;
    vec3 s3 = texture2D( tex, p + px * vec2( 0., 1. ) ).rgb;
    vec3 s4 = texture2D( tex, p + px * vec2( 0., -1. ) ).rgb;
    vec3 s5 = texture2D( tex, p + px * vec2( -1., 0. ) ).rgb;
    
    float edges = diff( s1, s2 ) + diff( s1, s3 ) + diff( s1, s4 ) + diff( s1, s5 );
    
    return step( MIN_FLOAT, edges );
    
}

vec3 separate ( sampler2D tex, vec2 p, vec2 px ) {
    
    vec3 col = texture2D( tex, p ).rgb;
    
    float r = col.r;
    float g = texture2D( tex, p + px * vec2( 2., 4. ) ).g;
    float b = texture2D( tex, p + px * vec2( -1., -4. ) ).b;
    
    return vec3( r, g, b ) * step( vec3( .01 ), col );
    
}

vec3 CMYKRGB( vec3 color ) {
    
    return vec3( 1. ) - color;
    
}

vec3 separateCMYK ( sampler2D tex, vec2 p, vec2 px ) {
    
    vec3 col = texture2D( tex, p ).rgb;
    
    vec3 sc = col;
    vec3 sm = texture2D( tex, p + px * vec2( 2., 4. ) ).rgb;
    vec3 sy = texture2D( tex, p + px * vec2( -1., -4. ) ).rgb;
    
    vec3 c = CMYKRGB( sc ) * vec3( 1., 0., 0. );
    vec3 m = CMYKRGB( sm ) * vec3( 0., 1., 0. );
    vec3 y = CMYKRGB( sy ) * vec3( 0., 0., 1. );
    
    return CMYKRGB( c + m + y );
    
    //return vec3( r, g, b ) * step( vec3( .01 ), col );
    
}

void main () {
    
    vec2 p = gl_FragCoord.xy / resolution;
    
    vec2 px = ( vec2( 1. ) / resolution ) * .5;
    
    // vec4 tex = texture2D( fbo, p );
    
    vec3 color = texture2D( colorFBO, p ).rgb;//separateCMYK( colorFBO, p, px );
    
    float edges = 1. - edge( edgeFBO, p, px );
    
    vec3 texBias = color.rgb * vec3( .5, 1., .8 );
    
    vec4 tex = texture2D( texture, p ) * length( texBias ) * .2;
    
    gl_FragColor = vec4( color * edges, 1. );
    
}