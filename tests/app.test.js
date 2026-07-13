// Mock DOM objects before loading app.js
global.window = { addEventListener: () => {} };
global.document = {
  getElementById: () => ({ classList: { add: () => {}, remove: () => {} }, innerHTML: '', className: '', addEventListener: () => {} }),
  createElement: () => ({ classList: { add: () => {}, remove: () => {} }, setAttribute: () => {}, addEventListener: () => {}, appendChild: () => {} }),
  querySelector: () => null,
  querySelectorAll: () => []
};
global.localStorage = {
  getItem: () => null,
  setItem: () => {}
};
global.AudioEngine = {
  playClick: () => {},
  playActionUnlock: () => {},
  playError: () => {}
};

const { getMascotSVG } = require('../app.js');

describe('getMascotSVG', () => {
  it('should return a valid SVG string with default parameters', () => {
    const svg = getMascotSVG();
    expect(svg).toContain('viewBox="0 0 80 100"');
    expect(svg).toContain('transform: rotate(0deg)'); // default center
  });

  const emotions = ['happy', 'sad', 'angry', 'surprised', 'tired', 'normal'];
  const directions = [
    { dir: 'center', rot: 0 },
    { dir: 'NW', rot: -8 },
    { dir: 'NE', rot: 8 },
    { dir: 'SW', rot: -4 },
    { dir: 'SE', rot: 4 }
  ];

  describe('Gaze Directions', () => {
    directions.forEach(({ dir, rot }) => {
      it(`should apply rotation ${rot}deg for gaze direction ${dir}`, () => {
        const svg = getMascotSVG('normal', dir);
        expect(svg).toContain(`transform: rotate(${rot}deg)`);
      });
    });
  });

  describe('Emotions', () => {
    it('should generate angry features', () => {
      const svg = getMascotSVG('angry', 'center');
      expect(svg).toContain('#ff6b6b'); // Angry cheek color
      expect(svg).toContain('Eyebrows'); // Has eyebrows
    });

    it('should generate sad features', () => {
      const svg = getMascotSVG('sad', 'center');
      expect(svg).toContain('transparent'); // Sad cheek color
      expect(svg).toContain('Tears'); // Has tears
    });

    it('should generate surprised features', () => {
      const svg = getMascotSVG('surprised', 'center');
      expect(svg).toContain('circle cx="40" cy="54"'); // O-shaped mouth
    });

    it('should generate tired features', () => {
      const svg = getMascotSVG('tired', 'center');
      expect(svg).toContain('line x1="34" y1="54"'); // Flat mouth
    });

    it('should generate happy features', () => {
      const svg = getMascotSVG('happy', 'center');
      expect(svg).toContain('#e74c3c'); // Wide open smiling mouth fill
    });
  });
});
