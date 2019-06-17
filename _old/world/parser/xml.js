var $ = require('cheerio');
var types = require('./types.js');

function getAttrs(node) {
    
    var ret = {};
    
    var attrs = node[0].attribs;
    
    for ( var name in attrs ) {
        
        var value = attrs[ name ];
        
        if( name === 'class' ) {
            name = 'classes';
            value = value.split(' ');
        }
        
        if( !isNaN(value) ) value = Number(value);
        
        if ( value === 'true' ) value = true;
        if ( value === 'false' ) value = false;
        
        ret[ name ] = value;
    }
    
    return ret;
    
}

function tagToType( tag ) {
    
    if ( tag.indexOf( 'CSS' ) > -1 ) {
        
        return tag.slice( 0, 4 ).toUpperCase() + tag.slice( 4 ).toLowerCase();
        
    } else {
        
        return tag[ 0 ].toUpperCase() + tag.slice( 1 ).toLowerCase();
        
    }
    
}

function parseNode(node, i) {
    
    var type = tagToType( node.prop('tagName') );
    
    var attrs = getAttrs(node);
    
    var children = [];
    var content = '';
    
    node.contents().each( function() {
        
        var node = $(this);
        
        if (
            this.type !== 'text' &&
            tagToType( node.prop('tagName') ) in types
        ) {
            
            children.push( parseNode( node ) );
            
        } else {
            
            content += $.html(node).trim();
            
        }
        
    });
    
    if( content.length ) attrs.content = content;
    
    return { type, attrs, children };
    
}

module.exports = (xml, tagName) => {
    
    var dom = $( xml.replace(/<!--[\s\S]*?-->/g, '') );
    
    return parseNode( dom );
    
}