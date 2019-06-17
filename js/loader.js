var THREE = require('three');
require('three-objmtll-loader')( THREE );

var loader = new THREE.OBJMTLLoader();

module.exports = ( objUrl, mtlUrl ) => {
    
    var obj = new THREE.Object3D();
    
    loader.load( objUrl, mtlUrl, mesh => obj.add( mesh ) );
    
    return obj;
    
}