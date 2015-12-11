'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const GulpSSH = require('gulp-ssh');
const config = require('config');
const babel = require('gulp-babel');
const livereload = require('gulp-livereload');

gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!node_modules/**', '!www/build/**', '!www/lib/**'])
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

let srcPath = './www/src/**/*.js';

gulp.task('babel', () => {
  return gulp.src(srcPath)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./www/build'))
    .pipe(livereload());
});

gulp.task('watch', () => {
  livereload.listen();
  gulp.watch(srcPath, ['babel']);
});
