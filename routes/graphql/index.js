const express = require('express');
import { graphqlExpress } from 'apollo-server-express';
const Graphql = require('../../graphql/shemas/shema');


const router = express.Router();


router.use('/', graphqlExpress({ schema: Graphql }))

// router.use('//')

module.exports = router;