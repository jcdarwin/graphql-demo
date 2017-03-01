const { GraphQLObjectType, GraphQLString, GraphQLSchema } = require('graphql');
const express = require('express');
const graphQLHTTP = require('express-graphql');
const compression = require('compression');
const cors = require('cors');
const rp = require('request-promise');
const PORT = 4000;

const getHi = new GraphQLObjectType({
    name: 'getHi',
    description: 'Returns a simple greeting',
    fields: {
        greeting: {
            type: GraphQLString,
            description: 'Outputs Hello World!',
            resolve: (args) => {
                const req = {
                    url: 'http://www.mocky.io/v2/58b73184110000771b9c438b',
                    method: 'GET',
                    headers: {},
                }

                return rp(req).then(res => {
                    const json = JSON.parse(res);
                    process.env.NODE_ENV !== 'production' && console.info(`${req.url} called`)
                    return `${json.greeting} ${args.name || 'World'}!`
                }).catch(e => {
                    throw e;
                });
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
.listen(PORT, function (err) {
    console.log(`GraphQL Server is now running on localhost:${PORT}`);
});
