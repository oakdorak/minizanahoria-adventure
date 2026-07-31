// --- Shared Mascot SVG Generator ---
function getMascotSVG(emotion = 'happy', modifier = 'normal') {
  let headRotation = 0;
  let pupilX = 0;
  let pupilY = 0;

  // Combine both gaze and status modifiers
  if (modifier === 'NW') { pupilX = -6; pupilY = -5; headRotation = -8; }
  else if (modifier === 'NE') { pupilX = 6; pupilY = -5; headRotation = 8; }
  else if (modifier === 'SW') { pupilX = -6; pupilY = 5; headRotation = -4; }
  else if (modifier === 'SE') { pupilX = 6; pupilY = 5; headRotation = 4; }
  else if (modifier === 'listening') { headRotation = 4; pupilY = 2; }
  else if (modifier === 'thinking') { headRotation = -6; pupilX = -3; pupilY = -3; }

  let eyesHTML = '';
  let mouthHTML = '';
  let cheekColor = '#ffb3ba';

  switch (emotion) {
    case 'happy':
      // Curved happy arcs for eyes
      // Using transform for app.js style gaze offset
      eyesHTML = `
        <path d="M 22 42 Q 28 35 34 42" stroke="#231f24" stroke-width="3.5" stroke-linecap="round" fill="none" transform="translate(${pupilX/2}, 0)" />
        <path d="M 46 42 Q 52 35 58 42" stroke="#231f24" stroke-width="3.5" stroke-linecap="round" fill="none" transform="translate(${pupilX/2}, 0)" />
      `;
      // Wide open smiling mouth
      mouthHTML = `
        <path d="M 33 52 Q 40 62 47 52 Z" fill="#e74c3c" stroke="#231f24" stroke-width="2" />
      `;
      break;

    case 'sad':
      // Drooping sad eyes
      eyesHTML = `
        <path d="M 22 38 Q 28 44 34 38" stroke="#231f24" stroke-width="3.5" stroke-linecap="round" fill="none" />
        <path d="M 46 38 Q 52 44 58 38" stroke="#231f24" stroke-width="3.5" stroke-linecap="round" fill="none" />
        <!-- Tears -->
        <circle cx="23" cy="46" r="3" fill="#3498db" />
        <circle cx="57" cy="46" r="3" fill="#3498db" />
      `;
      // Frowning mouth
      mouthHTML = `
        <path d="M 34 56 Q 40 48 46 56" stroke="#231f24" stroke-width="3" stroke-linecap="round" fill="none" />
      `;
      cheekColor = 'transparent';
      break;

    case 'angry':
      // Slanted angry eyes and eyebrows
      eyesHTML = `
        <!-- Eyebrows -->
        <path d="M 20 32 L 34 38" stroke="#231f24" stroke-width="3.5" stroke-linecap="round" />
        <path d="M 60 32 L 46 38" stroke="#231f24" stroke-width="3.5" stroke-linecap="round" />
        <!-- Pupils -->
        <circle cx="28" cy="42" r="4.5" fill="#231f24" />
        <circle cx="52" cy="42" r="4.5" fill="#231f24" />
      `;
      // Wavy or flat angry mouth
      mouthHTML = `
        <path d="M 32 54 Q 40 50 48 54" stroke="#231f24" stroke-width="3.5" stroke-linecap="round" fill="none" />
      `;
      cheekColor = '#ff6b6b';
      break;

    case 'surprised':
      // Wide circular open eyes
      eyesHTML = `
        <circle cx="28" cy="40" r="7.5" fill="#fff" stroke="#231f24" stroke-width="3.5" />
        <circle cx="28" cy="40" r="3" fill="#231f24" />
        <circle cx="52" cy="40" r="7.5" fill="#fff" stroke="#231f24" stroke-width="3.5" />
        <circle cx="52" cy="40" r="3" fill="#231f24" />
      `;
      // O-shaped mouth (agora.js has cy=55, app.js has cy=54)
      mouthHTML = `
        <circle cx="40" cy="54" r="5" fill="#231f24" />
      `;
      break;

    case 'tired':
      // Flat horizontal sleeping lines
      eyesHTML = `
        <line x1="22" y1="40" x2="34" y2="40" stroke="#231f24" stroke-width="3.5" stroke-linecap="round" />
        <line x1="46" y1="40" x2="58" y2="40" stroke="#231f24" stroke-width="3.5" stroke-linecap="round" />
      `;
      // Flat mouth
      mouthHTML = `
        <line x1="34" y1="54" x2="46" y2="54" stroke="#231f24" stroke-width="3" stroke-linecap="round" />
      `;
      break;

    case 'thinking': // Only in agora.js
      eyesHTML = `
        <circle cx="28" cy="40" r="7.5" fill="#fff" stroke="#231f24" stroke-width="3" />
        <circle cx="25" cy="37" r="3.5" fill="#231f24" />
        <circle cx="52" cy="40" r="7.5" fill="#fff" stroke="#231f24" stroke-width="3" />
        <circle cx="49" cy="37" r="3.5" fill="#231f24" />
        <!-- Thinking Eyebrows -->
        <path d="M 20 31 Q 28 34 32 30" stroke="#231f24" stroke-width="2.5" stroke-linecap="round" fill="none" />
        <path d="M 48 30 Q 52 34 60 31" stroke="#231f24" stroke-width="2.5" stroke-linecap="round" fill="none" />
      `;
      mouthHTML = `
        <path d="M 36 53 Q 40 50 44 53" stroke="#231f24" stroke-width="3" stroke-linecap="round" fill="none" />
      `;
      cheekColor = '#e3e0a4'; // Muted gold blush
      break;

    default: // normal/gazing
      // Gaze responsive standard eyes
      eyesHTML = `
        <circle cx="28" cy="40" r="8.5" fill="#fff" stroke="#231f24" stroke-width="3" />
        <circle cx="${28 + pupilX}" cy="${40 + pupilY}" r="4" fill="#231f24" />
        <circle cx="52" cy="40" r="8.5" fill="#fff" stroke="#231f24" stroke-width="3" />
        <circle cx="${52 + pupilX}" cy="${40 + pupilY}" r="4" fill="#231f24" />
      `;
      // Small happy mouth
      mouthHTML = `
        <path d="M 36 50 Q 40 54 44 50" stroke="#231f24" stroke-width="3" stroke-linecap="round" fill="none" />
      `;
  }

  return `
    <svg viewBox="0 0 80 100" class="carrot-svg" style="transform: rotate(${headRotation}deg); transition: transform 0.3s ease;">
      <g>
        <!-- Carrot Main Body (Orange) -->
        <path d="M 20 25 C 20 12 60 12 60 25 C 60 45 46 85 40 95 C 34 85 20 45 20 25 Z" fill="#e67e22" stroke="#231f24" stroke-width="3" />

        <!-- Sage Leaves (Green) -->
        <path d="M 33 16 C 30 5 15 8 22 18 C 29 18 33 16 33 16 Z" fill="#a8b28a" stroke="#231f24" stroke-width="2.5" />
        <path d="M 40 15 C 40 2 28 -2 34 14 C 40 14 40 15 40 15 Z" fill="#a8b28a" stroke="#231f24" stroke-width="2.5" />
        <path d="M 47 16 C 50 5 65 8 58 18 C 51 18 47 16 47 16 Z" fill="#a8b28a" stroke="#231f24" stroke-width="2.5" />

        <!-- Texture details -->
        <path d="M 24 35 H 29" stroke="#d35400" stroke-width="2" stroke-linecap="round" />
        <path d="M 51 45 H 56" stroke="#d35400" stroke-width="2" stroke-linecap="round" />
        <path d="M 23 55 H 28" stroke="#d35400" stroke-width="2" stroke-linecap="round" />
        <path d="M 52 65 H 57" stroke="#d35400" stroke-width="2" stroke-linecap="round" />

        <!-- Blush cheeks -->
        <ellipse cx="23" cy="46" rx="4" ry="2" fill="${cheekColor}" opacity="0.8" />
        <ellipse cx="57" cy="46" rx="4" ry="2" fill="${cheekColor}" opacity="0.8" />

        <!-- Eyes -->
        ${eyesHTML}

        <!-- Mouth -->
        ${mouthHTML}
      </g>
    </svg>
  `;
}
