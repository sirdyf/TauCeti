function laser(scene, camera)  {

    var speed = 5;
    var dist  = 0;

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
    
    //var mesh = new THREE.Mesh( geometry, material );
    var mesh = new THREE.Mesh( new THREE.SphereGeometry( 0.1, 7, 7 ), material );
    mesh.scale.z = 50;
    
    //mesh.matrix.copy(camera.matrix);
    //mesh.matrixAutoUpdate = true;
    //mesh.matrixWorldNeedsUpdate = true;
    
    //mesh.rotation.y = camera.rotation.y;
    //mesh.rotation.z = camera.rotation.z;
    //mesh.rotation.x = camera.rotation.x;
    //mesh.rotation.z = - Math.PI / 2;

    var dir = new THREE.Vector3();
    dir = camera.localToWorld(new THREE.Vector3(0, 0, 1));
    dir.sub(camera.position, dir);
    dir.normalize();
    
    mesh.position.x = camera.position.x;
    mesh.position.y = 1;
    mesh.position.z = camera.position.z;
    
    mesh.name = 'laser';
    //mesh.matrixAutoUpdate = true;
    //mesh.rotationAutoUpdate = true;
    //mesh.updateMatrix();

    scene.add( mesh );

//    var pointLight = new THREE.PointLight( 'rgb(0,250,0)', 0.3);
//    pointLight.position.y = 3;
//    mesh.add(pointLight);
    
//    var mat = new THREE.MeshLambertMaterial( { shading: THREE.FlatShading } );
//    var sphere = new THREE.Mesh( new THREE.SphereGeometry( 0.7, 7, 7 ), mat );
//    mesh.add(sphere);
    
    mesh.update = function (dt) {
            
            dist += speed;
            //mesh.translate(dist, dir);
            
            //mesh.updateMatrix();
            mesh.position.x += dir.x * speed;
            mesh.position.z += dir.z * speed;
            //pointLight.position.z = mesh.position.z;
            
            //var vec = new THREE.Vector3();
            //vec.getRotationFromMatrix(mesh.matrixRotationWorld);
            
            document.getElementById( "val_right" ).innerHTML = mesh.position.distanceTo(camera.position);
            
            if ( mesh.position.distanceTo(camera.position) > 500 ) {
                
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