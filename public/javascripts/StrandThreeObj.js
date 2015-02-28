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
  // si lile est fullygenerated on va iterer sur les positions des palmiers
  // pour en faire une moyenne afin de palcer le centre de l'ile et la taille max
  if (data.fullyGenerated) {
    var ISLAND = new THREE.Mesh();
    for (o in data.objects) {
      var object = data.objects[o];
      if (object.type === 'PALM_TREE_1' ||
        object.type === 'PALM_TREE_2' ||
        object.type === 'PALM_TREE_3' ||
        object.type === 'PALM_TREE_4')
      {
       var little = new THREE.Mesh(
          new THREE.CylinderGeometry(12, 10, .2, 50, 50, false),
          new THREE.MeshLambertMaterial({color: 'rgb(235,244,140)'})
        );
        little.position.x = object.position.x - data.position.x;
        little.position.z = object.position.z - data.position.z;
        ISLAND.add(little);
      }
    }
    ISLAND.isFullyGenerated = true;
  }
  else {
    var ISLAND = new THREE.Mesh(
      new THREE.CylinderGeometry(40, 40, .2, 50, 50, false),
      new THREE.MeshLambertMaterial({color: 'yellow'})
    );
    ISLAND.isFullyGenerated = false;
  }
  ISLAND.position.x = data.position.x;
  ISLAND.position.y = 0;
  ISLAND.position.z = data.position.z;
  ISLAND.overdraw = true;
  ISLAND.receiveShadow = true;
  ISLAND.castShadow = false;
  ISLAND.key = 'ISLAND_' + data.id;
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
  var DecalageHeight = 0;
  var invisible = false;
  switch (dataObject.type) {
      case 'SHIPWRECK_1A':
      case 'SHIPWRECK_2A':
      case 'SHIPWRECK_3A':
      case 'SHIPWRECK_4A':
      case 'SHIPWRECK_5A':
      case 'SHIPWRECK_6A':
      case 'SHIPWRECK_7A':
      case 'RowBoat_3':
        MESH = new THREE.BoxGeometry(10, 10, 10);
        MATE = new THREE.MeshBasicMaterial({color: 'yellow', wireframe: false, opacity: .8, transparent: false});
        DecalageHeight = 5;
        break;

      case 'FOUNDATION':
        MESH = new THREE.BoxGeometry(2, 2.7, 2);
        MATE = new THREE.MeshBasicMaterial({color: 'GREY', wireframe: false, transparent: false});
        DecalageHeight = -2;
        break;
      case 'PALM_TREE_1':
        MESH = new THREE.BoxGeometry(.35, 4, .35);
        MATE = new THREE.MeshBasicMaterial({color: 'green', wireframe: false, opacity: .8, transparent: false});
        DecalageHeight = 2;
        break;
      case 'PALM_TREE_2':
        MESH = new THREE.BoxGeometry(.35, 6, .35);
        MATE = new THREE.MeshBasicMaterial({color: 'green', wireframe: false, opacity: .8, transparent: false});
        DecalageHeight = 3;
        break;
      case 'PALM_TREE_3':
        MESH = new THREE.BoxGeometry(.35, 8, .35);
        MATE = new THREE.MeshBasicMaterial({color: 'green', wireframe: false, opacity: .8, transparent: false});
        DecalageHeight = 4;
        break;
      case 'PALM_TREE_4':
        MESH = new THREE.BoxGeometry(.35, 10, .35);
        MATE = new THREE.MeshBasicMaterial({color: 'green', wireframe: false, opacity: .8, transparent: false});
        DecalageHeight = 5;
        break;
      case 'COCONUT':
      case 'COCONUT_DRINKABLE':
      case 'COCONUT_GREEN':
      case 'COCONUT_ORANGE':
        MESH = new THREE.SphereGeometry(.35, 4, 4);
        MATE = new THREE.MeshBasicMaterial({color: 'Chocolate', wireframe: false, opacity: .8, transparent: false});
        break;
      case 'SARDINE':
        MESH = new THREE.BoxGeometry(.04, .06, .30);
        MATE = new THREE.MeshBasicMaterial({color: 'white', wireframe: false, opacity: .8, transparent: false});
        break;
      case 'MARLIN':
      case 'SHARK - GREAT WHITE':
      case 'SHARK - TIGER':
        MESH = new THREE.BoxGeometry(.5, .5, 2);
        MATE = new THREE.MeshBasicMaterial({color: 'white', wireframe: false, opacity: .8, transparent: false});
        break;
      case 'POTATO_PLANT':
      case 'YUCCA':
        MESH = new THREE.BoxGeometry(.35, .8, .35);
        MATE = new THREE.MeshBasicMaterial({color: 'green', wireframe: false, opacity: .8, transparent: false});
        DecalageHeight = .4;
        break;
      case 'WHALE':
        MESH = new THREE.BoxGeometry(4, 4, 21);
        MATE = new THREE.MeshBasicMaterial({color: 'black', wireframe: false, opacity: .8, transparent: false});
        DecalageHeight = 2;
        break;
      case 'RAFT_V1':
        MESH = new THREE.TorusGeometry(2, .3, 16, 100);
        MATE = new THREE.MeshBasicMaterial({color: 'orange', wireframe: false, opacity: .8, transparent: false});
        DecalageHeight = .15;

        break;
      case 'PLANEWRECK':
        MESH = new THREE.BoxGeometry(10, 10, 10);
        MATE = new THREE.MeshBasicMaterial({color: 'yellow', wireframe: false, opacity: .8, transparent: false});
        DecalageHeight = 10;
        break;
      default:
        invisible = true;
  }

  if (!invisible) {
    var OBJECT = new THREE.Mesh(MESH, MATE);
    OBJECT.overdraw = true;
    OBJECT.castShadow = true;
    OBJECT.receiveShadow = false;
    OBJECT.name = '';

    OBJECT.position.x = dataObject.position.x;
    OBJECT.position.y = dataObject.position.y + DecalageHeight;
    OBJECT.position.z = dataObject.position.z;


    var rotation = new THREE.Euler().setFromQuaternion(dataObject.rotation);

    OBJECT.rotation.x = rotation.x;
    OBJECT.rotation.y = rotation.y;
    OBJECT.rotation.z = rotation.z;
    if (dataObject.type == 'RAFT_V1') {
       OBJECT.rotation.z = Math.PI / 2;
    }

    OBJECT.scale.x = dataObject.scale.x;
    OBJECT.scale.y = dataObject.scale.y;
    OBJECT.scale.z = dataObject.scale.z;

    OBJECT.key = dataObject.originalKey;

    return OBJECT;
  }

};



/*
AXE
BED
BINOCULARS
BUCKET
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
STICK
TOOLBOX_1
TORCH
WALL_CABINET_1
WATER_BOTTLE
MORPHINE
PALM_FROND
POTATO
ROCK
ROCK_SHARD
ROPE_COIL
RowBoat_3
SHARK_MEAT_CHUNK
SHARK_MEAT_FIN





*/

