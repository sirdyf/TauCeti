/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function(camera) {

    var scope = this;

    var yawObject = new THREE.Object3D();
    yawObject.position.y = 3;
    yawObject.add(camera);

    yawObject.boundRadius = 3;//DEBUG


    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
    var rotateYawCW = false; // По часовой
    var rotateYawСCW = false; // Против часовой

    var isOnObject = false;
    var canJump = false;

    velocity = new THREE.Vector3();

    var rotateYaw = new THREE.Vector3();

    var velocityYaw = 0;

    var PI_2 = Math.PI / 2;

    var onMouseMove = function(event) {

        if (scope.enabled === false)
            return;

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        yawObject.rotation.y -= movementX * 0.002;
        pitchObject.rotation.x -= movementY * 0.002;

        pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));

    };

    var onKeyDown = function(event) {

        switch (event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
                moveLeft = true;
                break;

            case 65: // a
                rotateYawСCW = true;
                break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
                moveRight = true;
                break;

            case 68: // d
                rotateYawCW = true;
                break;

//			case 32: // space
//				if ( canJump === true ) velocity.y += 10;
//				canJump = false;
//				break;

            case 81: // Q 
                break;

            case 69: // E 
                break;

        }

    };

    var onKeyUp = function(event) {

        switch (event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
                moveLeft = false;
                break;

            case 65: // a
                rotateYawСCW = false;
                break;

            case 40: // down
            case 83: // a
                moveBackward = false;
                break;

            case 39: // right
                moveRight = false;
                break;

            case 68: // d
                rotateYawCW = false;
                break;

            case 81: // Q 
                break;

            case 69: // E 
                break;

        }

    };

    //document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    this.enabled = false;

    this.getObject = function() {

        return yawObject;

    };

    this.isOnObject = function(boolean) {

        isOnObject = boolean;
        canJump = boolean;

    };

    var impAngleValue = 0;

    this.GetVelocity = function() {
        return velocity;
    };
    this.SetImpulse = function(angleValue) {
        impAngleValue = angleValue;
        
//************
//var vector = new THREE.Vector3( 1, 0, 0 );

//var angle = Math.PI / 2;

        var axis = new THREE.Vector3(0, 1, 0);
        var matrixRot = new THREE.Matrix4().makeRotationAxis(axis, angleValue);
        matrixRot.multiplyVector3(velocity);
//        CheckCollResult();
//        velocityYaw = angleValue;
//************
    };
//    this.CheckCollResult = function(){
//    };

    var speedMax = 10;//максимальная скорость
    var accelStop = 0.08;//ускорение торможения
    var accelMove = 0.12;//ускорение движения
    var accelYawMove = 0.0016;//ускорение вращения
    var accelYawStop = 0.08;
    //var speedYawMax=0.016;

    var yawObject_position_y = 3;

    this.update = function(delta) {//delta is "delta time"

        if (scope.enabled === false)
            return;
// торможения
        velocity.x += (-velocity.x) * accelStop * delta; // уменьшение скорости = торможение X
        velocity.z += (-velocity.z) * accelStop * delta; // уменьшение скорости = торможение Z
        velocityYaw += (-velocityYaw) * accelYawStop * delta;

// ускорения
        if (moveForward)
            velocity.z -= accelMove * delta; // увеличение скорости = движение вперёд
        if (moveBackward)
            velocity.z += accelMove * delta;

        if (moveLeft)
            velocity.x -= accelMove * delta;// увеличение скорости = движение влево
        if (moveRight)
            velocity.x += accelMove * delta;
// фактические изменения конечных величин
//    velocity. y = 3;
        rotateYaw.z += (-rotateYaw.z) * 0.016 * delta * 2;
        if (rotateYawCW) {
            velocityYaw -= accelYawMove * delta;
        }
        if (rotateYawСCW) {
            velocityYaw += accelYawMove * delta;
        }//rotateYaw.y += velocityYaw;}
        //         if (Math.abs(velocityYaw)>speedYawMax){
        //              velocityYaw=speedYawMax*Math.sign(velocityYaw);
        //          }
        rotateYaw.y += velocityYaw;
        if (rotateYawCW)
            rotateYaw.z += 0.016 * delta / 2;
        if (rotateYawСCW)
            rotateYaw.z -= 0.016 * delta / 2;

        yawObject.rotation.y = rotateYaw.y;
        yawObject.rotation.z = rotateYaw.z;

        yawObject.translateX(velocity.x);
        yawObject.translateZ(velocity.z);
        yawObject.position.y = 3; // The kostyl

//        yawObject.position.y = yawObject_position_y;
    };

};
