const test = require('node:test');
const assert = require('node:assert/strict');

// Mock browser globals required by agora.js
global.window = {
  addEventListener: () => {},
  SpeechRecognition: function() {},
  webkitSpeechRecognition: function() {},
  localStorage: {
    getItem: () => null,
    setItem: () => {}
  }
};
global.document = {
  addEventListener: () => {},
  getElementById: () => ({
    style: {},
    classList: { add: () => {}, remove: () => {} },
    innerHTML: '',
    appendChild: () => {},
    addEventListener: () => {},
    value: '',
    innerText: '',
    scrollTo: () => {}
  }),
  createElement: () => ({
    classList: { add: () => {}, remove: () => {} },
    style: {},
    appendChild: () => {},
    innerHTML: '',
    innerText: ''
  })
};

const { runMockSemanticProcessing, MockDialogues, FallbackDialogue } = require('../agora.js');

test('runMockSemanticProcessing', async (t) => {
  await t.test('Happy path: keyword "jugar"', () => {
    const result = runMockSemanticProcessing('quiero jugar a algo');
    assert.deepEqual(result, {
      red: MockDialogues[0].red,
      blue: MockDialogues[0].blue,
      green: MockDialogues[0].green
    });
  });

  await t.test('Case insensitivity: keyword "MiNeCrAfT"', () => {
    const result = runMockSemanticProcessing('quiero jugar MiNeCrAfT');
    assert.deepEqual(result, {
      red: MockDialogues[0].red,
      blue: MockDialogues[0].blue,
      green: MockDialogues[0].green
    });
  });

  await t.test('Happy path: keyword "volar"', () => {
    const result = runMockSemanticProcessing('mi dragón puede volar alto');
    assert.deepEqual(result, {
      red: MockDialogues[1].red,
      blue: MockDialogues[1].blue,
      green: MockDialogues[1].green
    });
  });

  await t.test('Fallback behavior: no matching keywords', () => {
    const result = runMockSemanticProcessing('esto es un texto sin palabras clave conocidas');
    assert.deepEqual(result, {
      red: FallbackDialogue.red,
      blue: FallbackDialogue.blue,
      green: FallbackDialogue.green
    });
  });

  await t.test('Empty strings', () => {
    const result = runMockSemanticProcessing('');
    assert.deepEqual(result, {
      red: FallbackDialogue.red,
      blue: FallbackDialogue.blue,
      green: FallbackDialogue.green
    });
  });

  await t.test('Whitespace only', () => {
    const result = runMockSemanticProcessing('   ');
    assert.deepEqual(result, {
      red: FallbackDialogue.red,
      blue: FallbackDialogue.blue,
      green: FallbackDialogue.green
    });
  });
});
