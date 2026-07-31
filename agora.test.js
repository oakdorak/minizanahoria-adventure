const { getMascotSVG } = require('./agora.js');

describe('getMascotSVG', () => {
  it('should generate an SVG string', () => {
    const svg = getMascotSVG();
    expect(typeof svg).toBe('string');
    expect(svg.trim()).toMatch(/^<svg/);
    expect(svg.trim()).toMatch(/<\/svg>$/);
  });

  it('should apply head rotation when listening', () => {
    const svg = getMascotSVG('happy', 'listening');
    expect(svg).toContain('rotate(4deg)');
  });

  it('should apply head rotation and pupil shift when thinking', () => {
    const svg = getMascotSVG('happy', 'thinking');
    expect(svg).toContain('rotate(-6deg)');
  });

  it('should generate happy eyes and mouth for happy emotion', () => {
    const svg = getMascotSVG('happy', 'normal');
    expect(svg).toContain('M 33 52 Q 40 62 47 52 Z'); // Happy mouth path
  });

  it('should generate thinking eyes and mouth for thinking emotion', () => {
    const svg = getMascotSVG('thinking', 'normal');
    expect(svg).toContain('M 36 53 Q 40 50 44 53'); // Thinking mouth path
  });

  it('should generate surprised eyes and mouth for surprised emotion', () => {
    const svg = getMascotSVG('surprised', 'normal');
    expect(svg).toContain('circle cx="40" cy="55" r="5"'); // Surprised mouth
  });

  it('should generate normal eyes and mouth for unknown emotion', () => {
    const svg = getMascotSVG('error', 'normal');
    expect(svg).toContain('M 36 50 Q 40 54 44 50'); // Normal mouth path
  });

  it('should use default emotion and status if none provided', () => {
    const svgHappyNormal = getMascotSVG('happy', 'normal');
    const svgDefault = getMascotSVG();
    expect(svgDefault).toBe(svgHappyNormal);
  });
});
