/* Regression checks for the email-only enquiry delivery model and privacy language. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const contact = read('contact/index.html');
const privacy = read('privacy/index.html');
const confirmation = read('contact/received/index.html');

assert.match(contact, /action="https:\/\/formsubmit\.co\/service@grapecrux\.com"/);
assert.match(contact, /FormSubmit receives the form over HTTPS and forwards it to service@grapecrux\.com/i);
assert.match(contact, /does not store a separate copy in a website database/i);
assert.match(contact, /accepted the request for email delivery/i);
assert.doesNotMatch(contact, /stores the request with a reference number|confirms storage only|automatic receipt confirms storage/i);
assert.match(privacy, /FormSubmit, a third-party form-delivery service/i);
assert.match(privacy, /referring page is reduced to its origin only/i);
assert.match(privacy, /Email addresses in campaign-tag values are discarded/i);
assert.match(confirmation, /accepted your request for email delivery/i);

const main = read('assets/js/main.js');
assert.match(main, /safeReferrerOrigin/);
assert.match(main, /parsed\.origin/);
assert.match(main, /safeCampaignValue/);
assert.match(main, /first\.referrer = safeReferrerOrigin\(first\.referrer\)/);

console.log('Email-only form copy and attribution privacy checks passed.');
