const BaseData = require('./base.data.js');
const Comment = require('../models/comment.model.js');

class Comments extends BaseData {
    constructor( db ) {
        super(db, Comment, Comment);
    }

    create( model, places ) {
        return super.create(model)
        .then( (comment) => {
                return places.getById( comment.placeId );
            })
        .then( ( place ) => {
                if (!place.comments) {
                    place.comments = [];
                }
                if (place.comments.length === 5) {
                    place.comments.unshift();
                }
                place.comments.push(model);
                return places.collection.updateOne( { _id: place.id }, place );
            } );
    }
}

module.exports = Comments;