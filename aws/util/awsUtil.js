const AWS = require("aws-sdk");
const Bluebird = require("bluebird");
AWS.config.update({region: process.env.AWS_REGION});
const DDB = new AWS.DynamoDB({apiVersion: "2012-10-08"});
AWS.config.setPromisesDependency(Bluebird);
require("aws-sdk/clients/apigatewaymanagementapi");

const fetch = require("node-fetch");
fetch.Promise = Bluebird

module.exports = {
    AWS,
    DDB,
}
