module.exports = {
    
    Renderer: require('./renderer'),
    
    LineSegments: require('./objects/lineSegments'),
    Mesh: require('./objects/mesh'),
    
    FaceIDs: require('./faceIDs'),

    ShaderMixin: require('./materials/lib/shaderMixin'),
    ObjectDepthVertexShader: require('./materials/lib/objectDepthVertex'),
    
    FaceIDOutlineMaterial: require('./materials/faceIDOutline/faceIDOutlineMaterial'),
    SolidOutlineMaterial: require('./materials/solidOutline/solidOutlineMaterial'),
    GridOutlineMaterial: require('./materials/gridOutline/gridOutlineMaterial'),
    StencilMaterial: require('./materials/stencil/stencilMaterial'),
    StencilOutlineMaterial: require('./materials/stencilOutline/stencilOutlineMaterial'),
    DepthOutlineMaterial: require('./materials/depthOutline/depthOutlineMaterial'),
    
    DECAL_SETTINGS: require('./materials/lib/decalSettings')
    
}