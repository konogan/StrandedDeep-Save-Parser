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
  ISLAND.receiveShadow = true;
  ISLAND.scale.x = 1;
  ISLAND.scale.y = .1;
  ISLAND.scale.z = 1;
  ISLAND.name = 'ISLAND ' + data.id;
  ISLAND.position.x = data.position.x;
  ISLAND.position.y = 0;
  ISLAND.position.z = data.position.z;
  return ISLAND;
};



/**
 * Retourne une geometrie Marker
 * @param {Object} data  width data.position
 * @param {String} color
 * @return {Object}
 */
StrandThreeObj.MARKER = function(data, color) {
  var color = color || 'white';
  var MARKER = new THREE.Mesh(
    new THREE.CylinderGeometry(10, 0, 100, 50, 50, false),
    new THREE.MeshLambertMaterial({color: color})
  );
  MARKER.overdraw = true;
  MARKER.castShadow = true;
  MARKER.receiveShadow = false;
  MARKER.name = 'WORLD';
  MARKER.position.x = data.position.x;
  MARKER.position.y = data.position.y + 50;
  MARKER.position.z = data.position.z;
  return MARKER;
};



/**
 * Retourne une geometrie Object generique
 * @param {Object} dataObject
 * @return {Object}
 */
StrandThreeObj.OBJECT = function(dataObject) {
  var MESH;
  var MATE;
  switch (dataObject.type) {
      case 'SHIPWRECK_1A':
      case 'SHIPWRECK_2A':
      case 'SHIPWRECK_3A':
      case 'SHIPWRECK_4A':
      case 'SHIPWRECK_5A':
      case 'SHIPWRECK_6A':
        MESH = new THREE.BoxGeometry(10, 10, 10);
        MATE = new THREE.MeshBasicMaterial({color: 'yellow', wireframe: false, opacity: .8, transparent: true});
        break;

      default:
          MESH = new THREE.BoxGeometry(1, 1, 1);
          MATE = new THREE.MeshBasicMaterial({color: 'grey', wireframe: false, opacity: .8, transparent: true});
  }

  var OBJECT = new THREE.Mesh(
    MESH,
    MATE
  );
  OBJECT.overdraw = true;
  OBJECT.castShadow = false;
  OBJECT.receiveShadow = false;
  OBJECT.name = '';
  OBJECT.position.x = dataObject.position.x;
  OBJECT.position.y = dataObject.position.y;
  OBJECT.position.z = dataObject.position.z;
  OBJECT.rotation.x = dataObject.rotation.x;
  OBJECT.rotation.y = dataObject.rotation.y;
  OBJECT.rotation.z = dataObject.rotation.z;
  // OBJECT.rotation.w = data.rotation.w;
  OBJECT.scale.x = dataObject.scale.x;
  OBJECT.scale.y = dataObject.scale.y;
  OBJECT.scale.z = dataObject.scale.z;
  return OBJECT;
};



/*
AXE
BED
BINOCULARS
BUCKET
COCONUT
COCONUT_DRINKABLE
COCONUT_GREEN
COCONUT_ORANGE
CONSOLE_1
CRAB_HOME
CRUDE_AXE
CRUDE_HAMMER
CRUDE_SPEAR
DOOR_1
DOOR_2
EGG_DEADEX
ENGINE
ENGINE_FUEL_TANK
ENGINE_PROPELLER
ENGINE_PUMP
FIRE
FLARE
FLASHLIGHT
FLOOR_HATCH
FOUNDATION
FOUNDATION_RAFT
FOUNDATION_ROOF
FOUNDATION_SUPPORT
FOUNDATION_WALL
FUELCAN
HARDCASE_1
KNIFE
LOCKER_1
LOCKER_4
MACHETTE
MARLIN
MORPHINE
PALM_FROND
PALM_TREE_1
PALM_TREE_2
PALM_TREE_3
PALM_TREE_4
POTATO
POTATO_PLANT
RAFT_V1
ROCK
ROCK_SHARD
ROPE_COIL
RowBoat_3
SARDINE
SHARK - GREAT WHITE
SHARK - TIGER
SHARK_MEAT_CHUNK
SHARK_MEAT_FIN

STICK
TOOLBOX_1
TORCH
WALL_CABINET_1
WATER_BOTTLE
WHALE
YUCCA
*/

