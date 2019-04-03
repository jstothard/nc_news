const { getUser } = require("../models/users");

exports.fetchUser = (req, res, next) => {
  getUser(req.params.username).then(([user]) => {
    return res.status(200).send({ user });
  });
};
