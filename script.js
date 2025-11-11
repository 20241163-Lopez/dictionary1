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
  "vpn": { def: "A Virtual Private Network securely connects remote users to a private network.", ex: "Used for secure remote work connections." },
  "subnet mask": { def: "A number that divides an IP address into network and host parts.", ex: "Example: 255.255.255.0" },
  "gateway": { def: "A device that connects different networks and routes traffic between them.", ex: "Often your router acts as the gateway." },
  "osi model": { def: "A conceptual model that describes how data moves through seven network layers.", ex: "Layers include Physical, Data Link, Network, etc." },
  "packet": { def: "A small unit of data transmitted over a network.", ex: "Files are broken into packets before transmission." },
  "ping": { def: "A network command used to test connectivity between devices.", ex: "Example: ping google.com" },
  "server": { def: "A computer that provides data or services to other computers over a network.", ex: "Web servers host websites for users." },
  "dhcp": { def: "Dynamic Host Configuration Protocol automatically assigns IP addresses to devices on a network.", ex: "DHCP helps devices join a network without manual IP configuration." },
  "nat": { def: "Network Address Translation allows multiple devices to share a single public IP address.", ex: "Used in routers to connect private networks to the internet." },
  "arp": { def: "Address Resolution Protocol maps IP addresses to MAC addresses.", ex: "Used to find the hardware address of a local device." },
  "lan": { def: "Local Area Network connects computers within a limited area like a home or office.", ex: "LANs are common in schools and offices." },
  "wan": { def: "Wide Area Network connects multiple LANs over long distances.", ex: "The internet is the largest WAN." },
  "man": { def: "Metropolitan Area Network connects users within a city or large campus.", ex: "Used by universities and large companies." },
  "proxy server": { def: "A server that acts as an intermediary for requests from clients seeking resources.", ex: "Used for security, filtering, or caching web content." },
  "port": { def: "A communication endpoint used to identify specific processes or services.", ex: "Example: HTTP uses port 80; HTTPS uses port 443." },
  "http": { def: "Hypertext Transfer Protocol used to transmit web pages.", ex: "HTTP runs on port 80." },
  "https": { def: "Secure version of HTTP that encrypts data using SSL/TLS.", ex: "HTTPS is used for secure websites." },
  "ftp": { def: "File Transfer Protocol used to transfer files between computers.", ex: "Example: Uploading website files to a server." },
  "smtp": { def: "Simple Mail Transfer Protocol used for sending emails.", ex: "SMTP runs on port 25." },
  "snmp": { def: "Simple Network Management Protocol used to monitor and manage network devices.", ex: "SNMP is used by network administrators." },
  "ipv4": { def: "Internet Protocol version 4 uses 32-bit addresses.", ex: "Example: 192.168.0.1" },
  "ipv6": { def: "Internet Protocol version 6 uses 128-bit addresses to replace IPv4.", ex: "Example: 2001:0db8:85a3::8a2e:0370:7334" },
  "hub": { def: "A basic network device that connects multiple Ethernet devices together.", ex: "Hubs broadcast data to all connected devices." },
  "repeater": { def: "A device that amplifies or regenerates network signals to extend their range.", ex: "Used in long-distance cable networks." },
  "load balancer": { def: "Distributes network traffic evenly across multiple servers.", ex: "Improves reliability and performance of web services." },
  "network topology": { def: "The physical or logical arrangement of network devices and connections.", ex: "Common topologies: star, ring, bus, mesh." },
  "dns server": { def: "A server that stores domain name records and resolves names to IP addresses.", ex: "Example: Google's DNS server 8.8.8.8" },
  "cloud computing": { def: "The delivery of computing services over the internet.", ex: "Examples: AWS, Google Cloud, Microsoft Azure." },
  "data center": { def: "A facility that houses computer systems and related components.", ex: "Data centers host cloud servers and websites." },
  "load shedding": { def: "The process of reducing network load by shedding less important data.", ex: "Used to maintain system stability during heavy traffic." },
  "qos": { def: "Quality of Service ensures priority for important network traffic.", ex: "Used in VoIP and streaming for stable performance." },
  "bridge": { def: "A device that connects and filters traffic between two network segments.", ex: "Used to divide large networks into smaller ones." },
  "collisions": { def: "When two devices send data on the same network segment at the same time.", ex: "Common in hub-based Ethernet networks." },
  "ip packet": { def: "A data packet that contains source and destination IP addresses.", ex: "Used to send data over the internet." }

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