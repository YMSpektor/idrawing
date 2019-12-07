const { DxfDrawing } = require('../../src/dxf');
const fs = require('fs');

const dxf = new DxfDrawing(200, 100);
dxf.line(10, 10, 10, 90, {stroke: 'red', 'stroke-dasharray': '2 1'});
fs.writeFileSync(__dirname + '/example.dxf', dxf.dxf());