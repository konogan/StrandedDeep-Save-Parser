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
  ISLAND.position.x = data.coord.x;
  ISLAND.position.y = data.coord.y - (StrandThree.tileSize / 2) + data.coord.height;
  ISLAND.position.z = data.coord.z;
  return ISLAND;
};

