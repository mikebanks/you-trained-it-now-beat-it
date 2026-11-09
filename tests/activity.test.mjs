import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const html = readFileSync(new URL("../activity.html", import.meta.url), "utf8");
const data = JSON.parse(html.match(/<script id="activity-data"[^>]*>([\s\S]*?)<\/script>/)[1]);
const engine = html.match(/<script id="activity-engine">([\s\S]*?)<\/script>/)[1];
const context = vm.createContext({});
vm.runInContext(engine, context);
const AI = context.ClassroomAI;
const initial = AI.train(data.training, data.features);
const counterexamples = data.test.filter((row) => ["C", "D", "E", "F"].includes(row.id));
const updated = data.training.concat(counterexamples);
const improved = AI.train(updated, data.features);

test("initial tree learns the URGENT shortcut and fails on unseen counterexamples", () => {
  assert.equal(initial.feature.id, "urgent");
  assert.equal(AI.score(initial, data.training).correct, 6);
  assert.equal(AI.score(initial, data.test).correct, 2);
  assert.equal(AI.predict(initial, data.test.find((row) => row.id === "C").text), "SCAM");
  assert.equal(AI.predict(initial, data.test.find((row) => row.id === "D").text), "LEGIT");
});

test("counterexamples improve fresh checks without adding fresh rows to training", () => {
  const trainingIds = new Set(updated.map((row) => row.id));
  assert.ok(data.fresh.every((row) => !trainingIds.has(row.id)));
  assert.equal(AI.score(improved, updated).correct, 10);
  assert.equal(AI.score(improved, data.fresh).correct, 4);
  assert.equal(data.fresh.length, 4);
});

test("passphrase challenge demonstrates the model's vocabulary limit", () => {
  assert.equal(AI.predict(improved, data.boss.text), "LEGIT");
  assert.equal(data.boss.label, "SCAM");
  assert.match(data.boss.reason, /login information/);
  assert.equal(AI.predict(improved, "Please send your password."), "SCAM");
  assert.equal(AI.predict(improved, "Please send your passphrase."), "LEGIT");
});

test("clues use whole words and normalize case, whitespace, and hyphens", () => {
  const giftCard = data.features.find((feature) => feature.id === "gift_card");
  assert.equal(AI.hasFeature("A GIFT–CARD fee", giftCard), true);
  assert.equal(AI.hasFeature("a gift   card fee", giftCard), true);
  assert.equal(AI.hasFeature("a giftcard fee", giftCard), false);
  assert.equal(AI.hasFeature("a gift cards fee", giftCard), false);
  assert.throws(() => AI.train([], data.features), /requires labeled examples/);
});

test("demo keeps all scripts inline with an explicit no-network policy", () => {
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /form-action 'none'/);
  assert.doesNotMatch(html, /<script[^>]+src\s*=|<link[^>]+href\s*=/i);
  assert.doesNotMatch(html, /\bfetch\s*\(|XMLHttpRequest|WebSocket|localStorage|sessionStorage|sendBeacon/);
});
