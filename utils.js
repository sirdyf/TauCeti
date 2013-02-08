/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var    UTILS = UTILS || { REVISION: '1' };

UTILS.LineGeometry = function(){
    var geom1 = new THREE.Geometry();
    geom1.vertices.push( new THREE.Vector3(0,-1,0), new THREE.Vector3(0,-1,100 ) );
    return geom1;
};

UTILS.lineDir = new THREE.Line(UTILS.LineGeometry());
UTILS.line1 = new THREE.Line(UTILS.LineGeometry());

//UTILS.RotateDirY = function(angle){
//    lineDir.rotation.y = angle;
//};
//UTILS.lookAt = function(dir){
//    lineDir.lookAt(dir);
//};
UTILS.addAll = function(parent){
    parent.add(UTILS.line1);
    parent.add(UTILS.lineDir);
};
UTILS.lookTo = function(base,dir){
    UTILS.line1.position.copy(base);
    var tmp=base.clone();
    tmp.addSelf(dir);
    UTILS.line1.lookAt(tmp);
};
UTILS.lookToDir = function(base,dir){
    UTILS.lineDir.position.copy(base);
    var tmp=base.clone();
    tmp.addSelf(dir);
    UTILS.lineDir.lookAt(tmp);
};

