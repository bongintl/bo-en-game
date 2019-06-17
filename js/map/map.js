var {
    Vector2,
    Vector3,
    Object3D,
    Matrix4,
    Box3,
    Frustum,
} = require('three');

var textures = {};

var m = new Matrix4();
var frustum = new Frustum();

var corners = [
    new Vector3(), new Vector3(),
    new Vector3(), new Vector3()
]

var box = new Box3();

var screenCorners = [
    new Vector2(), new Vector2(),
    new Vector2(), new Vector2()
]

var edges = [
    [ screenCorners[ 0 ], screenCorners[ 1 ] ],
    [ screenCorners[ 1 ], screenCorners[ 3 ] ],
    [ screenCorners[ 3 ], screenCorners[ 2 ] ],
    [ screenCorners[ 2 ], screenCorners[ 0 ] ]
]

var shouldSplit = ( quad, camera, frustum ) => {
    
    var { size, position } = quad;
    
    var halfSize = size / 2;
    
    box.min.set( position.x - halfSize, 0, position.z - halfSize );
    box.max.set( position.x + halfSize, 0, position.z + halfSize );
    
    if ( !frustum.intersectsBox( box ) ) return false;
    
    corners[ 0 ].set( position.x - halfSize, 0, position.z + halfSize );
    corners[ 1 ].copy( box.max );
    corners[ 2 ].copy( box.min );
    corners[ 3 ].set( position.x + halfSize, 0, position.z - halfSize );
    
}

var canSplit = address => {
    
    return [
        address + '0',
        address + '1',
        address + '2',
        address + '3'
    ].every( a => textures[ a ] );
    
}

var split = quad => {
    
    var { size, address } = quad;
    
    var quads = [ quad, quad.clone(), quad.clone(), quad.clone() ];
    
    quads.forEach( ( q, i ) => {
        q.scale.multiplyScalar( .5 );
        q.size = size / 2;
        q.address = address + String( i );
        q.material.map = textures[ q.address ];
        q.material.needsUpdate = true;
    });
    
    quads[ 0 ].position.x -= size / 4;
    quads[ 0 ].position.z += size / 4;
    
    quads[ 1 ].position.x += size / 4;
    quads[ 1 ].position.z += size / 4;
    
    quads[ 2 ].position.x -= size / 4;
    quads[ 2 ].position.z -= size / 4;
    
    quads[ 3 ].position.x += size / 4;
    quads[ 3 ].position.z -= size / 4;
    
    return quads;
    
}

module.exports = ({ baseUrl, mapSize, tileSize, maxDepth }) => {
    
    return ({ width, height, camera, object }) => {
        
        m.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
        frustum.setFromMatrix( m );
        
        var root = { center: new Vector3(), size: mapSize };
        
    }
    
}