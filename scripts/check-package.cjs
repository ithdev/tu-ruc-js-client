const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { mkdtempSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join, resolve } = require('node:path');

const project = resolve(__dirname, '..');
const consumer = mkdtempSync(join(tmpdir(), 'tu-ruc-js-consumer-'));
// npm run supplies the CLI path; reuse it with the Node version under test.
const npmCli = process.env.npm_execpath;

try {
  const [archive] = JSON.parse(
    execFileSync(process.execPath, [npmCli, 'pack', '--json', '--pack-destination', consumer], {
      cwd: project,
      encoding: 'utf8',
    }),
  );
  assert.ok(archive.files.some((file) => file.path === 'src/index.js'));
  assert.ok(
    archive.files.every(
      (file) =>
        file.path.startsWith('src/') ||
        ['package.json', 'README.md', 'CHANGELOG.md'].includes(file.path),
    ),
  );

  writeFileSync(join(consumer, 'package.json'), JSON.stringify({ private: true }));
  execFileSync(
    process.execPath,
    [
      npmCli,
      'install',
      '--ignore-scripts',
      '--omit=dev',
      '--no-audit',
      '--no-fund',
      join(consumer, archive.filename),
    ],
    { cwd: consumer, stdio: 'inherit' },
  );
  execFileSync(
    process.execPath,
    [
      '-e',
      `
    const assert = require('node:assert/strict');
    const client = require('tu-ruc-js-client');
    assert.equal(typeof client.getContribuyenteBySearch, 'function');
    assert.equal(typeof client.getContribuyenteByRucOrCI, 'function');
    assert.deepEqual(require('tu-ruc-js-client/package.json').dependencies || {}, {});
    console.log('Paquete instalado y API CommonJS disponible en ' + process.version);
  `,
    ],
    { cwd: consumer, stdio: 'inherit' },
  );
} finally {
  rmSync(consumer, { recursive: true });
}
