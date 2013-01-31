/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {

	var scope = this;

	var yawObject = new THREE.Object3D();
	//yawObject.position.y = 10;
	yawObject.add( camera );

        var moveForward     = false;
	var moveBackward    = false;
	var moveLeft        = false;
	var moveRight       = false;
	var rotateYawCW     = false; // По часовой
	var rotateYawСCW    = false; // Против часовой

	var isOnObject = false;
	var canJump    = false;

	var velocity     = new THREE.Vector3();
	
        var rotateYaw  = new THREE.Vector3();
	
        var velocityYaw  = 0.016;

	var PI_2 = Math.PI / 2;

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
				moveLeft = true; break;
			
                        case 65: // a
                                rotateYawСCW = true; break;

			case 40: // down
			case 83: // s
				moveBackward = true; break;

			case 39: // right
				moveRight = true; break;
                                
			case 68: // d
                                rotateYawCW = true; break;

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

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

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
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	this.isOnObject = function ( boolean ) {

		isOnObject = boolean;
		canJump = boolean;

	};

	this.update = function ( delta ) {

		if ( scope.enabled === false ) return;

		delta *= 0.1;

                rotateYaw.z += ( - rotateYaw.z ) * velocityYaw * delta;

                if ( rotateYawCW )  rotateYaw.y -= velocityYaw;
		if ( rotateYawСCW ) rotateYaw.y += velocityYaw;

                if ( rotateYawCW )  rotateYaw.z += velocityYaw * delta / 5;
		if ( rotateYawСCW ) rotateYaw.z -= velocityYaw * delta / 5;

                velocity.x += ( - velocity.x ) * 0.08 * delta;
		velocity.z += ( - velocity.z ) * 0.08 * delta;
//		velocity.y -= 0.25 * delta;

		if ( moveForward ) velocity.z -= 0.12 * delta;
		if ( moveBackward ) velocity.z += 0.12 * delta;

		if ( moveLeft ) velocity.x -= 0.12 * delta;
		if ( moveRight ) velocity.x += 0.12 * delta;

//		if ( isOnObject === true ) {
//			velocity.y = Math.max( 0, velocity.y );
//		}

                yawObject.rotation.y  = rotateYaw.y;
                yawObject.rotation.z  = rotateYaw.z;
               
		yawObject.translateX( velocity.x );
		yawObject.translateY( velocity.y ); 
		yawObject.translateZ( velocity.z );

//                if ( yawObject.position.y < 3 ) {
//
//			velocity.y = 0;
			yawObject.position.y = 3;
//
//			canJump = true;
//
//		}

	};

};
