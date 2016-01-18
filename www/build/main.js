'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = (function () {
  function App() {
    _classCallCheck(this, App);

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

  _createClass(App, [{
    key: 'gameInit',
    value: function gameInit() {
      this.addText();
      this.startGame();
      this.initKeysPress();
    }
  }, {
    key: 'startGame',
    value: function startGame() {
      this.drawPlayer();
      this.generateEnemy();
      this.move();
    }
  }, {
    key: 'drawPlayer',
    value: function drawPlayer() {
      this.ctx.fillStyle = this.playerColor;
      this.ctx.fillRect(this.playerLeft, this.playerTop, this.playerWidth, this.playerHeight);
    }
  }, {
    key: 'drawFire',
    value: function drawFire() {
      var _this = this;

      this.ctx.fillStyle = this.fireColor;
      this.fireArray.forEach(function (fire) {
        _this.ctx.fillRect(fire.left, fire.top, _this.fireWidth, _this.fireHeight);
      });
    }
  }, {
    key: 'drawEnemy',
    value: function drawEnemy() {
      var _this2 = this;

      this.ctx.fillStyle = this.enemyColor;
      this.enemyArray.forEach(function (enemy) {
        _this2.ctx.fillRect(enemy.left, enemy.top, _this2.enemyWidth, _this2.enemyHeight);
      });
    }
  }, {
    key: 'generateEnemy',
    value: function generateEnemy() {
      var _this3 = this;

      setInterval(function () {
        if (!_this3.pause) {
          var count = _this3.random(1, 3);
          for (var n = 0; n < count; n++) {
            var top = _this3.random(0 - _this3.enemyHeight, -_this3.canvas.height);
            var left = _this3.random(0, _this3.canvas.width - _this3.enemyWidth);
            _this3.enemyArray.push({
              top: top,
              left: left
            });
          }
        }
      }, 5000);
    }
  }, {
    key: 'gameOver',
    value: function gameOver() {
      this.pause = true;
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }, {
    key: 'addText',
    value: function addText() {
      this.ctx.fillStyle = 'grey';
      this.ctx.font = '21px Arial';
      this.ctx.fillText('Esc - pause', 30, 50);
      this.ctx.fillText('Enter - start new game', 30, 80);
      this.ctx.fillText('Space - fire', 30, 110);
    }
  }, {
    key: 'move',
    value: function move() {
      var _this4 = this;

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
          var enemyToRemove = undefined;
          this.enemyArray.forEach(function (enemy, n) {
            enemy.top = enemy.top + _this4.enemySpeed;
            if (enemy.top > _this4.canvas.height) {
              enemyToRemove = n;
            } else {
              if (enemy.top + _this4.enemyHeight > _this4.playerTop && enemy.top < _this4.playerTop + _this4.playerHeight) {
                if (enemy.left + _this4.enemyWidth > _this4.playerLeft && enemy.left < _this4.playerLeft + _this4.playerWidth) {
                  _this4.gameOver();
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
          (function () {
            var fireToRemove = [];
            var enemyToRemove = [];
            _this4.fireArray.forEach(function (fire, n) {
              fire.top = fire.top - _this4.fireSpeed;
              if (fire.top < 0) {
                fireToRemove.push(n);
              } else {
                _this4.enemyArray.forEach(function (enemy, j) {
                  if (fire.left >= enemy.left && fire.left <= enemy.left + _this4.enemyWidth) {
                    if (fire.top <= enemy.top + _this4.enemyHeight && fire.top + _this4.fireHeight >= enemy.top) {
                      enemyToRemove.push(j);
                      fireToRemove.push(n);
                    }
                  }
                });
              }
            });
            if (fireToRemove.length > 0) {
              fireToRemove.forEach(function (i) {
                _this4.fireArray.splice(i, 1);
              });
            }
            if (enemyToRemove.length > 0) {
              enemyToRemove.forEach(function (k) {
                _this4.enemyArray.splice(k, 1);
              });
            }
          })();
        }
      }

      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      this.drawPlayer();
      this.drawFire();
      this.drawEnemy();
      this.addText();

      setTimeout(function () {
        _this4.move();
      }, 1000 / this.capturesPS);
    }
  }, {
    key: 'initKeysPress',
    value: function initKeysPress() {
      var _this5 = this;

      window.addEventListener('keydown', function (e) {
        switch (e.keyCode) {
          case 37:
            _this5.movePlayerLeft = true;
            break;
          case 39:
            _this5.movePlayerRight = true;
            break;
          case 38:
            _this5.movePlayerTop = true;
            break;
          case 40:
            _this5.movePlayerBottom = true;
            break;
          case 32:
            if (!_this5.pause) {
              _this5.fireArray.push({
                left: _this5.playerLeft + _this5.playerWidth / 2 - _this5.fireWidth / 2,
                top: _this5.playerTop - _this5.fireHeight
              });

              _this5.drawFire();
            }
            break;
          case 27:
            _this5.pause = !_this5.pause;
            _this5.move();
            break;
          case 13:
            location.reload();
            break;
        }
      }, true);

      window.addEventListener('keyup', function (e) {
        switch (e.keyCode) {
          case 37:
            _this5.movePlayerLeft = false;
            break;
          case 39:
            _this5.movePlayerRight = false;
            break;
          case 38:
            _this5.movePlayerTop = false;
            break;
          case 40:
            _this5.movePlayerBottom = false;
            break;
        }
      }, true);
    }
  }, {
    key: 'random',
    value: function random(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }]);

  return App;
})();

var app = new App();
app.gameInit();