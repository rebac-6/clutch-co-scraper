onst fs = require('fs');
const path = require('path');
const { logInfo, logError } = require('../extractors/utils');

async function exportDataset(data, outputPath) {
const resolved = path.resolve(outputPath);

const dir = path.dirname(resolved);
try {
await fs.promises.mkdir(dir, { recursive: true });
} catch (err) {
logError(`Failed to create directory ${dir}: ${err.message}`);
throw err;
}

const payload = JSON.stringify(data, null, 2);

try {
await fs.promises.writeFile(resolved, payload, 'utf8');
logInfo(`Wrote dataset to ${resolved}`);
} catch (err) {
logError(`Failed to write dataset to ${resolved}: ${err.message}`);
throw err;
}
}

module.exports = {
exportDataset,
};