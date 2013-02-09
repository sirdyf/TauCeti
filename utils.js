/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var    UTILS = UTILS || { REVISION: '0.1' };

UTILS.LineGeometry = function(size,posY){
    size = size || 100;
    posY = posY || -2.5;
    var geom1 = new THREE.Geometry();
    geom1.vertices.push( new THREE.Vector3(0,posY,-size), new THREE.Vector3(0,posY,size ) );
    return geom1;
};
UTILS.LineGeometry2 = function(size,posY){
    size = size || 100;
    posY = posY || -2.5;
    var geom1 = new THREE.Geometry();
    geom1.vertices.push( new THREE.Vector3(0,posY,-size/10), new THREE.Vector3(0,posY,size ) );
    geom1.colors.push  ( new THREE.Color( 0xff0000 ), new THREE.Color( 0xffaa00 ));
    return geom1;
};
UTILS.lines= [];
//UTILS.parent;

UTILS.addLine = function(parentObj){
    var line=new THREE.Line(UTILS.LineGeometry());
    this.lines.push(line);
    parentObj.add(line);
};
UTILS.addLineColor = function(parentObj){
    var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );
    var line=new THREE.Line(UTILS.LineGeometry2(),material,THREE.LinePieces);
    this.lines.push(line);
    parentObj.add(line);
};

UTILS.lookTo = function(index,position,dir){
//    dir.y = 0;//=position.y;
    var tmpObj=this.lines[index];
    tmpObj.position.copy(position);//    UTILS.line1.position.copy(base);
    var tmp=position.clone();
    tmp.addSelf(dir);
    tmpObj.lookAt(tmp);
};
