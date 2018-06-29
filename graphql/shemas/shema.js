const { makeExecutableSchema } = require('graphql-tools');
const mongoose = require('mongoose');

const User = mongoose.model('Users');
const Sport = mongoose.model('Sports');
const Annonce = mongoose.model('Annonces');


const typeDefs = `
    type Query {
        users: [User],
        sports: [Sport],
        annonces: [Annonce]
    }

    type Sport {
        name: String,
        key: String,
    }

    type Annonce {
        name: String, 
        creator: User,
        sport: Sport,
    }

    type User {
        lastName: String,
        firstName: String,
        username: String
        email: String,
        password: String,
        googleId: Int,
        facebookId: Int,
        sports: [Sport],
    }
`;

const resolvers = {
    Query: {
        users: () => User.find({}).then((users) => users),
        sports: () => Sport.find({}).then((sports) => sports),
        annonces: () => Annonce.find({}).then(annonces => annonces)
    },
    Annonce: {
        creator: annonce => ( User.findById(annonce.creator).then(user => user) )
    }
}

module.exports = makeExecutableSchema({
    typeDefs,
    resolvers,
});
