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

function mergeCss() {
  return through.obj(function(file, enc, cb) {
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
      contents: Buffer.from(output, enc)
    }));
    cb();
  });
}

gulp.task('lint', () => {
  return gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('clean:tmp', (done) => {
  del.sync(['.tmp/**']);
  done();
});

gulp.task('clean:dist', gulp.series('clean:tmp', (done) => {
  del.sync(['dist/**']);
  done();
}));

gulp.task('sass:global', gulp.series('clean:dist', () => {
  return gulp.src(['src/styles/global/haiku.scss'])
    .pipe(sassLint())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('.tmp'));
}));

gulp.task('sass', gulp.series('sass:global', () => {
  return gulp.src(['src/**/*.scss', '!src/styles/global/**/*.scss'])
    .pipe(sassLint())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('.tmp'));
}));

gulp.task('js', gulp.series('sass', 'lint', () => {
  return gulp.src(['src/**/*.js'])
    .pipe(gulp.dest('.tmp'));
}));

gulp.task('build', gulp.series('js', () => {
  return gulp.src(['.tmp/**/*.js', '.tmp/haiku.css'])
    .pipe(mergeCss())
    .pipe(gulp.dest('dist'));
}));

gulp.task('watch', () => {
  watch(['src/**/*'], {debounceDelay: 2000}, () => {
    gulp.start('deploy');
  });
});

gulp.task('deploy', gulp.series('build', (cb) => {
  exec('sh ./tools/deploy/deploy.sh', () => {
    notifier.notify({
      title: 'Deployment Complete',
      message: 'The updated compiled artifacts were pushed to the raspberrypi.'
    });
    cb();
  });
}));

gulp.task('default', gulp.series('build'));
