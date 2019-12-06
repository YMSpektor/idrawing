const { SvgDrawing } = require('../../src/svg');
const fs = require('fs');

function draw(drawing) {
  const region = drawing.createRegion();
  region.include((r) => {
    r.circle(50, 50, 40);
    r.circle(90, 70, 40);
  });
  region.exclude((r) => 
    r.circle(70, 60, 10)
  );
  drawing.region(region, {fill: 'red'});
  const paths = region.outline();
  paths.forEach(path => drawing.path(path, {stroke: '#000', fill: 'none'}));
}

const svg = new SvgDrawing();
draw(svg);
fs.writeFileSync(__dirname + '/example.svg', svg.toString());