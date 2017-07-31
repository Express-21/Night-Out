const { expect } = require( 'chai' );

const randomElement = ( arr ) => {
    return arr[Math.floor( Math.random() * arr.length )];
};

describe( 'Validator tests', () => {
    const validShortStrings = [
        'abc', 'abcde', 'a'.repeat( 100 ),
    ];
    const validLongStrings = [
        '',
        'abc',
        'abcde',
        'a'.repeat( 100 ),
        'a'.repeat( 500 ),
        'a'.repeat( 1000 ),
    ];
    const validPasswords = [
        'aaaaa1', 'qwert2', 'Asdsad112', '123456', 'a'.repeat( 99 ) + '1',
    ];
    const invalidPasswords = [
        'aaa', '12345', 'abcdef', 'a'.repeat( 100 ) + '1',
    ];
    const validEmails = [
        'nas.i.nas@abv.gd', 'adsdaada@com.com', 'aaaaaa_Asas@dede.fr',
    ];
    const invalidEmails = [
        '@abv.gd', 'adsdaada@com', 'aaaaaa-Asas@.fr',
    ];
    const invalidShortStrings = [
        '', 'a', 'ab', 'a'.repeat( 101 ),
    ];
    const invalidLongStrings = [
        'a'.repeat( 1001 ),
    ];
    const invalidExtremeLongString = [
        { length: 100001 },
    ];

    const validIds = [];
    const invalidIds = [];

    const Validator = require( '../../../server/utils/validator.js' );

    it( 'stringLength validations', () => {
        for ( let i = 0; i < 100; i += 1 ) {
            const minLength = Math.floor( Math.random() * 6 + 5 );
            const maxLength = minLength + Math.floor( Math.random() * 6 );

            for ( let j = 0; j < 100; j += 1 ) {
                const length = Math.floor( Math.random() * 25 ) + 1;
                const testString = 'a'.repeat( length );
                const result = Validator
                    .stringLength( testString, minLength, maxLength );
                if ( minLength <= length && length <= maxLength ) {
                    expect( result ).to.equal( true );
                } else {
                    expect( result ).to.equal( false );
                }
            }
        }
    } );

    it( 'password validations', () => {
        validPasswords.forEach( ( pass ) => {
            expect( Validator.password( pass ) ).to.equal( true );
        } );
        invalidPasswords.forEach( ( pass ) => {
            expect( Validator.password( pass ) ).to.equal( false );
        } );
    } );

    it( 'email validations', () => {
        validEmails.forEach( ( pass ) => {
            expect( Validator.email( pass ) ).to.equal( true );
        } );
        invalidEmails.forEach( ( pass ) => {
            expect( Validator.email( pass ) ).to.equal( false );
        } );
    } );

    it( 'id validations', () => {
        for ( let i = 0; i < 1000; i += 1 ) {
            const length = Math.floor( Math.random() * 30 );
            let testId = '';
            for ( let j = 0; j < length; j += 1 ) {
                const charCode = 48 + Math.floor( Math.random() * (122 - 48) );
                testId += String.fromCharCode( charCode );
            }
            if ( length === 24 ) {
                expect( Validator.id( testId ) ).to.equal( true );
                validIds.push( testId );
            } else {
                expect( Validator.id( testId ) ).to.equal( false );
                invalidIds.push( testId );
            }
        }
    } );

    it( 'username validations', () => {
        const valid = validShortStrings;
        const invalid = invalidShortStrings;
        valid.forEach( ( username ) => {
            expect( Validator.username( username ) ).to.equal( true );
        } );
        invalid.forEach( ( username ) => {
            expect( Validator.username( username ) ).to.equal( false );
        } );
    } );

    it( 'nationality validations', () => {
        const valid = validShortStrings;
        const invalid = invalidShortStrings;
        valid.forEach( ( nationality ) => {
            expect( Validator.nationality( nationality ) ).to.equal( true );
        } );
        invalid.forEach( ( nationality ) => {
            expect( Validator.nationality( nationality ) ).to.equal( false );
        } );
    } );

    it( 'nationality validations', () => {
        const valid = validShortStrings;
        const invalid = invalidShortStrings;
        valid.forEach( ( nationality ) => {
            expect( Validator.nationality( nationality ) ).to.equal( true );
        } );
        invalid.forEach( ( nationality ) => {
            expect( Validator.nationality( nationality ) ).to.equal( false );
        } );
    } );

    it( 'placeName validations', () => {
        const valid = validShortStrings;
        const invalid = invalidShortStrings;
        valid.forEach( ( placeName ) => {
            expect( Validator.placeName( placeName ) ).to.equal( true );
        } );
        invalid.forEach( ( placeName ) => {
            expect( Validator.placeName( placeName ) ).to.equal( false );
        } );
    } );

    it( 'placeDescription validations', () => {
        const valid = validLongStrings;
        const invalid = invalidExtremeLongString;
        valid.forEach( ( placeDescription ) => {
            expect(Validator.placeDescription(placeDescription))
            .to.equal( true );
        } );
        invalid.forEach( ( placeDescription ) => {
            expect(Validator.placeDescription(placeDescription))
            .to.equal( false );
        } );
    } );

    it( 'townName validations', () => {
        const valid = validShortStrings;
        const invalid = invalidShortStrings;
        valid.forEach( ( townName ) => {
            expect( Validator.townName( townName ) ).to.equal( true );
        } );
        invalid.forEach( ( townName ) => {
            expect( Validator.townName( townName ) ).to.equal( false );
        } );
    } );

    it( 'category validations', () => {
        const valid = Validator.default().CATEGORIES;
        const invalid = validShortStrings;
        valid.forEach( ( category ) => {
            expect( Validator.category( category ) ).to.equal( true );
        } );
        invalid.forEach( ( category ) => {
            expect( Validator.category( category ) ).to.equal( false );
        } );
    } );

    it( 'address validations', () => {
        const valid = validLongStrings;
        const invalid = invalidLongStrings;
        valid.forEach( ( address ) => {
            expect( Validator.address( address ) ).to.equal( true );
        } );
        invalid.forEach( ( address ) => {
            expect( Validator.address( address ) ).to.equal( false );
        } );
    } );

    it( 'openingHours validations', () => {
        const valid = validLongStrings;
        const invalid = invalidLongStrings;
        valid.forEach( ( openingHours ) => {
            expect( Validator.openingHours( openingHours ) ).to.equal( true );
        } );
        invalid.forEach( ( openingHours ) => {
            expect( Validator.openingHours( openingHours ) ).to.equal( false );
        } );
    } );

    it( 'comment validations', () => {
        const valid = validLongStrings;
        const invalid = invalidLongStrings;
        valid.forEach( ( comment ) => {
            expect( Validator.comment( comment ) ).to.equal( true );
        } );
        invalid.forEach( ( comment ) => {
            expect( Validator.comment( comment ) ).to.equal( false );
        } );
    } );

    it( 'user validations', () => {
        for ( let i = 0; i < 100; i += 1 ) {
            const user = {
                username: randomElement( validShortStrings ),
                password: randomElement( validPasswords ),
                email: randomElement( validEmails ),
                nationality: randomElement( validShortStrings ),
            };
            expect( Validator.validateUser( user ) ).to.equal( true );
            switch ( Math.floor( Math.random() * 4 ) ) {
                case 0 :
                {
                    user.username = randomElement( invalidShortStrings );
                    break;
                }
                case 1:
                {
                    user.password = randomElement( invalidPasswords );
                    break;
                }
                case 2:
                {
                    user.email = randomElement( invalidEmails );
                    break;
                }
                default:
                {
                    user.nationality = randomElement( invalidShortStrings );
                }
            }
            expect( Validator.validateUser( user ) ).to.equal( false );
        }
    } );

    it( 'place validations', () => {
        for ( let i = 0; i < 100; i += 1 ) {
            const place = {
                title: randomElement( validShortStrings ),
                description: randomElement( validLongStrings ),
                town: randomElement( validShortStrings ),
                category: randomElement( Validator.default().CATEGORIES ),
                address: randomElement( validLongStrings ),
                openingHours: randomElement( validLongStrings ),
                email: randomElement( validEmails ),
            };
            expect( Validator.validatePlace( place ) ).to.equal( true );
            switch ( Math.floor( Math.random() * 7 ) ) {
                case 0 :
                {
                    place.title = randomElement( invalidShortStrings );
                    break;
                }
                case 1:
                {
                    place.description = randomElement(invalidExtremeLongString);
                    break;
                }
                case 2:
                {
                    place.town = randomElement( invalidShortStrings );
                    break;
                }
                case 3:
                {
                    place.category = randomElement( invalidLongStrings );
                    break;
                }
                case 4:
                {
                    place.address = randomElement( invalidLongStrings );
                    break;
                }
                case 5:
                {
                    place.openingHours = randomElement( invalidLongStrings );
                    break;
                }
                default:
                {
                    place.email = randomElement( invalidEmails );
                }
            }
            expect( Validator.validatePlace( place ) ).to.equal( false );
        }
    } );

    it( 'comment validations', () => {
        for ( let i = 0; i < 100; i += 1 ) {
            const comment = {
                placeId: randomElement( validIds ),
                userId: randomElement( validIds ),
                username: randomElement( validShortStrings ),
                content: randomElement( validLongStrings ),
            };
            expect( Validator.validateComment( comment ) ).to.equal( true );
            switch ( Math.floor( Math.random() * 4 ) ) {
                case 0 :
                {
                    comment.placeId = randomElement( invalidIds );
                    break;
                }
                case 1:
                {
                    comment.userId = randomElement( invalidIds );
                    break;
                }
                case 2:
                {
                    comment.username = randomElement( invalidShortStrings );
                    break;
                }
                default:
                {
                    comment.content = randomElement( invalidLongStrings );
                }
            }
            expect( Validator.validateComment( comment ) ).to.equal( false );
        }
    } );
} );
