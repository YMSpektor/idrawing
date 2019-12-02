export { Attributes } from "./common/attributes";
export { Point } from "./common/point";
export { Alignment } from "./common/alignment";
export { Region, RegionData } from "./common/region";

export { IDrawing } from "./idrawing";


import { SvgDrawing } from "./svg";
import { Alignment } from "./common/alignment";

const svg = new SvgDrawing();
svg.text('test', 10, 10, Alignment.MIDDLE, {class: 'test'});

console.log(svg.toString());