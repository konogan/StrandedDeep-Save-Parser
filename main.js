var container, stats;
var camera, controls, scene, renderer;
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
  scene.fog = new THREE.FogExp2(0xcccccc, 0.0002);
  // lights
  light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1);
  scene.add(light);

  light = new THREE.DirectionalLight(0x002288);
  light.position.set(-1, -1, -1);
  scene.add(light);


/*
  var aCubeMap = THREE.ImageUtils.loadTextureCube([
    'img/px.jpg',
    'img/nx.jpg',
    'img/py.jpg',
    'img/ny.jpg',
    'img/pz.jpg',
    'img/nz.jpg'
  ]);
  aCubeMap.format = THREE.RGBFormat;
  var aShader = THREE.ShaderLib['cube'];
  aShader.uniforms['tCube'].value = aCubeMap;
  var aSkyBoxMaterial = new THREE.ShaderMaterial({
    fragmentShader: aShader.fragmentShader,
    vertexShader: aShader.vertexShader,
    uniforms: aShader.uniforms,
    depthWrite: false,
    side: THREE.BackSide
  });
  var aSkybox = new THREE.Mesh(new THREE.BoxGeometry(1000000, 1000000, 1000000), aSkyBoxMaterial);
  scene.add(aSkybox);
*/


  light = new THREE.AmbientLight(0x222222);
  scene.add(light);
  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setClearColor(scene.fog.color);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container = document.getElementById('container');
  container.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);
  animate();

  carte.load();
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
