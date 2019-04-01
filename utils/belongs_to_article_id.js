exports.belongsToToArticleId = (reference, comments) => {
  return comments.map(comment => {
    newComment = { ...comment };
    const { belongs_to } = newComment;
    const article_id = reference[belongs_to];
    delete newComment.belongs_to;
    newComment.article_id = article_id;
    return newComment;
  });
};
