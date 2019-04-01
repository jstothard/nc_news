exports.createArticleRef = arr => {
  return arr.reduce((ref, currObj) => {
    const { title, article_id } = currObj;
    ref[title] = article_id;
    return ref;
  }, {});
};
