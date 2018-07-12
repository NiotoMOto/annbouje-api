const { makeExecutableSchema } = require('graphql-tools');
const Sport = require('mongoose').model('Sports');


const typeDefs = `
    type Query { sports: [SPORT] }
    type SPORT {
        name: String,
        key: String
    }
`;
const resolvers = {
    Query: {
        sports: () => Sport.find({}).then((sports) => ( sports))
    }
}

module.exports = makeExecutableSchema({
    typeDefs,
    resolvers,
})
