var THREE = require('three');
var eases = require('eases');
var tween = require('./lib/tween.js');
var {scale} = require('./lib/utils.js');

var DISTANCE_HORIZONTAL = 100000;
var DISTANCE_VERTICAL = DISTANCE_HORIZONTAL * .6;

module.exports = class Camera extends THREE.OrthographicCamera {
    
    constructor ( ...args ) {
        
        super( ...args );
        
        this.focusIn = new THREE.Vector3();
        this.focusOut = new THREE.Vector3();
        this.focus = new THREE.Vector3();
        
        this.angle = Math.PI / 4;
        
        this.following = null;
        
        this.minZoom = 0;
        this.maxZoom = 10;
        
        this.update();
        
    }
    
    update () {
        
        if( this.following ) {
            
            this.focusIn.lerpVectors( this.focusIn.clone(), this.following, 0.1 );
            
        }
        
        var mix = eases.expoIn( scale( this.zoom, 1, this.minZoom, 0, 1 ) );
        
        this.focus.lerpVectors( this.focusIn, this.focusOut, mix );
        
        this.position.set(
            this.focus.x + Math.cos( this.angle ) * DISTANCE_HORIZONTAL,
            this.focus.y + DISTANCE_VERTICAL,
            this.focus.z + Math.sin( this.angle ) * DISTANCE_HORIZONTAL
        );
        
        this.lookAt( this.focus );
        this.updateProjectionMatrix();
        
    }
    
    reset() {
        
        this.focus.set(0, 0, 0);
        this.zoom = 1;
        this.angle = Math.PI / 4;
        this.following = null;
        this.update();
        
    }
    
    follow ( point ) {
        
        this.following = point;
        
    }
    
    setSize ( w, h ) {
        
        var hw = w / 2;
        var hh = h / 2;
        
        this.left = -hw;
        this.right = hw;
        this.top = hh;
        this.bottom = -hh;
        
        this.updateProjectionMatrix();
        
    }
    
    setZoom( z ) {
        
        this.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, z ) );
        
    }
    
    setMinZoom( z ) {
        
        this.minZoom = Math.min( z, 1 );
        this.setZoom( this.zoom );
        
    }
    
    zoomTo ( z ) {
        return tween( this.zoom, z, 1000, this.setZoom.bind(this) );
    }
    
    zoomOut() {
        return this.zoomTo(this.minZoom);
    }
    
    zoomIn(){
        return this.zoomTo(1);
    }
    
    toggleZoom() {
        return this.zoom === this.minZoom ? this.zoomIn() : this.zoomOut();
    }
    
}