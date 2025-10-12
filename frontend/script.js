const API_URL = 'http://localhost:3000';

// DOM Elements
const loginCard = document.getElementById('login-card');
const dashboard = document.getElementById('dashboard');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');
const formTitle = document.getElementById('form-title');
const toggleLink = document.getElementById('toggle-link');
const addBtn = document.getElementById('add-btn');
const tableBody = document.getElementById('campaigns-table');
const searchInput = document.getElementById('search-input');

let campaigns = [];
let isSignup = false;

// ---------- Toggle Login / Signup ----------
toggleLink.addEventListener('click', () => {
  isSignup = !isSignup;
  updateFormMode();
});

function updateFormMode() {
  formTitle.innerText = isSignup ? 'Sign Up' : 'Login';
  loginBtn.innerText = isSignup ? 'Create Account' : 'Login';
  toggleLink.innerText = isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up";
  loginError.innerText = '';
}

// ---------- Login / Signup ----------
loginBtn.addEventListener('click', async () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  loginError.innerText = '';

  if (!username || !password) {
    loginError.innerText = 'Please enter username and password';
    return;
  }

  const endpoint = isSignup ? '/signup' : '/login';
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      if (isSignup) {
        // After signup success → switch to login
        loginError.style.color = 'green';
        loginError.innerText = 'Signup successful! Please login now.';
        isSignup = false;
        updateFormMode();
      } else {
        // Login success → show dashboard
        loginCard.style.display = 'none';
        dashboard.style.display = 'block';
        loadCampaigns();
      }
    } else {
      // If login fails and not signed up yet → suggest signup
      if (!isSignup && data.error && data.error.toLowerCase().includes('not found')) {
        loginError.innerText = 'Account not found. Please sign up first.';
        isSignup = true;
        updateFormMode();
      } else {
        loginError.innerText = data.error || 'Something went wrong.';
      }
    }
  } catch (err) {
    console.error(err);
    loginError.innerText = 'Server error. Please try again later.';
  }
});

// ---------- Load Campaigns ----------
const loadCampaigns = async () => {
  try {
    const res = await fetch(`${API_URL}/campaigns`);
    campaigns = await res.json();
    displayCampaigns();
    updateSummary();
  } catch (err) {
    console.error('Failed to load campaigns:', err);
  }
};

// ---------- Display Campaigns ----------
const displayCampaigns = () => {
  const search = searchInput.value.toLowerCase();
  tableBody.innerHTML = '';

  campaigns
    .filter(c => !search || c.name.toLowerCase().includes(search) || c.client.toLowerCase().includes(search))
    .forEach(c => {
      const card = document.createElement('div');
      card.className = 'campaign-card';
      card.innerHTML = `
        <h3>${c.name}</h3>
        <p>Client: ${c.client}</p>
        <p>Start Date: ${c.startDate}</p>
        <span class="badge ${c.status}">${c.status}</span>
        <button class="delete-btn" onclick="deleteCampaign(${c.id})">Delete</button>
        <select onchange="updateStatus(${c.id}, this.value)">
          <option value="Pending" ${c.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Active" ${c.status === 'Active' ? 'selected' : ''}>Active</option>
          <option value="Completed" ${c.status === 'Completed' ? 'selected' : ''}>Completed</option>
        </select>
      `;
      tableBody.appendChild(card);
    });
};

// ---------- Add Campaign ----------
addBtn.addEventListener('click', async () => {
  const newCampaign = {
    name: document.getElementById('name').value.trim(),
    client: document.getElementById('client').value.trim(),
    startDate: document.getElementById('start-date').value,
    status: document.getElementById('status').value
  };

  if (!newCampaign.name || !newCampaign.client || !newCampaign.startDate) {
    alert('Please fill in all fields before adding.');
    return;
  }

  await fetch(`${API_URL}/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCampaign)
  });

  document.getElementById('name').value = '';
  document.getElementById('client').value = '';
  document.getElementById('start-date').value = '';
  loadCampaigns();
});

// ---------- Update / Delete ----------
async function updateStatus(id, status) {
  await fetch(`${API_URL}/campaigns/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  loadCampaigns();
}

async function deleteCampaign(id) {
  await fetch(`${API_URL}/campaigns/${id}`, { method: 'DELETE' });
  loadCampaigns();
}

// ---------- Search ----------
searchInput.addEventListener('input', displayCampaigns);

// ---------- Dashboard Summary ----------
function updateSummary() {
  document.getElementById('total-count').innerText = campaigns.length;
  document.getElementById('active-count').innerText = campaigns.filter(c => c.status === 'Active').length;
  document.getElementById('pending-count').innerText = campaigns.filter(c => c.status === 'Pending').length;
  document.getElementById('completed-count').innerText = campaigns.filter(c => c.status === 'Completed').length;
}
