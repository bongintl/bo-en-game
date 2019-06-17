var promise = require('promise');
var howler = require('howler');

module.exports = class Player {
    
    constructor(){
        
        this.sound = null;
        
    }
    
    load( src ) {
        
        if ( this.sound ) {
            
            this.sound.stop();
            
        }
        
        return new Promise( resolve => {
            
            this.sound = new howler.Howl({
                src: [src],
                onload: resolve
            })
            
        })
        
    }
    
    isLoaded(){
        
        if( this.sound === null ) return false;
        
        return this.sound.state() === 'loaded';
        
    }
    
    play(){
        
        this.isLoaded() && this.sound.play();
        
    }
    
    pause(){
        
        this.isLoaded() && this.sound.pause();
        
    }
    
    toggle () {
        
        if( !this.isLoaded() ) return;
        
        this.sound.playing() ? this.pause() : this.play();
        
    }
    
}