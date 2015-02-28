// client JS

var container; // DOM
var camera, controls, scene, renderer, mouseVector, controls; // THREE
var StrandThree = {};

/** @type {Bool} axis ? */
StrandThree.showAxis = true;

/** @type {Bool} sky in 3D ? */
StrandThree.displaySky = false;

/** @type {Number}  Size of tile */
StrandThree.Tilesize = 256;

/** @type {Number}  Space between tiles */
StrandThree.Tilespacer = .1;

/** @type {Array}  Array of tiless */
StrandThree.Tiles = [];

/** @type {Array}  Array of objects*/
StrandThree.Objects = [];

/** @type {Array}  Array of islands */
StrandThree.Islands = [];

/** @type {Bool}  Se deplacer en cliquant */
StrandThree.jumpOnClick = false;

/** @type {THREE} Group */
StrandThree.GridGroup = new THREE.Group();
/** @type {THREE} Group */
StrandThree.ObjectsGroup = new THREE.Group();
/** @type {THREE} Group */
StrandThree.PathGroup = new THREE.Group();

/**
 * [drawGrid description]
 * @param  {[type]} data
 * @return {void}
 */
StrandThree.drawGrid = function(data) {
  for (nodeKey in data) {
    var nodeData = data[nodeKey];
    nodeData.position.x = nodeData.position.x;
    nodeData.position.z = nodeData.position.z;
    var tileid = 'tile_' + nodeData.id;

    if (typeof StrandThree.Tiles[tileid] !== 'undefined') {
      if (nodeData.fullyGenerated) {
        StrandThree._update3dTile(StrandThree.Tiles[tileid]);
      }
    }
    else {
      StrandThree._draw3dTile(nodeData, nodeKey, true);
    }

    if (nodeData.fullyGenerated) {
      StrandThree._drawGridObjects(nodeData);
    }

    if (data[nodeKey].type === 'ISLAND') {
      var islandid = 'ISLAND_' + nodeData.id;
      var doDraw = false;
      if (typeof StrandThree.Islands[islandid] === 'undefined') {
        console.log('new island');
        doDraw = true;
        //the island is not already generated
      }
      else if (!StrandThree.Islands[islandid].isFullyGenerated && nodeData.fullyGenerated) {
        console.log('redraw an island');
        // the island is not already fullygenerated but the tile is now fullygenerated
        // remove the previous one
        StrandThree.GridGroup.remove(StrandThree.Islands[islandid]);
        delete StrandThree.Islands[islandid];
        doDraw = true;
      }
      if (doDraw) {
        var isle = StrandThreeObj.ISLAND(nodeData);
        StrandThree.Islands[isle.key] = isle;
        StrandThree.GridGroup.add(isle);
      }
    }
  }
  animate();
};

/**
 * [drawGridObjects description]
 * @param  {Array} nodeData array of objcts in biome
 */
StrandThree._drawGridObjects = function(nodeData) {
   for (o in nodeData.objects) {
    var object = nodeData.objects[o];
    nodeData.position.y = -129;
    object.position = addPos(object, nodeData);
    if (typeof StrandThree.Objects[object.originalKey] !== 'undefined') {
      // console.log(object.originalKey + ' is old -> updateIt');
      StrandThree.Objects[object.originalKey].position = object.position;
      StrandThree.Objects[object.originalKey].quaternion = object.rotation;
    }
    else {
      var model = StrandThreeObj.OBJECT(object);
      if (typeof model !== 'undefined') {
        StrandThree.Objects[model.key] = model;
        StrandThree.ObjectsGroup.add(model);
      }
    }
  }
};

/**
 * dessine un biome en 3D avec DEBUG
 * @param  {Object} data
 * @param  {String} texte a afficher dans les face
 * @param  {Bool} debug
 * @return {void}
 */
StrandThree._draw3dTile = function(data, texte , debug) {
  var heightOfNode = data.position.height * 1;
  var TEX;

  if (!debug) {
    TEX = StrandThreeObj.biomesTypes[data.type].material;
  }
  else {
    var canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    var context = canvas.getContext('2d');
    context.font = '10pt Arial';
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    if (data.fullyGenerated) {
      context.fillStyle = '#0489B1';
      context.fillRect(2, 2, canvas.width - 4, canvas.height - 4);
      context.fillStyle = 'black';
    }
    else {
      context.fillStyle = '#0489B1';
      context.fillRect(2, 2, canvas.width - 4, canvas.height - 4);
      context.fillStyle = 'white';
    }
    context.textAlign = 'right';
    context.textBaseline = 'bottom';
    context.fillText(texte + ' - ' + data.type, canvas.width - 20, canvas.height - 20);

    var texture1 = new THREE.Texture(canvas);
    texture1.needsUpdate = true;

     TEX = new THREE.MeshLambertMaterial({
      map: texture1,
      side: THREE.DoubleSide,
      transparent: true
    });

     if (data.fullyGenerated) {
      TEX.opacity = .7;
     }
     else {
      TEX.opacity = 1;
     }
  }

  var BOX = new THREE.BoxGeometry(
        StrandThree.Tilesize - StrandThree.Tilespacer,
        StrandThree.Tilesize / 2 ,
        StrandThree.Tilesize - StrandThree.Tilespacer,
        1, 1, 1);

  var tile = new THREE.Mesh(BOX, TEX);

  tile.overdraw = true;
  tile.receiveShadow = true;
  tile.position.x = data.position.x;
  tile.position.y = - (StrandThree.Tilesize / 4);
  tile.position.z = data.position.z;

  tile.key = 'tile_' + data.id;

  StrandThree.Tiles[tile.key] = tile;
  StrandThree.GridGroup.add(tile);
};




/**
 * draw a compass
 * @return {void}
 */
StrandThree._drawCompass = function() {
  var canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  var ctx = canvas.getContext('2d');
  var centerX = ctx.width / 2;
  var centerY = ctx.height / 2;
  var radius = 100;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#003300';
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(centerY, 27);
  ctx.lineTo(centerY, centerX);
  ctx.stroke();

  var texture1 = new THREE.Texture(canvas);
  texture1.needsUpdate = true;
  var material = new THREE.MeshBasicMaterial({map: texture1, side: THREE.DoubleSide});
  material.transparent = true;
  var plane = new THREE.PlaneGeometry(canvas.width, canvas.height);
  var compass = new THREE.Mesh(plane, material);
  compass.overdraw = true;
  compass.receiveShadow = false;
  compass.rotation.x = Math.PI / 2;
  compass.position.x = 0;
  compass.position.y = 150;
  compass.position.z = 0;

  StrandThree.Objects['COMPASS'] = compass;
  scene.add(compass);
};




/**
 * Update a tile
 * @param  {Object} tile [description]
 */
StrandThree._update3dTile = function(tile) {
    tile.material.opacity = 0.7;
};

/**
 * [drawMarker description]
 * @param  {[Object} data with position inside
 * @param  {String} color
 * @return {void}
 */
StrandThree._drawMarker = function(data, color) {
  var drawMarker = StrandThreeObj.MARKER(data, color);
  StrandThree.PathGroup.add(drawMarker);
  //StrandThree.Objects.push(StrandThree.player);
};


/**
 * drawPlayerPath
 * @param  {[bject} Path
 */
StrandThree.drawPlayerPath = function(Path) {
  cleanGroup(StrandThree.PathGroup);
  var player = {};
  var world = {};
  var playerinworld = {};
  player.position = {};
  world.position = {};
  playerinworld.position = {};
  world.prec = {};
  player.prec = {};
  playerinworld.prec = {};
  player.prec.position = {};
  world.prec.position = {};
  playerinworld.prec.position = {};

  for (key in Path) {
    player.position = Path[key].player.position;
    world.position = Path[key].world.position;
    playerinworld.position = addPos(world, player);

    if (key == Path.length - 1) {
      StrandThree._drawMarker(playerinworld, 'red');
      StrandThree.moveCam(playerinworld);
      StrandThree.moveLight(playerinworld);
    }
    else {
      StrandThree._drawMarker(playerinworld, 'green');
    }

    if (parseInt(key) > 0) {
      player.prec.position = Path[key - 1].player.position;
      world.prec.position = Path[key - 1].world.position;
      playerinworld.prec.position = addPos(world.prec, player.prec);

      StrandThree.drawLineBetweenCoord(playerinworld.prec.position, playerinworld.position, 'green');
    }
  }
  animate();
};





/**
 * Deplace le regard de la camera a un point
 * @param  {Object} where [description]
 * @return {void}       [description]
 */
StrandThree.moveCam = function(where) {
  oldTarget = controls.target;
  oldCam = camera.position;

  var distance={
    x:parseInt(oldTarget.x - where.position.x),
    y:parseInt(oldTarget.y - where.position.y),
    z:parseInt(oldTarget.z - where.position.z)
  };
  var camPos = {
    x:parseInt(oldCam.x - distance.x),
    y:parseInt(oldCam.y - distance.y),
    z:parseInt(oldCam.z - distance.z)
  };
  camera.position.set(camPos.x, camPos.y, camPos.z);
  camera.updateMatrix();
  controls.target = new THREE.Vector3(where.position.x, where.position.y, where.position.z);
};



StrandThree.moveLight = function(where) {
  var oldLight = light.position;
  light.position.set(where.position.x, oldLight.y, where.position.z);
  light.updateMatrix();
  light.updateMatrixWorld();
};

/**
 * [showAxis description]
 * @return {void}
 */
StrandThree.showAxis = function() {
  var length = StrandThree.Tilesize;
  StrandThree.axis = new THREE.Object3D();
  StrandThree.axis.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0), 0xFF0000, false)); // +X
  StrandThree.axis.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-length, 0, 0), 0xFF0000, true)); // -X
  StrandThree.axis.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, length, 0), 0x00FF00, false)); // +Y
  StrandThree.axis.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -length, 0), 0x00FF00, true)); // -Y
  StrandThree.axis.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, length), 0x0000FF, false)); // +Z
  StrandThree.axis.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -length), 0x0000FF, true)); // -Z
  StrandThree.axis.position.y = 50;
  scene.add(StrandThree.axis);
};

/**
 * [buildAxis description]
 * @param  {[type]} src      [description]
 * @param  {[type]} dst      [description]
 * @param  {[type]} colorHex [description]
 * @param  {[type]} dashed   [description]
 * @return {[type]}          [description]
 */
function buildAxis(src, dst, colorHex, dashed) {
  var geom = new THREE.Geometry(), mat;
  if (dashed) {
    mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
  } else {
    mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
  }
  geom.vertices.push(src.clone());
  geom.vertices.push(dst.clone());
  geom.computeLineDistances();
  var axis = new THREE.Line(geom, mat, THREE.LinePieces);

  return axis;
}

/**
 * drawLineBetweenCoord description
 * @param  {Object} pos1
 * @param  {object} pos2
 * @return {void}
 */
StrandThree.drawLineBetweenCoord = function(pos1, pos2, color) {
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(pos1.x, pos1.y + 20, pos1.z));
  geometry.vertices.push(new THREE.Vector3(pos2.x, pos2.y + 20, pos2.z));

  var material = new THREE.LineBasicMaterial({color: color,linewidth: 3});
  var line = new THREE.Line(geometry, material);
  StrandThree.PathGroup.add(line);

};




/**
 * [initThree description]
 * @return {void} [description]
 */
StrandThree.initThree = function() {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 200000);
  camera.position.set(500, 800, 250);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  controls = new THREE.OrbitControls(camera);
  controls.damping = 0.2;
  controls.addEventListener('change', render);

  scene = new THREE.Scene();
  //scene.fog = new THREE.FogExp2(0xcccccc, 0.0002);

  // lights
  light = new THREE.SpotLight(0xffffff);
  light.position.set(0, 5500, 0);
  light.castShadow = true;
  light.shadowCameraNear = 1;
  light.shadowCameraFar = 20000;
  light.shadowCameraFov = 45;
  light.shadowDarkness = 0.5;
  light.shadowMapWidth = 2048;
  light.shadowMapHeight = 2048;
  scene.add(light);

  if(StrandThree.displaySky) {
    StrandThree.addSky();
  }

  if(StrandThree.showAxis) {
    StrandThree.showAxis();
  }

  //StrandThree._drawCompass();

  scene.add(StrandThree.PathGroup);
  scene.add(StrandThree.GridGroup);
  scene.add(StrandThree.ObjectsGroup);

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setClearColor(0xffffff);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;
  renderer.shadowMapType = THREE.PCFSoftShadowMap;

  container = document.getElementById('container');
  container.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('click', onMouseClick, false);
  animate();

  // Emit ready event.
  io.emit('three ready');
};


StrandThree.addSky = function() {
  var imagePrefix = 'images/';
    var directions = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
    var imageSuffix = '.jpg';
    var skyGeometry = new THREE.BoxGeometry(StrandThree.Tilesize * 200, StrandThree.Tilesize * 200, StrandThree.Tilesize * 200);
    light = new THREE.AmbientLight(0x222222);
    scene.add(light);
    var materialArray = [];
    for (var i = 0; i < 6; i++)
      materialArray.push(new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(imagePrefix + directions[i] + imageSuffix),
        side: THREE.BackSide
      }));
    var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
    StrandThree.skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
    StrandThree.skyBox.name = 'SKY';
    StrandThree.skyBox.visible = StrandThree.displaySky;
    scene.add(StrandThree.skyBox);
}

function cleanGroup(group) {
  var obj, i;
  for ( i = group.children.length - 1; i >= 0 ; i -- ) {
    obj = group.children[ i ];
    group.remove(obj);
  }
}


/**
 * [onWindowResize description]
 * @return {void} [description]
 */
function onWindowResize() {
  io.emit('three resize');
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

/**
 * [onMouseClick description]
 * @param  {event} event [description]
 * @return {void}       [description]
 */
function onMouseClick(event) {
  console.log('click');
  var vector = new THREE.Vector3();
  var raycaster = new THREE.Raycaster();
  var dir = new THREE.Vector3();

  vector.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5); // z = 0.5 important!
  vector.unproject(camera);
  raycaster.set(camera.position, vector.sub(camera.position).normalize());


  var intersects = raycaster.intersectObjects(scene.children,true);
  console.log(intersects);
  /*if (typeof intersects[0] != 'undefined' && typeof intersects[0].object != 'undefined') {
    console.log(intersects[0].object);
    StrandThree.moveCam(intersects[0].object);

  }*/
}


function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

function render() {
  renderer.clear();
  renderer.render(scene, camera);
}

/**
 * additionne 2 positions dans l'espace
 * @param {Object} posOne premiere position
 * @param {Object} posTwo deuxieme position
 * @return {Object} coordonnee resultante
 */
function addPos(posOne, posTwo) {
  return {
    x: parseInt(posOne.position.x * 1 + posTwo.position.x * 1),
    y: parseInt(posOne.position.y * 1 + posTwo.position.y * 1),
    z: parseInt(posOne.position.z * 1 + posTwo.position.z * 1)
  };
};


