process.env.NODE_ENV = "test";

const chai = require("chai");
const { expect } = chai;
chai.use(require("chai-sorted"));

const supertest = require("supertest");

const app = require("../app");
const connection = require("../db/connection");

const request = supertest(app);

describe("/", () => {
  after(() => connection.destroy());
  beforeEach(() => connection.seed.run());

  describe("/api", () => {
    it("GET status:200 responds with a JSON describing all the available endpoints", () => {
      return request
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.endpoints).to.eql({
            topics: { address: "/api/topics", methods: ["GET"] },
            aticles: { address: "/api/articles", methods: ["GET"] },
            article: {
              address: "/api/articles/:article_id",
              methods: ["GET", "PATCH"]
            },
            article_comments: {
              address: "/api/articles/:article_id/comments",
              methods: ["GET", "POST"]
            },
            comments: {
              address: "/api/comments",
              methods: ["PATCH", "DELETE"]
            },
            user: { address: "/api/users/username", methods: ["GET"] }
          });
        });
    });
    describe("ERRORS", () => {
      it("status:404 responds with error message when route not found", () => {
        const methods = ["get", "put", "delete", "patch"];
        return Promise.all(
          methods.map(method => {
            return request[method]("/api/helloworld")
              .expect(404)
              .then(res => {
                expect(res.body.msg).to.equal("Not Found");
              });
          })
        );
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
      describe("ERRORS", () => {
        it("status:405 responds with error message when method not allowed", () => {
          const methods = ["post", "put", "delete", "patch"];
          return Promise.all(
            methods.map(method => {
              return request[method]("/api/topics")
                .expect(405)
                .then(res => {
                  expect(res.body.msg).to.equal("Method Not Allowed");
                });
            })
          );
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
              expect(articles).to.have.length(10);
              console.log(articles);
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
        it("GET status:200 default to sorted by newest first", () => {
          return request
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.sortedBy("created_at", {
                descending: true
              });
            });
        });
        it("GET status:200 default to sorted by newest first when invalid sort query", () => {
          const sortQueries = ["sort_by=hello", "order=hello"];
          return Promise.all(
            sortQueries.map(sort => {
              return request
                .get("/api/articles/?" + sort)
                .expect(200)
                .then(({ body: { articles } }) => {
                  expect(articles).to.be.sortedBy("created_at", {
                    descending: true
                  });
                });
            })
          );
        });
      });
      describe("QUERIES", () => {
        it("GET status:200 can be sorted by any column", () => {
          return request
            .get("/api/articles?sort_by=author")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.sortedBy("author", {
                descending: true
              });
            });
        });
        it("GET status:200 can specify sort by asc or desc", () => {
          return request
            .get("/api/articles?sort_by=title&order=asc")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.sortedBy("title", {
                descending: false
              });
            });
        });
        it("GET status:200 filters the articles by given username", () => {
          return request
            .get("/api/articles?username=butter_bridge")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.have.length(3);
            });
        });
        it("GET status:200 filters the articles by given topic", () => {
          return request
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.have.length(10);
            });
        });
      });
      describe("ERRORS", () => {
        it("GET status:400 responds with error message when request is made with a bad query", () => {
          const queries = [
            "article_id=1",
            "votes=10",
            "hello_world=yes",
            "username=jake"
          ];
          return Promise.all(
            queries.map(query => {
              return request
                .get(`/api/articles/abc?${query}`)
                .expect(400)
                .then(res => {
                  expect(res.body.msg).to.equal("Bad Request");
                });
            })
          );
        });
        it("status:405 responds with error message when method not allowed", () => {
          const methods = ["post", "put", "patch", "delete"];
          return Promise.all(
            methods.map(method => {
              return request[method]("/api/articles")
                .expect(405)
                .then(res => {
                  expect(res.body.msg).to.equal("Method Not Allowed");
                });
            })
          );
        });
      });
      describe("/:article_id", () => {
        describe("DEFAULT GET BEHAVIOUR", () => {
          it("GET status:200 returns a single article object with a comment count", () => {
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
          it("PATCH status:200 works for negatives", () => {
            return request
              .patch("/api/articles/1")
              .send({ inc_votes: -1 })
              .expect(200)
              .then(({ body: { article: { votes } } }) => {
                expect(votes).to.equal(99);
                return request
                  .get("/api/articles/1")
                  .expect(200)
                  .then(({ body: { article: { votes } } }) => {
                    expect(votes).to.equal(99);
                  });
              });
          });
          it("PATCH status:200 no body responds with unformatted article", () => {
            return request
              .patch("/api/articles/1")
              .expect(200)
              .then(({ body: { article: { votes } } }) => {
                expect(votes).to.equal(100);
                return request
                  .get("/api/articles/1")
                  .expect(200)
                  .then(({ body: { article: { votes } } }) => {
                    expect(votes).to.equal(100);
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
                return request
                  .get("/api/articles/1")
                  .expect(404)
                  .then(({ body: { msg } }) => {
                    expect(msg).to.equal("Not Found");
                  });
              });
          });
        });
        describe("ERRORS", () => {
          it("status:400 responds with error message when request is made with a bad ID", () => {
            const methods = ["get", "patch", "delete"];
            return Promise.all(
              methods.map(method => {
                return request[method]("/api/articles/abc")
                  .send({ inc_votes: 1 })
                  .expect(400)
                  .then(res => {
                    expect(res.body.msg).to.equal("Bad Request");
                  });
              })
            );
          });
          it("status:404 responds with error message when ID not found", () => {
            const methods = ["get", "patch", "delete"];
            return Promise.all(
              methods.map(method => {
                return request[method]("/api/articles/900")
                  .send({ inc_votes: 1 })
                  .expect(404)
                  .then(res => {
                    expect(res.body.msg).to.equal("Not Found");
                  });
              })
            );
          });
          it("status:405 responds with error message when method not allowed", () => {
            const methods = ["post", "put"];
            return Promise.all(
              methods.map(method => {
                return request[method]("/api/articles/1")
                  .expect(405)
                  .then(res => {
                    expect(res.body.msg).to.equal("Method Not Allowed");
                  });
              })
            );
          });
          it("PATCH status:422 responds with error message when body in incorrect format", () => {
            const bodys = [{ inc_votes: "abc" }];
            return Promise.all(
              bodys.map(body => {
                return request
                  .patch("/api/articles/1")
                  .send(body)
                  .expect(422)
                  .then(res => {
                    expect(res.body.msg).to.equal("Unprocessable Entity");
                  });
              })
            );
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
            it("GET status:200 default to sorted by newest first", () => {
              return request
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.sortedBy("created_at", {
                    descending: true
                  });
                });
            });
            it("GET status:200 default to sorted by newest first when given bad sort query", () => {
              const sortQueries = ["sort_by=hello", "order=hello"];
              return Promise.all(
                sortQueries.map(sort => {
                  return request
                    .get("/api/articles/1/comments/?" + sort)
                    .expect(200)
                    .then(({ body: { comments } }) => {
                      expect(comments).to.be.sortedBy("created_at", {
                        descending: true
                      });
                    });
                })
              );
            });
          });
          describe("DEFAULT POST BEHAVIOUR", () => {
            it("POST status:201 inserts new comment and returns the posted comment", () => {
              return request
                .post("/api/articles/1/comments")
                .send({
                  username: "butter_bridge",
                  body: "hello world"
                })
                .expect(201)
                .then(({ body: { comment } }) => {
                  expect(comment).to.include.keys(
                    "article_id",
                    "author",
                    "body",
                    "comment_id",
                    "created_at",
                    "votes"
                  );
                  return request
                    .get("/api/articles/1/comments")
                    .expect(200)
                    .then(({ body: { comments } }) => {
                      expect(comments).to.have.length(14);
                    });
                });
            });
          });
          describe("QUERIES", () => {
            it("GET status:200 can be sorted by any column", () => {
              return request
                .get("/api/articles/1/comments?sort_by=votes")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.sortedBy("votes", {
                    descending: true
                  });
                });
            });
            it("GET status:200 can be sorted asc or desc", () => {
              return request
                .get("/api/articles/1/comments?sort_by=author&order=asc")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.sortedBy("author", {
                    descending: false
                  });
                });
            });
          });
          describe("ERRORS", () => {
            it("status:400 responds with error message when request is made with a bad ID", () => {
              const methods = ["get", "post"];
              return Promise.all(
                methods.map(method => {
                  return request[method]("/api/articles/abc/comments")
                    .expect(400)
                    .then(res => {
                      expect(res.body.msg).to.equal("Bad Request");
                    });
                })
              );
            });
            it("POST status:400 responds with error message body references invalid column", () => {
              const bodys = [
                { username: "butter_bridge", hello: "hi" },
                { username: "butter_bridge", article_id: 1 }
              ];
              return Promise.all(
                bodys.map(body => {
                  return request
                    .post("/api/articles/abc/comments")
                    .send(body)
                    .expect(400)
                    .then(res => {
                      expect(res.body.msg).to.equal("Bad Request");
                    });
                })
              );
            });
            it("status:404 responds with error message when ID not found", () => {
              const methods = ["get", "post"];
              return Promise.all(
                methods.map(method => {
                  return request[method]("/api/articles/900/comments")
                    .expect(404)
                    .then(res => {
                      expect(res.body.msg).to.equal("Not Found");
                    });
                })
              );
            });
            it("status:405 responds with error message when method not allowed", () => {
              const methods = ["delete", "put"];
              return Promise.all(
                methods.map(method => {
                  return request[method]("/api/articles/1/comments")
                    .expect(405)
                    .then(res => {
                      expect(res.body.msg).to.equal("Method Not Allowed");
                    });
                })
              );
            });
            it("POST status:422 responds with error message when invalid username", () => {
              const bodys = [{ username: "jake", body: "hi" }];
              return Promise.all(
                bodys.map(body => {
                  return request
                    .post("/api/articles/1/comments")
                    .send(body)
                    .expect(422)
                    .then(res => {
                      expect(res.body.msg).to.equal("Unprocessable Entity");
                    });
                })
              );
            });
          });
        });
      });
    });
    describe("/comments", () => {
      describe("/:comment_id", () => {
        describe("DEFAULT PATCH BEHAVIOUR", () => {
          it("PATCH status:200 changes votes and returns the comment", () => {
            return request
              .patch("/api/comments/1")
              .send({
                inc_votes: 1
              })
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment).to.contain.keys(
                  "comment_id",
                  "votes",
                  "created_at",
                  "author",
                  "body",
                  "article_id"
                );
                expect(comment.votes).to.equal(17);
                return request
                  .get("/api/articles/9/comments")
                  .expect(200)
                  .then(({ body: { comments } }) => {
                    expect(comments[0].votes).to.equal(17);
                  });
              });
          });
          it("PATCH status:200 returns original comment if no inc_vote", () => {
            return request
              .patch("/api/comments/1")
              .send({})
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment).to.contain.keys(
                  "comment_id",
                  "votes",
                  "created_at",
                  "author",
                  "body",
                  "article_id"
                );
                expect(comment.votes).to.equal(16);
                return request
                  .get("/api/articles/9/comments")
                  .expect(200)
                  .then(({ body: { comments } }) => {
                    expect(comments[0].votes).to.equal(16);
                  });
              });
          });
        });
        describe("DEFAULT DELETE BEHAVIOUR", () => {
          it("POST status:204 removes the comment from the db", () => {
            return request
              .delete("/api/comments/1")
              .expect(204)
              .then(() => {
                return request
                  .get("/api/articles/9/comments")
                  .expect(200)
                  .then(({ body: { comments } }) => {
                    expect(comments).to.have.length(1);
                  });
              });
          });
        });
        describe("ERRORS", () => {
          it("status:400 responds with error message when request is made with a bad ID", () => {
            const methods = ["patch", "delete"];
            return Promise.all(
              methods.map(method => {
                return request[method]("/api/comments/abc")
                  .expect(400)
                  .then(res => {
                    expect(res.body.msg).to.equal("Bad Request");
                  });
              })
            );
          });
          it("PATCH status:400 responds with error message when body in incorrect format", () => {
            const bodys = [{ inc_votes: "abc" }];
            return Promise.all(
              bodys.map(body => {
                return request
                  .patch("/api/comments/1")
                  .send(body)
                  .expect(400)
                  .then(res => {
                    expect(res.body.msg).to.equal("Bad Request");
                  });
              })
            );
          });
          it("status:404 responds with error message when ID not found", () => {
            const methods = ["patch", "delete"];
            return Promise.all(
              methods.map(method => {
                return request[method]("/api/comments/123")
                  .expect(404)
                  .then(res => {
                    expect(res.body.msg).to.equal("Not Found");
                  });
              })
            );
          });
          it("status:405 responds with error message when method not allowed", () => {
            const methods = ["get", "put"];
            return Promise.all(
              methods.map(method => {
                return request[method]("/api/comments/1")
                  .expect(405)
                  .then(res => {
                    expect(res.body.msg).to.equal("Method Not Allowed");
                  });
              })
            );
          });
        });
      });
    });
    describe("/users", () => {
      describe("/:user_id", () => {
        describe("DEFAULT GET BEHAVIOUR", () => {
          it("POST status:200 returns specified user with correct keys", () => {
            return request
              .get("/api/users/butter_bridge")
              .expect(200)
              .then(({ body: { user } }) => {
                expect(user).to.contain.keys("username", "avatar_url", "name");
              });
          });
        });
        describe("ERRORS", () => {
          it("GET status:404 responds with error message when ID not found", () => {
            const methods = ["get"];
            return Promise.all(
              methods.map(method => {
                return request[method]("/api/users/123")
                  .expect(404)
                  .then(res => {
                    expect(res.body.msg).to.equal("Not Found");
                  });
              })
            );
          });
          it("status:405 responds with error message when method not allowed", () => {
            const methods = ["delete", "put", "patch", "post"];
            return Promise.all(
              methods.map(method => {
                return request[method]("/api/users/1")
                  .expect(405)
                  .then(res => {
                    expect(res.body.msg).to.equal("Method Not Allowed");
                  });
              })
            );
          });
        });
      });
    });
    describe("ERRORS", () => {
      it("status:405 responds with error message when method not allowed", () => {
        const methods = ["delete", "put", "patch", "post"];
        return Promise.all(
          methods.map(method => {
            return request[method]("/api")
              .expect(405)
              .then(res => {
                expect(res.body.msg).to.equal("Method Not Allowed");
              });
          })
        );
      });
    });
  });
});
