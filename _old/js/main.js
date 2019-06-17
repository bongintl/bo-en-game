var cookies = require('js-cookie');
var page = require('page');

var BoEngine = require('./engine.js');
var world = require('./world.json');

var element = document.querySelector('main');

var nav = require('./nav.js');

var game = new BoEngine( element, world );

nav( game );

//page.base('/boen');

for ( var path in world ) {
    
    page( path, game.loadLevel.bind(game, path) );
    
}

page.redirect( '*', '/' );

page();