if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container,stats;

var camera, scene, renderer, geometry, terrain;

var num = 0;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var controls, time = Date.now();
var clock = new THREE.Clock();


init();
animate();

function init() {

        container = document.createElement( 'div' );
        document.body.appendChild( container );

        renderer = new THREE.WebGLRenderer( { antialias: true } );

        camera = new THREE.PerspectiveCamera( 35, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 2500 );
        camera.position.z = 0;

        scene = new THREE.Scene();

        scene.add( camera );
	
        scene.fog = new THREE.FogExp2( 0x050510, 0.0025 );
        //scene.fog = new THREE.Fog( 'rgb( 50, 50, 50 )', 1, 700 );
        //scene.fog.color = new THREE.Color( 20, 20, 20 );

        scene.add( new THREE.AmbientLight( 'rgb(5,5,20)' ) );

        // LIGHTS

        //scene.add( new THREE.AmbientLight( 0x111111 ) );

        directionalLight = new THREE.DirectionalLight( 0xffffff, 1.15 );
        directionalLight.position.set( 500, 2000, 0 );
        scene.add( directionalLight );

//        for( var i=1 ; i <= 70; i++) {
//            var pointLight = new THREE.PointLight( 'rgb(0,250,0)', 0.3 * 10 );
//            //pointLight.position.set( Math.sin(i) * 30, i - 8, Math.cos(i) * 30 - 150 );
//            scene.add( pointLight );        
//        }        

//        var mat = new THREE.MeshLambertMaterial( { shading: THREE.FlatShading } );
//        sphere = new THREE.Mesh( new THREE.SphereGeometry( 0.7, 7, 7 ), mat );
//        sphere.position.x = Math.sin(i) * 30;
//        sphere.position.y = i - 8;
//        sphere.position.z = Math.cos(i) * 30 - 150;
//        scene.add( sphere );

        var maxAnisotropy = renderer.getMaxAnisotropy();
        
        if ( maxAnisotropy > 0 ) {

                document.getElementById( "val_left" ).innerHTML = maxAnisotropy;

        } else {

                document.getElementById( "val_left" ).innerHTML = "not supported";
                document.getElementById( "val_right" ).innerHTML =  "not supported";

        }
        
        terrain = new terrain(scene, maxAnisotropy);
        
        var mat = new THREE.MeshLambertMaterial( { shading: THREE.FlatShading } );
        sphere = new THREE.Mesh( new THREE.SphereGeometry( 20, 20, 10 ), mat );
        //sphere.scale.set( 10, 10, 10 );
        sphere.position.z = -150;
        sphere.position.x = -50;
        scene.add( sphere );
        
        loader = new THREE.JSONLoader();
        loader.load( 'model/fabric.js', function ( geometry ) {

                mesh1 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, overdraw: true } ) );
                mesh1.position.z = -150;
                scene.add( mesh1 );

                mesh2 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, overdraw: true } ) );
                mesh2.rotation.x = Math.PI;
                mesh2.position.z = -150;
                scene.add( mesh2 );

        } );


        // RENDERER

        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        renderer.setClearColor( scene.fog.color, 1 );
        renderer.autoClear = false;

        renderer.domElement.style.position = "relative";
        container.appendChild( renderer.domElement );

        // STATS1

        stats = new Stats();
        container.appendChild( stats.domElement );

        controls = new THREE.PointerLockControls( camera );
        scene.add( controls.getObject() );
        controls.enabled = true;

        laser1 = new laser(scene, controls.getObject());
//        laser2 = new laser(scene, controls.getObject());

        var onKeyDownMain=function  ( event ) {
            if (event.keyCode === 32){ // Пробел
                var ll= new laser(scene, controls.getObject());
		ll.update(1);
            }
        };
    
        document.addEventListener( 'keydown', onKeyDownMain, false );
};

function animate() {

        requestAnimationFrame( animate );

        render();
        stats.update();

};

function render() {

        var delta_time = clock.getDelta();
        renderer.clear();

        controls.update( delta_time * 100);
        terrain.update(controls.getObject());
        
        mouseX = 0;
        
        for(var index in scene.children) {
            mouseX += 1;
            var object = scene.children[index];
            if ("update" in object){
                object.update( delta_time );
             }
         }

        //document.getElementById( "val_right" ).innerHTML = mouseX;

        renderer.render( scene, camera );
	time = Date.now();

};
