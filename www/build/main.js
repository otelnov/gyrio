'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = (function () {
  function App(gameId, socket) {
    _classCallCheck(this, App);

    this.gameId = gameId;
    this.socket = socket;

    this.playerHeight = 100;
    this.playerWidth = 100;
    this.playerColor = 'navy';
    this.playerLeft = $(window).width() / 2 - this.playerWidth / 2;
    this.playerTop = $(window).height() - this.playerHeight;
    this.maxPlayerLeft = 0;
    this.maxPlayerRight = $(window).width() - this.playerWidth;

    this.canvas = document.getElementById('canvas');
    this.canvas.height = $(window).height();
    this.canvas.width = $(window).width();
    this.ctx = this.canvas.getContext('2d');

    this.movePlayerLeft = false;
    this.movePlayerRight = false;
    this.stopPlayer = false;

    this.joyTextColor = '#333';
  }

  _createClass(App, [{
    key: 'gameInit',
    value: function gameInit() {
      this.initPlayer();
      this.movePlayer();
      this.initKeysPress();
      this.initSocketMove();
    }
  }, {
    key: 'joyInit',
    value: function joyInit() {
      this.initJoystick();
      this.initAccelerometer();
    }
  }, {
    key: 'initPlayer',
    value: function initPlayer() {
      this.ctx.fillStyle = this.playerColor;
      this.ctx.fillRect(this.playerLeft, this.playerTop, this.playerWidth, this.playerHeight);
    }
  }, {
    key: 'movePlayer',
    value: function movePlayer() {
      var _this = this;

      if (!this.stopPlayer) {
        if (this.movePlayerLeft && this.playerLeft > this.maxPlayerLeft) {
          this.ctx.clearRect(0, 0, $(window).width(), $(window).height());
          this.playerLeft = this.playerLeft - 20;
          this.ctx.fillRect(this.playerLeft, this.playerTop, this.playerWidth, this.playerHeight);
        }
        if (this.movePlayerRight && this.playerLeft < this.maxPlayerRight) {
          this.ctx.clearRect(0, 0, $(window).width(), $(window).height());
          this.playerLeft = this.playerLeft + 20;
          this.ctx.fillRect(this.playerLeft, this.playerTop, this.playerWidth, this.playerHeight);
        }
        setTimeout(function () {
          _this.movePlayer();
        }, 20);
      }
    }
  }, {
    key: 'initKeysPress',
    value: function initKeysPress() {
      var _this2 = this;

      window.addEventListener('keydown', function (e) {
        switch (e.keyCode) {
          case 37:
            _this2.movePlayerLeft = true;
            _this2.socket.emit('move', { gameId: _this2.gameId, direction: 'left', event: 'start' });
            break;
          case 39:
            _this2.movePlayerRight = true;
            _this2.socket.emit('move', { gameId: _this2.gameId, direction: 'right', event: 'start' });
            break;
        }
      }, true);

      window.addEventListener('keyup', function (e) {
        switch (e.keyCode) {
          case 37:
            _this2.movePlayerLeft = false;
            _this2.socket.emit('move', { gameId: _this2.gameId, direction: 'left', event: 'stop' });
            break;
          case 39:
            _this2.movePlayerRight = false;
            _this2.socket.emit('move', { gameId: _this2.gameId, direction: 'right', event: 'stop' });
            break;
        }
      }, true);
    }
  }, {
    key: 'initSocketMove',
    value: function initSocketMove() {
      var _this3 = this;

      this.socket.on('move', function (data) {
        if (data.gameId === _this3.gameId) {
          if (data.direction === 'left') {
            _this3.movePlayerLeft = data.event === 'start';
          }
          if (data.direction === 'right') {
            _this3.movePlayerRight = data.event === 'start';
          }
        }
      });
    }
  }, {
    key: 'initJoystick',
    value: function initJoystick() {
      var _this4 = this;

      this.ctx.fillStyle = this.joyTextColor;
      this.ctx.font = '70px Arial';
      this.ctx.fillText('Tilt your phone', 50, 100);
      var img = new Image();
      img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALwAAAA8CAMAAADrJyBBAAAAPFBMVEX///8NDQ3p6ekAAAD19fXx8fHg4OASEhIWFhY4ODirq6uwsLDt7e1tbW2lpaXGxsYbGxtERER8fHybm5vFGOeBAAAAf0lEQVRoge3VUQqAIBAAUUutNLOs+9+17AQpkizM+18YZFWlAAAAAAAAgD9Na+gbENapdvJKp2naUsyc6ao6v5j0sbeuKbUfOsXSIRv1YwtjZ2HLHdEWpBvv8oxe5qGzeXlDnP++v6LjRa/NS+6FzSQ/lUr0JwUAAAAAAADUuQEh0wdF1JJhrwAAAABJRU5ErkJggg==';
      img.onload = function () {
        _this4.ctx.drawImage(img, 0, 170, $(window).width(), 70);
      };
    }
  }, {
    key: 'initAccelerometer',
    value: function initAccelerometer() {
      var _this5 = this;

      window.ondeviceorientation = function (event) {
        // let alpha = Math.round(event.alpha);
        var beta = Math.round(event.beta);
        // let gamma = Math.round(event.gamma);
        if (beta > 0) {
          _this5.socket.emit('move', { gameId: _this5.gameId, direction: 'left', event: 'stop' });
          _this5.socket.emit('move', { gameId: _this5.gameId, direction: 'right', event: 'start' });
        } else {
          _this5.socket.emit('move', { gameId: _this5.gameId, direction: 'right', event: 'stop' });
          _this5.socket.emit('move', { gameId: _this5.gameId, direction: 'left', event: 'start' });
        }
      };
    }
  }]);

  return App;
})();

var gameId = window.location.pathname.replace(/\//g, '');
gameId = gameId.replace('gyrio', '');

var socket = io('https://telnov.com/gyrio/');

var app = new App(gameId, socket);

if (isMobile()) {
  app.joyInit();
} else {
  app.gameInit();
}

function isMobile() {
  var mobile = false;
  (function (a, b) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) mobile = true;
  })(navigator.userAgent || navigator.vendor || window.opera, 'http://detectmobilebrowser.com/mobile');
  return mobile;
}