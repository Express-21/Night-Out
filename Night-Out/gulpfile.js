const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const browser = require('openurl');
const istanbul = require( 'gulp-istanbul' );
const mocha = require( 'gulp-mocha' );

gulp.task( 'pre-test', () => {
    return gulp.src( ['./server/**/*.js'] )
        .pipe( istanbul( {
            includeUntested: true,
        } ) )
        .pipe( istanbul.hookRequire() );
} );

gulp.task( 'tests:unit', ['pre-test'], () => {
    return gulp.src( './tests/unit/**/*.js' )
        .pipe( mocha( {
            reporter: 'dot',
        } ) )
        .pipe( istanbul.writeReports() );
} );

gulp.task( 'tests:integration', ['pre-test'], () => {
    return gulp.src( './tests/integration/**/*.js' )
        .pipe( mocha( {
            reporter: 'dot',
        } ) )
        .pipe( istanbul.writeReports() );
} );

gulp.task( 'tests:all', ['pre-test'], () => {
    return gulp.src( './tests/**/*.js' )
        .pipe( mocha( {
            reporter: 'dot',
        } ) )
        .pipe( istanbul.writeReports( {
            reporters: ['lcov', 'json', 'text', 'text-summary'],
        } ) );
} );

//gulp.task('tests:app', ['pre-test'], () => {
//    return gulp.src('./tests/app/**/*.js')
//        .pipe( mocha( {
//            reporter: 'dot',
//        }))
//        .pipe(istanbul.writeReports());
//});

gulp.task('server', ()=>{
    const async = () => {
        return Promise.resolve();
    };
    let config = null;
    async()
        .then( () => {
            return require( './server/config/app.config.js' )
                .init( '127.0.0.1', 3001 );
        } )
        .then( ( _config ) => {
            config = _config;
            return require( './server/db' ).init( config.connectionString );
        } )
        .then( ( db ) => require( './server/data' ).init( db ) )
        .then( ( data ) => {
            data.sessionStoreName = config.sessionStoreName;
            return require( './server/app' ).init( data );
        } )
        .then( ( app ) => {
            app.listen( config.port, () =>
                console.log( `Server running at: ${config.port}` ) );
            // browser.open(`config.port`);
        } );
});

gulp.task('dev', ['server'], () => {
    return nodemon({
        ext: 'js',
        tasks: ['server'],
        script: 'gulpfile.js',
    });
});


