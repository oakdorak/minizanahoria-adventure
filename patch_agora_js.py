import re

with open('agora.js', 'r') as f:
    content = f.read()

# Fix lines 496-498
old_mirror = """  // Populate content
  document.getElementById('mirror-red-content').innerHTML = `<p>${result.red}</p>`;
  document.getElementById('mirror-blue-content').innerHTML = `<p>${result.blue}</p>`;
  document.getElementById('mirror-green-content').innerHTML = `<p>${result.green}</p>`;"""

new_mirror = """  // Populate content
  const redP = document.createElement('p');
  redP.textContent = result.red;
  document.getElementById('mirror-red-content').innerHTML = '';
  document.getElementById('mirror-red-content').appendChild(redP);

  const blueP = document.createElement('p');
  blueP.textContent = result.blue;
  document.getElementById('mirror-blue-content').innerHTML = '';
  document.getElementById('mirror-blue-content').appendChild(blueP);

  const greenP = document.createElement('p');
  greenP.textContent = result.green;
  document.getElementById('mirror-green-content').innerHTML = '';
  document.getElementById('mirror-green-content').appendChild(greenP);"""

content = content.replace(old_mirror, new_mirror)

# Fix lines 536-537
old_library = """    itemEl.innerHTML = `
      <div class="item-meta">
        <span>${item.timestamp}</span>
        <span>Evolución: ${stars}</span>
      </div>
      <div class="item-concept">Concepto Original: "${item.concept}"</div>
      <div class="item-synthesis">Evolución Sellada: ${item.green}</div>
      <div class="item-actions">
        <button class="cleanse-btn" onclick="deleteLibraryItem(${State.library.length - 1 - index})">Purgar</button>
      </div>
    `;"""

new_library = """    // Construct elements safely
    const metaDiv = document.createElement('div');
    metaDiv.className = 'item-meta';

    const timeSpan = document.createElement('span');
    timeSpan.textContent = item.timestamp;

    const starsSpan = document.createElement('span');
    starsSpan.textContent = `Evolución: ${stars}`;

    metaDiv.appendChild(timeSpan);
    metaDiv.appendChild(starsSpan);

    const conceptDiv = document.createElement('div');
    conceptDiv.className = 'item-concept';
    conceptDiv.textContent = `Concepto Original: "${item.concept}"`;

    const synthesisDiv = document.createElement('div');
    synthesisDiv.className = 'item-synthesis';
    synthesisDiv.textContent = `Evolución Sellada: ${item.green}`;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'item-actions';
    const btn = document.createElement('button');
    btn.className = 'cleanse-btn';
    btn.textContent = 'Purgar';
    btn.onclick = () => deleteLibraryItem(State.library.length - 1 - index);
    actionsDiv.appendChild(btn);

    itemEl.appendChild(metaDiv);
    itemEl.appendChild(conceptDiv);
    itemEl.appendChild(synthesisDiv);
    itemEl.appendChild(actionsDiv);"""

content = content.replace(old_library, new_library)

with open('agora.js', 'w') as f:
    f.write(content)

print("Patch applied successfully.")
