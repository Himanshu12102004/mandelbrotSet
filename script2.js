const gui = new dat.GUI();
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const fx = math.evaluate("f(x,c)=x^2+c");
canvas.height = innerHeight;
canvas.width = innerWidth;
const mouse = {
  x: { position: 0, coord: -canvas.width / 2 },
  y: { position: 0, coord: +canvas.width / 2 },
};

let quad1 = [];
let quad3 = [];

let quad2 = [];
let quad4 = [];
let density = 5;

let points = [];
ctx.fillStyle = "black";
ctx.fillRect(0, 0, innerWidth, innerHeight);
ctx.strokeStyle = "red";
ctx.moveTo(0, innerHeight / 2);
ctx.lineTo(innerWidth, innerHeight / 2);
ctx.stroke();
ctx.beginPath();
ctx.moveTo(innerWidth / 2, 0);
ctx.lineTo(innerWidth / 2, innerHeight);
ctx.stroke();
let calcScale =
  innerWidth > innerHeight ? innerHeight / 2 - 50 : innerWidth / 2 - 50;
const scale = { x: calcScale, y: calcScale };
const drawingSpecifics = { iterations: 100 };
let scaleFolder = gui.addFolder("scale");
let iterationFolder = gui.addFolder("iterations");
iterationFolder.open();
const iterationsField = iterationFolder.add(
  drawingSpecifics,
  "iterations",
  10,
  300
);
iterationsField.onChange(() => {
  calc();
});
scaleFolder.add(scale, "x", 50, 500);
scaleFolder.add(scale, "y", 50, 500);
scaleFolder.open();
window.addEventListener("mousemove", (e) => {
  mouse.x.position = e.clientX;
  mouse.y.position = e.clientY;

  mouse.x.coord = e.clientX - canvas.width / 2;
  mouse.y.coord = -e.clientY + canvas.height / 2;
  document.querySelector(".mouseCoord").style.top =
    mouse.y.position + 10 + "px";
  document.querySelector(".mouseCoord").style.left =
    mouse.x.position + 10 + "px";

  document.querySelector(".real").textContent =
    (mouse.x.coord / scale.x <= 0 ? "" : "+") +
    (mouse.x.coord / scale.x).toFixed(3);

  document.querySelector(".imaginary").textContent =
    (mouse.y.coord / scale.y <= 0 ? "" : "+") +
    (mouse.y.coord / scale.y).toFixed(3) +
    "i";
  calc();
});

class Ellipse {
  constructor(coords, radius, color) {
    this.position = { x: null, y: null };
    this.coords = { x: null, y: null };
    this.coords.x = coords.re;
    this.coords.y = coords.im;
    this.position.x = this.coords.x * scale.x + canvas.width / 2;
    this.position.y = -this.coords.y * scale.y + canvas.height / 2;
    this.radiusX = radius * scale.x;
    this.radiusY = radius * scale.y;
    this.radius = radius;
    this.color = color;
  }
  update() {
    this.coords.x = (this.position.x - canvas.width / 2) / scale.x;
    this.coords.y = (-this.position.y + canvas.height / 2) / scale.y;
    this.radiusX = this.radius * scale.x;
    this.radiusY = this.radius * scale.y;
    this.draw();
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(
      this.position.x,
      this.position.y,
      this.radiusX,
      this.radiusY,
      0,
      0,
      Math.PI * 2,
      true
    );
    ctx.stroke();
    ctx.fill();
  }
}
class Circle {
  constructor(coords, radius, color) {
    this.position = { x: null, y: null };
    this.coords = { x: null, y: null };
    this.coords.x = coords.re;
    this.coords.y = coords.im;
    this.position.x = this.coords.x * scale.x + canvas.width / 2;
    this.position.y = -this.coords.y * scale.y + canvas.height / 2;
    this.radius = radius * scale.x;
    this.staticRadius = radius;
    this.color = color;
  }
  update() {
    this.coords.x = (this.position.x - canvas.width / 2) / scale.x;
    this.coords.y = (-this.position.y + canvas.height / 2) / scale.y;
    this.radius = (this.staticRadius * (scale.y + scale.x)) / 2;
    this.draw();
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2,
      true
    );
    ctx.stroke();
    ctx.fill();
  }
}

const unitCircle = new Ellipse({ re: 0, im: 0 }, 1, "rgba(0,0,0,0)");
unitCircle.update();
const mouseCircle = new Circle({ re: 0, im: 0 }, 0.02, "red");
const startCircle = new Circle({ re: 0, im: 0 }, 0.02, "red");

points.push(startCircle);
mouseCircle.update();
function animate() {
  requestAnimationFrame(animate);

  makeGrid();
  mouseCircle.position.x = mouse.x.position;
  mouseCircle.position.y = mouse.y.position;
  mouseCircle.update();
  for (let i = 0; i < quad1.length; i++) {
    for (let j = 0; j < quad1[0].length; j++) {
      quad1[i][j].update();
      quad3[i][j].update();
      quad2[i][j].update();
      quad4[i][j].update();
    }
  }
  points.forEach((elem, index, array) => {
    elem.update();
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.moveTo(elem.position.x, elem.position.y);
    if (index != array.length - 1)
      ctx.lineTo(array[index + 1].position.x, array[index + 1].position.y);
    ctx.stroke();
  });
}
// layGridPoins();
animate();
function makeGrid() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, innerWidth, innerHeight);
  ctx.strokeStyle = "red";
  ctx.moveTo(0, innerHeight / 2);
  ctx.lineTo(innerWidth, innerHeight / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(innerWidth / 2, 0);
  ctx.lineTo(innerWidth / 2, innerHeight);
  ctx.stroke();

  for (
    let i = innerWidth / 2 + scale.x, j = innerWidth / 2 - scale.x;
    i <= innerWidth;
    j -= scale.x, i += scale.x
  ) {
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, innerHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(j, 0);
    ctx.lineTo(j, innerHeight);
    ctx.stroke();
  }
  for (
    let i = innerHeight / 2 + scale.y, j = innerHeight / 2 - scale.y;
    i <= innerWidth;
    j -= scale.y, i += scale.y
  ) {
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(innerWidth, i);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(innerWidth, j);
    ctx.stroke();
  }
  ctx.strokeStyle = "green";
  unitCircle.update();
}
function calc() {
  const start = { x: 0, y: 0 };
  let complexA = math.complex(mouseCircle.coords.x, mouseCircle.coords.y);
  let complexX = math.complex(start.x, start.y);
  startCircle.coords.x = start.x;
  startCircle.coords.y = start.y;
  points.splice(1, points.length - 1);
  for (let i = 0; i < drawingSpecifics.iterations; i++) {
    let complexTempX = fx(complexX, complexA);
    complexX = complexTempX;
    points.push(
      new Circle(complexX, (points[i].radius * 0.95) / scale.x, "white")
    );
  }
  // for (let i = 1; i < 100; i++) {
  //   if (
  //     points[i].coords.x == points[i + 1].coords.x &&
  //     points[i].coords.y == points[i + 1].coords.y
  //   ) {
  //     console.log(points[i].coords);
  //     break;
  //   }
  // }
}
function analyzeConvergence(distanceArray, tolerance) {
  const n = distanceArray.length;

  if (n === 0) {
    // No data, cannot determine convergence
    return "No data";
  }

  // Check if the distance array stabilizes
  const stabilized = distanceArray
    .slice(-3)
    .every((d, i, arr) => Math.abs(d - arr[0]) < tolerance);

  if (stabilized) {
    // Converges to a stable value
    return "Converges to " + distanceArray[n - 1];
  }

  // Check if the distance array oscillates
  const oscillates = distanceArray
    .slice(-3)
    .every((d, i, arr) => i % 2 === 0 && Math.abs(d - arr[0]) < tolerance);

  if (oscillates) {
    // Oscillates
    return "Oscillates";
  }

  // If it hasn't converged or oscillated, it diverges
  return "Diverges";
}
function distanceFormula(coord1, coord2) {
  return Math.sqrt(
    Math.pow(coord1.re - coord2.re, 2) + Math.pow(coord1.im - coord2.im, 2)
  );
}
function layGridPoins() {
  for (let i = 0; i <= canvas.width / (2 * scale.x); i += 1 / density) {
    let quad1Row = [];
    let quad3Row = [];
    for (let j = 0; j <= canvas.height / (2 * scale.y); j += 1 / density) {
      const circle1 = new Circle({ re: i, im: j }, 0.01, "white");
      quad1Row.push(circle1);

      const circle2 = new Circle({ re: -i, im: -j }, 0.01, "white");
      quad3Row.push(circle2);
    }
    quad1.push(quad1Row);
    quad3.push(quad3Row);
  }
  for (let i = 0; i >= -canvas.width / (2 * scale.x); i -= 1 / density) {
    let quad2Row = [];
    let quad4Row = [];
    for (let j = 0; j <= canvas.height / (2 * scale.y); j += 1 / density) {
      const circle1 = new Circle({ re: i, im: j }, 0.01, "white");
      quad2Row.push(circle1);

      const circle2 = new Circle({ re: -i, im: -j }, 0.01, "white");
      quad4Row.push(circle2);
    }
    quad2.push(quad2Row);
    quad4.push(quad4Row);
  }
}
document.querySelector(".real").textContent =
  (mouse.x.coord / scale.x <= 0 ? "" : "+") +
  (mouse.y.coord / scale.y).toFixed(3);

document.querySelector(".imaginary").textContent =
  (mouse.y.coord / scale.y <= 0 ? "" : "+") +
  (mouse.y.coord / scale.y).toFixed(3) +
  "i";
