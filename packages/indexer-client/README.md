# Indexer Client

Library package for querying the indexer's GraphQL endpoint.
The client code is generated automatically using [graphql-codegen](https://www.the-guild.dev/graphql/codegen).

### Getting started

1. This project is part of [Turborepo](https://turborepo.org). To install dependencies simply run `yarn install`
   from the root directory
2. Run `yarn generate` to generate or update the client code. The codegen tools will query the endpoint and
   generate the required types and functions
3. Import the library by adding `"@petra/indexer-client": "*"` to your `package.json`
4. If you're building or developing just the extension, make sure to either run `yarn build` or `yarn dev` from
   this folder. Alternatively run `yarn build` or `yarn dev` from the root directory