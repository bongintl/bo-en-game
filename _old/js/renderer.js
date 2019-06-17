var THREE = require('three');
require('./vendor/three.cssrenderer.js')(THREE);

module.exports = class Renderer {
    
    constructor ( container ) {
        
        this.glRenderer = new THREE.WebGLRenderer( {antialias: true } )
        this.glRenderer.localClippingEnabled = true;
        this.glRenderer.domElement.classList.add('renderer', 'renderer_gl');
        
        this.cssRenderer = new THREE.CSS3DRenderer();
        this.cssRenderer.domElement.classList.add('renderer', 'renderer_css');
        
        container.appendChild( this.glRenderer.domElement );
        container.appendChild( this.cssRenderer.domElement );
        
    }
    
    setSize( w, h ) {
        
        this.width = w;
        this.height = h;
        
        this.glRenderer.setSize( w, h );
        this.cssRenderer.setSize( w, h );
        
    }
    
    setupScene ( scene ) {
        
        scene.traverse( object => {
            
            if( object instanceof THREE.CSS3DObject ) {
                
                this.cssRenderer.domElement.childNodes[0].appendChild( object.element );
                
            }
            
        })
        
    }
    
    clearScene ( scene ) {
        
        scene.traverse( object => {
            
            if( object instanceof THREE.CSS3DObject ) {
                
                this.cssRenderer.domElement.childNodes[0].removeChild( object.element );
                
            }
            
        })
        
        scene.children.forEach( object => scene.remove( object ) );
        
    }
    
    render ( scene, camera ) {
        
        this.glRenderer.render( scene, camera );
        this.cssRenderer.render( scene, camera );
        
    }
    
}