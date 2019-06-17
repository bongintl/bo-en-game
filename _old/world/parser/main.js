var fs = require('fs');
var parseXML = require('./xml.js');
var transforms = require('./transform.js');
var config = require('./config.js');

var dir = './world/';

module.exports = () => {
    
    var world = {};
    
    fs.readdirSync( dir )
        .filter( filename => filename.indexOf('.xml') !== -1 )
        .forEach( filename => {
            
            var xml = fs.readFileSync( dir + filename ).toString();
            
            var level = parseXML( xml );
            
            transforms.forEach( fn => fn( level ) );
            
            var name = filename.split('.')[0];
            
            if( name === 'index' ) name = '';
            
            world[ '/' + name ] = level;
            
        })
    
    fs.writeFile( './js/world.json', JSON.stringify(world) );
    
}