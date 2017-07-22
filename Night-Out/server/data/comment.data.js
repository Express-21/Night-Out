const BaseData = require('./base.data.js');
const Comment = require('../models/comment.model.js');

class Comments extends BaseData {
    constructor( db ) {
        super(db, Comment, Comment);
    }

    create( model, places ) {
        return super.create(model)
        .then( (comment) => {
                return places.findById( comment.placeId );
            })
        .then( ( place ) => {
                if (!place.comments) {
                    place.comments = [];
                }
                while (place.comments.length >= 5) {
                    place.comments.shift();
                }
                place.comments.push(model);
                return places.updateById(place);
            } );
    }
}

module.exports = Comments;