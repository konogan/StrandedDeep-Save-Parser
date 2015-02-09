'use strict';
var fs = require('fs');
var strandedParser = {};

/** @type {String} player position */
strandedParser.loadedFile = '';
/** @type {Object} player position */
strandedParser.lastPlayerPos = {};
/** @type {Array} array of player position */
strandedParser.allPlayerPos = [];
/** @type {Array} array of nodes */
strandedParser.allNodes;
/** @type {Array} array of biomeType */
strandedParser.biomes = [];


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
    strandedParser.loadedFile = file;
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
  // playerPositionLocale.x = playerPositionLocale.x * -1;
  var worldPosistion = normalizeStranded(strandedParser.data.TerrainGeneration.WorldOriginPoint);
  strandedParser.lastPlayerPos = addPos(playerPositionLocale, worldPosistion);
  strandedParser.allNodes = strandedParser.buildGrid(strandedParser.data.TerrainGeneration.Nodes);
};


/**
 * Stocke les informations d'une sauvegarde a l'autre
 * @return {void}
 */
strandedParser.keep = function() {

};

/**
 * getPlayerPos
 * @return {Objet}
 */
strandedParser.getPlayerPos = function() {
  return strandedParser.lastPlayerPos;
};

/**
 * Stocke les informations d'une sauvegarde a l'autre
 * @return {void}
 */
strandedParser.getAllPlayerPos = function() {
  // return array coord
};

/**
 * Recupere de la sauvegarde la derniere position connue du joueur
 * @return {void}
 */
strandedParser.getLastPlayerPos = function() {
  // return  coord
};


/**
 * Build grid from stranded nodes datas
 * @param  {Object} strandedNodes from save
 * @return {Array}
 */
strandedParser.buildGrid = function(strandedNodes) {
  //console.log('buildGrid');
  var grid = [];
  for (var key in strandedNodes) {
    var node = strandedNodes[key];
    var pos = normalizeStranded(node.positionOffset);
    strandedParser.addBiomeType(node.biome);
     grid.push({
        id: extractKeyId(key),
        originalKey: key,
        type: node.biome,
        coord: {
          x: pos.x,
          y: pos.y,
          z: pos.z
        }
    });
  }
  return grid;
};

/**
 * retourne la grille
* @return {Array}
 */
strandedParser.getGrid = function() {
  //console.log('getGrid');
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
 * [getAllBiomesType description]
 * @return {Object}
 */
strandedParser.getAllBiomesType = function() {
  //console.log('getAllBiomesType');
  return strandedParser.biomes;
};


/**
 * Stocke les informations d'une sauvegarde a l'autre
 * @return {void}
 */
strandedParser.getAllObjetsFromNode = function() {
  // return array coord
};

/**
 * blabla
 * @param  {String} type
 * @return {Object}
 */
strandedParser.getObjetsFromNode = function(type) {
  // return array coord
  return toto;
};


/** @type {Object} Node Export */
module.exports = strandedParser;