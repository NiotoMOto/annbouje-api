const { makeExecutableSchema } = require('graphql-tools');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const mongoose = require('mongoose');

const User = mongoose.model('Users');
const Sport = mongoose.model('Sports');
const Group = mongoose.model('Groups');
const Annonce = mongoose.model('Annonces');


const typeDefs = `
    scalar Date
    input GroupInput {
        name: String, 
        creator: String,
        sport: String,
    }

    type Query {
        users: [User],
        sports: [Sport],
        groups: [Group],
        groupsById(id: String): Group,
        annoncesByGroup(group: String): [Annonce],
        annonces: [Annonce]
        annonce(id: String): Annonce
    }

    type Mutation {
        addGroup(annonce: GroupInput): Group
    }

    type Sport { 
        name: String,
        key: String,
    }

    type Group {
        _id: String,
        name: String, 
        creator: User,
        sport: Sport,
        annonces: [Annonce]
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

    type Annonce {
        _id: String
        date: Date,
        places: Int,
        name:  String,
        sport: Sport,
        creator: User,
        group: Group,
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
        groups: () => Groups.find({}).then(groups => groups),
        groupsById: (_, { id }) => Annonce.findById(id).then(groups => groups),
        annoncesByGroup: (_, { group }) => (
           Annonce.find({ group }).then(annonces => {
            return annonces;
           })
        ),
        annonces: () => Annonce.find({}).then(annonces => annonces),
        annonce: (_, { id }) => (
            Annonce.findById(id)
                .then(Annonce => {
                return Annonce
            })
        )
    },
    Mutation: {
        addGroup: (root, { group }) => (
            Annonce.create(group).then(group => group)
        )
    },
    Group: {
        creator: group => ( User.findById(group.creator).then(user => user) ),
        sport: group => ( Sport.findById(group.sport).then(sport => sport )),
        annonces: group => ( Annonce.find({ annonce: group._id }).then(annonces => {
            return annonces;
           })
        )
    },

    Annonce: {
      creator: annonce => ( User.findById(annonce.creator).then(user => user) ),
      sport: annonce => ( Sport.findById(annonce.sport).then(sport => sport )),
      group: annonce => ( Group.findById(annonce.group).then(group => group) ),
      subscribers: Annonce => (
        Promise.all(
          Annonce.subscribers.map(user => User.findById(user))
        ).then(users => ( users ))
      )
    }
}

module.exports = makeExecutableSchema({
    typeDefs,
    resolvers,
});
