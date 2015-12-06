'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const GulpSSH = require('gulp-ssh');
const config = require('config');

gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint({ useEslintrc: true }))
    .pipe(eslint.format());
});

let sshConfig = {
  host: 'jse.me',
  port: 22,
  username: config.douser,
  password: config.dopass
};

let gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: sshConfig
});

gulp.task('deploy', () => {
  return gulpSSH
    .shell(['cd /var/www/gyrio', 'git pull origin master', 'npm install', 'pm2 restart index.js'], { filePath: 'shell.log' })
    .pipe(gulp.dest('logs'));
});
