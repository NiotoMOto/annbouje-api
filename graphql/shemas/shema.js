const { makeExecutableSchema } = require('graphql-tools');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const mongoose = require('mongoose');

const User = mongoose.model('Users');
const Sport = mongoose.model('Sports');
const Annonce = mongoose.model('Annonces');
const InstanceAnnonce = mongoose.model('InstanceAnnonces');


const typeDefs = `
    scalar Date

    type Query {
        users: [User],
        sports: [Sport],
        annonces: [Annonce],
        instanceAnnonces(annonce: String): [InstanceAnnonce]
    }

    type Sport {
        name: String,
        key: String,
    }

    type Annonce {
        _id: String,
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

    type InstanceAnnonce {
        date: Date,
        annonce: Annonce,
        subscribers: [User]
    }
`;

const resolvers = {
    Date: new GraphQLScalarType({
      name: 'Date',
      description: 'Date custom scalar type',
      parseValue(value) {
        return new Date(value); // value from the client
      },
      serialize(value) {
        return value.getTime(); // value sent to the client
      },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
          return parseInt(ast.value, 10); // ast value is always in string format
        }
        return null;
      },
    }),
    Query: {
        users: () => User.find({}).then((users) => users),
        sports: () => Sport.find({}).then((sports) => sports),
        annonces: () => Annonce.find({}).then(annonces => annonces),
        instanceAnnonces: (_, {annonce}) => (
           InstanceAnnonce.find({ annonce }).then(InstanceAnnonces => {
            return InstanceAnnonces;
           })
        )
    },
    Annonce: {
        creator: annonce => ( User.findById(annonce.creator).then(user => user) ),
        sport: annonce => ( Sport.findById(annonce.sport).then(sport => sport ))
    },

    InstanceAnnonce: {
      annonce: instanceAnnonce => ( Annonce.findById(instanceAnnonce.annonce).then(annonce => annonce) ),
      subscribers: instanceAnnonce => (
        Promise.all(
          instanceAnnonce.subscribers.map(user => User.findById(user))
        ).then(users => ( users ))
      )
    }
}

module.exports = makeExecutableSchema({
    typeDefs,
    resolvers,
});
