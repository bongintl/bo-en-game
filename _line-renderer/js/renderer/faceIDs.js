var {
    Vector3,
    BufferGeometry,
    BufferAttribute
} = require('three');

function getNeighbours ( faces ) {
    
    function areNeighbours( f1, f2 ) {
        
        var matched = 0;
        
        for ( var i = 0; i < 3; i++ ) {
            
            for ( var j = 0; j < 3; j++ ) {
                
                if ( f1[ i ] === f2[ j ] ) {
                    
                    matched++;
                    break;
                    
                }
                
            }
            
        }
        
        return matched === 2;
        
    }
    
    var neighbours = faces.map( () => [] );
    
    var faceVertices = faces.map( f => [ f.a, f.b, f.c ] );
    
    for ( var i = 0; i < faceVertices.length; i++ ) {
        
        var f1 = faceVertices[ i ];
        
        for ( var j = i + 1; j < faceVertices.length; j++ ) {
            
            var f2 = faceVertices[ j ];
            
            if ( areNeighbours( f1, f2 ) ) {
                
                neighbours[ i ].push( j );
                
                neighbours[ j ].push( i );
                
            }
            
        }
        
    }
    
    return neighbours;
    
}

function pull ( array, value ) {
    
    var idx = array.indexOf( value );
    
    return array.splice( idx, 1 );
    
}

function groupFaces( faces, faceNeighbours, tolerance = 0 ) {
    
    var numGroups = 0;
    
    var faceObjects = faces.map( () => {
        return { group: false }
    });
    
    faces.forEach( (face, i) => {
        
        var fo = faceObjects[ i ];
        
        fo.normal = face.normal;
        
        var neighbours = faceNeighbours[ i ];
        
        fo.neighbours = neighbours.map( n => faceObjects[ n ] );
        
    });
    
    var stack = [ ...faceObjects ];
    
    var face, neighbour;
    
    while ( stack.length ) {
        
        face = stack[ stack.length - 1 ];
        
        if ( face.group === false ) face.group = numGroups++;
        
        if ( !face.neighbours.length ) {
            
            stack.pop();
            
            continue;
            
        }
        
        neighbour = face.neighbours[ face.neighbours.length - 1 ];
        
        if ( face.normal.angleTo( neighbour.normal ) <= tolerance ) {
            
            neighbour.group = face.group;
            
            stack.push( neighbour );
            
        }
        
        face.neighbours.pop();
        
        pull( neighbour.neighbours, face );
        
    }
    
    return faceObjects.map( f => f.group );
    
}

function triple ( groupIds ) {
    
    var buffer = new Float32Array( groupIds.length * 3 );
    
    var values = [];
    
    for ( var i = 0; i < groupIds.length; i++ ) {
        
        var id = groupIds[ i ];
        
        if ( !values[ id ] ) values[ id ] = Math.random();
        
        var value = values[ id ];
        
        for ( var j = 0; j < 3; j++ ) buffer[ i * 3 + j ] = value;
        
    }
    
    return buffer;
    
}

function autoFaceGroupBuffer ( faces, tolerance = 0 ) {
    
    var neighbours = getNeighbours( faces );
    
    var groups = groupFaces( faces, neighbours, tolerance );
    
    return groups;
    
}

function convertGeometry ( geometry, buffer ) {
    
    var attribute = new BufferAttribute( triple( buffer ), 1 );
    
    var bufferGeometry = new BufferGeometry().fromGeometry( geometry );
    
    bufferGeometry.addAttribute( 'outlineGroupID', attribute );
    
    return bufferGeometry;
    
}

function map ( geometry, fn ) {
    
    var ids = geometry.faces.map( fn );
    
    return convertGeometry( geometry, ids );
    
}

module.exports = {
    
    map,
    
    mapPositions: ( geometry, fn ) => {
        
        var v = new Vector3();
        
        return map( geometry, face => {
            
            v.copy( geometry.vertices[ face.a ] );
            v.add( geometry.vertices[ face.b ] );
            v.add( geometry.vertices[ face.c ] );
            
            v.divideScalar( 3 );
            
            return fn( v, face );
            
        })
        
    },
    
    auto: ( geometry, tolerance ) => {
        
        geometry.mergeVertices();
        
        geometry.computeFaceNormals();
        
        var buffer = autoFaceGroupBuffer( geometry.faces, tolerance );
        
        return convertGeometry( geometry, buffer );
        
    },
    
    fill: geometry => {
        
        return map( geometry, () => 0 );
        
    },
    
    randomize: geometry => {
        
        return map( geometry, ( face, i ) => i );
        
    }
    
};