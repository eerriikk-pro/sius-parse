"use strict";
function addShot(x, y, radius = 9, color = "red") {
    const svgElement = document.getElementById("target");
    if (!(svgElement instanceof SVGSVGElement)) {
        console.error("SVG element with id 'target' not found or not an SVGSVGElement");
        return;
    }
    const shot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    shot.setAttribute("cx", x.toString());
    shot.setAttribute("cy", y.toString());
    shot.setAttribute("r", radius.toString());
    shot.setAttribute("fill", color);
    shot.setAttribute("stroke", "black");
    shot.setAttribute("stroke-width", "0.5");
    svgElement.appendChild(shot);
}
function addShotCentre(dx, dy, radius = 9, color = "red") {
    dx = dx * 4;
    dy = dy * -4;
    addShot(100 + dx, 100 + dy, radius, color);
}
const shots = [
    { dx: -4.65472, dy: 4.10962 },
    { dx: 8.16152, dy: -1.0812 },
    { dx: -9.19364, dy: -5.26564 },
    { dx: -1.18633, dy: 2.40555 },
    { dx: -0.90808, dy: -4.99305 },
    { dx: -1.72859, dy: -1.56988 },
    { dx: -0.36661, dy: -0.41163 },
    { dx: -6.23595, dy: 1.3263 },
    { dx: -0.24518, dy: 3.62145 },
    { dx: -6.02971, dy: 1.27822 },
    // { dx: 0, dy: 0 },
    // { dx: 0.59548, dy: 2.04661 },
];
for (const shot of shots) {
    addShotCentre(shot.dx, shot.dy);
}
