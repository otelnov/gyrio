class App {
  constructor() {
    this.pause = false;

    this.playerHeight = 100;
    this.playerWidth = 100;
    this.playerColor = 'navy';
    this.playerSpeed = 20;

    this.playerLeft = window.innerWidth / 2 - this.playerWidth / 2;
    this.playerTop = window.innerHeight - this.playerHeight;

    this.maxPlayerLeft = 0;
    this.maxPlayerTop = 0;
    this.maxPlayerRight = window.innerWidth - this.playerWidth;
    this.maxPlayerBottom = window.innerHeight - this.playerHeight;

    this.canvas = document.getElementById('canvas');
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.ctx = this.canvas.getContext('2d');

    this.movePlayerLeft = false;
    this.movePlayerRight = false;
    this.movePlayerTop = false;
    this.movePlayerBottom = false;
    this.stopPlayer = false;

    this.capturesPS = 48;

    this.fireColor = 'red';
    this.stopFire = false;
    this.fireWidth = 6;
    this.fireHeight = 15;
    this.fireSpeed = 30;
    this.fireArray = [];

    this.stopEnemy = false;
    this.enemyColor = 'black';
    this.enemyWidth = 50;
    this.enemyHeight = 50;
    this.enemySpeed = 3;
    this.enemyArray = [];
  }

  gameInit() {
    this.addText();
    this.startGame();
    this.initKeysPress();
  }

  startGame() {
    this.drawPlayer();
    this.generateEnemy();
    this.move();
  }

  drawPlayer() {
    this.ctx.fillStyle = this.playerColor;
    this.ctx.fillRect(this.playerLeft, this.playerTop, this.playerWidth, this.playerHeight);
  }

  drawFire() {
    this.ctx.fillStyle = this.fireColor;
    this.fireArray.forEach(fire => {
      this.ctx.fillRect(fire.left, fire.top, this.fireWidth, this.fireHeight);
    });
  }

  drawEnemy() {
    this.ctx.fillStyle = this.enemyColor;
    this.enemyArray.forEach(enemy => {
      this.ctx.fillRect(enemy.left, enemy.top, this.enemyWidth, this.enemyHeight);
    });
  }

  generateEnemy() {
    setInterval(() => {
      if (!this.pause) {
        let count = this.random(1, 3);
        for (let n = 0; n < count; n++) {
          let top = this.random(0 - this.enemyHeight, -this.canvas.height);
          let left = this.random(0, this.canvas.width - this.enemyWidth);
          this.enemyArray.push({
            top: top,
            left: left
          });
        }
      }
    }, 5000);
  }

  gameOver() {
    this.pause = true;
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  addText() {
    this.ctx.fillStyle = 'grey';
    this.ctx.font = '21px Arial';
    this.ctx.fillText('Esc - pause', 30, 50);
    this.ctx.fillText('Enter - start new game', 30, 80);
    this.ctx.fillText('Space - fire', 30, 110);
  }

  move() {
    if (this.pause) {
      return;
    }
    if (!this.stopPlayer) {
      if (this.movePlayerLeft && this.playerLeft > this.maxPlayerLeft) {
        this.playerLeft = this.playerLeft - this.playerSpeed;
        if (this.playerLeft < this.maxPlayerLeft) {
          this.playerLeft = this.maxPlayerLeft;
        }
      }
      if (this.movePlayerRight && this.playerLeft < this.maxPlayerRight) {
        this.playerLeft = this.playerLeft + this.playerSpeed;
        if (this.playerLeft > this.maxPlayerRight) {
          this.playerLeft = this.maxPlayerRight;
        }
      }
      if (this.movePlayerTop && this.playerTop > this.maxPlayerTop) {
        this.playerTop = this.playerTop - this.playerSpeed;
        if (this.playerTop < this.maxPlayerTop) {
          this.playerTop = this.maxPlayerTop;
        }
      }
      if (this.movePlayerBottom && this.playerTop < this.maxPlayerBottom) {
        this.playerTop = this.playerTop + this.playerSpeed;
        if (this.playerTop > this.maxPlayerBottom) {
          this.playerTop = this.maxPlayerBottom;
        }
      }
    }

    if (!this.stopEnemy) {
      if (this.enemyArray.length > 0) {
        let enemyToRemove;
        this.enemyArray.forEach((enemy, n) => {
          enemy.top = enemy.top + this.enemySpeed;
          if (enemy.top > this.canvas.height) {
            enemyToRemove = n;
          } else {
            if (enemy.top + this.enemyHeight > this.playerTop && enemy.top < this.playerTop + this.playerHeight) {
              if (enemy.left + this.enemyWidth > this.playerLeft && enemy.left < this.playerLeft + this.playerWidth) {
                this.gameOver();
              }
            }
          }
        });
        if (enemyToRemove) {
          this.enemyArray.splice(enemyToRemove, 1);
        }
      }
    }

    if (!this.stopFire) {
      if (this.fireArray.length > 0) {
        let fireToRemove = [];
        let enemyToRemove = [];
        this.fireArray.forEach((fire, n) => {
          fire.top = fire.top - this.fireSpeed;
          if (fire.top < 0) {
            fireToRemove.push(n);
          } else {
            this.enemyArray.forEach((enemy, j) => {
              if (fire.left >= enemy.left && fire.left <= enemy.left + this.enemyWidth) {
                if (fire.top <= enemy.top + this.enemyHeight && fire.top + this.fireHeight >= enemy.top) {
                  enemyToRemove.push(j);
                  fireToRemove.push(n);
                }
              }
            });
          }
        });
        if (fireToRemove.length > 0) {
          fireToRemove.forEach(i => {
            this.fireArray.splice(i, 1);
          });
        }
        if (enemyToRemove.length > 0) {
          enemyToRemove.forEach(k => {
            this.enemyArray.splice(k, 1);
          });
        }
      }
    }

    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    this.drawPlayer();
    this.drawFire();
    this.drawEnemy();
    this.addText();

    setTimeout(() => {
      this.move();
    }, 1000 / this.capturesPS);
  }

  initKeysPress() {
    window.addEventListener('keydown', e => {
      switch (e.keyCode) {
        case 37:
          this.movePlayerLeft = true;
          break;
        case 39:
          this.movePlayerRight = true;
          break;
        case 38:
          this.movePlayerTop = true;
          break;
        case 40:
          this.movePlayerBottom = true;
          break;
        case 32:
          if (!this.pause) {
            this.fireArray.push({
              left: this.playerLeft + this.playerWidth / 2 - this.fireWidth / 2,
              top: this.playerTop - this.fireHeight
            });

            this.drawFire();
          }
          break;
        case 27:
          this.pause = !this.pause;
          this.move();
          break;
        case 13:
          location.reload();
          break;
      }
    }, true);

    window.addEventListener('keyup', e => {
      switch (e.keyCode) {
        case 37:
          this.movePlayerLeft = false;
          break;
        case 39:
          this.movePlayerRight = false;
          break;
        case 38:
          this.movePlayerTop = false;
          break;
        case 40:
          this.movePlayerBottom = false;
          break;
      }
    }, true);
  }

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

let app = new App();
app.gameInit();
