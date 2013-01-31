function terrain(scene, anisotropy)  {

        var Anisotropy = anisotropy;
        
        var texture = THREE.ImageUtils.loadTexture( "textures/metal_1_8_512.jpg" );
        texture.repeat.set( 32, 32 );
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.anisotropy = 0; //Anisotropy;
        
        var material = new THREE.MeshLambertMaterial( { 
            //alphaTest: 0.5,
            shading: THREE.FlatShading,
            overdraw: true,
            //wireframe: true,
            //wireframeLinewidth: 2,
            reflectivity: 0.3,
            emissive: 0x111111,
            shiness: 10,
            color: 'rgb(5,5,30)', 
            map: texture, 
            fog: true, 
            transparent: true, 
            wrapAround: true, 
            opacity: 0.95
        } );

        var geometry = new THREE.PlaneGeometry( 1400, 1400, 100, 100 );

        var mesh = new THREE.Mesh( geometry, material );
        mesh.rotation.x = - Math.PI / 2;
        scene.add( mesh );

        this.update = function update(cam) {
            
            var sx = cam.position.x - mesh.position.x;
            var sz = mesh.position.z - cam.position.z;
            
            texture.offset.x += sx / 1400 * 32;
            texture.offset.y += sz / 1400 * 32;

            mesh.position.x = cam.position.x;
            mesh.position.z = cam.position.z;
            
        }
}
