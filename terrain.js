function terrain(scene, anisotropy)  {

        var Anisotropy = anisotropy;
        
        var texture = THREE.ImageUtils.loadTexture( "textures/metal_1_8_512.jpg" );
        texture.repeat.set( 32, 32 );
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.anisotropy = 0; //Anisotropy;
        
        var material = new THREE.MeshLambertMaterial( { 
            //alphaTest: 0.5,
            //shading: THREE.FlatShading,
            //overdraw: true,
            //wireframe: true,
            //wireframeLinewidth: 2,
            //reflectivity: 0.3,
            //emissive: 0x111111,
            //shiness: 10,
            color: 'rgb(5,5,30)', 
            map: texture, 
            fog: true, 
            transparent: true, 
            //wrapAround: true, 
            opacity: 0.85
        } );

        var geometry = new THREE.PlaneGeometry( 1400, 1400, 30, 30 );

        var mesh = new THREE.Mesh( geometry, material );
        mesh.rotation.x = - Math.PI / 2;
        scene.add( mesh );


        var texture2 = THREE.ImageUtils.loadTexture( "textures/stars-texture.jpg" );
        texture2.repeat.set( 48, 32 );
        texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
        //texture2.anisotropy = 0; //Anisotropy;
       
        var material2 = new THREE.MeshBasicMaterial( {
            color: 'rgb(180,180,200)',
            overdraw: true,
            side: THREE.DoubleSide,
            fog: false,
            wireframe: false,
            map: texture2
        })
            
//        var material2 = new THREE.MeshLambertMaterial( { 
//            //alphaTest: 0.5,
//            //shading: THREE.FlatShading,
//            //overdraw: true,
//            //wireframe: true,
//            //wireframeLinewidth: 2,
//            //reflectivity: 0.3,
//            //emissive: 0x111111,
//            //shiness: 10,
//            //color: 'rgb(255,255,255)', 
//            map: texture2, 
//            fog: false, 
//            //transparent: false, 
//            //wrapAround: true, 
//            side: THREE.DoubleSide,
//            //opacity: 1.0
//        } );

        //var geometry2 = new THREE.CylinderGeometry( 1000, 1000, 30, 20, 1 );
        var geometry2 = new THREE.SphereGeometry( 1000, 8, 6 );
        var mesh2 = new THREE.Mesh( geometry2, material2 );

        //mesh2.position.z = -30;
        mesh2.position.y = -5;
        scene.add( mesh2 );
	
//        var mapA = THREE.ImageUtils.loadTexture( "textures/stars.jpg" );
//        mapA.repeat.set( 8, 8 );
//        mapA.wrapS = mapA.wrapT = THREE.RepeatWrapping;
//        //mapA.anisotropy = 0; //Anisotropy;
//        
//        
//	var scaleX = SCREEN_WIDTH;  mapA.image.width;
//        var scaleY = SCREEN_HEIGHT; mapA.image.height;
//
//        var materialA1 = new THREE.SpriteMaterial( { map: mapA, useScreenCoordinates: true, alignment: THREE.SpriteAlignment.topLeft, opacity: 0.2, fog: false } );
//       	sprite = new THREE.Sprite( materialA1 );
//        sprite.position.set( 0, 0, 0 );
//        sprite.scale.set( scaleX, scaleY, 1 );
//        scene.add( sprite );

        this.update = function update(cam) {
            
            var sx = cam.position.x - mesh.position.x;
            var sz = mesh.position.z - cam.position.z;
            
            texture.offset.x += sx / 1400 * 32;
            texture.offset.y += sz / 1400 * 32;

            mesh.position.x = cam.position.x;
            mesh.position.z = cam.position.z;
            
            mesh2.position.x = cam.position.x;
            mesh2.position.z = cam.position.z;
            
        }
}
