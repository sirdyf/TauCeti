function scaner(container, scene, camera, sx, sy)  {

    // Scaner
    var canvas = document.createElement( 'canvas' );

    canvas.width = sx;
    canvas.height = sy;
    
    var halfx = sx / 2;
    var halfy = sy / 2;

    canvas.style.position = 'absolute';
    //canvas.style.left = '0px';
    canvas.style.right= '10px';
    canvas.style.top  = '10px';
    //canvas.style.bottom = '10px';

    container.appendChild( canvas );

    var ctx = canvas.getContext( '2d' );
    //ctx.setTransform( 1, 0, 0, 1, 0, 0 );
    // ctx.fillStyle   = "rgba(50,50,70, 0.4)";
    ctx.strokeStyle = "rgba(100, 100, 200, 1)";

    var radgrad = ctx.createRadialGradient(halfx, halfy, 0, halfx, halfy, halfx);  
    radgrad.addColorStop(0.0, "rgba(100,100,100,1)");  
    radgrad.addColorStop(0.32, "rgba(150,150,150,1)");  
    radgrad.addColorStop(0.33, "rgba(255,255,255,1)");  
    radgrad.addColorStop(0.34, "rgba(150,150,150,1)");  
    radgrad.addColorStop(0.94, "rgba(40,40,40,1)");  
    radgrad.addColorStop(0.95, "rgba(60,60,60,1)");  
    radgrad.addColorStop(0.99, "rgba(40,40,40,1)");  
    radgrad.addColorStop(1.0, "rgba(0,0,0,0)");  
  
    ctx.fillStyle = radgrad; 

    ctx.arc(halfx, halfy, halfy, 0, Math.PI * 2, false);
    ctx.clip();

    //ctx.clearRect( 0, 0, sx, sy );
    //ctx.stroke();
    
    this.update = function (dt) {
        
        ctx.globalAlpha = 0.4;
        ctx.clearRect( 0, 0, sx, sy );
        
        ctx.beginPath();
        ctx.strokeStyle = "rgba(50, 50, 50, 1)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(halfx,0);
        ctx.lineTo(halfx,sy);
        ctx.moveTo(0,halfy);
        ctx.lineTo(sx,halfy);
        ctx.closePath();
        ctx.stroke();   
        
        ctx.fillRect(0, 0, sx, sy);
        //ctx.strokeRect(0, 0, sx, sy);
    
        //ctx.lineWidth = 3;
//        ctx.beginPath();
//            ctx.strokeStyle = "rgba(100, 100, 100, 1)";
//            ctx.arc(halfx, halfy, halfy * 0.95, 0, Math.PI * 2, false);
//        ctx.closePath();
//        ctx.stroke();
//        
//        ctx.beginPath();
//            ctx.arc(halfx, halfy, halfy * 0.3333, 0, Math.PI * 2, false);
//        ctx.closePath();
//        ctx.stroke();
    
        ctx.globalAlpha = 1.0;
        
        for(var index in scene.children) {
            var object = scene.children[index];

            if (object.name === "factory") {
                ctx.beginPath();
                    var pos = camera.worldToLocal(new THREE.Vector3(object.position.x, object.position.y, object.position.z));
                    var objx = pos.x / 5 + halfx;
                    var objy = pos.z / 5 + halfy;
                    ctx.strokeStyle = "rgba(200, 200, 100, 1)";
                    ctx.arc(objx, objy, 3, 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.stroke();
            }
         
            if (object.name === "sphere") {
                ctx.beginPath();
                    var pos = camera.worldToLocal(new THREE.Vector3(object.position.x, object.position.y, object.position.z));
                    var objx = pos.x / 5 + halfx;
                    var objy = pos.z / 5 + halfy;
                    ctx.strokeStyle = "rgba(200, 200, 250, 1)";
                    ctx.strokeRect(objx-3, objy-3, 6, 6);
                ctx.closePath();
                ctx.stroke();
            }
        }
        
    };

    this.remove = function () {
      if(canvas) {
        canvas.parentNode.removeChild(canvas);
      }
    };
}
