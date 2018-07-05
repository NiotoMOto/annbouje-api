const express = require('express');
const { graphqlExpress } = require('apollo-server-express');
const Graphql = require('../../graphql/shemas/shema');


const router = express.Router();


router.use('/', graphqlExpress({ schema: Graphql }))

module.exports = router;