laser = function(camera) {
    var speed = 100;

    var dist = 0;

    var material = new THREE.MeshLambertMaterial({
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
    });

    var geometry = new THREE.PlaneGeometry(1, 30);

    var mesh = new THREE.Mesh(new THREE.CubeGeometry(0.1, 0.1, 1.0), material);
    mesh.scale.z = 300;


    mesh.rotation.y = camera.rotation.y;

    var dir = new THREE.Vector3();

    dir = camera.localToWorld(new THREE.Vector3(0, 0, 1));
    dir.sub(camera.position, dir);
    dir.normalize();

    mesh.position.x = camera.position.x;
    mesh.position.y = 1;
    mesh.position.z = camera.position.z;

    mesh.name = 'laser';

    var pl = PointLight.getLight();
    pl.distance = 300;
    pl.intensity = 1;

    mesh.add(pl);

    var lScene = this;
    mesh.update = function(dt) {
        dist += speed;
        pl.position.y = 5;

        mesh.position.x += dir.x * speed;
        mesh.position.z += dir.z * speed;
        //document.getElementById( "val_right" ).innerHTML = mesh.position.distanceTo(camera.position);

        if (mesh.position.distanceTo(camera.position) > 1000) {
            pl.distance = 0;
            pl.intensity = 0;
            lScene.remove(mesh);
        }
    };
    this.add(mesh);
};