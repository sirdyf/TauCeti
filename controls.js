/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function(camera) {

    var scope = this;

    var yawObject = new THREE.Object3D();
    yawObject.position.y = 3;
    yawObject.add(camera);

    yawObject.boundRadius = 5;//DEBUG

    var enableContols = true;
    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
    var rotateYawCW = false; // По часовой
    var rotateYawСCW = false; // Против часовой

    var isOnObject = false;
    var canJump = false;

    var velocity = new THREE.Vector3();

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

    this.enabled = false;//???

//    this.isOnObject = function(boolean) {
//
//        isOnObject = boolean;
//        canJump = boolean;
//
//    };
    this.getObject = function() {
        return yawObject;
    };

    this.GetVelocity = function() {
        return velocity.clone();
    };
    this.controlSet = function(flag) {
        enableContols = flag;
    };
    this.getControlValue = function() {
        return enableContols;
    };
    this.SetImpulse = function(angleValue) {

        var axis = new THREE.Vector3(0, 1, 0);
        var matrixRot = new THREE.Matrix4().makeRotationAxis(axis, angleValue);
        matrixRot.multiplyVector3(velocity);
        velocity.multiplyScalar(0.75);
        enableContols = false;
//        if ((velocity.x <= accelMove)&&(velocity.z <= accelMove)){
//            velocity.x = accelMove;//чтобы движение было хотя бы минимальным
//        }
        this.move();
        yawObject.updateMatrix();

    };


    var speedMax = 10;//максимальная скорость
    var accelStop = 0.08;//ускорение торможения
    var accelMove = 0.12;//ускорение движения
    var accelYawMove = 0.0016;//ускорение вращения
    var accelYawStop = 0.08;
    //var speedYawMax=0.016;

    var yawObject_position_y = 3;

this.vv=0;
    this.update = function(delta) {//delta is "delta time"

        if (scope.enabled === false)
            return;

// торможения
        velocity.x += (-velocity.x) * accelStop * delta; // уменьшение скорости = торможение X
        velocity.z += (-velocity.z) * accelStop * delta; // уменьшение скорости = торможение Z
        velocityYaw += (-velocityYaw) * accelYawStop * delta;

        if (enableContols === false) {
            this.move();
            return;
        }
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
        rotateYaw.z += (-rotateYaw.z) * 0.016 * delta * 2;
        if (rotateYawCW) {
            velocityYaw -= accelYawMove * delta;
        }
        if (rotateYawСCW) {
            velocityYaw += accelYawMove * delta;
        }
        ////rotateYaw.y += velocityYaw;}
        //         if (Math.abs(velocityYaw)>speedYawMax){
        //              velocityYaw=speedYawMax*Math.sign(velocityYaw);
        //          }
        rotateYaw.y += velocityYaw;
        if (rotateYawCW)
            rotateYaw.z += 0.016 * delta / 2;
        if (rotateYawСCW)
            rotateYaw.z -= 0.016 * delta / 2;

        this.move();
    };
    this.move = function() {

        yawObject.rotation.y = rotateYaw.y;
        yawObject.rotation.z = rotateYaw.z;

        yawObject.translateX(velocity.x);
        yawObject.translateZ(velocity.z);
        yawObject.position.y = 3; // The kostyl

    };
//document.getElementById( "val_right" ).innerHTML = vv;
    this.colPingPong = function(ob) {
        if (this.getControlValue() === false) { // управление отключено, значит углы вычислены
            return;
        }
        var obj=ob.clone();
        var camObj = camera.parent.clone();
//        camObj.updateMatrix();
//        camObj.updateMatrixWorld(true);
        var camRadius = camObj.boundRadius;
        var camPos = camObj.matrix.getPosition().clone();//position.clone();

        var objPos = obj.matrix.getPosition().clone();//position.clone();
        var objRadius = obj.geometry.boundingSphere.radius;
        var bothRadius = objRadius + camRadius;

        objPos.y = camPos.y; // Чтобы любые объекты были на уровне камеры
        var dir = new THREE.Vector3();
        var vRadius = new THREE.Vector3();

        vRadius.sub(objPos, camPos);
        dir = this.GetVelocity();
        dir.y = camPos.y;
        //dir.normalize();
        camObj.localToWorld(dir);//dir меняется!

        dir.subSelf(camPos);
        dir.y = 0;//работаем в лоскости XZ

        var vRadiusNorm = vRadius.clone();
        vRadiusNorm.normalize();
        vRadiusNorm.y = 0;//работаем в лоскости XZ

        var alpha = vRadiusNorm.angleTo(dir);
        if (alpha>Math.PI / 2){
            alpha=alpha;
        }

        UTILS.lookTo(0, camPos, vRadius);
        UTILS.lookTo(3, camPos, vRadius);
        UTILS.lines[3].rotation.y += Math.PI / 2;

        UTILS.lines[1].position.copy(camObj.position);//matrix.getPosition());
        UTILS.lines[1].rotation.copy(camObj.rotation);
        UTILS.lines[2].position.copy(camObj.position);
        UTILS.lines[2].rotation.copy(camObj.rotation);


        var delta = objPos.clone();
        camObj.worldToLocal(delta);

        var sign = delta.x > 0 ? 1 : -1;
this.vv=alpha;
        UTILS.lines[2].rotation.y += (Math.PI - 2 * alpha) * sign;
        if (delta.z >= 0)
            alpha += Math.PI;
        this.SetImpulse((Math.PI - 2 * alpha) * sign);//отключает управление с клавиатуры
    };
    this.CheckCollisionWithCamera = function(obj) {

        if (obj.geometry && obj.geometry.boundingSphere.radius < 90 && obj.geometry.boundingSphere.radius > 5) {// instanceof THREE.Mesh){

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
    };

};
