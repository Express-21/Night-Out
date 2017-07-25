class Validator {
    static stringLength( s, min, max ) {
        if ( !s ) {
            return false;
        }
        return ( min <= s.length ) && ( s.length <= max );
    }

    static username( username ) {
        return Validator.stringLength( username, 3, 100 );
    }

    static password( password ) {
        return Validator.stringLength( password, 6, 100 ) &&
            (password.match( /[0-9]/g ).length > 0);
    }

    static email( email ) {
        const template = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return template.test( email );
    }

    static nationality( nationality ) {
        return Validator.stringLength( nationality, 3, 100 );
    }

    static validateUser( { username, email, password, nationality } ) {
        return Validator.username( username ) &&
            Validator.password( password ) &&
            Validator.email( email ) &&
            Validator.nationality( nationality );
    }
}

module.exports = Validator;