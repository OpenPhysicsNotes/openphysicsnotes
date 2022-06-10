"use strict";

import Two from '/js/two.module.js';

import { Plot, PlotCartesianXYFunc } from '/js/two-utils.mjs';

let elem = document.getElementById('canvas')

let two = new Two({ fitted: true }).appendTo(elem)

let W = two.width;
let H = two.height;





// set the viewBox
//two.setAttribute('viewBox', '0 0 ' + '100' + ' ' + '100')

// set the viewport

//let r = two.makeRectangle(0, 0, 100, 100);

Two.Rectangle;

//let g = two.makeGroup(r);
//g.translation.set(two.width/2, two.height/2);
//g.position.set(two.width / 2 + 100, two.height / 2);
//g.scale = 1;

let P = new Plot(two);
P.add_XY_func(x => Math.sin(x*10*Math.PI)*0.5+0.3);
P.render();
two.add(P);
P.translation.set(50, 50);

two.render();

// set the viebox
two.renderer.domElement.setAttribute('viewBox', '0 0 ' + two.width + ' ' + two.height);
two.renderer.domElement.removeAttribute("width");
two.renderer.domElement.removeAttribute("height");
two.renderer.domElement.setAttribute("width", "100%");
two.renderer.domElement.setAttribute("height", "100%");
//two.renderer.domElement.setAttribute("transform", "scale(1, -1)");


let g2 = two.makeGroup();

two.update();

console.log(g2);
let svgElement = g2._renderer.elem.innerHTML = `
<foreignObject x="0" y="0" width="100" height="100">
  <i-math>c^2</i-math>
</foreignObject>
`;