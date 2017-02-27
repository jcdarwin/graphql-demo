const { GraphQLObjectType, GraphQLString, GraphQLSchema } = require('graphql');
const express = require('express');
const graphQLHTTP = require('express-graphql');
const compression = require('compression');
const cors = require('cors');

const getHi = new GraphQLObjectType({
    name: 'getHi',
    description: 'Returns a simple greeting',
    fields: {
        greeting: {
            type: GraphQLString,
            description: 'Outputs Hello World!',
            resolve: (args) => {
                return `Hello ${args.name || 'World'}!`
            }
        }
    }
})

const rootQuery = new GraphQLObjectType({
    name: 'rootQuery',
    description: 'Our root query',
    fields: {
        getHi: {
            type: getHi,
            args: { name: { type: GraphQLString } },
            resolve: (root, args, context) => {
                // Our root query needs a resolver which returns a non-null value,
                // otherwise resolvers further down will not work.
                return args
            }
        }
    }
})

const Schema = new GraphQLSchema({
    query: rootQuery
});

const app = express();

// add cors headers
app.use(cors());

// compress all responses
app.use(compression())

app.use('/', graphQLHTTP({
    schema: Schema,
    pretty: true,
    graphiql: process.env.NODE_ENV !== 'production',
}))
.listen(8080, function (err) {
    console.log('GraphQL Server is now running on localhost:8080');
});
