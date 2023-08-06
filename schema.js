const { gql } = require('graphql-tag');
const fs = require('fs');
const path = require('path');

const schema = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8');
const typeDefs = gql`${schema}`;

module.exports = typeDefs;
