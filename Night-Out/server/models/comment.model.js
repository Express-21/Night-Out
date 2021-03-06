const Validator = require( '../utils/validator' );

class Comment {
    static isValid(model) {
//        console.log('comment: ' + Validator.validateComment( model ));
        if ( !Validator.validateComment( model ) ) {
            return false;
        }
        return true;
    }

    get id() {
        return this._id;
    }

    static toViewModel(model) {
        const viewModel = new Comment();
        Object.keys(model)
            .forEach( (key) => {
                viewModel[key] = model[key];
            });

        return viewModel;
    }

    static escapeComment( comment ) {
        const filter = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#x27;',
            '/': '&#x2F;',
        };
        let retStr = comment;
        for (let i = 0; i < filter.length; i++) {
            retStr = retStr.replace(new RegExp(i, 'g'), filter[i]);
        }
        return retStr;
    }
}

module.exports = Comment;
