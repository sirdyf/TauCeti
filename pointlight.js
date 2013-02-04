function pointlight(scene)  {

    var plArray  = [];
    var maxLight = 30;
    
    // LIGHTS INIT
    
    for( var i=0 ; i <= maxLight; i++) {
        var pl = new THREE.PointLight( 'rgb(0,250,0)', 0, 0 );
        scene.add(pl);
        plArray.push(pl);
    }        

    this.getLight = function() {
        for( var i=0 ; i <= maxLight; i++) {
            if(plArray[i].distance === 0) {
                return plArray[0];
            }
        }        
    }

}