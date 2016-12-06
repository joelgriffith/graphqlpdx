const { buildSchema } = require('graphql');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const _ = require('lodash');

const PORT = 4000;
const app = express();

// Some intial data
const cars = [
  { id: 'tilmjr4aocefk5ut0529', name: 'lightening mcqueen', model: 'unknown' },
  { id: 'c6y9uocnho2dyf8t1emi', name: 'knight rider', model: 'trans am'}
];

// Defining our types
const schema = buildSchema(`
  type Query {
    car(first: Int, name: String): [Car]
  }

  type Mutation {
    createCar(name: String!, model: String!): Car
  }

  type Car {
    id: ID!
    name: String!
    model: String!
  }
`);

// How our types are resolved, note that these can be async/Promises as well
const root = {
  car: ({ first, name }) => {
    if (name) {
      return _.filter(cars, { name });
    }

    if (first) {
      return _.take(cars, first);
    }

    return cars;
  },
  createCar: ({ name, model }) => {
    const newCar = {
      name,
      model,
      id: Math.random().toString(36).substring(7),
    };

    cars.push(newCar);

    return newCar;
  },
};

app.use('/', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
