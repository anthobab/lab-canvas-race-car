window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    const game = new Game();
    game.startGame();
  };
};

class Car {
  constructor(canvas, ctx) {
    this.image = new Image();
    this.image.src = "./../images/car.png";
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = 50;
    this.height = 100;
    this.x = this.canvas.width / 2 - this.width / 2;
    this.y = this.canvas.height - 150;
  }

  bottomEdge() {
    return this.y + this.height;
  }

  leftEdge() {
    return this.x;
  }
  rightEdge() {
    return this.x + this.width;
  }
  topEdge() {
    return this.y;
  }

  moveLeft() {
    if (this.x <= 20) {
      return;
    }
    this.x -= 4;
  }
  moveRight() {
    if (this.x >= this.canvas.width - this.width - 20) {
      return;
    }
    this.x += 4;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Road {
  constructor(canvas, ctx) {
    this.image = new Image();
    this.ctx = ctx;
    this.canvas = canvas;
    this.image.src = "./../images/road.png";
    this.x = 0;
    this.y = 0;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  move() {
    this.y += 4;
    this.y %= this.canvas.height;
  }
  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    this.ctx.drawImage(
      this.image,
      this.x,
      this.y - this.height,
      this.width,
      this.height
    );
  }
}

class Game {
  constructor() {
    this.canvas = null;
    this.intervalId = null;
    this.ctx = null;
    this.init();
    this.road = new Road(this.canvas, this.ctx);
    this.car = new Car(this.canvas, this.ctx);
    this.frames = 0;
    this.obstacles = [];
  }
  init() {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.createEventListeners();
  }
  startGame() {
    this.intervalId = setInterval(() => {
      this.frames++;
      if (this.frames % 60 === 0) {
        this.obstacles.push(new Obstacle(this.canvas, this.ctx));
      }
      this.road.draw();
      this.road.move();
      this.car.draw();
      for (const obstacle of this.obstacles) {
        obstacle.draw();
        if (this.checkCollision(obstacle, this.car)) {
          this.stopGame();
        }
        obstacle.move();
      }
    }, 1000 / 60);
  }

  stopGame() {
    clearInterval(this.intervalId);
  }

  checkCollision(obstacle, car) {
    const isInX =
      obstacle.rightEdge() >= car.leftEdge() &&
      obstacle.leftEdge() <= car.rightEdge();
    const isInY =
      obstacle.topEdge() <= car.bottomEdge() &&
      obstacle.bottomEdge() >= car.topEdge();
    return isInX && isInY;
  }

  createEventListeners() {
    document.addEventListener("keydown", (event) => {
      // console.log(event.key)
      switch (event.key) {
        case "ArrowLeft":
          this.car.moveLeft();
          break;
        case "ArrowRight":
          this.car.moveRight();
          break;
        default:
          break;
      }
    });
  }
}

class Obstacle {
  constructor(canvas, ctx) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.x = Math.floor(Math.random() * (this.canvas.width / 2)) + 20;
    this.width = Math.floor(Math.random() * (this.canvas.width / 2));
    this.height = 15;
    this.y = -20;
  }

  bottomEdge() {
    return this.y + this.height;
  }

  leftEdge() {
    return this.x;
  }
  rightEdge() {
    return this.x + this.width;
  }
  topEdge() {
    return this.y;
  }

  draw() {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move() {
    this.y += 4;
  }
}
