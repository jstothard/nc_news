process.env.NODE_ENV = "test";
const { expect } = require("chai");
const { articles, comments } = require("../../db/data");

const { remapDate } = require("../remap_date");

//  input an array of objects with created_at field
//  convert date to YYYY-MM-DD format
//  push to new array with converted date
//  return new array

//  single object array returns formatted
//  multi object array returns formatted
//  works for both articles and comments

describe("remapDate()", () => {
  it("does not mutate original array", () => {
    expect(remapDate(articles)).to.not.equal(articles);
  });
  it("returns single element array with new date", () => {
    expect(remapDate(articles.slice(0, 1))).to.eql([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2018-11-15",
        votes: 100
      }
    ]);
    expect(remapDate(comments.slice(0, 1))).to.eql([
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: "2017-11-22"
      }
    ]);
  });
  it("returns multi element array with new dates", () => {
    expect(remapDate(articles.slice(0, 2))).to.eql([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2018-11-15",
        votes: 100
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: "2014-11-16"
      }
    ]);
  });
});
