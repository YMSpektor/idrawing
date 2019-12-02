import { SvgDrawing } from "../../src/svg";
import { Alignment } from "../../src";

const svg = new SvgDrawing();
svg.text('test', 10, 10, Alignment.MIDDLE, {class: 'test'});

console.log(svg.toString());