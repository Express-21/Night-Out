const BaseData = require('./base.data.js');
const Comment = require('../models/comment.model.js');

class Comments extends BaseData {
    constructor( db ) {
        super(db, Comment, Comment);
    }
}

module.exports = Comments;