const { makeExecutableSchema } = require('graphql-tools');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const mongoose = require('mongoose');

const User = mongoose.model('Users');
const Sport = mongoose.model('Sports');
const Group = mongoose.model('Groups');
const Annonce = mongoose.model('Annonces');
const Address = mongoose.model('Addresses');


const typeDefs = `
    scalar Date
    input AnnonceInput {
        name: String, 
        creator: String,
        sport: String,
        date: Date,
        places: Int
    }

    input SubscribeInput {
        userId: String,
        annonceId: String,
    }

    input AddressInput {
        postalCode: String,
        latitude: Float,
        longitude: Float,
        country: String,
        locality: String,
        streetNumber: String,
        route: String,
        addressName: String,
        placeId: String
    }

    type Query {
        users: [User],
        sports: [Sport],
        groups: [Group],
        groupsById(id: String): Group,
        annoncesByGroup(group: String): [Annonce],
        annonces: [Annonce]
        annonce(id: String): Annonce
        searchUser(userContain: String): [User]
        searchSport(sportContain: String): [Sport],
    }

    type Address {
        postalCode: String,
        latitude: Float,
        longitude: Float,
        country: String,
        locality: String,
        streetNumber: String,
        route: String,
    }

    type Mutation {
        addAnnonce(annonce: AnnonceInput, address: AddressInput): Group
        subscribe(subscribe: SubscribeInput): Annonce
    }

    type Sport { 
        _id: String,
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
        _id: String,
        lastName: String,
        firstName: String,
        username: String
        email: String,
        password: String,
        googleId: Int,
        facebookId: Int,
        sports: [Sport],
        image: String,
    }

    type Annonce {
        _id: String,
        date: Date,
        places: Int,
        name:  String,
        sport: Sport,
        creator: User,
        group: Group,
        subscribers: [User],
        placeId: String,
        address: Address
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
        ),
        searchSport: (_, { sportContain }) => {
            const searchRegex = new RegExp(`^${sportContain}`, 'i')
            return Sport.find({ name: searchRegex });
        },
        searchUser: (_, { userContain }) => {
            const searchRegex = new RegExp(`^${userContain}`, 'i')
            return User.find({$or: [
                { 'lastName': searchRegex },
                { 'username': searchRegex },
                { 'firstName': searchRegex }
            ]})
        }
    },
    Mutation: {
        addAnnonce: (root, { annonce, address }) => {
            if (address) {
                return Address.findOne( { placeId : address.placeId } ).then(result => {
                    if (result) {
                        return result._id;
                    } else {
                        return Address.create(address).then(address => {
                            console.log('create', address);
                            return address._id;
                        })
                    }
                }).then(addressId => (
                    Annonce.create({...annonce, address: addressId }).then(annonce => annonce)        
                ))
            } else {
                return Annonce.create(annonce).then(annonce => annonce)
            }
        },
        subscribe: async (root, { subscribe: { userId, annonceId } }) => {
            await Annonce.update(
                { _id: annonceId },
                { $push: { subscribers: userId } }
            );
            return Annonce.findById(annonceId);
        }
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
      address: annonce => ( Address.findById(annonce.address).then(address => address) ),
      subscribers: annonce => {
        console.log(annonce)
        return Promise.all(
            annonce.subscribers.map(user => User.findById(user))
        ).then(users => ( users ));
      }
    }
}

module.exports = makeExecutableSchema({
    typeDefs,
    resolvers,
});
