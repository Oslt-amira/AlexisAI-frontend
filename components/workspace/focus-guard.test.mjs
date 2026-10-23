import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const source = readFileSync(new URL("./focus-guard.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;

function setup() {
  const document = new EventTarget();
  document.hidden = false;
  const window = new EventTarget();
  const exports = {};
  vm.runInNewContext(compiled, { exports, window, document });
  let departures = 0;
  const stop = exports.watchFocusDepartures(() => { departures++; });
  return { document, window, stop, count: () => departures };
}

test("hidden tabs and window departures trigger the companion; returning does not clear it", () => {
  const guard = setup();
  guard.document.dispatchEvent(new Event("visibilitychange"));
  assert.equal(guard.count(), 0);
  guard.document.hidden = true;
  guard.document.dispatchEvent(new Event("visibilitychange"));
  assert.equal(guard.count(), 1);
  guard.document.hidden = false;
  guard.document.dispatchEvent(new Event("visibilitychange"));
  guard.window.dispatchEvent(new Event("focus"));
  assert.equal(guard.count(), 1);
  guard.window.dispatchEvent(new Event("blur"));
  assert.equal(guard.count(), 2);
  guard.stop();
});

test("navigation requests a browser warning and also triggers the companion", () => {
  const guard = setup();
  const event = new Event("beforeunload", { cancelable: true });
  guard.window.dispatchEvent(event);
  assert.equal(event.defaultPrevented, true);
  assert.equal(guard.count(), 1);
  guard.stop();
});

test("exiting Focus removes every listener, including the navigation warning", () => {
  const guard = setup();
  guard.stop();
  guard.document.hidden = true;
  guard.document.dispatchEvent(new Event("visibilitychange"));
  guard.window.dispatchEvent(new Event("blur"));
  const event = new Event("beforeunload", { cancelable: true });
  guard.window.dispatchEvent(event);
  assert.equal(guard.count(), 0);
  assert.equal(event.defaultPrevented, false);
});
