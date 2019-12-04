import { SvgDrawing } from "../../src/svg";
import { Alignment, Geometry } from "../../src";

const svg = new SvgDrawing();
svg.addStyle('line { stroke: black; }');
svg.addStyle('rect { stroke: black; }');
svg.addPattern('<pattern id="clay" x="0" y="0" width="10" height="5" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse"><line x1="0" y1="1" x2="10" y2="1"/></pattern>');
/*
const region = svg.createRegion();
region.include((r) => {
    r.circle(50, 50, 40);
    r.circle(90, 70, 40);
});
region.exclude((r) => r.circle(70, 60, 10));
svg.region(region, {fill: 'url(#clay)'});
*/

/*
svg.curve([
    {x: 50, y: 150},
    {x: 100, y: 100},
    {x: 170, y: 150},
    {x: 100, y: 200}
], true, 0.25, {fill: 'url(#clay)', stroke: '#000'});
*/
const path = svg.createPath();
path.move(300, 300);
path.curve([
    {x: 350, y: 200},
    {x: 400, y: 300}
], 0.25);
const region = svg.createRegion();
region.include((r) => {
    r.closedCurve([
        {x: 50, y: 150},
        {x: 100, y: 100},
        {x: 170, y: 150},
        {x: 100, y: 200}
    ]);
    r.rect(10, 10, 100, 100);
    r.ellipse(90, 40, 50, 20);
    r.path(path);
});
region.exclude((r) => r.circle(40, 40, 10));
const paths = region.outline();
svg.region(region, {fill: 'url(#clay)'});
//svg.path(path, {stroke: '#000', fill: 'none'});
paths.forEach(path => svg.path(path, {stroke: '#000', fill: 'none'}));

console.log(svg.toString());