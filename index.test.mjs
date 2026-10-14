import test from "node:test";
import assert from "node:assert";
import nock from "nock";
import {
  getCodewarsUser,
  sortUsersByScore,
  getLanguages,
  sortUsersByLanguage,
  parseUsernames,
} from "./index.mjs";

test("fetches a Codewars user successfully", async () => {
  const scope = nock("https://www.codewars.com")
    .get("/api/v1/users/Sam")
    .reply(200, {
      username: "Sam",
      clan: "CodeYourFuture",
      ranks: {
        overall: { score: 500 },
      },
    });

  const user = await getCodewarsUser("Sam");

  assert.strictEqual(user.username, "Sam");
  assert.strictEqual(user.ranks.overall.score, 500);
  assert.strictEqual(scope.isDone(), true);
});

test("throws an error when a Codewars user does not exist", async () => {
  const scope = nock("https://www.codewars.com")
    .get("/api/v1/users/UnknownUser")
    .reply(404);

  await assert.rejects(getCodewarsUser("UnknownUser"), {
    message:
      'User "UnknownUser" was not found. Check the spelling and try again.',
  });

  assert.strictEqual(scope.isDone(), true);
});

test("handles a Codewars server error", async () => {
  const scope = nock("https://www.codewars.com")
    .get("/api/v1/users/Sam")
    .reply(500);

  await assert.rejects(getCodewarsUser("Sam"), {
    message: "Unable to retrieve Codewars user data.",
  });

  assert.strictEqual(scope.isDone(), true);
});

test("sorts users by overall score from highest to lowest", () => {
  const users = [
    { username: "Sam", ranks: { overall: { score: 300 } } },
    { username: "Ali", ranks: { overall: { score: 900 } } },
    { username: "John", ranks: { overall: { score: 500 } } },
  ];

  const result = sortUsersByScore(users);

  assert.deepStrictEqual(
    result.map((user) => user.username),
    ["Ali", "John", "Sam"],
  );
});

test("sorting does not change the original array", () => {
  const users = [
    { username: "Sam", ranks: { overall: { score: 300 } } },
    { username: "Ali", ranks: { overall: { score: 900 } } },
  ];

  sortUsersByScore(users);

  assert.deepStrictEqual(
    users.map((user) => user.username),
    ["Sam", "Ali"],
  );
});

test("returns unique programming languages", () => {
  const users = [
    {
      ranks: {
        languages: {
          javascript: { score: 500 },
          python: { score: 200 },
        },
      },
    },
    {
      ranks: {
        languages: {
          javascript: { score: 300 },
          ruby: { score: 400 },
        },
      },
    },
  ];

  const languages = getLanguages(users);

  assert.deepStrictEqual(languages, ["javascript", "python", "ruby"]);
});

test("excludes users without the selected language and sorts by score", () => {
  const users = [
    {
      username: "Sam",
      ranks: {
        languages: {
          javascript: { score: 500 },
          python: { score: 300 },
        },
      },
    },
    {
      username: "Ali",
      ranks: {
        languages: {
          python: { score: 400 },
        },
      },
    },
    {
      username: "John",
      ranks: {
        languages: {
          javascript: { score: 800 },
        },
      },
    },
  ];
  const result = sortUsersByLanguage(users, "javascript");

  assert.deepStrictEqual(
    result.map((user) => user.username),
    ["John", "Sam"],
  );
});

test("shows a helpful message when the network request fails", async () => {
  const scope = nock("https://www.codewars.com")
    .get("/api/v1/users/Sam")
    .replyWithError("Network connection failed");

  await assert.rejects(getCodewarsUser("Sam"), {
    message:
      "Could not connect to Codewars. Check your internet connection and try again.",
  });

  assert.strictEqual(scope.isDone(), true);
});

test("removes duplicate usernames", () => {
  const users = "Sam, Ali, Sam, John, Ali";

  const result = parseUsernames(users);

  assert.deepStrictEqual(result, ["Sam", "Ali", "John"]);
});
