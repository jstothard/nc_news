const { getUser } = require("../models/users");

exports.fetchUser = (req, res, next) => {
  getUser(req.params.username).then(([user]) => {
    if (user === undefined) next({ status: 404 });
    else return res.status(200).send({ user });
  });
};
