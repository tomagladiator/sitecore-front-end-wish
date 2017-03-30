var bulkSass     = require('gulp-sass-bulk-import');   
var inline       = require('gulp-inline-source');  
var autoprefixer = require('gulp-autoprefixer'); 
var sourcemaps   = require('gulp-sourcemaps');  
var favicons     = require('gulp-favicons');  
var imagemin     = require('gulp-imagemin');  
var prettify     = require('gulp-prettify');  
var replace      = require('gulp-replace');  
var cssnano      = require('gulp-cssnano');  
var concat       = require('gulp-concat');  
var rename       = require('gulp-rename');  
var uglify       = require('gulp-uglify');  
var batch        = require('gulp-batch');
var watch        = require('gulp-watch');  
var scss         = require('gulp-sass');  
var util         = require('gulp-util');  
var gulp         = require('gulp');  
var fs           = require('fs');  



/* *************************
	CONFIG
************************* */
var minify  = false;



/* *************************
	COMMANDS
************************* */
//  gulp scss                                  : compile scss
//  gulp inline                                : compile inline scss
//  gulp js-head                               : compile js file in the head
//  gulp js-foot                               : compile js file in the foot
//  gulp img-else                              : optimize all img in 3-else folder
//  gulp img-components                        : optimize all img in 1-components folder
//  gulp favicon                               : convert a square logo to all type of favicons.
//  gulp fonts                                 : move fonts in dist/
//  gulp component --options name-of-component : create a new component.



/* *************************
	A - FUNCTIONS
************************* */
function handleError(err) {
	console.log(err.toString());
	this.emit('end');
}



/* *************************
	C - DEFAULT
************************* */
	gulp.task('default', [
			'scss',
			'inline',
			'js-head',
			'js-foot',
			'img-else',
			'img-components',
			'watch-scss',
			'watch-js',
			'watch-fonts',
			'watch-img'
		] , function() {
	});



/* *************************
	D - SCSS
************************* */
	gulp.task('scss', function () {
		if ( minify ) {
			var css_refactoring = cssnano();
		} else {
			var css_refactoring = util.noop();
		}

		return gulp.src([
				'src/**/*.scss', 
				'!src/**/inline.scss'
			])
			.pipe(sourcemaps.init())
			.pipe(bulkSass())
			.pipe(scss().on('error', scss.logError))
			.pipe(autoprefixer({
				browsers: ['last 2 versions']
			}))
			.pipe(css_refactoring)
			.pipe(concat('styles.min.js'))
			.pipe(sourcemaps.write('.'))
			.pipe(rename({
				dirname: ''
			}))
			.pipe(gulp.dest('dist/css/'));
	});



/* *************************
	E - SCSS-WATCH
************************* */
	gulp.task('watch-scss', function () {
		watch('src/**/*.scss', batch(function (events, done) {
			gulp.start([
				'scss',
				'inline'
			], done);
		}));
	});



/* *************************
	F - INLINE
************************* */
	gulp.task('inline', function () {
		if ( minify ) {
			var css_refactoring = cssnano();
		} else {
			var css_refactoring = util.noop();
		}

		return gulp.src('src/3-else/scss/inline.scss')
			.pipe(scss().on('error', scss.logError))
			.pipe(autoprefixer({
				browsers: ['last 2 versions']
			}))
			.pipe(css_refactoring)
			.pipe(rename({
				dirname: ''
			}))
			.pipe(gulp.dest('dist/css/'));
	});



/* *************************
	G - JS-HEAD
************************* */
	gulp.task('js-head', function () {
		if ( minify ) {
			var js_refactoring = uglify();
		} else {
			var js_refactoring = util.noop();
		}

		return gulp.src('src/3-else/js/libs/**/*.js')
			.pipe(sourcemaps.init())
			.pipe(concat('script-head.min.js'))
			.pipe(js_refactoring)
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('dist/js'));
	});



/* *************************
	H - JS-FOOT
************************* */
	gulp.task('js-foot', function () {
		if ( minify ) {
			var js_refactoring = uglify();
		} else {
			var js_refactoring = util.noop();
		}

		return gulp.src([
				'src/**/*.js', 
				'!src/3-else/js/libs/**/*.js'
			])
			.pipe(sourcemaps.init())
			.pipe(concat('script-foot.min.js'))
			.pipe(js_refactoring)
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('dist/js'));
	});



/* *************************
	I - WATCH-JS
************************* */
	gulp.task('watch-js', function () {
		watch('src/**/*.js', batch(function (events, done) {
			gulp.start([
				'js-head',
				'js-foot'
			], done);
		}));
	});



/* *************************
	J - IMG-ELSE
************************* */
	gulp.task('img-else', function () {
		return gulp.src([
				'src/3-else/img/*.*', 
				'!src/3-else/img/favicon.png'
			])
			.pipe(imagemin({
				progressive: true
			}))
			.pipe(gulp.dest('dist/img'));
	});



/* *************************
	J - IMG-COMPONENTS
************************* */
	gulp.task('img-components', function () {
		return gulp.src([
				'src/1-components/**/img/*.*',
				'!src/1-components/_name-of-component/**/*'
			])
			.pipe(imagemin({
				progressive: true
			}))
			.pipe(gulp.dest('dist/img'));
	});



/* *************************
	I - WATCH-IMG
************************* */
	gulp.task('watch-img', function () {
		watch('src/**/img/*.*', batch(function (events, done) {
			gulp.start([
				'img-else',
				'img-components'
			], done);
		}));
	});



/* *************************
	J - FONTS
************************* */
	gulp.task('fonts', () => {
        return gulp.src('src/3-else/fonts/**/*')
            .pipe(rename({
				dirname: ''
			}))
            .pipe(gulp.dest('dist/fonts'));
    });



/* *************************
	I - WATCH-FONTS
************************* */
	gulp.task('watch-fonts', function () {
		watch('src/3-else/fonts/**/*', batch(function (events, done) {
			gulp.start('fonts' , done);
		}));
	});



/* *************************
    K - FAVICON
************************* */
    gulp.task("favicon", function () {
        return gulp.src("src/3-else/img/favicon.png").pipe(favicons({
            "appName": null,
            "appDescription": null,
            "developerName": null,
            "developerURL": null,
            "background": "#fff",
            "path": "/",
            "url": "/",
            "display": "standalone",
            "orientation": "portrait",
            "version": "1.0",
            "logging": false,
            "online": false,
            "pipeHTML": false,
            "icons": {
                "android": true,
                "appleIcon": true,
                "appleStartup": true,
                "coast": true,
                "favicons": true,
                "firefox": true,
                "opengraph": true,
                "twitter": true,
                "windows": true,
                "yandex": true
            }
        }))
        .on("error", util.log)
        .pipe(gulp.dest("dist/img/favicons/"));
});



/* *************************
    L - CREATE COMPONENT : gulp component --options name-of-component
************************* */
    var componentFirstLetter = '';
    var componentName = '';
    var shortname = '';
    var parts = '';

    gulp.task('component', [
            'create-component-get-name',
            'create-component-cshtml',
            'create-component-scss',
            'create-component-js'
        ] , function() {
    });

    gulp.task('create-component-get-name', function(){
        componentName = process.argv[4];
        parts = componentName.split('-');

        for (var i = 0; i < parts.length; i += 1) {
            shortname += parts[i].charAt(0);
        }
    });

    gulp.task('create-component-cshtml', ['create-component-get-name'], function() {
        return gulp.src('src/1-components/_name-of-component/_name-of-component.cshtml')
            .pipe(rename("src/1-components/"+componentName+"/_"+componentName+".cshtml"))
            .pipe(replace("lorem", ""+componentName+""))
            .pipe(replace("xxx", ""+shortname+""))
            .pipe(gulp.dest('./'));
    });

    gulp.task('create-component-scss', ['create-component-get-name'], function() {
        return gulp.src('src/1-components/_name-of-component/_name-of-component.scss')
            .pipe(rename("src/1-components/"+componentName+"/_"+componentName+".scss"))
            .pipe(replace("lorem", ""+componentName+""))
            .pipe(replace("xxx", ""+shortname+""))
            .pipe(gulp.dest('./'));
    });

    gulp.task('create-component-js', ['create-component-get-name'], function() {
        return gulp.src('src/1-components/_name-of-component/_name-of-component.js')
            .pipe(rename("src/1-components/"+componentName+"/"+componentName+".js"))
            .pipe(replace("lorem", ""+componentName+""))
            .pipe(gulp.dest('./'));
    });