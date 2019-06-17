var THREE = require('three');

module.exports = class Base3DObject extends THREE.Mesh {
    
    constructor ( attrs ) {
        
        super();
        
        this.attrs = attrs;
        
        this.position.set( attrs.x || 0, attrs.y || 0, attrs.z || 0 );
        
        this.geometry = this.getGeometry( attrs );
        this.material = this.getMaterial( attrs );
        
        this.updateMorphTargets();
        
        this.width = attrs.width;
        this.height = attrs.height;
        
        if ( attrs.rotate ) this.rotation.z = THREE.Math.degToRad( attrs.rotate );
        
        if ( attrs.winColor ) {
            
            var baseColor = new THREE.Color( attrs.color );
            var winColor = new THREE.Color( attrs.winColor );
            
            this.onWin = progress => {
                this.material.color = baseColor.clone().lerp( winColor, progress )
            };
            
        }
        
    }
    
    getMaterial ( attrs ) {
        
        var params = {
            depthWrite: false
        };
        
        if( this.attrs.color ) {
            
            params.color = this.attrs.color;
            
        }
        
        if ( this.attrs.image ) {
            
            params.transparent = true;
            params.map = new THREE.TextureLoader().load( this.attrs.image );
            
        }
        
        return new THREE.MeshBasicMaterial( params );
        
    }
    
    clone () {
        
        return new this.constructor( this.attrs );
        
    }
    
}