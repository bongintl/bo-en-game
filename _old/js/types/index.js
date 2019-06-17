module.exports = {
    
    Origin: require('./abstract/origin.js'),
    Group: require('./abstract/group.js'),
    Cloner: require('./abstract/cloner.js'),
    Generator: require('./abstract/generator.js'),
    Grid: require('./abstract/grid.js'),
    
    Region: require('./gl/rect.js'),
    Rect: require('./gl/rect.js'),
    Ellipse: require('./gl/ellipse.js'),
    Image: require('./gl/image.js'),
    Panel: require('./gl/panel.js'),
    Door: require('./gl/door.js'),
    Song: require('./gl/song.js'),
    Sprite: require('./gl/sprite.js'),
    
    CSSRegion: require('./css/cssregion.js'),
    CSSRect: require('./css/cssrect.js'),
    Text: require('./css/text.js'),
    CSSPanel: require('./css/csspanel.js'),
    Theater: require('./css/theater.js'),
    CSSSprite: require('./css/csssprite.js'),
    Button: require('./css/button.js'),
    Merch: require('./css/merch.js'),
    
    Beach: require('./gl/special/beach.js'),
    Forest: require('./gl/special/forest.js')
    
};