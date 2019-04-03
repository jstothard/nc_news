process.env.NODE_ENV = "test";

const { expect } = require("chai");
const supertest = require("supertest");

const app = require("../app");
const connection = require("../db/connection");

const request = supertest(app);

describe("/", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/api", () => {
    it("GET status:200", () => {
      return request
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.ok).to.equal(true);
        });
    });
    describe("/topics", () => {
      describe("DEFAULT GET BEHAVIOUR", () => {
        it("GET status:200 returns a list of length n with correct keys", () => {
          return request
            .get("/api/topics")
            .expect(200)
            .then(({ body: { topics } }) => {
              expect(topics).to.have.length(2);
              topics.forEach(topic => {
                expect(topic).to.contain.keys("slug", "description");
              });
            });
        });
      });
    });
    describe("/articles", () => {
      describe("DEFAULT GET BEHAVIOUR", () => {
        it("GET status:200 returns a list of length n with correct keys", () => {
          return request
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.have.length(12);
              articles.forEach(article => {
                expect(article).to.contain.keys(
                  "author",
                  "title",
                  "article_id",
                  "topic",
                  "created_at",
                  "votes",
                  "comment_count"
                );
              });
            });
        });
      });
      describe("/:article_id", () => {
        describe("DEFAULT GET BEHAVIOUR", () => {
          it("GET status:200 returns a single article object", () => {
            return request
              .get("/api/articles/1")
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article).to.eql({
                  author: "butter_bridge",
                  title: "Living in the shadow of a great man",
                  article_id: 1,
                  body: "I find this existence challenging",
                  topic: "mitch",
                  created_at: "2018-11-15T00:00:00.000Z",
                  votes: 100,
                  comment_count: "13"
                });
              });
          });
        });
        describe("DEFAULT PATCH BEHAVIOUR", () => {
          it("PATCH status:200 updates article and returns updated article", () => {
            return request
              .patch("/api/articles/1")
              .send({ inc_votes: 1 })
              .expect(200)
              .then(({ body: { article: { votes } } }) => {
                expect(votes).to.equal(101);
                return request
                  .get("/api/articles/1")
                  .expect(200)
                  .then(({ body: { article: { votes } } }) => {
                    expect(votes).to.equal(101);
                  });
              });
          });
        });
        describe("DEFAULT DELETE BEHAVIOUR", () => {
          it("DELETE status:204 deletes article from article list", () => {
            return request
              .delete("/api/articles/1")
              .expect(204)
              .then(() => {
                //  check that article has been deleted
                // return request
                //   .get("/api/articles/1")
                //   .expect(404)
                //   .then(({ body }) => {
                //     console.log(body);
                //   });
              });
          });
        });
        describe("/comments", () => {
          describe("DEFAULT GET BEHAVIOUR", () => {
            it("GET status:200 returns an array of comments with correct keys", () => {
              return request
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body: { comments } }) => {
                  comments.forEach(comment => {
                    expect(comment).to.have.keys(
                      "comment_id",
                      "votes",
                      "created_at",
                      "author",
                      "body"
                    );
                  });
                });
            });
            it("GET status:200 comments of only given article ", () => {
              return request
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.have.length(13);
                });
            });
          });
        });
      });
    });
  });
});
