var container, stats;
var camera, controls, scene, renderer, controls;
var carte = Carte();

$(function() {
  init();
  //console.log(carte);
});


function init() {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(200, 200, 100);
  camera.lookAt(new THREE.Vector3(0, 0, 0));


  controls = new THREE.OrbitControls(camera);
  controls.damping = 0.2;
  controls.addEventListener('change', render);
  scene = new THREE.Scene();

  //scene.fog = new THREE.FogExp2(0xcccccc, 0.0002);

  // lights
  light = new THREE.PointLight(0xffffff);
  light.position.set(0, 250, 0);
  scene.add(light);

  var imagePrefix = 'img/';
  var directions = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
  var imageSuffix = '.jpg';
  var skyGeometry = new THREE.CubeGeometry(5000, 5000, 5000);
  light = new THREE.AmbientLight(0x222222);
  scene.add(light);

  var materialArray = [];
  for (var i = 0; i < 6; i++)
    materialArray.push(new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture(imagePrefix + directions[i] + imageSuffix),
      side: THREE.BackSide
    }));
  var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
  skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
  scene.add(skyBox);


  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: false });
  // renderer.setClearColor(scene.fog.color);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container = document.getElementById('container');
  container.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);
  animate();

  carte.load();
  carte.debug();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

function render() {
  renderer.render(scene, camera);
}
