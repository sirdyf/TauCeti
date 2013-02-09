if (!Detector.webgl)
    Detector.addGetWebGLMessage();

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container, stats;

var camera, scene, renderer, geometry, terrain, meterial_g;

var PointLight;

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
    camera.lookAt(new THREE.Vector3(0, 0, 1));

    scene = new THREE.Scene();

    PointLight = new pointlight(scene);

    scene.add(camera);

    scene.fog = new THREE.FogExp2(0x050510, 0.0025);
    //scene.fog = new THREE.Fog( 'rgb( 50, 50, 50 )', 1, 700 );
    //scene.fog.color = new THREE.Color( 20, 20, 20 );

    scene.add(new THREE.AmbientLight('rgb(5,5,20)'));

    //scene.add( new THREE.AmbientLight( 0x111111 ) );

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

    var mat = new THREE.MeshLambertMaterial({color: 0xffffff, shading: THREE.FlatShading, overdraw: true});
    sphere = new THREE.Mesh(new THREE.SphereGeometry(20, 20, 10), mat);
    //sphere.scale.set( 10, 10, 10 );
    sphere.position.z = 150;
    sphere.position.x = -50;
    //sphere.geometry.boundingSphere.radius=20;
    scene.add(sphere);

    for (var i = 0; i < 20; i++) {

        loader = new THREE.JSONLoader();
        loader.load('model/fabric.json', function(geometry) {

            meterial_g = new THREE.MeshLambertMaterial({color: 0xffffff, shading: THREE.FlatShading, overdraw: true});

            mesh1 = new THREE.Mesh(geometry, meterial_g);
            mesh1.position.x = Math.random() * 1000 - 500;
            mesh1.position.z = Math.random() * 1000 - 500;
            mesh1.geometry.boundingSphere.radius = 10;
            // scene.add( mesh1 );

            mesh2 = new THREE.Mesh(geometry, meterial_g);
            mesh2.rotation.x = Math.PI;
            mesh2.position.x = mesh1.position.x;
            mesh2.position.z = mesh1.position.z;
            //mesh1.geometry.boundingSphere.radius=10;
            //scene.add( mesh2 );

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
}
;


function animate() {

    requestAnimationFrame(animate);
    render();
    stats.update();

}
;
var vv = 0;
var sumdeltaD = 0;
function render() {

    var delta_time = clock.getDelta();
    sumdeltaD += 1;
    renderer.clear();

    controls.update(delta_time * 10);
    terrain.update(controls.getObject());

    mouseX = 0;

    for (var index in scene.children) {
        mouseX += 1;
        var object = scene.children[index];
        if (sumdeltaD > 10){
            CheckCollisionWithCamera(object);
        }
        if ("update" in object) {
            object.update(delta_time);
        }
    }
    if (sumdeltaD > 10) {
        sumdeltaD = 0;
    }

//    document.getElementById( "val_right" ).innerHTML = vv;

    // renderer.render( scene, camera );

    renderer.clear();
    composer.render();

    time = Date.now();

}

function CheckCollisionWithCamera(obj) {


    document.getElementById("val_right").innerHTML = vv;

    if (obj.geometry && obj.geometry.boundingSphere.radius < 90) {// instanceof THREE.Mesh){
        var camObj = camera.parent;
        var camRadius = camObj.boundRadius;
        var objRadius = obj.geometry.boundingSphere.radius;
        var camPos = camObj.position.clone();
        var objPos = obj.position.clone();
        objPos.y = camPos.y; // Чтобы любые объекты были на уровне камеры
        var bothRadius = objRadius + camRadius;
        var dir = new THREE.Vector3();

        if (objPos.distanceTo(camPos) < bothRadius) {//distanceToSquared//фактическая позиция камеры не меняется!

            var vRadius = new THREE.Vector3();
            vRadius.sub(objPos, camPos);
//            vRadius.y = -2.5;//чтобы визуально было виднее


            var vel= new THREE.Vector3(0,0,1);//DEBUG

            dir = camObj.localToWorld(vel);
            dir.sub(dir,camPos);
            dir.normalize();
            dir.y =0 ;//работаем в лоскости XZ
            
            var vRadiusNorm = vRadius.clone();
            vRadiusNorm.normalize();
            vRadiusNorm.y=0;//работаем в лоскости XZ
            
            var alpha = vRadiusNorm.angleTo(dir);
            
            vv=alpha;
            if (vv > Math.PI / 2){
                vv=0;
            }
            
            var pointCol = vRadiusNorm.clone();
            pointCol.addScalar(camRadius);pointCol.y=0.5;
            pointCol.addSelf(camPos);
            UTILS.lookTo(0,camPos, vRadius);
            UTILS.lookTo(1,camPos, dir);
            UTILS.lookTo(2,camPos, dir);
            UTILS.lookTo(3,camPos, vRadius);
            UTILS.lines[3].rotation.y +=  Math.PI / 2;
            //obj.visible = false;

            //var delta = dir.subSelf(vRadiusNorm);//Не верно. Нужно всего лишь объект перевести в ЛСК камеры!
            var delta = camObj.worldToLocal(objPos);
            var sign = 1;//delta.x > 0 ? 1 : -1;
//            if (camPos.z > 0) sign *= -1;

document.getElementById( "val_right" ).innerHTML = vv;
            
            UTILS.lines[2].rotation.y +=  (Math.PI - 2 * alpha) * sign;
            if (false){
                controls.SetImpulse((Math.PI - 2 * alpha) * sign);
                while(objPos.distanceTo(camPos) < bothRadius){
                    controls.update(0.017);//???
                    camPos = camObj.position.clone();
                }
            }else{
                    camera.parent.position.x = 0;
                    camera.parent.position.y = 3;
                    camera.parent.position.z = 0;
//                    camera.lookAt(-50,0,150);
            }
        }

    }
}

//.boundingBox
//Bounding box.
//{ min: new THREE.Vector3(), max: new THREE.Vector3() }
//.boundingSphere

var onKeyDownMain = function(event) {
    if (event.keyCode === 32) { // Пробел

        //scene.fire.laser();
        //
        scene.fireLaser(controls.getObject());

        // meterial_g.needsUpdate = true;

        //for(l in PoingLight){
        //    PoingLight[l].distance = 0;
        //    PoingLight[l].enabled = false;
        //}

    }
};

document.addEventListener('keydown', onKeyDownMain, false);