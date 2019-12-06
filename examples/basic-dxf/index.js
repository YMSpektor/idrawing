const { DxfDocument, DxfTextWriter } = require('../../src/dxf');
const { Line } = require('../../src/dxf/entities');

const fs = require('fs');

const dxf = new DxfDocument();
dxf.addEntity(
    new Line(dxf, 10, 10, 100, 100)
);
const writer = new DxfTextWriter();
dxf.writeDxf(writer);
fs.writeFileSync(__dirname + '/example.dxf', writer.text);

