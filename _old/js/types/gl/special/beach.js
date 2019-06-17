var THREE = require('three');

var Shader = require('../shader.js');

var shaderSource = require('./beach.c');

var seaNight = new THREE.Color('navy');
var seaDay = new THREE.Color('teal');

var sunNight = new THREE.Color('white');
var sunDay = new THREE.Color('yellow');

module.exports = class Beach extends Shader {
    
    getGeometry ( attrs ) {
        
        return new THREE.PlaneGeometry( attrs.width, attrs.height );
        
    }
    
    getSource () { return shaderSource }
    
    getUniforms ( attrs ) {
        
        var rippleOrigin = attrs.ripple.split(',').map( x => Number(x) );
        
        rippleOrigin[1] = 1 - rippleOrigin[1];
        
        return {
            u_tide: { value: 0 },
            u_time: { value: 0 },
            u_rippleOrigin: { value: new THREE.Vector2( ...rippleOrigin ) },
            u_seaColorDay: { value: seaDay },
            u_seaColorNight: { value: seaNight },
            u_sunColorNight: { value: sunNight },
            u_sunColorDay: { value: sunDay },
            u_resolution: { value: new THREE.Vector2() },
            u_win: { value: 0 }
        };
        
    }
    
    onResize ( w, h ) {
        
        console.log(w, h);
        
        this.uniforms.u_resolution.value.set( w, h );
        
    }
    
    onWin ( progress ) {
        
        this.uniforms.u_win.value = progress;
        
    }
    
    onFrame ( now, dT ) {
        
        if ( !this.startTime ) this.startTime = now;
        
        var elapsed = this.startTime - now;
        
        this.uniforms.u_time.value = elapsed;
        this.uniforms.u_tide.value = Math.sin( elapsed / 5000 ) * .5 + .5;
        
    }
    
}