function scaner(scene, container, sx, sy)  {

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
    ctx.setTransform( 1, 0, 0, 1, 0, 0 );
    // ctx.fillStyle   = "rgba(50,50,70, 0.4)";
    ctx.strokeStyle = "rgba(100, 100, 200, 1)";

    var radgrad = ctx.createRadialGradient(halfx, halfy, 0, halfx, halfy, halfx);  
    radgrad.addColorStop(0, "rgba(100,100,100,1)");  
    radgrad.addColorStop(0.33, "rgba(150,150,150,1)");  
    radgrad.addColorStop(0.95, "rgba(40,40,40,1)");  
    radgrad.addColorStop(1, "rgba(0,0,0,0)");  
  
    ctx.fillStyle = radgrad; 
    
    this.update = function (dt) {
        
        ctx.globalAlpha = 0.4;
        ctx.clearRect( 0, 0, sx, sy );
        ctx.fillRect(0, 0, sx, sy);
        //ctx.strokeRect(0, 0, sx, sy);
    
        ctx.beginPath();
            ctx.strokeStyle = "rgba(100, 100, 100, 1)";
            ctx.arc(halfx, halfy, halfy * 0.95, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
            ctx.arc(halfx, halfy, halfy * 0.3333, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.stroke();
    
        ctx.globalAlpha = 1.0;
        
        for(var index in scene.children) {
            var object = scene.children[index];

            if (object.name === "factory") {
                ctx.beginPath();
                    var objx = object.position.x / 5;
                    var objy = object.position.z / 5;
                    ctx.strokeStyle = "rgba(200, 200, 100, 1)";
                    ctx.arc(objx, objy, 3, 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.stroke();
            }
         
            if (object.name === "sphere") {
                ctx.beginPath();
                    var objx = object.position.x / 5;
                    var objy = object.position.z / 5;
                    ctx.strokeStyle = "rgba(200, 200, 100, 1)";
                    ctx.strokeRect(objx-1, objx-1, objx+1, objx+1);
                ctx.closePath();
                ctx.stroke();
            }
        }


    };

}
