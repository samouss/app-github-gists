var browserSync = require('browser-sync'),
    del = require('del'),
    events = require('events'),
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    jshint = require('gulp-jshint'),
    minifyCSS = require('gulp-minify-css'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    map = require('map-stream'),
    argv = require('minimist')(process.argv.slice(2)),
    wiredep = require('wiredep'),
    path = require('path'),
    emitter = new events.EventEmitter()
;

var config = {

  // build dir
  build_dir : 'build/',

  // map dir
  maps_dir : 'src/maps/',

  //files to dump
  dump_files: {
    'bower_components/fontawesome/fonts/*': '/assets/fonts/'
  },

  // JS default config
  js : {
    // path source files
    source_dir : 'src/',

    // main file for app
    dest_app_filename : 'main.js',

    // main file for
    dest_vendor_filename : 'vendor.js',

    // main file dest dir
    dest_dir: 'assets/js/',

    // map dir relative to dest_dir
    maps_dir : '../maps/',

    // Exlude lib to vendor
    excludes_vendor : [],

    // js dump file
    dump : [
      "bower_components/modernizr/modernizr.js",
      "bower_components/jquery/dist/jquery.js"
    ]
  },

  // SASS default config
  sass : {
    // path source files
    source_dir : 'src/assets/sass/',

    // main file to build
    dest_filename : 'main.css',

    // main file dest dir
    dest_dir: 'assets/css/',

    // map dir relative to dest_dir
    maps_dir : '../maps/',

    // main file to load
    files : 'main.scss',

    // file to include transform in scss
    requires : [],

    // lib to includes
    includes : [
      'bower_components/bootstrap-sass-official/assets/stylesheets',
      'bower_components/fontawesome/scss'
    ]

  },

  // HTML default config
  html : {
    // path source files
    source_dir : 'src/',

    // dest view dir
    dest_dir: '.',
  },

};

// CSS to SASS task
gulp.task('cssToScss', function() {
  config.sass.requires.forEach(function(filePath) {
    return gulp.src(path.join(filePath, '*.css'))
      .pipe(rename({
        extname: '.scss'
      }))
      .pipe(gulp.dest(filePath))
    ;
  });
});

// SASS task
gulp.task('sass', ['cssToScss'], function() {
  return sass(path.join(config.sass.source_dir, config.sass.files), {
      sourcemap: true,
      loadPath: config.sass.includes.concat(config.sass.requires)
    })
    .pipe(plumber())
    .pipe(sourcemaps.write(config.sass.maps_dir))
    .pipe(gulpif(argv.prod !== undefined, minifyCSS()))
    .pipe(gulp.dest(path.join(config.build_dir, config.sass.dest_dir)))
    .pipe(browserSync.reload({stream:true}))
  ;
});

// Lint task
gulp.task('lint', function() {
  return gulp.src(path.join(config.js.source_dir, '**/*.js'))
    .pipe(jshint())
    .pipe(notify(function (file) {
      if (!file.jshint.success) {
        var errors = file.jshint.results.map(function (data) {
          if (data.error) {
            return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
          }
        }).join("\n");

        return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
      }
    }))
  ;
});

// Vendor js task
gulp.task('vendor-js', function() {
  var excludes = config.js.excludes_vendor;

  return gulp.src(wiredep({ exclude: excludes.concat(config.js.dump) }).js)
    .pipe(plumber())
    .pipe(concat(config.js.dest_vendor_filename))
    .pipe(gulp.dest(path.join(config.build_dir, config.js.dest_dir)))
  ;
});

// JS task - require lint
gulp.task('js', ['lint'], function() {

  var files = [];

  files.push(path.join(config.js.source_dir, 'app.js'));
  files.push(path.join(config.js.source_dir, 'common/**/*.js'));
  files.push(path.join(config.js.source_dir, '/**/*.js'));

  return gulp.src(files)
    .pipe(plumber())
    .pipe(gulpif(argv.prod !== undefined, sourcemaps.init()))
      .pipe(concat(config.js.dest_app_filename))
      .pipe(gulpif(argv.prod !== undefined, uglify()))
    .pipe(sourcemaps.write(config.js.maps_dir))
    .pipe(gulp.dest(path.join(config.build_dir, config.js.dest_dir)))
    .pipe(browserSync.reload({stream:true}))
  ;
});

// View task
gulp.task('html', function() {
  return gulp.src(path.join(config.html.source_dir, '**/*.html'))
    .pipe(gulp.dest(path.join(config.build_dir, config.html.dest_dir)))
    .pipe(browserSync.reload({stream:true}))
  ;
});


// Browser-sync task
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: config.build_dir
    },
    open: argv.no !== undefined ? false : true
  });
});

// Clean task
gulp.task('clean', function() {
  del.sync(path.join(config.build_dir));
});

// Dump task
gulp.task('dump', function() {
  Object.keys(config.dump_files).forEach(function(glob, index) {
    var dest = this[glob];

    gulp.src(glob)
      .pipe(rename(function(filepath) {
        filepath.dirname = path.join(dest, filepath.dirname);
      }))
      .pipe(gulp.dest(config.build_dir))
      .pipe(browserSync.reload({stream:true}))
    ;

  }, config.dump_files);
});

// Dump js task
gulp.task('dumpjs', function() {
  return gulp.src(config.js.dump)
    .pipe(gulpif(argv.prod !== undefined, uglify()))
    .pipe(gulp.dest(path.join(config.build_dir, config.js.dest_dir)))
  ;
});

// --------------------------------

gulp.task('start', ['default', 'browser-sync'], function() {
  gulp.watch(path.join(config.sass.source_dir, '../**/*.scss'), ['sass']);
  gulp.watch(path.join(config.js.source_dir, '**/*.js'), ['js']);
  gulp.watch(path.join(config.html.source_dir, '**/*.html'), ['html']);
  gulp.watch(Object.keys(config.dump_files), ['dump']);
  gulp.watch(['bower.json', 'bower_components/**/*'], ['vendor-js']);
});

// --------------------------------

gulp.task('default', ['clean', 'dump', 'dumpjs', 'vendor-js', 'html', 'sass', 'js']);
