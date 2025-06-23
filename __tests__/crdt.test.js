import assert from 'node:assert';
import test from 'node:test';
import { CRDTDoc } from '../dist/crdt.js';

test('CRDTDoc handles concurrent edits and converges state', () => {
  const docA = new CRDTDoc('client_a');
  const docB = new CRDTDoc('client_b');

  const itemA = docA.insert('H', 0);
  docB.integrateRemote(itemA);

  assert.strictEqual(docA.getText(), 'H');
  assert.strictEqual(docB.getText(), 'H');
});
