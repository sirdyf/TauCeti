function laser(scene, camera)  {

    var speed = 100;

    var material = new THREE.MeshLambertMaterial( { 
        //alphaTest: 0.5,
        shading: THREE.FlatShading,
        //overdraw: true,
        //wireframe: true,
        //wireframeLinewidth: 2,
        //reflectivity: 0.3,
        emissive: 'rgb(255,255,255)',
        //shiness: 10,
        color: 'rgb(255,255,255)', 
        //map: texture, 
        //transparent: true, 
        //wrapAround: true, 
        //opacity: 0.95
        fog: true
    } );

    var geometry = new THREE.PlaneGeometry( 1, 30 );
    var mesh = new THREE.Mesh( geometry, material );
    
    //mesh.matrixRotationWorld = camera.matrixRotationWorld;
    //mesh.updateMatrix();
    
    //mesh.rotation.y = camera.rotation.y;
    //mesh.rotation.z = camera.rotation.z;
    mesh.rotation.x = - Math.PI / 2;

    mesh.position.x = camera.position.x;
    mesh.position.y = 1;
    mesh.position.z = camera.position.z;
    
    mesh.name = 'laser';
    mesh.matrixAutoUpdate = true;
    scene.add( mesh );
    
     pointLight =  new THREE.PointLight( 'rgb(0,250,0)', 0.3);
    pointLight.position.y = 3;
//    pointLight.position.x = camera.position.z+30;
    mesh.add(pointLight);

//    var mat = new THREE.MeshLambertMaterial( { shading: THREE.FlatShading } );
//    var sphere = new THREE.Mesh( new THREE.SphereGeometry( 0.7, 7, 7 ), mat );
//    mesh.add(sphere);
    
    mesh.update = function (dt) {
            
            mesh.position.z -= speed * dt;
            //pointLight.position.z = mesh.position.z;
            
            //var vec = new THREE.Vector3();
            //vec.getRotationFromMatrix(mesh.matrixRotationWorld);
            
            //document.getElementById( "val_right" ).innerHTML = vex.x + " - " + vec.y + " - " + vec.z;
            
            if (camera.position.distanceToSquared(mesh.position) > 100000) {
                
                //mesh.remove(sphere);
                //mesh.remove(pointLight);
                
                delete mesh.update;
                
                scene.remove(mesh);

                // clean up
                //mesh.dispose();
                //geometry.dispose();
                //material.dispose();
                //texture.dispose();

            }
    };
}
