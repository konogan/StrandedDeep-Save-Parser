// client JS
// var io = io.connect();

var container; // DOM
var camera, controls, scene, renderer, mouseVector; // THREE
//var gui = new dat.GUI();
var StrandThree = {};

/** @type {Bool} biomes in 3D ? */
StrandThree.display3d = true;

/** @type {Bool} axis ? */
StrandThree.showAxis = true;

/** @type {Bool} sky in 3D ? */
StrandThree.displaySky = false;

/** @type {Number}  taille dun biome */
StrandThree.tileSize = 256;

/** @type {Number}  espacement entre les elements */
StrandThree.tileSpacer = 1;

/** @type {Array}   */
StrandThree.tiles = [];

/** @type {Array}  Array des objets 3D */
StrandThree.Objects = [];

/** @type {Bool}  Se deplacer en cliquant */
StrandThree.jumpOnClick = false;





/**
 * [drawGrid description]
 * @param  {[type]} data
 * @return {void}
 */
StrandThree.drawGrid = function(data) {
  //console.log('drawGrid');
  for (var i = data.length - 1; i >= 0; i--) {
    if (StrandThree.display3d) {
      StrandThree.draw3DNode(data[i]);
    }
    else {
      StrandThree.draw2DNode(data[i]);
    }
    if (data[i].type === 'ISLAND') {
      // add island geometry
      var isle = StrandThreeObj.ISLAND(data[i]);
      //StrandThree.Objects.push(isle);
      scene.add(isle);
    }
  }
};



/**
 * dessine un biome en 3D
 * @param  {Object} data
 * @return {void}
 */
StrandThree.draw3DNode = function(data) {
  var tile = new THREE.Mesh(
    new THREE.BoxGeometry(StrandThree.tileSize - StrandThree.tileSpacer, StrandThree.tileSize - StrandThree.tileSpacer, StrandThree.tileSize - StrandThree.tileSpacer),
    StrandThreeObj.biomesTypes[data.type].material
  );
  tile.overdraw = true;
  tile.position.x = data.coord.x;
  tile.position.y = data.coord.y - (StrandThree.tileSize) + data.coord.height;
  tile.position.z = data.coord.z;
  tile.material.side = THREE.DoubleSide;
  if (!data.fullyGenerated) {
    //tile.material.wireframe = 'grey';
  }
  tile.name = 'tile_' + data.id;
  StrandThree.tiles[data.id] = tile;
  StrandThree.Objects.push(StrandThree.tiles[data.id]);
  scene.add(tile);
};

/**
 * dessine un biome en 2D
 * @param  {Object} data
 * @return {void}
 */
StrandThree.draw2DNode = function(data) {

  var tile = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(StrandThree.tileSize - StrandThree.tileSpacer, StrandThree.tileSize - StrandThree.tileSpacer),
    StrandThreeObj.biomesTypes[data.type].material
  );
  tile.overdraw = true;
  tile.position.x = data.coord.x;
  tile.position.y = data.coord.y - (StrandThree.tileSize / 2) + data.coord.height;
  tile.position.z = data.coord.z;
  tile.material.side = THREE.DoubleSide;

  tile.rotation.x = Math.PI / 2;
  tile.name = 'tile_' + data.id;
  StrandThree.tiles[data.id] = tile;
  StrandThree.Objects.push(StrandThree.tiles[data.id]);
  scene.add(tile);
};


/**
 * [drawPlayer description]
 * @param  {[type]} data
 * @return {void}
 */
StrandThree.drawPlayer = function(data) {
  StrandThree.player = new THREE.Mesh(
    new THREE.BoxGeometry(10, 10, 10),
    new THREE.MeshNormalMaterial());
  StrandThree.player.name = 'Player';
  StrandThree.player.overdraw = true;
  scene.add(StrandThree.player);
  StrandThree.Objects.push(StrandThree.player);
  StrandThree.movePlayerTo(data, true);
};


/**
 * [drawPlayer description]
 * @param  {[type]} dbData
 * @return {void}
 */
StrandThree.drawPlayerPath = function(dbData) {
  // get initial pos
  console.log('drawPlayerPath', dbData);
  /*StrandThree.player = new THREE.Mesh(
    new THREE.BoxGeometry(10, 100, 10),
    new THREE.MeshNormalMaterial());
  StrandThree.player.name = 'Player';
  StrandThree.player.overdraw = true;
  scene.add(StrandThree.player);
  StrandThree.Objects.push(StrandThree.player);
  StrandThree.movePlayerTo(data, true);*/
};

/**
 * Deplace le marqueur du joeur a une position donnee
 * @param  {Object} data coord
 * @param  {Bool} path  trace un chemin entre l'ancienne et la nouvelle position
 * @return {void}
 */
StrandThree.movePlayerTo = function(data, path) {
  if (path) {
    var prevPos = StrandThree.player.position;
    StrandThree.drawLineBetweenCoord(prevPos, data);
  }
  StrandThree.player.position.x = data.x;
  StrandThree.player.position.y = data.y;
  StrandThree.player.position.z = data.z;
  render();
};

/**
 * Deplace le regard de la camera a un point
 * @param  {Object} where [description]
 * @return {void}       [description]
 */
StrandThree.moveCam = function(where) {
  controls.target = new THREE.Vector3(where.x, where.y, where.z);
  animate();
};
/**
 * [showAxis description]
 * @return {void}
 */
StrandThree.showAxis = function() {
  var length = StrandThree.tileSize;
  StrandThree.axis = new THREE.Object3D();
  StrandThree.axis.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0), 0xFF0000, false)); // +X
  StrandThree.axis.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-length, 0, 0), 0xFF0000, true)); // -X
  StrandThree.axis.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, length, 0), 0x00FF00, false)); // +Y
  StrandThree.axis.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -length, 0), 0x00FF00, true)); // -Y
  StrandThree.axis.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, length), 0x0000FF, false)); // +Z
  StrandThree.axis.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -length), 0x0000FF, true)); // -Z
  scene.add(StrandThree.axis);
};

/**
 * Build a cube for test
 * @return {void}
 */
StrandThree.test = function() {
  //console.log('test');
  var test = new THREE.Mesh(
    new THREE.SphereGeometry(60, 64, 16, 0, 2 * Math.PI, 0, Math.PI / 2),
    new THREE.MeshBasicMaterial({color: 'yellow', wireframe: false})
    );
  test.overdraw = true;
  test.scale.x = 1;
  test.scale.y = .1;
  test.scale.z = 1;

  scene.add(test);
};




/**
 * [initGui description]
 * @return {void} [description]
 */
StrandThree.initGui = function() {
  gui.params = {
    showSky: StrandThree.displaySky,
    transparency: 90,
    showAxis: true,
    showPlayerTrail: true,
    showGrid: false,
    information: 'Infos',
    jumpOnClick: StrandThree.jumpOnClick
  };

  var f1 = gui.addFolder('Global Display');
  var controllerSky = f1.add(gui.params, 'showSky');
  var controllerAlpha = f1.add(gui.params, 'transparency', 0, 100);
  //var controllerAxis = f1.add(gui.params, 'showAxis');
  //var controllerTrail = f1.add(gui.params, 'showPlayerTrail');
  //var controllerGrid = f1.add(gui.params, 'showGrid');

  var f2 = gui.addFolder('Objects Display');


  var f3 = gui.addFolder('Informations');
  f3.add(gui.params, 'information').listen();
  //var controllerJump = f3.add(gui.params, 'jumpOnClick');
  f3.open();

  controllerSky.onChange(function(value) {
    StrandThree.skyBox.visible = value;
  });

  // controllerAxis.onChange(function(value) {
  //   StrandThree.axis.visible = value;
  // });

  controllerAlpha.onChange(function(value) {
    for (geo in StrandThree.Objects) {
      if (value < 100) {
        StrandThree.Objects[geo].material.transparent = true;
      }
      StrandThree.Objects[geo].material.opacity = value / 100;
    }
  });

  // controllerJump.onChange(function(value) {
  //   StrandThree.jumpOnClick = value;
  // });

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
StrandThree.drawLineBetweenCoord = function(pos1, pos2) {
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(pos1.x, pos1.y, pos1.z));
  geometry.vertices.push(new THREE.Vector3(pos2.x, pos2.y, pos2.z));
  var material = new THREE.LineBasicMaterial({color: 0xff0000});
  var line = new THREE.Line(geometry, material);
  scene.add(line);
};




/**
 * [initThree description]
 * @return {void} [description]
 */
StrandThree.initThree = function() {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
  camera.position.set(StrandThree.tileSize, StrandThree.tileSize, StrandThree.tileSize);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  controls = new THREE.OrbitControls(camera);
  controls.damping = 0.2;
  controls.addEventListener('change', render);
  scene = new THREE.Scene();

  //scene.fog = new THREE.FogExp2(0xcccccc, 0.0002);

  // lights
  light = new THREE.PointLight(0xffffff);
  light.position.set(0, 2500, 0);
  scene.add(light);


    var imagePrefix = 'images/';
    var directions = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
    var imageSuffix = '.jpg';
    var skyGeometry = new THREE.BoxGeometry(StrandThree.tileSize * 200, StrandThree.tileSize * 200, StrandThree.tileSize * 200);
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


  // si les biomes ne sont pas en 3D on met un plan pour representer la mer que l'on recouvrira d'une grille
  if (!StrandThree.display3d) {

  }
  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setClearColor(0xffffff);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container = document.getElementById('container');
  container.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('click', onMouseClick, false);
  animate();

  // Emit ready event.
  io.emit('three ready');
};

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
  io.emit('mouse click');
  var vector = new THREE.Vector3();
  var raycaster = new THREE.Raycaster();
  var dir = new THREE.Vector3();

  if (camera instanceof THREE.OrthographicCamera) {
    vector.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, - 1); // z = - 1 important!
    vector.unproject(camera);
    dir.set(0, 0, - 1).transformDirection(camera.matrixWorld);
    raycaster.set(vector, dir);

  } else if (camera instanceof THREE.PerspectiveCamera) {
    vector.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5); // z = 0.5 important!
    vector.unproject(camera);
    raycaster.set(camera.position, vector.sub(camera.position).normalize());
  }

  var intersects = raycaster.intersectObjects(StrandThree.Objects);
  if (typeof intersects[0] != 'undefined' && typeof intersects[0].object != 'undefined') {
    //gui.params.information = intersects[0].object.name;
    /// console.log(intersects[0].object);
    if (StrandThree.jumpOnClick) {
      StrandThree.moveCam(intersects[0].object.position);
    }
  }
}


function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

function render() {
  renderer.render(scene, camera);
}




