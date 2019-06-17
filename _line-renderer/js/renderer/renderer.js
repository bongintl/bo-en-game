var {
    Color,
    TextureLoader,
    WebGLRenderer,
    WebGLRenderTarget,
    PlaneBufferGeometry,
    BufferGeometry,
    BufferAttribute,
    Camera,
    Mesh,
    Scene
} = require('three');

var EdgeDetectMaterial = require('./materials/edgeDetect/edgeDetectMaterial');

var WHITE = new Color( 1, 1, 1 );
var YELLOW = new Color( 1, 1, 0 );

var loader = new TextureLoader();

module.exports = class OutlinedRenderer extends WebGLRenderer {
    
    constructor ( options = {} ) {
        
        super( Object.assign({
            antialias: false
        }, options ));
        
        this.oldRender = this.render;
        this.render = this._render;
        
        this.oldSetSize = this.setSize;
        this.setSize = this._setSize;
        
        this.oldSetClearColor = this.setClearColor;
        this.setClearColor = this._setClearColor;
        
        this.visibleClearColor = 0x000000;
        
        this.autoClear = false;
        
        this.edgeDetectFramebuffer = new WebGLRenderTarget( 1, 1 );
        this.colorFramebuffer = new WebGLRenderTarget( 1, 1 );
        
        this.edgeDetectScene = new Scene();
        this.edgeDetectScene.autoUpdate = false;
        
        this.edgeDetectMaterial = new EdgeDetectMaterial({
            edgeFBO: this.edgeDetectFramebuffer,
            colorFBO: this.colorFramebuffer,
            texture: loader.load('assets/textures/noise.jpg')
        });
        
        var fullscreenPlane = new PlaneBufferGeometry( 2, 2 );
        var mesh = new Mesh( fullscreenPlane, this.edgeDetectMaterial );
        
        this.edgeDetectScene.add( mesh );
        
        this.edgeDetectCamera = new Camera();
        this.edgeDetectCamera.matrixAutoUpdate = false;
        this.edgeDetectCamera.position.z = 1;
        
    }
    
    _setSize ( w, h, style ) {
        
        this.oldSetSize( w, h, style );
        
        w = this.domElement.width;
        h = this.domElement.height;
        
        this.edgeDetectMaterial.uniforms.resolution.value.x = w;
        this.edgeDetectMaterial.uniforms.resolution.value.y = h;
        
        this.edgeDetectFramebuffer.setSize( w, h );
        this.colorFramebuffer.setSize( w, h );
        
    }
    
    _setClearColor ( color ) {
        
        this.visibleClearColor = color;
        
    }
    
    setOutlineColor ( color ) {
        
        this.edgeDetectMaterial.uniforms.outlineColor.value.set( color );
        
    }
    
    _render ( scene, camera ) {
        
        // update matrices once, good for both passes
        scene.updateMatrixWorld();
        camera.updateMatrix();
        
        // renderer.renderingOutlinesNext is checked by onAfterRender of each mesh
        // changing their material and making them ready for the next pass
        // (onBeforeRender of the next pass is too late)
        this.renderingOutlinesNext = true;
        this.oldSetClearColor( this.visibleClearColor );
        this.clearTarget( this.colorFramebuffer );
        this.oldRender( scene, camera, this.colorFramebuffer );
        
        // Comment this line to view outline materials
        this.renderingOutlinesNext = false;
        
        // Outline materials are now set, render to framebuffer
        // In onAfterRender, each mesh changes back to visible material
        this.oldSetClearColor( YELLOW );
        this.clearTarget( this.edgeDetectFramebuffer );
        this.oldRender( scene, camera, this.edgeDetectFramebuffer );
        
        this.edgeDetectMaterial.uniforms.time.value = Date.now() / 1000;
        
        // Edge detect and comp to main canvas
        this.oldRender( this.edgeDetectScene, this.edgeDetectCamera );
        
    }
    
}