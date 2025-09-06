const fs = require('fs');
const path = require('path');

/**
 * Safely delete one or more files from disk.
 * - Accepts a single file path string or an array of file path strings.
 * - Normalizes the path, checks existence, retries transient errors (EPERM/EBUSY) a few times.
 * - Never throws (errors are logged); returns a Promise that resolves when all attempts complete.
 *
 * @param {string | string[]} input - file path or array of file paths to remove
 * @param {object} [opts]
 * @param {number} [opts.retries=3] - number of retry attempts for transient errors
 * @param {number} [opts.retryDelay=200] - ms delay between retries
 */
async function safeUnlink(input, opts = {}) {
  const { retries = 3, retryDelay = 200 } = opts;

  if (!input) return;
  const paths = Array.isArray(input) ? input : [input];

  async function delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  for (let p of paths) {
    if (!p) continue;
    try {
      const resolved = path.resolve(p);

      // check existence
      const exists = await fs.promises
        .access(resolved, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);

      if (!exists) {
        // nothing to do
        // console.debug(`safeUnlink: file not found, skipping: ${resolved}`);
        continue;
      }

      let attempt = 0;
      while (true) {
        try {
          await fs.promises.unlink(resolved);
          // console.debug(`safeUnlink: removed ${resolved}`);
          break; // success
        } catch (err) {
          attempt += 1;
          // transient errors (Windows file lock or busy) — retry
          if ((err.code === 'EPERM' || err.code === 'EBUSY' || err.code === 'EACCES') && attempt <= retries) {
            // small delay then retry
            await delay(retryDelay);
            continue;
          }
          // non-retriable or out of retries: log and move on
          console.warn('safeUnlink failed for', resolved, err && err.message ? err.message : err);
          break;
        }
      }
    } catch (err) {
      // defensive fallback
      console.warn('safeUnlink unexpected error for', p, err && err.message ? err.message : err);
    }
  }
}

module.exports = { safeUnlink };
