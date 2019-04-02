exports.remapKeys = (reference, comments) => {
  return comments.map(comment => {
    newComment = { ...comment };
    const { belongs_to } = newComment;
    const article_id = reference[belongs_to];
    const author = newComment.created_by;
    delete newComment.belongs_to;
    delete newComment.created_by;
    return { ...newComment, article_id, author };
  });
};
