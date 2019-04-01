// require in and export out all test data

const articles = require("./data/articles");
const comments = require("./data/comments");
const topics = require("./data/topics");
const users = require("./data/users");

module.exports = { articles, comments, topics, users };
