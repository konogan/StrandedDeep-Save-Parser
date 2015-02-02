var Carte = function() {

    var saveName = './datas/Save 6.json';
    // var saveName = '/Users/konogan.cossec/Library/Application Support/Steam/steamapps/common/Stranded Deep/Stranded_Deep_x64.app/Contents/Data/Save.json';
    var carte = {};
    carte.onlyIsland = false;
    carte.showInfos = false;
    carte.tileSize = 256;
    carte.scale = 0.1;
    carte.jsonFromSave;
    carte.objArray = [];
    carte.TerrainGenerationNodes = {};
    carte.camPos = {};

    carte.load = function() {
      self = this;
      var jqxhr = $.getJSON(saveName, function(data) {
        carte.jsonFromSave = data.Persistent;
        parseDatas();
      })
      .fail(function(error) {
        console.log('error : \'' + saveName + '\' ->' + error.statusText);
      });
    };

    carte.debug = function() {

      var length = 256 * carte.scale;
      var axis = new THREE.Object3D();
      axis.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0), 0xFF0000, false)); // +X
      axis.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-length, 0, 0), 0xFF0000, true)); // -X
      axis.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, length, 0), 0x00FF00, false)); // +Y
      axis.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -length, 0), 0x00FF00, true)); // -Y
      axis.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, length), 0x0000FF, false)); // +Z
      axis.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -length), 0x0000FF, true)); // -Z
      scene.add(axis);
    };

     carte.buildNodes = function() {
      for (key in carte.TerrainGenerationNodes) {

        node = carte.TerrainGenerationNodes[key];
        var geo = new THREE.BoxGeometry(256 , 256 , 256);
        var mat = getMat(node.biome);
        var tile = new THREE.Mesh(geo, mat);

        var position = normalizeStranded(node.position);
        var positionOffset = normalizeStranded(node.positionOffset);
        var pos = pos2Three(positionOffset);

        tile.scale.x = carte.scale;
        tile.scale.y = carte.scale;
        tile.scale.z = carte.scale;

        tile.position.x = pos.x;
        tile.position.y = pos.y;
        tile.position.z = pos.z;
        scene.add(tile);
        buildObjects(node.Objects, node.positionOffset);
      }
    };

    carte.moveCam = function() {
      camera.lookAt(new THREE.Vector3(carte.camPos.x, carte.camPos.y, carte.camPos.y));
      animate();
    };

    var parseDatas = function() {
      carte.TerrainGenerationNodes = carte.jsonFromSave.TerrainGeneration.Nodes;
      carte.buildNodes(carte.TerrainGenerationNodes);

      playerPositionLocale = normalizeStranded(carte.jsonFromSave.PlayerMovement.Transform.localPosition);
      worldPosistion = normalizeStranded(carte.jsonFromSave.TerrainGeneration.WorldOriginPoint);
      playerPosition = addPos(playerPositionLocale, worldPosistion);
      carte.camPos = pos2Three(playerPosition);


      placePlayer(playerPosition);

    };

    var placeworldPosistion = function(worldPosistion) {
      placeMarker(worldPosistion, 'white');
    };

    var placePlayer = function(playerPosition) {
      placeMarker(playerPosition, 'red');
      carte.moveCam();

      var oldPlayerPosition;
      var pos = playerPosition;
      var playerHasMoved = function() {
        oldPlayerPosition = JSON.parse(localStorage.getItem('playerPosition'));
        var hasMoved = false;
        if (oldPlayerPosition === null) {
          localStorage.setItem('playerPosition', JSON.stringify(pos));
        }
        else {
          if (pos.x !== oldPlayerPosition.x ||
            pos.y !== oldPlayerPosition.y ||
            pos.z !== oldPlayerPosition.z) {
            hasMoved = true;
            localStorage.setItem('playerPosition', JSON.stringify(pos));
          }
        }
        return hasMoved;
      };
      if (playerHasMoved()) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(pos.x, pos.y + 256 , pos.z));
        geometry.vertices.push(new THREE.Vector3(oldPlayerPosition.x, oldPlayerPosition.y + 256, oldPlayerPosition.z));
        var material = new THREE.LineBasicMaterial({color: 0xff0000});
        var line = new THREE.Line(geometry, material);
        scene.add(line);
      }
    };



    var placeMarker = function(strandedPos, color) {
      var geo = new THREE.BoxGeometry(.2, 10, .2);
      var mat = new THREE.MeshBasicMaterial({color: color});
      var marker = new THREE.Mesh(geo, mat);
      var pos = pos2Three(strandedPos);
      marker.position.x = pos.x;
      marker.position.y = pos.y + 256 * carte.scale;
      marker.position.z = pos.z;
      scene.add(marker);
    };

    var buildObjects = function(nodeObjects, nodePos) {
      for (key in nodeObjects) {
        obj = nodeObjects[key];

        switch (true) {
          case key.indexOf('SHIPWRECK') != -1:
            buildObject('SHIPWRECK', obj, nodePos);
            break;
          case key.indexOf('SHARK') != -1:
            buildObject('SHARK', obj, nodePos);
            break;
          case key.indexOf('MARLIN') != -1:
            buildObject('SHARK', obj, nodePos);
            break;
          case key.indexOf('SARDIN') != -1:
            buildObject('SHARK', obj, nodePos);
            break;
          case key.indexOf('WHALE') != -1:
            buildObject('WHALE', obj, nodePos);
            break;
          case key.indexOf('PALM_TREE') != -1:
            buildObject('PALM_TREE', obj, nodePos);
            break;
          case key.indexOf('COCONUT') != -1:
            buildObject('COCONUT', obj, nodePos);
            break;
          case key.indexOf('ENGINE') != -1:
            buildObject('ENGINE', obj, nodePos);
            break;
          case key.indexOf('FOUNDATION') != -1:
            buildObject('FOUNDATION', obj, nodePos);
            break;
          case key.indexOf('STICK') != -1:
            buildObject('STICK', obj, nodePos);
            break;
          case key.indexOf('RAFT') != -1:
            buildObject('RAFT', obj, nodePos);
            break;
          default:
            carte.objArray.push(key);
            //alert('default');
        }
      }
    };

    var buildObject = function(type, strandedObject, nodePos) {
      var threeObj = getObj(type);

      var pos = pos2Three(addPos(normalizeStranded(strandedObject.Transform.localPosition), normalizeStranded(nodePos)));

      threeObj.position.x = pos.x;
      threeObj.position.y = pos.y;
      threeObj.position.z = pos.z;

      threeObj.scale.x = carte.scale;
      threeObj.scale.y = carte.scale;
      threeObj.scale.z = carte.scale;

      var localRotation = normalizeStranded(strandedObject.Transform.localRotation);

      threeObj.rotation.x = localRotation.x;
      threeObj.rotation.y = localRotation.y;
      threeObj.rotation.z = localRotation.z;
      scene.add(threeObj);
    };

    var pos2Three = function(strandedPos) {
      return {
        x: strandedPos.x * carte.scale,
        y: strandedPos.y * carte.scale,
        z: strandedPos.z * carte.scale
      };
    };

    var normalizeStranded = function(strandedPos) {
       return {
        x: strandedPos.x.substr(2) * 1,
        y: strandedPos.y.substr(2) * 1,
        z: strandedPos.z.substr(2) * 1
      };
    };

    var addPos = function(posOne, posTwo) {
      return {
        x: parseInt(posOne.x * 1 + posTwo.x * 1),
        y: parseInt(posOne.y * 1 + posTwo.y * 1),
        z: parseInt(posOne.z * 1 + posTwo.z * 1)
      };
    };

    var getObj = function(meshType) {
      switch (meshType) {
        case 'SHARK' :
          var mesh = new THREE.CylinderGeometry(0, 4 , 4 , 4 , false);
          var mat = new THREE.MeshBasicMaterial({color: 'white'});
          break;
        case 'WHALE' :
          var mesh = new THREE.CylinderGeometry(0, 10 , 10 , 10 , false);
          var mat = new THREE.MeshBasicMaterial({color: 'black'});
          break;

        case 'SHIPWRECK' :
          var mesh = new THREE.BoxGeometry(10, 10, 10);
          var mat = new THREE.MeshBasicMaterial({color: 'yellow', wireframe: false, opacity: .8, transparent: true});
          break;
        case 'PALM_TREE' :
          var mesh = new THREE.BoxGeometry(1 , 8 , 1);
          var mat = new THREE.MeshBasicMaterial({color: 'green'});
          break;
        case 'FOUNDATION' :
          var mesh = new THREE.BoxGeometry(2 , 3 , 2);
          var mat = new THREE.MeshBasicMaterial({color: 'grey', wireframe: true});
          break;
        case 'STICK' :
          var mesh = new THREE.BoxGeometry(.3 , .3 , 2);
          var mat = new THREE.MeshBasicMaterial({color: 'grey'});
          break;
        case 'COCONUT' :
          var mesh = new THREE.SphereGeometry(.5, .5, .5);
          var mat = new THREE.MeshBasicMaterial({color: 'green'});
          break;
        case 'ENGINE' :
          var mesh = new THREE.SphereGeometry(.1, .1, .1);
          var mat = new THREE.MeshBasicMaterial({color: 'orange'});
          break;
         case 'RAFT' :
          var mesh = new THREE.TorusGeometry(2, .5);
          var mat = new THREE.MeshBasicMaterial({color: 'red'});
          break;
        default :
          var mesh = new THREE.BoxGeometry(1, 1, 1);
          var mat = new THREE.MeshBasicMaterial({color: 'black'});
      }
      var threeObj = new THREE.Mesh(mesh, mat);
      return threeObj;
    };

    var buildAxis = function(src, dst, colorHex, dashed) {
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
    };

    var getMat = function(biomeString) {
      if (carte.onlyIsland) {
         switch (biomeString) {
          case 'ISLAND':
              colorTex = 0xF2F5A9;
              opacity = .7;
              transparent = true;
              break;
          default:
              colorTex = 0x2E2EFE;
               opacity = 0.5;
              transparent = true;
          }
      }
      else {
        switch (biomeString) {
          case 'ISLAND':
              colorTex = 0xF2F5A9;
              opacity = .5;
              transparent = true;
              break;
          case 'BARREN':
              colorTex = 0xA5DF00;
              opacity = 0.5;
              transparent = true;
              break;
          case 'DEEP_SEA':
              colorTex = 0x2E2EFE;
              opacity = 0.5;
              transparent = true;
              break;
          case 'SAND_PLAINS':
              colorTex = 0xEFFBF8;
              opacity = 0.5;
              transparent = true;
              break;
          case 'SHALLOW_SAND_PLAINS':
              colorTex = 0xF5F6CE;
              opacity = 0.5;
              transparent = true;
              break;
          default:
              colorTex = 0xffffff;
              opacity = 0.2;
              transparent = true;
          }
      }
      return new THREE.MeshBasicMaterial({
        wireframe: false,
        color: colorTex,
        opacity: opacity,
        transparent: transparent
      });

    };

    return carte;
};
