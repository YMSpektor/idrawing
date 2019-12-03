import { SvgDrawing } from "../../src/svg";
import { Alignment } from "../../src";

const svg = new SvgDrawing();
svg.addStyle('line { stroke: black; }');
svg.addStyle('rect { stroke: black; }');
svg.addPattern('<pattern id="clay" x="0" y="0" width="10" height="5" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse"><line x1="0" y1="1" x2="10" y2="1"/></pattern>');
const region = svg.createRegion();
region.include((r) => {
    r.circle(50, 50, 40);
    r.circle(90, 70, 40);
});
region.exclude((r) => r.circle(70, 60, 10));
svg.region(region, {fill: 'url(#clay)'});

console.log(svg.toString());