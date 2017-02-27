# What is this?

This is a demonstration of a simple GraphQL server.

## Installation

    npm install

## Usage

    npm start

and then submit a query:

    curl -X POST -H "Content-Type: application/graphql" -H "Cache-Control: no-cache" -d 'query {
        # Query the demo API
        getHi(name: "Jason") {
            greeting
        }
    }' "http://localhost:8080/graphql"

You should see a result set similar to the following:

    {
      "data": {
        "getHi": {
          "greeting": "Hello Jason!"
        }
      }
    }

