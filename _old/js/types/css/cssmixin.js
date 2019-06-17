var el = document.createElement('div');

function createElement ( template ) {
        
    el.innerHTML = template;
    return el.childNodes[0];
    
}

module.exports = superclass => class extends superclass {
    
    constructor ( attrs ) {
        
        super();
        
        this.attrs = attrs;
        
        this.width = attrs.width;
        this.height = attrs.height;
        
        var template = this.getTemplate( attrs );
        var element = createElement( template );
        
        if( attrs.classes ) element.classList.add( ...attrs.classes );
        
        var style = this.getStyle( attrs );
        
        for ( var prop in style ) {
            
            element.style[ prop ] = style[ prop ];
            
        }
        
        this.setElement( element );
        
        var shadow = this.getShadow( attrs );
        
        if( shadow ) this.add( shadow );
        
    }
    
    getShadow() {
        
        return false;
        
    }
    
    setElement( element ) {
        
        this.element = element;
        
    }
    
    getTemplate ( attrs ) {
        
        return `<div>${ attrs.content || '' }</div>`;
        
    }
    
    getStyle ( attrs ) {
        
        var style = {
            width: attrs.width + 'px',
            height: attrs.height + 'px'
        };
        
        if( attrs.color ) style.backgroundColor = attrs.color;
        if( attrs.src ) style.backgroundImage = 'url(' + attrs.src + ')';
        
        return style;
        
    }
    
    clone () {
        
        return new this.constructor( this.attrs );
        
    }
    
}