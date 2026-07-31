/* ==========================================================================
   MINIZANAHORIA: LA AVENTURA ADAPTATIVA - APPLICATION LOGIC
   ========================================================================== */

// --- Shared Audio Engine (from music.js) ---
// AudioEngine is loaded from music.js - ansiolítico auditivo compartido

// --- Mascot SVG Generator ---


// --- Application State ---
const State = {
  stars: parseInt(localStorage.getItem('minizanahoria_stars') || '0'),
  activeGame: 'orbit',
  
  addStar() {
    this.stars += 1;
    localStorage.setItem('minizanahoria_stars', this.stars);
    document.getElementById('star-count').innerText = this.stars;
  }
};

// --- DOM Navigation controller ---
function initNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const panels = document.querySelectorAll('.game-panel');
  
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      AudioEngine.playClick();
      navBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const gameName = btn.getAttribute('data-game');
      State.activeGame = gameName;
      
      const targetPanel = document.getElementById(`game-${gameName}`);
      targetPanel.classList.add('active');
      
      // Initialize the chosen game
      if (gameName === 'orbit') initFocusOrbit();
      if (gameName === 'emotion') initEmotionResonance();
      if (gameName === 'routine') initRoutineBuilder();
    });
  });

  // Init stars count
  document.getElementById('star-count').innerText = State.stars;
}

// --- Reward / Celebration Overlay Trigger ---
function triggerRewardCelebration() {
  AudioEngine.playSuccess();
  State.addStar();
  
  const screen = document.getElementById('celebration-screen');
  screen.classList.add('active');
}

document.getElementById('close-celebration-btn').addEventListener('click', () => {
  AudioEngine.playClick();
  document.getElementById('celebration-screen').classList.remove('active');
});


// ==========================================================================
// GAME 1: FOCUS ORBIT (ATENCIÓN CONJUNTA)
// ==========================================================================
let orbitTargetQuadrant = '';
let orbitActiveRound = false;

function initFocusOrbit() {
  const container = document.getElementById('orbit-mascot-container');
  container.innerHTML = getMascotSVG('normal', 'center');
  container.className = "mascot-wrapper anim-idle";
  
  const quadrants = document.querySelectorAll('.grid-quadrant');
  quadrants.forEach(q => {
    q.className = 'grid-quadrant'; // Clear classes
  });
  
  document.getElementById('orbit-feedback').innerText = "Presiona iniciar para comenzar a enfocar.";
  orbitActiveRound = false;
}

document.getElementById('start-orbit-btn').addEventListener('click', () => {
  AudioEngine.playClick();
  
  const quadrants = ['NW', 'NE', 'SW', 'SE'];
  orbitTargetQuadrant = quadrants[Math.floor(Math.random() * quadrants.length)];
  orbitActiveRound = true;
  
  // Update mascot gaze direction
  const container = document.getElementById('orbit-mascot-container');
  container.innerHTML = getMascotSVG('normal', orbitTargetQuadrant);
  container.className = "mascot-wrapper"; // Remove idle bobbing to keep focus clear
  
  // Clear quadrant states
  document.querySelectorAll('.grid-quadrant').forEach(q => {
    q.className = 'grid-quadrant';
  });

  document.getElementById('orbit-feedback').innerText = "Mira hacia dónde volteó Minizanahoria. ¡Selecciona su dirección!";
});

document.querySelectorAll('.grid-quadrant').forEach(quadrant => {
  quadrant.addEventListener('click', () => {
    if (!orbitActiveRound) return;
    
    const clickedQ = quadrant.getAttribute('data-quadrant');
    if (clickedQ === orbitTargetQuadrant) {
      // Success
      quadrant.classList.add('success-flash');
      document.getElementById('orbit-feedback').innerText = "¡Correcto! Excelente enfoque.";
      orbitActiveRound = false;
      
      // Update mascot to happy
      const container = document.getElementById('orbit-mascot-container');
      container.innerHTML = getMascotSVG('happy', 'center');
      container.className = "mascot-wrapper anim-spin";
      
      setTimeout(() => {
        triggerRewardCelebration();
      }, 700);
    } else {
      // Failure
      AudioEngine.playError();
      quadrant.classList.add('error-flash');
      document.getElementById('orbit-feedback').innerText = "Incorrecto. Mira con cuidado hacia dónde apunta.";
      
      // Temporary angry/sad mascot
      const container = document.getElementById('orbit-mascot-container');
      container.innerHTML = getMascotSVG('angry', orbitTargetQuadrant);
      container.className = "mascot-wrapper anim-angry";
      
      // Auto restore to normal look after 1.5s
      setTimeout(() => {
        container.innerHTML = getMascotSVG('normal', orbitTargetQuadrant);
        container.className = "mascot-wrapper";
        quadrant.classList.remove('error-flash');
      }, 1500);
    }
  });
});


// ==========================================================================
// GAME 2: EMOTION RESONANCE (IDENTIFICAR EMOCIONES)
// ==========================================================================
const EMOTIONS = {
  happy: {
    label: "Alegre",
    speech: "¡Me siento de maravilla hoy! ¿Jugamos?",
    correctAction: "celebrate",
    actions: [
      { id: "celebrate", label: "Celebrar y bailar juntos 🕺" },
      { id: "hug", label: "Darle un abrazo 🤗" },
      { id: "water", label: "Ofrecerle agua fría 💧" }
    ]
  },
  sad: {
    label: "Triste",
    speech: "Oh... mis hojitas se sienten pesadas hoy.",
    correctAction: "hug",
    actions: [
      { id: "nap", label: "Dejarle dormir una siesta 💤" },
      { id: "hug", label: "Abrazar con cuidado y escucharle 🤗" },
      { id: "music", label: "Tocar música animada 🎵" }
    ]
  },
  angry: {
    label: "Enojado",
    speech: "¡Grrr! ¡Las cosas no salieron como quería hoy!",
    correctAction: "relax",
    actions: [
      { id: "celebrate", label: "Tratar de hacerle bromas 🤡" },
      { id: "water", label: "Darle agua y un espacio tranquilo 💧" },
      { id: "relax", label: "Tomar respiraciones profundas juntos 🧘" }
    ]
  },
  surprised: {
    label: "Sorprendido",
    speech: "¡Oh! ¿Qué es este ruido tan fuerte?",
    correctAction: "earmuffs",
    actions: [
      { id: "earmuffs", label: "Ponerle audífonos bloqueadores 🎧" },
      { id: "shake", label: "Moverle para despertarle 👁️" },
      { id: "hug", label: "Correr rápidamente 🏃" }
    ]
  },
  tired: {
    label: "Cansado",
    speech: "Uaaah... se me cierran los ojitos.",
    correctAction: "nap",
    actions: [
      { id: "nap", label: "Acomodarle en su cama a dormir 💤" },
      { id: "celebrate", label: "Hacerle cosquillas 🤸" },
      { id: "water", label: "Darle una manzana para masticar 🍎" }
    ]
  }
};

let currentEmotionKey = '';
let emotionCorrectGuessed = false;

function initEmotionResonance() {
  const keys = Object.keys(EMOTIONS);
  currentEmotionKey = keys[Math.floor(Math.random() * keys.length)];
  emotionCorrectGuessed = false;
  
  // Set mascot SVG
  const container = document.getElementById('emotion-mascot-container');
  container.innerHTML = getMascotSVG(currentEmotionKey, 'center');
  container.className = `mascot-stage-wrapper anim-${currentEmotionKey === 'happy' ? 'idle' : (currentEmotionKey === 'sad' ? 'sad' : 'idle')}`;
  
  // Set speech bubble
  document.getElementById('emotion-speech').innerText = EMOTIONS[currentEmotionKey].speech;
  
  // Reset grids
  document.getElementById('care-options-group').classList.add('disabled');
  document.getElementById('emotion-feedback').innerText = "Selecciona la emoción correcta para desbloquear las acciones de cuidado.";
  
  // Render Guess Grid
  const guessGrid = document.getElementById('emotion-guess-grid');
  guessGrid.innerHTML = '';
  keys.forEach(key => {
    const card = document.createElement('button');
    card.className = 'option-card';
    card.innerText = EMOTIONS[key].label;
    card.addEventListener('click', () => handleEmotionGuess(key, card));
    guessGrid.appendChild(card);
  });
  
  // Render Actions Grid placeholder
  document.getElementById('emotion-action-grid').innerHTML = '';
}

function handleEmotionGuess(guessedKey, cardBtn) {
  if (emotionCorrectGuessed) return;
  
  if (guessedKey === currentEmotionKey) {
    AudioEngine.playActionUnlock();
    emotionCorrectGuessed = true;
    cardBtn.classList.add('correct');
    
    document.getElementById('emotion-feedback').innerText = `¡Correcto! Minizanahoria está ${EMOTIONS[currentEmotionKey].label}. Desbloqueado el panel de acciones.`;
    
    // Unlock actions
    document.getElementById('care-options-group').classList.remove('disabled');
    
    // Render care actions
    const actionGrid = document.getElementById('emotion-action-grid');
    actionGrid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    EMOTIONS[currentEmotionKey].actions.forEach(action => {
      const actBtn = document.createElement('button');
      actBtn.className = 'option-card';
      actBtn.innerText = action.label;
      actBtn.addEventListener('click', () => handleActionSelection(action.id, actBtn));
      fragment.appendChild(actBtn);
    });
    actionGrid.appendChild(fragment);
  } else {
    AudioEngine.playError();
    cardBtn.classList.add('incorrect');
    setTimeout(() => {
      cardBtn.classList.remove('incorrect');
    }, 1000);
  }
}

function handleActionSelection(actionId, actBtn) {
  const correctActId = EMOTIONS[currentEmotionKey].correctAction;
  
  if (actionId === correctActId) {
    // Correct care action
    actBtn.classList.add('correct');
    document.getElementById('emotion-feedback').innerText = "¡Excelente acción de cuidado! Has ayudado a Minizanahoria.";
    
    // Update mascot to spin/dance
    const container = document.getElementById('emotion-mascot-container');
    container.innerHTML = getMascotSVG('happy', 'center');
    container.className = "mascot-stage-wrapper anim-spin";
    
    setTimeout(() => {
      triggerRewardCelebration();
    }, 800);
  } else {
    AudioEngine.playError();
    actBtn.classList.add('incorrect');
    setTimeout(() => {
      actBtn.classList.remove('incorrect');
    }, 1000);
  }
}


// ==========================================================================
// GAME 3: ROUTINE BUILDER (SECUENCIAS DE LA VIDA DIARIA)
// ==========================================================================
const ROUTINE_DATA = {
  morning: {
    title: "Rutina de la Mañana",
    cards: [
      { id: "wake", label: "Despertar ☀️", order: 0 },
      { id: "wash", label: "Lavarse la Cara 🧼", order: 1 },
      { id: "eat", label: "Desayunar 🥕", order: 2 },
      { id: "pack", label: "Alistar Mochila 🎒", order: 3 }
    ]
  },
  evening: {
    title: "Rutina de la Noche",
    cards: [
      { id: "dinner", label: "Cenar Ligero 🍽️", order: 0 },
      { id: "teeth", label: "Cepillarse Dientes 🦷", order: 1 },
      { id: "book", label: "Leer un Cuento 📖", order: 2 },
      { id: "sleep", label: "Dormir 💤", order: 3 }
    ]
  }
};

let activeRoutine = 'morning';
let routineOrder = [];

function initRoutineBuilder() {
  const routine = ROUTINE_DATA[activeRoutine];
  
  // Set slots
  const slotsContainer = document.getElementById('routine-slots-container');
  slotsContainer.innerHTML = '';
  
  // We need 4 slots
  for (let i = 0; i < 4; i++) {
    const slot = document.createElement('div');
    slot.className = 'routine-slot';
    slot.setAttribute('data-index', i + 1);
    
    // Drag & drop listeners for slots
    slot.addEventListener('dragover', e => e.preventDefault());
    slot.addEventListener('dragenter', () => slot.classList.add('dragover'));
    slot.addEventListener('dragleave', () => slot.classList.remove('dragover'));
    slot.addEventListener('drop', e => handleDropOnSlot(e, slot));
    
    slotsContainer.appendChild(slot);
  }
  
  // Set cards (shuffled)
  const cardsContainer = document.getElementById('routine-cards-container');
  cardsContainer.innerHTML = '';
  
  const shuffledCards = [...routine.cards].sort(() => Math.random() - 0.5);
  shuffledCards.forEach(cardData => {
    const card = document.createElement('div');
    card.className = 'routine-card';
    card.setAttribute('draggable', 'true');
    card.setAttribute('data-id', cardData.id);
    card.setAttribute('data-order', cardData.order);
    
    // Icon splitter
    const splitLabel = cardData.label.split(" ");
    const textPart = splitLabel.slice(0, -1).join(" ");
    const emojiPart = splitLabel[splitLabel.length - 1];
    
    card.innerHTML = `
      <span class="card-emoji">${emojiPart}</span>
      <span class="card-text">${textPart}</span>
    `;
    
    // Drag listeners
    card.addEventListener('dragstart', () => {
      card.classList.add('dragging');
    });
    
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });
    
    cardsContainer.appendChild(card);
  });
  
  document.getElementById('routine-feedback').innerText = "Arrastra las tarjetas en el orden correcto.";
}

// Allow dropping back to the source deck
const cardsSourceDeck = document.getElementById('routine-cards-container');

function handleDropOnSlot(e, slot) {
  slot.classList.remove('dragover');
  const draggingCard = document.querySelector('.routine-card.dragging');
  
  if (draggingCard) {
    AudioEngine.playClick();
    
    // Check if slot has children. If yes, move existing child back to source.
    if (slot.children.length > 0) {
      const existingCard = slot.children[0];
      cardsSourceDeck.appendChild(existingCard);
    }
    
    slot.appendChild(draggingCard);
  }
}

cardsSourceDeck.addEventListener('dragover', e => e.preventDefault());
cardsSourceDeck.addEventListener('drop', () => {
  const draggingCard = document.querySelector('.routine-card.dragging');
  if (draggingCard) {
    AudioEngine.playClick();
    cardsSourceDeck.appendChild(draggingCard);
  }
});

document.getElementById('check-routine-btn').addEventListener('click', () => {
  AudioEngine.playClick();
  const slots = document.querySelectorAll('.routine-slot');
  let allCorrect = true;
  let missing = false;
  
  slots.forEach((slot, index) => {
    if (slot.children.length === 0) {
      missing = true;
      allCorrect = false;
      return;
    }
    
    const cardOrder = parseInt(slot.children[0].getAttribute('data-order'));
    if (cardOrder !== index) {
      allCorrect = false;
    }
  });
  
  if (missing) {
    AudioEngine.playError();
    document.getElementById('routine-feedback').innerText = "Coloca todas las tarjetas en los espacios vacíos.";
    return;
  }
  
  if (allCorrect) {
    document.getElementById('routine-feedback').innerText = "¡Increíble! Toda la secuencia está en el orden correcto.";
    
    // Toggle active routine type for next round
    activeRoutine = activeRoutine === 'morning' ? 'evening' : 'morning';
    
    setTimeout(() => {
      triggerRewardCelebration();
    }, 600);
  } else {
    AudioEngine.playError();
    document.getElementById('routine-feedback').innerText = "Secuencia incorrecta. Observa los pasos y reordénalos.";
  }
});

document.getElementById('reset-routine-btn').addEventListener('click', () => {
  AudioEngine.playClick();
  initRoutineBuilder();
});


// ==========================================================================
// BOOTSTRAP INITIALIZATION
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initFocusOrbit(); // Default game on startup
});
