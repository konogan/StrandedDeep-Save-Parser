'use strict';
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var moment = require('moment');
var Datastore = require('nedb');
var db = new Datastore({ filename: 'data/data.json', autoload: true });


var Parser = function(config) {
    var debug = true;
    var ev = new EventEmitter();
    var self = this;
    var config;
    var saveFile;
    var strandedParser = {
      config: config,
      biomes: [],
      objects: []
    };

    var init = function(config) {
      config = config;
      saveFile = config.saveFolder + config.saveFile;

      // listeners module
       ev.on('loadFile', function() {
           console.log('Parser : loadFile ');
           _loadFile();
       });

       ev.on('fileLoaded', function() {
           console.log('Parser : fileLoaded ');
           _extractData();
       });

       ev.on('dataExtracted', function() {
           console.log('Parser : dataExtracted ');
           _insertIfPositionAsChanged();
       });

      fs.watchFile(saveFile, function(curr, prev) {
        if (
          curr.mtime.valueOf() != prev.mtime.valueOf() ||
          curr.ctime.valueOf() != prev.ctime.valueOf())
          {
            console.log('watch');
           ev.emit('loadFile');
          }
        });
    };

   /**
    * Process
    */
   var _extractData = function() {
        strandedParser.pLocPos = _normalizedPosition(strandedParser.data.PlayerMovement.Transform.localPosition);
        strandedParser.pLocPos.z = strandedParser.pLocPos.z * -1;
        strandedParser.wLocPos = _normalizedPosition(strandedParser.data.TerrainGeneration.WorldOriginPoint);
        strandedParser.wLocPos.x = strandedParser.wLocPos.x * -1;
        strandedParser.grid = _buildGrid(strandedParser.data.TerrainGeneration.Nodes);
        ev.emit('dataExtracted');
   };

   /**
    * Save the last position in database if new
    * and after set the list of positions
    */
   var _insertIfPositionAsChanged = function() {
    var doInsert = false;
     db.findOne({}).sort({ saveTime: -1 }).exec(
        function(err, dbval) {
          if (dbval) {
            if (!_identicalPos(dbval.player.position, strandedParser.pLocPos) ||
              !_identicalPos(dbval.world.position, strandedParser.wLocPos)) {
              doInsert = true;
            }
          }
          else {
            doInsert = true;
          }
          if (doInsert) {
             console.log('position as changed or new save');
              var saveDb = {
                saveTime: strandedParser.loadedFileTime,
                player: {
                  position: strandedParser.pLocPos
                },
                world: {
                  position: strandedParser.wLocPos
                }
              };
              db.insert(saveDb, function(err, newDoc) {
                _setAllPlayerPosFromDb();
              });
          }
          else {
            _setAllPlayerPosFromDb();
          }
      });
   };

   /**
    * Verifies if two positions are identical
    * @param  {Object} pos1
    * @param  {Object} pos2
    * @return {[Bool}
    */
  var _identicalPos = function(pos1, pos2) {
    if (pos1.x === pos2.x &&
        pos1.y === pos2.y &&
        pos1.z === pos2.z
      ) {
      return true;
    }
  };

    /**
     * Retrieve and set all positions of player
     */
    var _setAllPlayerPosFromDb = function() {
      db.find({}).sort({ saveTime: 1 }).exec(
        function(err, dbval) {
         strandedParser.allPlayersPosFromDb = dbval;
         ev.emit('pathExtracted');
      });
    };

    /**
     * Return all positions of the player
     * @return {Array} array of position
     */
    var _getAllPlayerPosFromDb = function() {
      return strandedParser.allPlayersPosFromDb;
    };

   /**
    * Parse and load  nodes from save
    * @param  {Object} strandedNodes Node from save
    * @return {Array}
    */
   var _buildGrid = function(strandedNodes) {
    var grid = [];
    for (var key in strandedNodes) {
      var node = strandedNodes[key];
      var pos = _normalizedPosition(node.positionOffset);
      var height = _removeStrandType(node.heightValue);
      _addBiomeType(node.biome);
      var objects = _buildObjects(node.Objects);
      grid.push({
          id: _extractKeyId(key),
          originalKey: key,
          type: node.biome,
          fullyGenerated: node.fullyGenerated,
          position: {
            x: pos.x * -1,
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
    * Parse and load the objects from save
    * @param  {Object} strandedNodesObject Objects from node;
    * @return {Array}
    */
   var _buildObjects = function(strandedNodesObject) {
      var objects = [];
      for (var keyO in strandedNodesObject) {
        var strandObject = strandedNodesObject[keyO];
        _addStrandedObjectType(strandObject.name);
        var pos = _normalizedPosition(strandObject.Transform.localPosition);
        pos.x = pos.x;
        pos.z = pos.z * -1;
        objects.push({
          originalKey: keyO,
          type: _normalizeStrandedObject(strandObject.name),
          position: pos,
          rotation: _normalizedRotation(strandObject.Transform.localRotation),
          scale: _normalizedScale(strandObject.Transform.localScale)
        });
      }
      return objects;
    };

    /**
     * Load The save file
     */
    var _loadFile = function() {
      fs.readFile(saveFile, 'utf8', function(err, data) {
          if (err) {
            console.log('Error: ' + err);
          return;
        }
        var stats = fs.statSync(saveFile);
        var date = moment(stats.mtime);
        strandedParser.loadedFile = saveFile;
        strandedParser.loadedFileTime = date.format('x');
        strandedParser.data = JSON.parse(data).Persistent;
        ev.emit('fileLoaded');
      });
    };

    /**
     * Remove unity type
     * @param  {String} strandString
     * @return {Int}
     */
    var _removeStrandType = function(strandString) {
      return strandString.substr(2) * 1;
    };

    /**
     * Remove type and convert world axis position
     * @param  {Object} strandPos
     * @return {Object}
     */
    var _normalizedPosition = function(strandPos) {
      var normPos = {
        x: _removeStrandType(strandPos.x) ,
        y: _removeStrandType(strandPos.y),
        z: _removeStrandType(strandPos.z)
      };
      return normPos;
    };

    /**
     * Remove type
     * @param  {Object} strandRot
     * @return {Object}
     */
    var _normalizedRotation = function(strandRot) {
      var normRot = {
        w: _removeStrandType(strandRot.w),
        x: _removeStrandType(strandRot.x),
        y: _removeStrandType(strandRot.y),
        z: _removeStrandType(strandRot.z)
      };
      return normRot;
    };

    /**
     * Remove type
     * @param  {Object} strandScale
     * @return {Object}
     */
    var _normalizedScale = function(strandScale) {
      var normScale = {
        x: _removeStrandType(strandScale.x),
        y: _removeStrandType(strandScale.y),
        z: _removeStrandType(strandScale.z)
      };
      return normScale;
    };


    /**
     * Add biome type to collection
     * @param {String} biome
     */
    var _addBiomeType = function(biome) {
      var found = strandedParser.biomes.some(function(el) {
        return el.type === biome;
      });
      if (!found) { strandedParser.biomes.push({ type: biome }); }
    };

    /**
     * Add Object type to collection
     * @param {String} strandedObjectName
     */
    var _addStrandedObjectType = function(strandedObjectName) {
      var normalizeStrandedObject = _normalizeStrandedObject(strandedObjectName);
      var found = strandedParser.objects.some(function(el) {
        return el.type === normalizeStrandedObject;
      });
      if (!found) { strandedParser.objects.push({ type: normalizeStrandedObject }); }
    };

    /**
     * Normalize Strand Object Type
     * @param  {String} strandedObjectName
     * @return {String}
     */
    var _normalizeStrandedObject = function(strandedObjectName) {
      var splitc = ']';
      var normalizeStrandedObject = strandedObjectName.split(splitc)[0].replace('(Clone)', '');
      return normalizeStrandedObject;
    };

    /**
     * Return all BiomeTypes
     * @return {Array}
     */
    var _getAllBiomesType = function() {
      return strandedParser.biomes;
    };

    /**
     * Return all ObjectTypes
     * @return {Array}
     */
    var _getAllObjetcsType = function() {
      return strandedParser.objects;
    };

    /**
     * Return all the grid
     * @return {Array}
     */
    var _getGrid = function() {
      return strandedParser.grid;
    };


    /**
     * nettoie la clef StrandedDeep
     * @param  {String} strandedKey
     * @return {String}
     */
    var _extractKeyId = function(strandedKey) {
      var numb = strandedKey.match(/\d/g);
      numb = numb.join('');
      return numb;
    };



    //return object / expose functions
    return {
      init: init,
      getAllObjetcsType: _getAllObjetcsType,
      getAllBiomesType: _getAllBiomesType,
      getPlayerPath: _getAllPlayerPosFromDb,
      getGrid: _getGrid,
      ev: ev
    };
};

/** we specify that this module is a refrence to the Parser class*/
module.exports = Parser;
