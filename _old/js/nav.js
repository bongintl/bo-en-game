module.exports = function( game ){
    
    var menuButton = document.querySelector('.menu-button');
    
    menuButton.addEventListener( 'click', () => 
    
        game.camera.zoomOut()
            .then( () => {
                document.body.classList.add('menu-open');
            })
            
    );
    
}