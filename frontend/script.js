const API_URL = 'http://localhost:3000';

// -------------------- DOM Elements --------------------
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
let isSignup = formTitle ? formTitle.innerText.toLowerCase().includes('sign up') : false;

// -------------------- Toggle Login / Signup --------------------
if (toggleLink) {
  toggleLink.addEventListener('click', () => {
    isSignup = !isSignup;
    updateFormMode();
  });
}

function updateFormMode() {
  if (!formTitle) return;
  formTitle.innerText = isSignup ? 'Sign Up' : 'Login';
  loginBtn.innerText = isSignup ? 'Create Account' : 'Login';
  toggleLink.innerText = isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up";
  loginError.innerText = '';
  loginError.style.color = 'red';
}

// -------------------- Login / Signup --------------------
if (loginBtn) {
  loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();

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
          loginError.style.color = 'green';
          loginError.innerText = 'Signup successful! Please login now.';
          isSignup = false;
          updateFormMode();
        } else {
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('username', username);
          if (dashboard) {
            loginCard.style.display = 'none';
            dashboard.style.display = 'block';
            loadCampaigns();
          } else {
            window.location.href = 'dashboard.html';
          }
        }
      } else {
        loginError.innerText = data.error || 'Something went wrong.';
      }
    } catch (err) {
      console.error(err);
      loginError.innerText = 'Server error. Please try again later.';
    }
  });
}

// -------------------- Load Campaigns --------------------
async function loadCampaigns() {
  try {
    const res = await fetch(`${API_URL}/campaigns`);
    campaigns = await res.json();
    displayCampaigns();
    updateSummary();
  } catch (err) {
    console.error('Failed to load campaigns:', err);
  }
}

// -------------------- Display Campaigns --------------------
function displayCampaigns() {
  if (!tableBody) return;
  const search = searchInput ? searchInput.value.toLowerCase() : '';
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
}

// -------------------- Add Campaign --------------------
if (addBtn) {
  addBtn.addEventListener('click', async (e) => {
    e.preventDefault();

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

    try {
      const res = await fetch(`${API_URL}/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCampaign)
      });

      if (!res.ok) throw new Error('Failed to add campaign');

      // Clear inputs
      document.getElementById('name').value = '';
      document.getElementById('client').value = '';
      document.getElementById('start-date').value = '';
      document.getElementById('status').value = 'Pending';

      loadCampaigns();
    } catch (err) {
      console.error('Failed to add campaign:', err);
      alert('Error adding campaign. Check console.');
    }
  });
}

// -------------------- Update / Delete --------------------
async function updateStatus(id, status) {
  try {
    await fetch(`${API_URL}/campaigns/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    loadCampaigns();
  } catch (err) {
    console.error('Failed to update status:', err);
  }
}

async function deleteCampaign(id) {
  try {
    await fetch(`${API_URL}/campaigns/${id}`, { method: 'DELETE' });
    loadCampaigns();
  } catch (err) {
    console.error('Failed to delete campaign:', err);
  }
}

// -------------------- Search --------------------
if (searchInput) {
  searchInput.addEventListener('input', displayCampaigns);
}

// -------------------- Dashboard Summary --------------------
function updateSummary() {
  if (!campaigns) return;
  document.getElementById('total-count').innerText = campaigns.length;
  document.getElementById('active-count').innerText = campaigns.filter(c => c.status === 'Active').length;
  document.getElementById('pending-count').innerText = campaigns.filter(c => c.status === 'Pending').length;
  document.getElementById('completed-count').innerText = campaigns.filter(c => c.status === 'Completed').length;
}

// -------------------- Logout --------------------
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
  });
}

// -------------------- Auto-show dashboard if logged in --------------------
window.addEventListener('load', () => {
  if (localStorage.getItem('loggedIn') && dashboard) {
    loginCard.style.display = 'none';
    dashboard.style.display = 'block';
    loadCampaigns();
  }
});
