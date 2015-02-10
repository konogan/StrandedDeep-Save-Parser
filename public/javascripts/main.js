
var io = io.connect();


$(function() {
  io.emit('dom ready');

  StrandThree.initThree();
  //initGui();

  // Listen for  events.

  //io.on('showAxis', StrandThree.showAxis);

  io.on('drawGrid', function(gridData) {
    StrandThree.drawGrid(gridData);
  });

  io.on('drawPlayerPath', function(dbData) {
    StrandThree.drawPlayerPath(dbData);
  });

  io.on('drawPlayer', function(data) {
    StrandThree.drawPlayer(data);
  });

});
