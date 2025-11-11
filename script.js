const qInput = document.getElementById('q');
const searchBtn = document.getElementById('searchBtn');
const resultEl = document.getElementById('result');
const historyList = document.getElementById('historyList');
const favList = document.getElementById('favList');
const randomBtn = document.getElementById('randomBtn');
const clearBtn = document.getElementById('clearBtn');

// Offline Networking term dataset
const NET_TERMS = {
  "ip address": { def: "A unique numerical label assigned to each device connected to a network.", ex: "Example: 192.168.1.1" },
  "router": { def: "A device that forwards data packets between computer networks.", ex: "Routers connect local networks to the internet." },
  "switch": { def: "A network device that connects devices within a LAN and forwards data based on MAC addresses.", ex: "Used to connect computers in the same office network." },
  "firewall": { def: "A system that monitors and controls incoming and outgoing network traffic.", ex: "Firewalls block unauthorized access to private networks." },
  "dns": { def: "The Domain Name System translates domain names into IP addresses.", ex: "Example: www.google.com → 142.250.190.14" },
  "protocol": { def: "A set of rules governing the exchange of data between devices.", ex: "Common protocols include HTTP, FTP, and TCP/IP." },
  "tcp": { def: "Transmission Control Protocol ensures reliable data delivery between devices.", ex: "Used for web browsing and email communication." },
  "udp": { def: "User Datagram Protocol provides faster but less reliable data transmission.", ex: "Used in video streaming and online games." },
  "mac address": { def: "A unique hardware identifier assigned to each network interface.", ex: "Example: 00:1A:2B:3C:4D:5E" },
  "ethernet": { def: "A technology for connecting devices in a wired local area network.", ex: "Ethernet cables connect PCs to routers or switches." },
  "wifi": { def: "A wireless technology that allows devices to connect to a local network and the internet.", ex: "Wi-Fi uses radio waves instead of cables." },
  "bandwidth": { def: "The maximum rate of data transfer across a network path.", ex: "Measured in Mbps or Gbps." },
  "latency": { def: "The time delay between sending and receiving data.", ex: "Low latency is important for online gaming." },
  "vpn": { def: "A Virtual Private Network that securely connects remote users to a private network.", ex: "Used for secure remote work connections." },
  "subnet mask": { def: "A number that divides an IP address into network and host parts.", ex: "Example: 255.255.255.0" },
  "gateway": { def: "A device that connects different networks and routes traffic between them.", ex: "Often your router acts as the gateway." },
  "osi model": { def: "A conceptual model that describes how data moves through seven network layers.", ex: "Layers include Physical, Data Link, Network, etc." },
  "packet": { def: "A small unit of data transmitted over a network.", ex: "Files are broken into packets before transmission." },
  "ping": { def: "A network command used to test connectivity between devices.", ex: "Example: ping google.com" },
  "server": { def: "A computer that provides data or services to other computers over a network.", ex: "Web servers host websites for users." }
};

function loadJSON(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } 
  catch (e) { return []; }
}
function saveJSON(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

let history = loadJSON('netdict_history');
let favorites = loadJSON('netdict_favorites');

function renderHistory() {
  historyList.innerHTML = '';
  if (history.length === 0) { historyList.innerHTML = '<li>No history yet</li>'; return; }
  history.slice().reverse().forEach(w => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${w}</span><button class='btn-ghost load' data-word='${w}'>Load</button>`;
    historyList.appendChild(li);
  });
}

function renderFavs() {
  favList.innerHTML = '';
  if (favorites.length === 0) { favList.innerHTML = '<li>No favorites yet</li>'; return; }
  favorites.forEach(w => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${w}</span><button class='btn-ghost load' data-word='${w}'>Load</button><button class='btn-ghost remove' data-word='${w}'>✖</button>`;
    favList.appendChild(li);
  });
}

function renderDefinition(word) {
  const data = NET_TERMS[word.toLowerCase()];
  if (!data) {
    resultEl.innerHTML = `<div style='color:gray'>No definition found for "${word}".</div>`;
    return;
  }
  const favState = favorites.includes(word) ? 'Unfavorite' : 'Save';
  resultEl.innerHTML = `
    <div class='meaning'>
      <div class='part'>${word}</div>
      <div>${data.def}</div>
      <div class='example'>${data.ex}</div>
      <button id='favBtn' class='btn-ghost'>${favState}</button>
    </div>`;
  document.getElementById('favBtn').addEventListener('click', () => {
    toggleFavorite(word);
    renderDefinition(word);
  });
}

function toggleFavorite(word) {
  if (favorites.includes(word))
    favorites = favorites.filter(x => x !== word);
  else
    favorites.push(word);
  saveJSON('netdict_favorites', favorites);
  renderFavs();
}

function pushHistory(word) {
  history = history.filter(x => x !== word);
  history.push(word);
  if (history.length > 15) history.shift();
  saveJSON('netdict_history', history);
  renderHistory();
}

searchBtn.addEventListener('click', () => {
  const word = qInput.value.trim().toLowerCase();
  if (!word) return;
  renderDefinition(word);
  pushHistory(word);
});

qInput.addEventListener('keydown', e => { if (e.key === 'Enter') searchBtn.click(); });

randomBtn.addEventListener('click', () => {
  const keys = Object.keys(NET_TERMS);
  const word = keys[Math.floor(Math.random() * keys.length)];
  qInput.value = word;
  searchBtn.click();
});

clearBtn.addEventListener('click', () => {
  qInput.value = '';
  resultEl.innerHTML = '';
});

document.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  if (btn.classList.contains('load')) {
    const w = btn.dataset.word;
    qInput.value = w;
    searchBtn.click();
  }
  if (btn.classList.contains('remove')) {
    const w = btn.dataset.word;
    favorites = favorites.filter(x => x !== w);
    saveJSON('netdict_favorites', favorites);
    renderFavs();
  }
});

renderHistory();
renderFavs();
