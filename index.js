
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const { graphiqlExpress } = require('apollo-server-express');
const cors = require('cors');
const app = express();
const config = require('./config')
const apiRoutes = require('./routes/api');
const graphRoutes = require('./routes/graphql');
const publicRoutes = require('./routes/public');
const passport = require('./services/passport');


const populateDatabase = require('./mongo/populate.js');


var corsOptions = {
  origin: function (origin, callback) {
    if (!origin || config.origins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}

populateDatabase();
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
app.use(express.static('static'));
app.use(passport.initialize());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors(corsOptions));

app.use(apiRoutes);
app.use(publicRoutes);
app.use('/graphql', graphRoutes);
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));


app.listen(config.port, function () {
  console.log(`Serveur mise en route sur le port ${config.port}`);
});
