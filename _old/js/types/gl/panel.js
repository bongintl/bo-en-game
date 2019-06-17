var {scale} = require('../../lib/utils.js');

var Rect = require('./rect.js');

var THREE = require('three');

module.exports = class Panel extends Rect {
    
    constructor ( attrs ) {
        
        super( attrs );
        
        this.position.z += attrs.height / 2;
        
        this.rotation.z = 0;
        this.rotation.x += Math.PI / 2;
        
        if ( attrs.rotate ) this.rotation.y = THREE.Math.degToRad( attrs.rotate );
        
        if( this.getShadow ) this.add( this.getShadow( attrs ) );
        
        this.material.depthWrite = true;
        
        if( this.attrs.image ) {
            
            var back = new Rect({
                width: this.width,
                height: this.height,
                x: 0,
                y: 0,
                color: 'grey'
            });
            
            back.rotation.y = Math.PI;
            
            back.material.depthWrite = true;
            
            this.add( back );
            
        } else {
            
            this.material.side = THREE.DoubleSide;
            
        }
        
        if ( this.attrs.hidden ) {
            
            var targetAngle = Math.PI * 4 - THREE.Math.degToRad( this.attrs.rotate || 0 );
            
            this.onWin = ( progress, game ) => {
                
                var angle = game.camera.angle;
                
                this.visible = angle > targetAngle;
                
                if( this.children[0] ) {
                    
                    this.children[0].material.opacity = scale( angle, targetAngle, targetAngle + Math.PI, 0, 1 );
                    
                }

                
            }
            
        }
        
        this.impassable = true;
        
    }
    
    getShadow ( attrs ) {
        
        var r = attrs.rotate || 0;
        
        var shadow;
        
        if( r % 360 === 0 ) {
            
            shadow = new Rect({
                width: attrs.width,
                height: attrs.height,
                x: 0,
                y: -attrs.height / 2,
                color: 'black'
            })
            
            shadow.position.z = -attrs.height / 2;
            
            shadow.rotation.x = -Math.PI / 2;
            
        } else if ( r % 360 === 90 ) {
            
            shadow = new Rect({
                width: 2,
                height: attrs.height,
                x: attrs.height / 2 + attrs.width / 2,
                y: -attrs.height / 2,
                color: 'black'
            })
            
            shadow.position.z = -1;
            
            shadow.rotation.set( Math.PI / 2, 0, Math.PI / 2 );
            
        }
        
        shadow.material.transparent = true;
        
        return shadow;
        
    }
    
}