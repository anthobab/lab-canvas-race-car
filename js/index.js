const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
class Route {
  constructor(image) {
    this.x = 0;
    this.y = 0;
    this.image = new Image();
    this.image.src = image;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, canvas.width, canvas.height);
    // ctx.drawImage(
    //   this.image,
    //   this.x,
    //   this.y - canvas.height,
    //   canvas.width,
    //   canvas.height
    // );
  }

  move() {
    // if (this.y >= canvas.height) {
    // 	this.y = 0
    // 	return
    // }
    this.y += 3;
    this.y %= canvas.height;
  }
}
class Car {
  constructor(image) {
    this.image = new Image();
    this.image.src = image;
    this.width = 50;
    this.height = (this.image.height / this.image.width) * this.width;
    this.x = (canvas.width - this.width) / 2;
    this.y = canvas.height - 150;
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.x,
      this.y,
      this.width,
      (this.image.height / this.image.width) * this.width
    );
  }

  move(xmove) {
    // if (this.y >= canvas.height) {
    // 	this.y = 0
    // 	return
    this.x += xmove;
    if (this.x < 0 + this.width / 2) {
      this.x = this.width / 2;
    } else if (this.x > canvas.width - this.width * 1.5) {
      this.x = canvas.width - this.width * 1.5;
    }
  }
}
class Obstacle {
  constructor() {
    this.width = 150 + Math.random() * 200; // min width =150 : max 150+200
    this.height = 20;
    this.x = 50 + Math.random() * (400 - this.width); // offset 50
    this.y = 0;
  }

  draw() {
    ctx.beginPath();
    // ctx.rect(this.x, this.y, this.radius, 0, 2 * Math.PI);
    // ctx.strokeStyle = "blue";
    ctx.fillStyle = "#870007";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.stroke();
    ctx.closePath();
  }

  move() {
    this.y += 5;

    if (this.y > canvas.height) {
      delete this;
      return true;
    }
    return false;

    // this.y %= canvas.height;
  }
}

const obstacles = [new Obstacle()];
const road = new Route("./images/road.png");
const car = new Car("./images/car.png");
let timeCounter = 100;
let scoreCounter = 0;
const startButton = document.getElementById("start-button");
let frames = 0;

function drawtext(scoreValue) {
  ctx.font = "40px sans-serif";

  ctx.fillStyle = "white";

  ctx.fillText("Score : " + scoreValue, 10, 50);
}

function drawGO(scoreValue) {
  ctx.beginPath();
  // ctx.rect(this.x, this.y, this.radius, 0, 2 * Math.PI);
  // ctx.strokeStyle = "blue";
  ctx.fillStyle = "black";
  ctx.fillRect(0, 100, canvas.width, 400);
  ctx.stroke();
  ctx.closePath();

  ctx.font = "30px sans-serif";
  ctx.fillStyle = "red";
  ctx.fillText("GAME OVER !", 150, 200);
  ctx.font = "25px sans-serif";
  ctx.fillStyle = "white";
  ctx.fillText("Your final score ", 150, 300);
  ctx.fillText(String(scoreCounter), 230, 350);
}

document.addEventListener("keydown", (e) => {
  // console.log(car.x, canvas.width);
  switch (e.key) {
    case "ArrowLeft":
      car.move(-25);
      // console.log(counter);
      break;
    case "ArrowRight":
      car.move(25);
      break;
    default:
      break;
  }
  // car.draw();
  // console.log(car.x);
});

window.onload = () => {
  startButton.onclick = () => {
    startGame();
    startButton.disabled = true;
  };
  // let counter = 0;

  function startGame() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    road.draw();
    car.draw();
    timeCounter--;
    let lost = false;
    obstacles.forEach((obst) => {
      if (obst.move()) {
        // Check if obstacle present arrive at the end of the road, delete it
        // and incremente score
        delete obstacles.shift();
        scoreCounter++;
      }
      obst.draw();
      let test =
        car.x < obst.x + obst.width &&
        car.x + car.width > obst.x &&
        car.y < obst.y + obst.height &&
        car.y + car.height > obst.y;

      if (test) {
        // Game Over Score Is :
        lost = true;
        console.log(frames);
        drawGO(scoreCounter);
        startButton.disabled = false;
        timeCounter = 100;
        scoreCounter = 0;
        let popedObstacle = obstacles.pop();
        while (popedObstacle) {
          delete popedObstacle;
          popedObstacle = obstacles.pop();
        }

        return;
        // cancelAnimationFrame(frames);
      }
    });
    if (lost) return (lost = false);
    if (!timeCounter) {
      timeCounter = 100;
      obstacles.push(new Obstacle());
      console.log(obstacles);
    }

    drawtext(scoreCounter);
    // document.addEventListener("keydown", (e) => (pressed = 0));
    // road.move();
    // requestAnimationFrame call the provided function when the next Frame is available
    frames = requestAnimationFrame(startGame);
  }
};
