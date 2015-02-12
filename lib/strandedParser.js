'use strict';
var fs = require('fs');
var Datastore = require('nedb'), db = new Datastore({ filename: 'data/data', autoload: true });
var moment = require('moment');
var strandedParser = {};

/** @type {String} player position */
strandedParser.loadedFile = '';
/** @type {String} player position */
strandedParser.loadedFileTime = '';
/** @type {Object} player position */
strandedParser.lastPlayerPos = {};
/** @type {Object} world position */
strandedParser.lastWorldPos = {};
/** @type {Array} array of player position */
strandedParser.allPlayerPos = {};
/** @type {Array} array of nodes */
strandedParser.allNodes;
/** @type {Array} array of biomeType */
strandedParser.biomes = [];
/** @type {Array} array of strandObjects */
strandedParser.strandObjects = [];


/**
 * retire le typage des variables unity
 * @param  {Object} strandedPos  unity coord
 * @return {Object} coord
 */
var normalizeStranded = function(strandedPos) {
   return {
    x: strandedPos.x.substr(2) * 1,
    y: strandedPos.y.substr(2) * 1,
    z: strandedPos.z.substr(2) * 1
  };
};

/**
 * additionne 2 coord dans l'espace
 * @param {Object} posOne premiere coord
 * @param {Object} posTwo deuxieme coord
 * @return {Object} coordonnee resultante
 */
var addPos = function(posOne, posTwo) {
  return {
    x: parseInt(posOne.x * 1 + posTwo.x * 1),
    y: parseInt(posOne.y * 1 + posTwo.y * 1),
    z: parseInt(posOne.z * 1 + posTwo.z * 1)
  };
};

/**
 * nettoie la clef StrandedDeep
 * @param  {String} strandedKey
 * @return {String}
 */
var extractKeyId = function(strandedKey) {
  var numb = strandedKey.match(/\d/g);
  numb = numb.join('');
  return numb;
};

/**
 * charge le fichier sauvegarde
 * @param  {string} file
 * @return {void}
 */
strandedParser.load = function(file) {
  fs.readFile(file, 'utf8', function(err, data) {
    if (err) {
      console.log('Error: ' + err);
      return;
    }
    var stats = fs.statSync(file);
    var date = moment(stats.mtime);
    strandedParser.loadedFile = file;
    strandedParser.loadedFileTime = date.format('x');
    strandedParser.data = JSON.parse(data).Persistent;
    strandedParser.process();
    return true;
  });
};




/**
 * re-charge le fichier sauvegarde
 * @param  {string} file
 * @return {void}
 */
strandedParser.reload = function(file) {
  return strandedParser.load(file);
};


/**
 * Ensemble des opérations à effectuer apres  une lecture des datas
 * - recup player
 * - recup world
 * - add player in world
 * - store player
 * - recup nodes
 * - build grid
 * @return {void]}
 */
strandedParser.process = function() {
  var playerPositionLocale = normalizeStranded(strandedParser.data.PlayerMovement.Transform.localPosition);
  var worldPosistion = normalizeStranded(strandedParser.data.TerrainGeneration.WorldOriginPoint);
  strandedParser.lastPlayerPos.position = playerPositionLocale;
  strandedParser.lastWorldPos.position = worldPosistion;
  strandedParser.allNodes = strandedParser.buildGrid(strandedParser.data.TerrainGeneration.Nodes);
  //strandedParser.keep();
  strandedParser.getAllPlayerPosFromDb();

/*  app.io.sockets.emit('TEST', {
        data: 'test'
      });
*/
};


/**
 * Stocke les informations d'une sauvegarde a l'autre
 * @return {void}
 */
strandedParser.keep = function() {
  var saveDb = {
    saveTime: strandedParser.loadedFileTime,
    player: strandedParser.lastPlayerPos,
    world: strandedParser.lastWorldPos
  };
  // TODO verifier que la derniere sauvegarde n'est pas la meme avant d'enregister
  db.insert(saveDb);
};

/**
 * getPlayerPos
 * @return {Objet}
 */
strandedParser.getPlayerPos = function() {
  return strandedParser.lastPlayerPos;
};

/**
 * Recuperes les positions d'une sauvegarde a l'autre
 * @return {void}
 */
strandedParser.getAllPlayerPosFromDb = function() {
  db.find({ }).sort({ saveTime: 1 }).exec(
    function(err, docs) {
      if (err) {
        console.log('err :', err);
        return;
      }
      else {
        strandedParser.allPlayerPos = docs;
      }
    }
  );

};


/**
 * Recuperes les positions d'une sauvegarde a l'autre
 * @return {void}
 */
strandedParser.getAllPlayerPos = function() {
  return strandedParser.allPlayerPos;
};


/**
 * Build grid from stranded nodes datas
 * @param  {Object} strandedNodes from save
 * @return {Array}
 */
strandedParser.buildGrid = function(strandedNodes) {
  var grid = [];
  for (var key in strandedNodes) {
    var node = strandedNodes[key];
    var pos = normalizeStranded(node.positionOffset);

    var height = node.heightValue.substr(2) * 1;
    strandedParser.addBiomeType(node.biome);
    var objects = strandedParser.buildObjects(node.Objects);
    grid.push({
        id: extractKeyId(key),
        originalKey: key,
        type: node.biome,
        fullyGenerated: node.fullyGenerated,
        position: {
          x: pos.x,
          y: pos.y,
          z: pos.z,
          height: height
        },
        objects: objects
    });
  }
  return grid;
};


/**
 * construit le noeud objets de la grille
 * @param  {Object} strandedNodesObject noeud Objet de la sauvegarde
 * @return {Array}
 */
strandedParser.buildObjects = function(strandedNodesObject) {
  var objects = [];
  for (var keyO in strandedNodesObject) {
    var strandObject = strandedNodesObject[keyO];
    strandedParser.addStrandedObjectType(strandObject.name);
    var position = normalizeStranded(strandObject.Transform.localPosition);
    var rotation = normalizeStranded(strandObject.Transform.localRotation);
    var scale = normalizeStranded(strandObject.Transform.localScale);
    objects.push({
      originalKey: keyO,
      type: strandedParser.normalizeStrandedObject(strandObject.name),
      position: position,
      rotation: rotation,
      scale: scale
    });
  }
  return objects;
};

/**
 * retourne la grille
* @return {Array}
 */
strandedParser.getGrid = function() {
  return strandedParser.allNodes;
};


/**
 * [addBiomeType description]
 * @param {void} biome
 */
strandedParser.addBiomeType = function(biome) {
  // on regarde si existe deja  avant;
  var found = strandedParser.biomes.some(function(el) {
    return el.type === biome;
  });
  if (!found) { strandedParser.biomes.push({ type: biome }); }
};

/**
 * [addStrandedObjectType description]
 * @param {void} strandedObjectName
 */
strandedParser.addStrandedObjectType = function(strandedObjectName) {
  // on regarde si existe deja  avant;
  var normalizeStrandedObject = strandedParser.normalizeStrandedObject(strandedObjectName);
  var found = strandedParser.strandObjects.some(function(el) {
    return el.type === normalizeStrandedObject;
  });
  if (!found) { strandedParser.strandObjects.push({ type: normalizeStrandedObject }); }
};

/**
 * [normalizeStrandedObject description]
 * @param  {String} strandedObjectName [description]
 * @return {String}                    [description]
 */
strandedParser.normalizeStrandedObject = function(strandedObjectName) {
  var splitc = ']';
  var normalizeStrandedObject = strandedObjectName.split(splitc)[0].replace('(Clone)', '');
  return normalizeStrandedObject;
};

/**
 * [getAllBiomesType description]
 * @return {Object}
 */
strandedParser.getAllBiomesType = function() {
  return strandedParser.biomes;
};



/** @type {Object} Node Export */
module.exports = strandedParser;
