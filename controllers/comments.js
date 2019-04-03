const { getComments, postComment } = require("../models/comments");

exports.fetchComments = (req, res, next) => {
  getComments(req.params["article_id"]).then(comments => {
    return res.status(200).send({ comments });
  });
};

exports.sendComment = (req, res, next) => {
  postComment(
    req.params["article_id"],
    req.body["username"],
    req.body["body"]
  ).then(([comment]) => {
    return res.status(200).send({ comment });
  });
};
