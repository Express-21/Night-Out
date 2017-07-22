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
    } /* Store only 5, the rest to be loaded via a "see all btn" */],
}

const Favourite = {
    userId:'',
    placeId: '',
    placeTitle: '',
    placeType: '',
    placeDescr: '',
}

const Place = {
    title: '',
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
    } /* Store only 5, the rest to be loaded via a "see all btn" */],
}

const Comment = {
    placeId: '',
    userId: '',
    username: '',
    content: '',
}

const Town = {
    name: '',
}


