var Ellipse = require('./ellipse.js');
var THREE = require('three');
var Promise = require('promise');

module.exports = class Song extends Ellipse {
    
    constructor ( attrs ) {
        
        attrs.color = 'red';

        super( attrs );
        
        this.src = attrs.src;
        this.title = attrs.title;
        
        this.inner = new Ellipse({
            x: 0,
            y: 0,
            width: attrs.width,
            height: attrs.height,
            color: 'white'
        })
        
        this.inner.visible = false;
        
        this.add( this.inner );
        
    }
    
    onClick ( game ) {
        
        game.character.walkTo( this.position2d );
        
        return false;
        
    }
    
    onCharacterStop ( character, game ) {
        
        //character.walkTo( this.position2d );
        
        Promise.all([
            game.winLevel( this.attrs.title ),
            game.player.load( this.src )
        ]).then(() => {
            game.player.play();
        });
        
    }
    
    onWin ( progress, game ) {
        
        this.inner.visible = true;
        
        this.inner.scale.set( .02 + progress * .96, .02 + progress * .96, 1 );
        
    }
    
}