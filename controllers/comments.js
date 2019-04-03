const { getComments } = require("../models/comments");

exports.fetchComments = (req, res, next) => {
  getComments(req.params["article_id"]).then(comments => {
    return res.status(200).send({ comments });
  });
};
