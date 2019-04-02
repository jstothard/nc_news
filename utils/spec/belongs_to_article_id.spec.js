process.env.NODE_ENV = "test";
const { expect } = require("chai");
const { comments } = require("../../db/data");

const { belongsToToArticleId } = require("../belongs_to_article_id");
const reference = {
  "They're not exactly dogs, are they?": 1,
  "Living in the shadow of a great man": 2
};
//

describe("belongsToToArticleId()", () => {
  it("doesnt mutate original array", () => {
    expect(belongsToToArticleId(reference, comments)).to.not.equal(comments);
  });
  it("converts single elemnent array", () => {
    const newComment = belongsToToArticleId(reference, comments.slice(0, 1));
    expect(newComment).to.eql([
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        author: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
        article_id: 1
      }
    ]);
  });
  it("converts multi elemnent array", () => {
    const newComment = belongsToToArticleId(reference, comments.slice(0, 2));
    expect(newComment).to.eql([
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        author: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
        article_id: 1
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 2,
        author: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ]);
  });
});
