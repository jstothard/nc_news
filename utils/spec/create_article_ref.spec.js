process.env.NODE_ENV = "test";
const { expect } = require("chai");

const testArr = [
  {
    article_id: 1,
    title: "Living in the shadow of a great man",
    topic: "mitch",
    author: "butter_bridge",
    body: "I find this existence challenging",
    created_at: 1542284514171,
    votes: 100
  },
  {
    article_id: 2,
    title: "Sony Vaio; or, The Laptop",
    topic: "mitch",
    author: "icellusedkars",
    body:
      "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
    created_at: 1416140514171
  }
];

const { createArticleRef } = require("../create_article_ref");

describe("createArticleRef()", () => {
  it("doesnt mutate original array", () => {
    expect(createArticleRef(testArr)).to.not.equal(testArr);
  });
  it("returns single key value pair for one article", () => {
    expect(createArticleRef(testArr.slice(0, 1))).to.eql({
      "Living in the shadow of a great man": 1
    });
  });
  it("returns multiple key value pairs for multi article array", () => {
    expect(createArticleRef(testArr)).to.eql({
      "Living in the shadow of a great man": 1,
      "Sony Vaio; or, The Laptop": 2
    });
  });
});
