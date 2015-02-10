/** @type {Object} [description] */
var StrandThreeObj = {};

/** @type {Object} Liste des biomesTypes */
StrandThreeObj.biomesTypes = {};


StrandThreeObj.biomesTypes['BARREN'] = {
  material: new THREE.MeshLambertMaterial({color: 'blue', wireframe: false, opacity: .8, transparent: true}),
  color: ''
};
StrandThreeObj.biomesTypes['ISLAND'] = {
  material: new THREE.MeshLambertMaterial({color: 'blue', wireframe: false, opacity: .1, transparent: false}),
  color: ''
};
StrandThreeObj.biomesTypes['SAND_PLAINS'] = {
  material: new THREE.MeshLambertMaterial({color: 'blue', wireframe: false, opacity: .8, transparent: true}),
  color: ''
};
StrandThreeObj.biomesTypes['DEEP_SEA'] = {
  material: new THREE.MeshLambertMaterial({color: 'blue', wireframe: false, opacity: .8, transparent: true}),
  color: ''
};
StrandThreeObj.biomesTypes['BOTTOMLESS'] = {
  material: new THREE.MeshLambertMaterial({color: 'blue', wireframe: false, opacity: .8, transparent: true}),
  color: ''
};
StrandThreeObj.biomesTypes['SHALLOW_SAND_PLAINS'] = {
  material: new THREE.MeshLambertMaterial({color: 'blue', wireframe: false, opacity: .8, transparent: true}),
  color: ''
};




/**
 * Retourne la geometrie d'une ile
 * @param {Object} data
 * @return {Object}
 */
StrandThreeObj.ISLAND = function(data) {

  var ISLAND = new THREE.Mesh(
    new THREE.SphereGeometry(60, 64, 16, 0, 2 * Math.PI, 0, Math.PI / 2),
    new THREE.MeshLambertMaterial({color: 'yellow'})
  );
  ISLAND.overdraw = true;
  ISLAND.scale.x = 1;
  ISLAND.scale.y = .1;
  ISLAND.scale.z = 1;
  ISLAND.name = 'ISLAND ' + data.id;
  ISLAND.position.x = data.position.x;
  ISLAND.position.y = data.position.y - (StrandThree.tileSize / 2) + data.position.height;
  ISLAND.position.z = data.position.z;
  return ISLAND;
};



/**
 * Retourne la geometrie du joeur
 * @param {Object} data
 * @return {Object}
 */
StrandThreeObj.PLAYER = function(data) {

  var PLAYER = new THREE.Mesh(
    new THREE.CylinderGeometry(10, 0, 100, 50, 50, false),
    new THREE.MeshLambertMaterial({color: 'red'})
  );
  PLAYER.overdraw = true;
  PLAYER.name = 'PLAYER';
  PLAYER.position.x = data.position.x;
  PLAYER.position.y = data.position.y + 50;
  PLAYER.position.z = data.position.z;
  return PLAYER;
};
