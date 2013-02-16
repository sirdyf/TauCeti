if (!Detector.webgl)
    Detector.addGetWebGLMessage();

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container, stats;

var camera, scene, renderer, geometry, terrain, meterial_g;

var PointLight;

var scan, bibutats;

var num = 0;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var controls, time = Date.now();
var clock = new THREE.Clock();

var composer, effectFXAA;

init();
animate();
 
function init() {
    this.init = true;
    container = document.createElement('div');
    document.body.appendChild(container);

    renderer = new THREE.WebGLRenderer({antialias: true});

    camera = new THREE.PerspectiveCamera(35, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 2500);

    scene = new THREE.Scene();


        scene = new THREE.Scene();
        
        PointLight = new pointlight(scene);
    
        scene.add( camera );
	
        scene.fog = new THREE.FogExp2( 0x050510, 0.0025 );
        //scene.fog = new THREE.Fog( 'rgb( 50, 50, 50 )', 1, 700 );
        //scene.fog.color = new THREE.Color( 20, 20, 20 );


    scene.add(camera);

    scene.fog = new THREE.FogExp2(0x050510, 0.0025);

    scene.add(new THREE.AmbientLight('rgb(5,5,20)'));


    directionalLight = new THREE.DirectionalLight(0xffffff, 1.15);
    directionalLight.position.set(500, 2000, 0);
    scene.add(directionalLight);

    var maxAnisotropy = renderer.getMaxAnisotropy();

    if (maxAnisotropy > 0) {

        document.getElementById("val_left").innerHTML = maxAnisotropy;

    } else {

        document.getElementById("val_left").innerHTML = "not supported";
        document.getElementById("val_right").innerHTML = "not supported";

    }

    terrain = new terrain(scene, maxAnisotropy);
    terrain.MakeBiburats();

    var mat = new THREE.MeshLambertMaterial({color: 0xffffff, shading: THREE.FlatShading, overdraw: true});
    sphere = new THREE.Mesh(new THREE.SphereGeometry(20, 20, 10), mat);
    sphere.position.z = -150;
    sphere.position.x = -50;
    sphere.updateMatrix();
    sphere.name = "factory";
    scene.add(sphere);
    stats = new Stats();
    container.appendChild( stats.domElement );
    for (var i = 0; i < 20; i++) {

        loader = new THREE.JSONLoader();
        loader.load('model/fabric.json', function(geometry) {


            meterial_g = new THREE.MeshLambertMaterial({color: 0xffffff, shading: THREE.FlatShading, overdraw: true});

            mesh1 = new THREE.Mesh(geometry, meterial_g);
            mesh1.position.x = Math.random() * 1000 - 500;
            mesh1.position.z = Math.random() * 1000 - 500;
//            mesh1.geometry.boundingSphere.radius = 10;
            mesh1.updateMatrix();
            mesh1.name = "sphere";
            scene.add( mesh1 );


            mesh2 = new THREE.Mesh(geometry, meterial_g);
            mesh2.rotation.x = Math.PI;
            mesh2.position.x = mesh1.position.x;
            mesh2.position.z = mesh1.position.z;
//            mesh1.geometry.boundingSphere.radius=10;
            mesh2.updateMatrix();
            mesh2.name = "sphere";
            scene.add( mesh2 );
        });
    }
    
    // RENDERER

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.setClearColor(scene.fog.color, 1);
    renderer.autoClear = false;

    renderer.domElement.style.position = "relative";
    container.appendChild(renderer.domElement);

    // STATS1

    stats = new Stats();
    container.appendChild(stats.domElement);

    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());
    controls.enabled = true;



    var renderModel = new THREE.RenderPass(scene, camera);
    var effectBloom = new THREE.BloomPass(1.2);
    var effectCopy = new THREE.ShaderPass(THREE.CopyShader);

    effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);

    var width = window.innerWidth || 2;
    var height = window.innerHeight || 2;

    effectFXAA.uniforms[ 'resolution' ].value.set(1 / width, 1 / height);

    effectCopy.renderToScreen = true;

    composer = new THREE.EffectComposer(renderer);

    composer.addPass(renderModel);
    //composer.addPass( effectFXAA );
    //composer.addPass( effectBloom );
    composer.addPass(effectCopy);

    scene.fireLaser = laser;

    UTILS.addLine(scene);//DEBUG
    UTILS.addLineColor(scene);//DEBUG
    UTILS.addLineColor(scene);//DEBUG
    UTILS.addLine(scene);//DEBUG
    
     scan = new scaner(container, scene, controls.getObject(), SCREEN_HEIGHT / 2, SCREEN_HEIGHT / 2);

}

function animate() {

    requestAnimationFrame(animate);
    render();
    stats.update();

}


//    document.getElementById( "val_right" ).innerHTML = vv;

function render() {



    var delta_time = clock.getDelta();

        controls.update( delta_time * 10);
        terrain.update(controls.getObject());
        
  
    mouseX = 0;
    var collision = false;
    for (var index in scene.children) {
        mouseX += 1;
        var object = scene.children[index];

        if (true === controls.CheckCollisionWithCamera(object)) {
            collision = true;
        }
        if ("update" in object) {
            object.update(delta_time);
        }
    }
    if (collision === false) {
        controls.controlSet(true);
    }
        scan.update(delta_time);

if (document.getElementById( "val_left" )){
    document.getElementById( "val_left" ).innerHTML = controls.vv;
}

    renderer.clear();
    composer.render();

    time = Date.now();

}


var onKeyDownMain = function(event) {
    if (event.keyCode === 32) { // Пробел

        scene.fireLaser(controls.getObject());

    }
};

document.addEventListener( 'keydown', onKeyDownMain, false );

function onWindowResize() {
        
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;

        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();

        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        
        scan.remove();
        scan = new scaner(container, scene, controls.getObject(), SCREEN_HEIGHT / 2, SCREEN_HEIGHT / 2);


}

window.addEventListener( 'resize', onWindowResize, false );

