const { DxfDocument, DxfTextWriter } = require('../../src/dxf');
const fs = require('fs');

const dxf = new DxfDocument();
const writer = new DxfTextWriter();
dxf.writeDxf(writer);
fs.writeFileSync(__dirname + '/example.dxf', writer.text);

