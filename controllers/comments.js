const {
  getComments,
  postComment,
  patchComment,
  deleteComment
} = require("../models/comments");

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

exports.updateComment = (req, res, next) => {
  patchComment(req.params["comment_id"], req.body["inc_votes"]).then(
    ([comment]) => {
      return res.status(200).send({ comment });
    }
  );
};

exports.removeComment = (req, res, next) => {
  deleteComment(req.params["comment_id"]).then(() => {
    return res.status(204).send();
  });
};
