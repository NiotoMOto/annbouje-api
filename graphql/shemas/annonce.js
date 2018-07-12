const { makeExecutableSchema } = require('graphql-tools');
const User = require('mongoose').model('Users');


const typeDefs = `
    type Query { users: [USER] }
    type USER {
        lastName: String,
        firstName: String,
        username: String
        email: String,
        password: String,
        googleId: Int,
        facebookId: Int,
    }
`;
const resolvers = {
    Query: {
        users: () => User.find({}).then((users) => (users))
    }
}

module.exports = makeExecutableSchema({
    typeDefs,
    resolvers,
})
