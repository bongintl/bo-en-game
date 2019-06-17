var {
    Vector2,
    Vector3,
    Matrix4,
    Box3,
    Frustum,
} = require('three');

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

var v2 = new Vector2();

var getQuads = ( address, ww, wh, center, size, maxSize, camera, frustum ) => {
    
    var halfSize = size / 2;
    
    corners[ 0 ].set( center.x - halfSize, 0, center.z + halfSize );
    corners[ 1 ].set( center.x + halfSize, 0, center.z + halfSize );
    corners[ 2 ].set( center.x - halfSize, 0, center.z - halfSize );
    corners[ 3 ].set( center.x + halfSize, 0, center.z - halfSize );
    
    box.min.copy( corners[ 2 ] );
    box.max.copy( corners[ 1 ] );
    
    if ( !frustum.intersectsBox( box ) ) return {};
    
    corners.forEach( ( corner, i ) => {
        
        var screenCorner = screenCorners[ i ];
        
        corner.project( camera );
        
        screenCorner.set(
            ( corner.x + 1 ) / 2 * ww,
            ( corner.y + 1 ) / 2 * wh
        )
        
    })
    
    var edgeTooLong = edges.some( ( [ c1, c2 ] ) => v2.copy(c1).sub(c2).length() > maxSize );
    
    if ( address.length < 5 && edgeTooLong ) {
        
        var quarterSize = size / 4;
        
        var centers = [
            new Vector3( center.x - quarterSize, 0, center.z - quarterSize ),
            new Vector3( center.x + quarterSize, 0, center.z - quarterSize ),
            new Vector3( center.x - quarterSize, 0, center.z + quarterSize ),
            new Vector3( center.x + quarterSize, 0, center.z + quarterSize )
        ]
        
        var quads = centers.map( ( c, i ) => getQuads( address + String(i), ww, wh, c, size / 2, maxSize, camera, frustum ) );
        
        return quads.reduce( ( a, q ) => Object.assign( a, q ), {} );
        
    } else {
        
        return { [ address ]: { center: center.clone(), size } };
        
    }
    
}

var m = new Matrix4();
var frustum = new Frustum();

module.exports = ( ww, wh, camera, mapSize, tileSize ) => {
    
    // camera.updateMatrixWorld();
    // camera.matrixWorldInverse.getInverse( camera.matrixWorld );
    
    m.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
    frustum.setFromMatrix( m );
    
    return getQuads( "0", ww, wh, new Vector3(), mapSize, tileSize, camera, frustum );
    
}