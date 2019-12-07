# idrawing
Provides a common abstract interface for drawing. The resulting format depends on the chosen interface implementation (currently only SVG format is supported, DXF is planned).

## Operations
The following operations are supported:
* line
* rect
* circle
* ellipse
* polyline
* polygon
* polybezier
* curve (draws a smooth curve through all given points. The curve can be closed)
* text
* region (represents a fill area by combining multiple closed shapes)
* path (represents a complex shape by combining straingt or curved lines)

## Quickstart
```javascript
const { SvgDrawing } = require('idrawing/svg');
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
  paths.forEach(path => svg.path(path, {stroke: '#000', fill: 'none'}));
}

const svg = new SvgDrawing();
draw(svg);
fs.writeFileSync(__dirname + '/example.svg', svg.svg());
```
### example.svg
<img src="./examples/basic-svg/example.svg">

## Authors
* Yuri Spektor