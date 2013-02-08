/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var    UTILS = UTILS || { REVISION: '0.1' };

UTILS.LineGeometry = function(size,posY){
    size = size || 100;
    posY = posY || -1;
    var geom1 = new THREE.Geometry();
    geom1.vertices.push( new THREE.Vector3(0,posY,0), new THREE.Vector3(0,posY,size ) );
    return geom1;
};
UTILS.lines= [];
//UTILS.parent;

UTILS.addLine = function(parentObj){
    var line=new THREE.Line(UTILS.LineGeometry());
    this.lines.push(line);
    parentObj.add(line);
};

UTILS.lookTo = function(index,position,dir){
    var tmpObj=this.lines[index];
    tmpObj.position.copy(position);//    UTILS.line1.position.copy(base);
    var tmp=position.clone();
    tmp.addSelf(dir);
    tmpObj.lookAt(tmp);
};
