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

gulp.task( 'tests:all', ['pre-test', 'test-server:start'], () => {
    return gulp.src( './tests/**/*.js' )
        .pipe( mocha( {
            reporter: 'dot',
            timeout: 20000,
        } ) )
        .pipe( istanbul.writeReports( {
            reporters: ['lcov', 'json', 'text', 'text-summary'],
        } ) )
        .once( 'end', () => {
            gulp.start( 'test-server:stop' );
        } );
});

gulp.task('server', ()=>{
    let config = null;
    return Promise.resolve()
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
        } );
});

let config = null;

gulp.task( 'test-server:start', () => {
    return Promise.resolve()
        .then( () => {
            return require( './server/config/app.config.js' )
                .init( '127.0.0.1', 3010, '(browser-tests)' );
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
        } );
} );

const { MongoClient } = require( 'mongodb' );

gulp.task( 'test-server:stop', () => {
    return Promise.all( [
        MongoClient.connect( config.connectionString )
            .then( ( db ) => {
                return db.dropDatabase();
            } ),
        MongoClient.connect( config.sessionStoreName )
            .then( ( db ) => {
                return db.dropDatabase();
            } ),
    ] );
} );

gulp.task( 'tests:browser', ['test-server:start'], () => {
    return gulp.src( './tests/browser/**/*.js' )
        .pipe( mocha( {
            reporter: 'dot',
            timeout: 10000,
        } ) )
        .once( 'end', () => {
            gulp.start( 'test-server:stop' );
        } );
} );

gulp.task('dev', ['server'], () => {
    return nodemon({
        ext: 'js',
        tasks: ['server'],
        script: 'gulpfile.js',
    });
});


