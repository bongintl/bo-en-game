var Generator = require('../../abstract/generator.js');

module.exports = class Forest extends Generator {
    
    tryPosition ( v ) {
        
        var a = Math.random() * 2 * Math.PI;
        var r = Math.pow( Math.random(), 2 ) * this.width / 2;
        
        v.x = Math.cos(a) * r;
        v.y = Math.sin(a) * r;
        
    }
    
    // onWin( progress ) {
        
    //     if( progress === 0 ) progress = .01;
        
    //     this.clones.forEach( clone => {
    //         clone.sprite.scale.set( progress * clone.attrs.width, progress * clone.attrs.height * 2, 0 )
    //     });
        
    // }
    
}