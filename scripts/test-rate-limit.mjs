import assert from "node:assert/strict";
import {
  clearLoginFailures,
  getLoginKey,
  loginLimit,
  recordLoginFailure,
  resetLoginFailuresForTests,
} from "../api/_rateLimit.js";

resetLoginFailuresForTests();
const request = { headers: { "x-forwarded-for": "203.0.113.10, 10.0.0.1" }, socket: {} };
const sameRequest = { headers: { "x-real-ip": "203.0.113.10" }, socket: {} };
const key = getLoginKey(request);
assert.equal(key, getLoginKey(sameRequest));

for (let index = 0; index < 5; index += 1) {
  assert.equal(loginLimit(key, 1_000).allowed, true);
  recordLoginFailure(key, 1_000);
}

assert.deepEqual(loginLimit(key, 1_000), { allowed: false, retryAfter: 900 });
assert.equal(loginLimit(key, 901_000).allowed, true);
clearLoginFailures(key);
assert.equal(loginLimit(key, 1_000).allowed, true);

console.log("GMODE login rate-limit tests passed");
