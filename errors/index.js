exports.handle400 = (err, req, res, next) => {
  const badRequestCodes = ["22P02", "42703"];
  if (badRequestCodes.includes(err.code) || err.status === 400) {
    res.status(400).send({ msg: "Bad Request" });
  } else next(err);
};

exports.handle404 = (err, req, res, next) => {
  const badRequestCodes = ["23503"];
  if (
    err.status === 404 ||
    (badRequestCodes.includes(err.code) &&
      err.constraint !== "comments_author_foreign")
  ) {
    res.status(404).send({ msg: "Not Found" });
  } else next(err);
};

exports.handle405 = (req, res) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};

exports.handle422 = (err, req, res, next) => {
  const badRequestCodes = ["23503"];
  if (err.status === 422 || badRequestCodes.includes(err.code)) {
    res.status(422).send({ msg: "Unprocessable Entity" });
  } else next(err);
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
