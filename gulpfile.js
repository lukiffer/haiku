const gulp      = require('gulp');
const eslint    = require('gulp-eslint');
const sass      = require('gulp-sass');
const sassLint  = require('gulp-sass-lint');
const util      = require('gulp-util');
const watch     = require('gulp-watch');
const del       = require('del');
const fs        = require('fs');
const notifier  = require('node-notifier');
const through   = require('through2');
const exec      = require('child_process').exec;

gulp.task('lint', () => {
  return gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('build', ['js'], () => {
  gulp.src(['.tmp/**/*.js'])
    .pipe(mergeCss())
    .pipe(gulp.dest('haiku'));
});

gulp.task('js', ['sass', 'lint'], () => {
  return gulp.src(['src/**/*.js'])
    .pipe(gulp.dest('.tmp'));
});

gulp.task('sass', ['clean:dist'], () => {
  return gulp.src(['src/**/*.scss'])
    .pipe(sassLint())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('clean:tmp', () => {
  return del.sync(['.tmp/**']);
});

gulp.task('clean:dist', ['clean:tmp'], () => {
  return del.sync(['haiku/**']);
});

gulp.task('watch', () => {
  watch(['src/**/*'], {debounceDelay: 2000}, () => {
    gulp.start('deploy');
  });
});

gulp.task('deploy', ['build'], (cb) => {
  exec('sh deploy.sh', () => {
    notifier.notify({
      title: 'Deployment Complete',
      message: 'The updated compiled artifacts were pushed to the raspberrypi.'
    });
    cb();
  });
});

gulp.task('default', ['build']);

function mergeCss() {
  return through.obj(function (file, enc, cb) {
    const cssFilePath = file.path.replace(/\.js$/, '.css');
    const js = file._contents.toString(enc);
    let css = null;
    try {
      css = fs.readFileSync(cssFilePath).toString(enc);
    }
    catch (e) {
      css = '';
    }
    const output = js.replace(/{{ css }}/, `<style>${ css }</style>`);
    this.push(new util.File({
      base: file.base,
      path: file.path,
      contents: new Buffer(output, enc)
    }));
    cb();
  });
}
