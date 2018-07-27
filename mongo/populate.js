'strict mode';

const Promise = require('bluebird');
const fs = require('fs');
const _ = require('lodash');
const Users = require('./schemas/user').model;
const Group = require('./schemas/group').model;
const Sports = require('./schemas/sport').model;
const Annonce = require('./schemas/annonce').model;

let sports = [];
let allusers = [];
function populate(next) {
    Promise.all([
        Users.remove({}),
        Group.remove({}),
        Sports.remove({}),
        Annonce.remove({})
    ]).then(() => {
        return Promise.all([
            Sports.create({ key: 'COURSE_PIED', name: 'Course à pied'}),
            Sports.create({ key: 'FOOT', name: 'Football'}),
            Sports.create({ key: 'URBANFOOT', name: 'Urban foot'}),
            Sports.create({ key: 'BASKET', name: 'Basket-ball'}),
            Sports.create({ key: 'VELO', name: 'Vélo'}),
        ]);
    })
    .then((s) => {
        sports = s;
        return Promise.all([
            Users.create({
                lastName: 'Guillemotos',
                firstName: 'Antoine',
                username: 'Nioto',
                password: 'toto',
                email: 'antoine.guillemoto@gmail.com',
                sports: _.take(sports, 1)

            }),
            Users.create({
                lastName: 'Wadlaire Ferrons',
                firstName: 'Pierre',
                username: 'Arken',
                password: 'toto',
                email: 'nioto.guillemoto@gmail.com',
                sports: _.takeRight(sports, 1)
            }),
            Users.create({
                lastName: 'Cirjean',
                firstName: 'Remy',
                username: 'Arkan',
                password: 'toto',
                email: 'fwadlaire@gmail.com',
                sports: _.takeRight(sports, 3)
            }),
            Users.create({
                lastName: 'Sanchez',
                firstName: 'Julien',
                username: 'El matador',
                password: 'toto',
                email: 'fwadlaire@gmail.com',
                sports: _.takeRight(sports, 3)
            }),
            Users.create({
                lastName: 'Michelle',
                firstName: 'Biza',
                username: 'El rojo',
                password: 'toto',
                email: 'fwadlaire@gmail.com',
                sports: _.takeRight(sports, 3)
            }),
            Users.create({
                lastName: 'Antoine',
                firstName: 'Antoine',
                username: 'Tonio',
                password: 'toto',
                email: 'fwadlaire@gmail.com',
                sports: _.takeRight(sports, 3)
            })
        ]).then(users => {
            allusers = users;
            return Promise.all([
                Group.create({ name: 'Foot st-ouensss', creator: users[5], sport: sports[1]._id, admin: [users[0]] }),
                Group.create({ name: 'Foot Paris 8eme', creator: users[1], sport: sports[1] }),
                Group.create({ name: 'Foot Lorient', creator: users[1], sport: sports[1] }),
                Group.create({ name: 'Course a pied Poissy', creator: users[0], sport: sports[0] }),
                Group.create({ name: 'Course a pied Plaisir', creator: users[0], sport: sports[0] }),
                Group.create({ name: 'Course a pied Nice', creator: users[2], sport: sports[0] }),
                Group.create({ name: 'Course a pied Montargis', creator: users[2], sport: sports[0] }),
                Group.create({ name: 'Basket-ball Poissy', creator: users[1], sport: sports[3] }),
                Group.create({ name: 'Urban foot Clohar-carnoë', creator: users[1], sport: sports[2] }),
            ]);
        }).then(groups => {
            return Promise.all(groups.map(group => (
                [
                    Annonce.create({ annonce: group._id, date: new Date(), subscribers: allusers, places: 10, creator: group.creator, sport: group.sport, name: group.name }),
                    Annonce.create({ annonce: group._id, date: new Date(), subscribers: _.take(allusers, 2), places: 10, creator: group.creator, sport: group.sport, name: group.name }),
                    Annonce.create({ annonce: group._id, date: new Date(), subscribers: _.take(allusers, 4), places: 10, creator: group.creator, sport: group.sport, name: group.name })
                ]
            )))
        })
    });
};

module.exports = populate;
