#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

uniform float time;
uniform float radius;
uniform float offset;
uniform float maxInclination;
uniform float velocity;

uniform sampler2D mask;
uniform vec2 maskScale;

vec3 spherical ( vec3 v ) {
    
    float inclination = v.x;
    float azimuth = v.y;
    float radius = v.z;
    
    float sinInc = sin( inclination );
    float cosInc = cos( inclination );
    float sinAz = sin( azimuth );
    float cosAz = cos( azimuth );
    
    return vec3(
        radius * sinInc * cosAz,
        radius * sinInc * sinAz,
        radius * cosInc
    );

}

void main () {
    
    const float pi = 3.14159;
    
    // Rectangular coordinates reprensenting spherical angles
    
    // Vertex position x in range [ 0, pi ]
    // Vertex position y in range [ 0, maxInclination ]
    // Vertex position z is either 0 ( hair root ) or > 0 ( hair tip )
    
    vec3 p = position;
    
    // 'Scrolling'
    p.y += offset;
    p.y = mod( p.y, maxInclination );
    
    // Texture sample, with scroll
    // Normalize position
    vec2 sample = position.xy / vec2( pi );
    
    // Scale to texture proportions
    sample /= maskScale;
    
    // 1 = long hair,
    // 0 = short hair
    float mask = texture2D( mask, sample ).r;
    p.z *= mask;
    
    // Position to sample noise from
    vec2 windSample = p.xy * 1.5;
    
    // Noise values for inclination and azimuth to rotate hair
    vec2 windDirection = vec2(
        snoise3( vec3( windSample, time * .25 ) ),
        snoise3( vec3( windSample + time, time * .5 ) )
    );
    
    // Rotate the end of each hair around the root
    // Roots are not affected because position.z = radius = 0
    vec3 windOffset = spherical( vec3( windDirection, p.z ) );
    windOffset.y += velocity * p.z;
    p += windOffset;
    
    // Finally, wrap it all around the head
    p = spherical( vec3( p.x, p.y, p.z + radius ) );
    
    // float mask = 0.;//texture2D( mask, vec2( position.x / pi, mod( position.y * 2., pi * .25 ) ) ).r;
    
    // vec3 p = vec3( position.x, mod( position.y + offset, pi * .5 ) - pi * 1.5, 0.);
    
    // vec2 windSample = ( p.xy + vec2( 0., offset ) ) * 2.;
    
    // vec2 windDirection = vec2(
    //     snoise3( vec3( windSample, time * .25 ) ) * 2.,
    //     snoise3( vec3( windSample + time * .5, time * .25 ) ) * 2.
    // );
    
    // p = vec3( p + spherical( vec3( windDirection, wind ) ) );
    
    // 
    
    // p *= 1. - mask;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
    
}