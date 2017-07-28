const DEFAULT_MIN_LENGTH = 3,
    DEFAULT_MAX_LENGTH = 100,
    DEFAULT_CATEGORIES = ['restaurants', 'bars', 'clubs'];

class Validator {
    static stringLength( s, min, max ) {
        min = min || DEFAULT_MIN_LENGTH;
        max = max || DEFAULT_MAX_LENGTH;
        if ( !s ) {
            return false;
        }
        return ( min <= s.length ) && ( s.length <= max );
    }

    static password( password ) {
        return Validator.stringLength( password, 6, 100 ) &&
            (password.match( /[0-9]/g ).length > 0);
    }

    static email( email ) {
        const template = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return template.test( email );
    }

    static id( id ) {
        return Validator.stringLength( '' + id, 24, 24 );
    }

    // <-----user validations----->
    static username( username ) {
        return Validator.stringLength( username );
    }

    static nationality( nationality ) {
        return Validator.stringLength( nationality );
    }

    // <-----places validations----->
    static placeName( name ) {
        return Validator.stringLength( name );
    }

    static placeDescription( descr ) {
        return Validator.stringLength( descr, 0, 10000 );
    }

    static townName( town ) {
        return Validator.stringLength( town );
    }

    static category( cat ) {
        return ( DEFAULT_CATEGORIES.indexOf( cat ) !== -1 );
    }

    static address( addr ) {
        return Validator.stringLength( addr, 0, 1000 );
    }

    static openingHours( hrs ) {
        return Validator.stringLength( hrs, 0, 1000 );
    }

    // <-----comment validations----->
    static comment( comment ) {
        return Validator.stringLength( comment, 0, 1000 );
    }

    // <-----bulk validations----->
    static validateUser( { username, email, password, nationality } ) {
        return Validator.username( username ) &&
            Validator.password( password ) &&
            Validator.email( email ) &&
            Validator.nationality( nationality );
    }

    static validatePlace( { title, description, town, category, address, openingHours, email } ) {
        return Validator.placeName( title ) &&
            Validator.placeDescription( description ) &&
            Validator.townName( town ) &&
            Validator.category( category ) &&
            Validator.address( address ) &&
            Validator.openingHours( openingHours ) &&
            Validator.email( email );
    }

    static validateComment( { placeId, userId, username, content } ) {
        return Validator.id( placeId ) &&
            Validator.id( userId ) &&
            Validator.username( username ) &&
            Validator.comment( content );
    }
}

module.exports = Validator;