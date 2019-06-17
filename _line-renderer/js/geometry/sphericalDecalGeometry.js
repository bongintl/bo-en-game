var { SphereGeometry } = require( 'three' );

module.exports = class SphericalDecalGeometry extends SphereGeometry {
    
    constructor ( radius, sphereWidthSegments, sphereHeightSegments, position, size ) {
        
        var widthSegments = Math.ceil( sphereWidthSegments * ( size.x / Math.PI * 2 ) );
        var heightSegments = Math.ceil( sphereHeightSegments * ( size.y / Math.PI ) );
        
        var phiStart = position.x;
        var phiLength = size.x;
        var thetaStart = position.y;
        var thetaLength = size.y;
        
        super(
            radius,
            widthSegments,
            heightSegments,
            phiStart,
            phiLength,
            thetaStart,
            thetaLength
        );
        
    }
    
}