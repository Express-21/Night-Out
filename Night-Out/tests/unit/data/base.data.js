const { expect } = require( 'chai' );
const sinon = require( 'sinon' );
const BaseData = require( '../../../server/data/base.data.js' );

describe( 'BaseData tests', () => {
    let items = [];

    const db = {
        collection: () => {
        },
    };
    let ModelClass = null;
    let validtator = null;
    let data = null;

    const toArray = () => {
        return Promise.resolve( items );
    };

    const find = () => {
        return {
            toArray,
        };
    };

    const findOne = ( filter ) => {
        const id = filter._id.$eq;
        const result = items.filter( ( item ) => {
                return (item.id == id);
            } )[0] || null;
        return Promise.resolve( result );
    };

    const updateOne = ( filter, model ) => {
        const id = filter._id;
        items = items.map( ( item ) => {
            return (item.id == id) ? model : item;
        } );
        return Promise.resolve( items );
    };

    const deleteOne = ( filter ) => {
        const id = filter._id;
        const index = items.findIndex( ( element ) => {
            return element.id == id;
        } );
        items.splice( index, 1, 1 );
        return Promise.resolve( items );
    };

    const insert = ( model ) => {
        items.push( model );
        return Promise.resolve( { ops: [model] } );
    };

    beforeEach( ()=> {
        sinon.stub( db, 'collection' )
            .callsFake( () => {
                return {
                    find,
                    findOne,
                    updateOne,
                    deleteOne,
                    insert,
                };
            } );
        ModelClass = class {
            static toViewModel( model ) {
                return model;
            }
        };

        validtator = class {
            static isValid( model ) {
                return (model.name === 'test');
            }
        };

        data = new BaseData( db, ModelClass, validtator );
    } );

    afterEach( () => {
        db.collection.restore();
    } );

    it( 'expect getAll to return all items', () => {
        items = [1, 2, 3];
        return data.getAll()
            .then( ( models ) => {
                expect( models ).to.deep.equal( items );
            } );
    } );

    it( 'expect findById to return the correct item', ()=> {
        items = [{ id: '596de4cfcb19a331a4f4b5f5' }, { id: '2' }];
        const id = '596de4cfcb19a331a4f4b5f5';
        return data.findById( id )
            .then( ( item ) => {
                expect( item.id ).to.equal( id );
            } );
    } );

    it( 'expect findById to return null if not found', () => {
        items = [{ id: '596de4cfcb19a331a4f4b5f5' }, { id: '2' }];
        const id = '123456789012345678901234';
        return data.findById( id )
            .then( ( item ) => {
                expect( item ).to.equal( null );
            } );
    } );

    it( 'expect findById to reject on bad ID', () => {
        const id = '1';
        return data.findById( id )
            .then( () => {
                throw new Error( 'internal' );
            } )
            .catch( ( err ) => {
                expect( err.message ).to.not.equal( 'internal' );
            } );
    } );

    it( 'expect updateById to update the correct item', ()=> {
        items = [{ id: '596de4cfcb19a331a4f4b5f5' }, { id: '2' }];
        const id = '596de4cfcb19a331a4f4b5f5';
        const model = { name: 'test', id };
        return data.updateById( model )
            .then( () => {
                return data.findById( id );
            } )
            .then( ( item ) => {
                expect( item ).to.deep.equal( model );
            } );
    } );

    it( 'expect updateById to reject on bad ID', () => {
        const id = '1';
        const model = { name: 'test', id };
        return data.updateById( model )
            .then( () => {
                throw new Error( 'internal' );
            } )
            .catch( ( err ) => {
                expect( err.message ).to.not.equal( 'internal' );
            } );
    } );

    it( 'expect updateById to reject on bad model', () => {
        const id = '596de4cfcb19a331a4f4b5f5';
        const model = { name: 'wrong', id };
        return data.updateById( model )
            .then( () => {
                throw new Error( 'internal' );
            } )
            .catch( ( err ) => {
                expect( err.message ).to.not.equal( 'internal' );
            } );
    } );

    it( 'expect removeById to remove the correct item', ()=> {
        items = [{ id: '596de4cfcb19a331a4f4b5f5' }, { id: '2' }];
        const id = '596de4cfcb19a331a4f4b5f5';
        const model = { name: 'test', id };
        return data.removeById( model )
            .then( () => {
                return data.findById( id );
            } )
            .then( ( item ) => {
                expect( item ).to.equal( null );
            } );
    } );

    it( 'expect removeById to reject on bad ID', () => {
        items = [{ id: '596de4cfcb19a331a4f4b5f5' }, { id: '2' }];
        const id = '1';
        const model = { name: 'test', id };
        return data.removeById( model )
            .then( () => {
                throw new Error( 'internal' );
            } )
            .catch( ( err ) => {
                expect( err.message ).to.not.equal( 'internal' );
            } );
    } );

    it( 'expect create to return the correct item', ()=> {
        items = [{ id: '596de4cfcb19a331a4f4b5f5' }, { id: '2' }];
        const id = '123456789012345678901234';
        const model = { name: 'test', id };
        return data.create( model )
            .then( () => {
                return data.findById( id );
            } )
            .then( ( item ) => {
                expect( item ).to.deep.equal( model );
            } );
    } );

    it( 'expect create to reject on bad model', () => {
        const id = '596de4cfcb19a331a4f4b5f5';
        const model = { name: 'wrong', id };
        return data.create( model )
            .then( () => {
                throw new Error( 'internal' );
            } )
            .catch( ( err ) => {
                expect( err.message ).to.not.equal( 'internal' );
            } );
    } );
} );