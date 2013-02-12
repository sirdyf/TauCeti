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
//    camera.lookAt(new THREE.Vector3(0, 0, 1));

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
    sphere.position.z = -150;
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

    controls.update(delta_time * 10);
    terrain.update(controls.getObject());

    mouseX = 0;
var collision=false;
    for (var index in scene.children) {
        mouseX += 1;
        var object = scene.children[index];
        if (sumdeltaD > 10){
            if (CheckCollisionWithCamera(object)===true){
                collision=true;
            }
        }
        if ("update" in object) {
            object.update(delta_time);
        }
    }
    if (collision === false){controls.controlSet(true);}
    if (sumdeltaD > 10) {
        sumdeltaD = 0;
    }

//    document.getElementById( "val_right" ).innerHTML = vv;

    renderer.clear();
    composer.render();

    time = Date.now();

}
//document.getElementById( "val_right" ).innerHTML = vv;

function CheckCollisionWithCamera(obj) {

    if (obj.geometry && obj.geometry.boundingSphere.radius < 90) {// instanceof THREE.Mesh){
        
        var camPos = camera.parent.matrix.getPosition().clone();//position.clone();

        var objPos = obj.matrix.getPosition().clone();//position.clone();
        var objRadius = obj.geometry.boundingSphere.radius;
        
        var bothRadius = objRadius + camera.parent.boundRadius;

        objPos.y = camPos.y; // Чтобы любые объекты были на уровне камеры

        if (objPos.distanceTo(camPos) < bothRadius) {//distanceToSquared//фактическая позиция камеры не меняется!
            //Есть столкновение!
            this.colPingPong(obj);
            return true;
        }
    }
    return false;
}
this.colPingPong = function(obj){
    if (controls.getControValue() === false){ // управление отключено, значит углы вычислены
        return;
    }
        var camObj = camera.parent;
        var camRadius = camObj.boundRadius;
        var camPos = camObj.matrix.getPosition().clone();//position.clone();

        var objPos = obj.matrix.getPosition().clone();//position.clone();
        var objRadius = obj.geometry.boundingSphere.radius;
        var bothRadius = objRadius + camRadius;

        objPos.y = camPos.y; // Чтобы любые объекты были на уровне камеры
                    var dir = new THREE.Vector3();
            var vRadius = new THREE.Vector3();

            vRadius.sub(objPos, camPos);
            dir=controls.GetVelocity();
            if (dir.lengthSq()<1){
                dir = camObj.localToWorld(new THREE.Vector3(0,0,-1));
            }else{
                dir.normalize();
                camObj.localToWorld(dir);//dir меняется!
            }
            dir.subSelf(camPos);
            dir.y =0 ;//работаем в лоскости XZ
            
            var vRadiusNorm = vRadius.clone();
            vRadiusNorm.normalize();
            vRadiusNorm.y=0;//работаем в лоскости XZ
            
            var alpha = vRadiusNorm.angleTo(dir);
            
            var pointCol = vRadiusNorm.clone();
            pointCol.addScalar(camRadius);pointCol.y=0.5;
            pointCol.addSelf(camPos);
            UTILS.lookTo(0,camPos, vRadius);
            UTILS.lookTo(3,camPos, vRadius);
            UTILS.lines[3].rotation.y +=  Math.PI / 2;
            
//            UTILS.lookTo(1,camPos, dir);
//            UTILS.lines[1].matrix.copy(camObj.matrix);
            UTILS.lines[1].position.copy(camObj.position);//matrix.getPosition());
            UTILS.lines[1].rotation.copy(camObj.rotation);
            UTILS.lines[2].position.copy(camObj.position);
            UTILS.lines[2].rotation.copy(camObj.rotation);
            

            var delta = objPos.clone();
            camObj.worldToLocal(delta);
            
            var sign = delta.x > 0 ? 1 : -1;

            UTILS.lines[2].rotation.y +=  (Math.PI - 2 * alpha) * sign;
            if (delta.z >= 0) alpha += Math.PI;
//            if (true){//delta.z < 0){
//                controls.SetImpulse((Math.PI - 2 * alpha) * sign);
//                while(objPos.distanceTo(camPos) < bothRadius){
//                    controls.move();
//                    camObj.updateMatrix();
//                    camPos = camObj.matrix.getPosition().clone();
//                }
                controls.SetImpulse((Math.PI - 2 * alpha) * sign);
//                camPos = camObj.matrix.getPosition().clone();
//                if (objPos.distanceTo(camPos) > bothRadius){
//                    controls.controlSet(true);
//                }
//            
//            }
//            else{
//                    camera.parent.position.x = 0;
//                    camera.parent.position.y = 3;
//                    camera.parent.position.z = 0;
////                    camera.lookAt(-50,0,150);
//            }
            
};
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