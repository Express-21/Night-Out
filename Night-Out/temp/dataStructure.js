const User = {
    username: '',
    email: '',
    password: '',
    stringProfilePicture: '',
    favourites: [{
        placeId: '',
        placeTitle: '',
        placeType: '',
        placeDescr: '',
    }],
};

const Favourite = {
    userId: '',
    placeId: '',
    placeTitle: '',
    placeType: '',
    placeDescr: '',
};

const Place = {
    title: '',
    picUrl: '',
    description: '',
    town: '',
    address: '',
    openingHours: '',
    email: '',
    type: '',
    rating: '',
    numberOfVotes: '', // keep the number to be able to calc next average
    comments: [{
        commentId: '',
        userId: '',
        username: '',
        content: '',
    }],
};

const Comment = {
    placeId: '',
    userId: '',
    username: '',
    content: '',
};

const Town = {
    name: '',
};


