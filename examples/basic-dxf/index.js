const { DxfDrawing } = require('../../src/dxf');
const fs = require('fs');

const dxf = new DxfDrawing(200, 100);
dxf.line(10, 10, 10, 90, {stroke: 'red', 'stroke-dasharray': '2 1'});
dxf.circle(50, 50, 30, {fill: 'cyan'});
dxf.ellipse(120, 50, 30, 20, {stroke: '#0f0'});
fs.writeFileSync(__dirname + '/example.dxf', dxf.dxf());