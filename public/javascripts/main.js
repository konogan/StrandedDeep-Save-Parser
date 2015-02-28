var io = io.connect();

io.on('setObjects', function(Objects) {
    console.log('setObjects', Objects);
});

io.on('setBiomes', function(Biomes) {
    console.log('setBiomes', Biomes);
});

io.on('setGrid', function(Grid) {
  console.log('setGrid');
  StrandThree.drawGrid(Grid);
});

io.on('setPlayerPath', function(Path) {
  console.log('setPlayerPath');
  StrandThree.drawPlayerPath(Path);
});

$(function() {
  io.emit('DOM_READY');
  StrandThree.initThree();

});
