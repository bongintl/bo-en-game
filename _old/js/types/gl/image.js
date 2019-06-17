var Rect = require('./rect.js');
var THREE = require('three');
var ImageManager = require('../../lib/imageManager.js');
var tween = require('../../lib/tween.js');

module.exports = class Image extends Rect {
    
    constructor ( attrs ) {
        
        super( attrs );
        
        this.visible = false;
        
        this.manager = new ImageManager({
            srcs: attrs.srcs,
            useLargest: true,
            transform: img => {
                
                var texture = new THREE.Texture( img );
                
                texture.needsUpdate = true;
                
                return texture;
                
            },
            
            onChange: texture => {
                
                this.material.map = texture;
                
                if ( !this.visible ) {
                    
                    this.visible = true;
                    tween( 0, 1, 200, o => this.material.opacity = o );
                    
                }
                
            }
            
        })
        
    }
    
    preload() {
        
        return this.manager.load( 0 );
        
    }
    
    getMaterial( attrs ) {
        
        return new THREE.MeshBasicMaterial({
            map: new THREE.Texture(),
            depthWrite: false,
            opacity: 0,
            transparent: true
        });
        
    }
    
    onCameraMove ( camera ) {
        
        this.manager.setZoom( camera.zoom );
        
    }
    
}