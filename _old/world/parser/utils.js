function copy( node ) {
    
    var ret = {};
    
    ret.type = node.type;
    
    ret.attrs = {};
    
    for( var key in node.attrs ) {
        
        ret.attrs[ key ] = node.attrs[ key ];
        
    }
    
    ret.children = node.children.map( copy );
    
    return ret;
    
}

function find (world, type) {
        
        if( Array.isArray( type ) ) {
            
            return type
                .map( t => find( world, t ) )
                .reduce( (a, b) => a.concat(b) );
            
        }
        
        var found = [];
        
        var search = item => {
            
            if ( item.type === type ) found.push( item );
            
            item.children.forEach( search );
            
        }
        
        Array.isArray( world ) ? world.forEach(search) : search(world);
        
        return found;
        
    }

module.exports = {
    
    find,
    
    repeat: ( list, num ) => {
        
        var ret = [];
        
        for( var i = 0; i < num; i++ ) {
            
            var model = list[ i % list.length ];
            
            ret.push( copy( model ) );
            
        }
        
        return ret;
        
    },
    
    copy
    
}