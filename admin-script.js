// Admin Dashboard Script

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupForm();
    setupSearch();
    loadDashboard();
    loadClients();
});

// Tab Navigation
function setupTabs() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and tabs
            navBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked button and corresponding tab
            btn.classList.add('active');
            document.getElementById(tabName).classList.add('active');
            
            // Update page title
            document.getElementById('page-title').textContent = btn.textContent.trim();
        });
    });
}

// Form Setup
function setupForm() {
    const form = document.getElementById('client-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addClient();
    });
}

// Add Client
function addClient() {
    const clientData = {
        id: Date.now(),
        groomName: document.getElementById('groom-name').value,
        brideName: document.getElementById('bride-name').value,
        weddingDate: document.getElementById('wedding-date').value,
        weddingTime: document.getElementById('wedding-time').value,
        venueName: document.getElementById('venue-name').value,
        venueAddress: document.getElementById('venue-address').value,
        groomFather: document.getElementById('groom-father').value,
        groomMother: document.getElementById('groom-mother').value,
        brideFather: document.getElementById('bride-father').value,
        brideMother: document.getElementById('bride-mother').value,
        musicUrl: document.getElementById('music-url').value,
        photo1: document.getElementById('photo-1').value,
        photo2: document.getElementById('photo-2').value,
        photo3: document.getElementById('photo-3').value,
        amountCharged: parseInt(document.getElementById('amount-charged').value),
        paymentStatus: document.getElementById('payment-status').value,
        createdAt: new Date().toISOString()
    };

    // Save to localStorage
    let clients = JSON.parse(localStorage.getItem('wedding-clients')) || [];
    clients.push(clientData);
    localStorage.setItem('wedding-clients', JSON.stringify(clients));

    // Generate unique invitation link
    const invitationLink = `invitation.html?id=${clientData.id}`;
    
    // Show success message
    alert(`✅ Client Added Successfully!\n\nInvitation Link:\n${window.location.origin}/${invitationLink}\n\nShare this link with your client!`);

    // Reset form
    document.getElementById('client-form').reset();
    
    // Reload dashboard
    loadDashboard();
    loadClients();
}

// Load Dashboard
function loadDashboard() {
    const clients = JSON.parse(localStorage.getItem('wedding-clients')) || [];
    
    // Update stats
    document.getElementById('total-clients').textContent = clients.length;
    
    const totalRevenue = clients.reduce((sum, c) => sum + c.amountCharged, 0);
    document.getElementById('total-revenue').textContent = `₹${totalRevenue.toLocaleString()}`;
    
    const today = new Date();
    const upcomingCount = clients.filter(c => new Date(c.weddingDate) > today).length;
    document.getElementById('upcoming-weddings').textContent = upcomingCount;

    // Load recent clients
    const recentList = document.getElementById('recent-list');
    if (clients.length === 0) {
        recentList.innerHTML = '<p class="empty-state">No clients yet. Add your first client to get started!</p>';
        return;
    }

    const recent = clients.slice(-5).reverse();
    recentList.innerHTML = recent.map(client => `
        <div class="client-row">
            <div class="client-info">
                <div class="client-name">${client.groomName} & ${client.brideName}</div>
                <div class="client-date">Wedding: ${new Date(client.weddingDate).toLocaleDateString()}</div>
            </div>
            <div class="client-actions">
                <button class="btn-small" onclick="viewClient(${client.id})">View</button>
                <button class="btn-small" onclick="copyLink(${client.id})">Copy Link</button>
            </div>
        </div>
    `).join('');
}

// Load Clients
function loadClients() {
    const clients = JSON.parse(localStorage.getItem('wedding-clients')) || [];
    const grid = document.getElementById('clients-grid');

    if (clients.length === 0) {
        grid.innerHTML = '<p class="empty-state">No clients yet. Add your first client!</p>';
        return;
    }

    grid.innerHTML = clients.map(client => `
        <div class="client-card">
            <div class="client-card-header">
                <div class="client-card-title">${client.groomName} & ${client.brideName}</div>
                <div class="client-card-status">${client.paymentStatus}</div>
            </div>
            <div class="client-card-info">
                <div>📅 ${new Date(client.weddingDate).toLocaleDateString()}</div>
                <div>💰 ₹${client.amountCharged}</div>
                <div>📍 ${client.venueName || 'TBD'}</div>
            </div>
            <div class="client-card-actions">
                <button class="btn-view" onclick="viewClient(${client.id})">View</button>
                <button class="btn-edit" onclick="copyLink(${client.id})">Copy Link</button>
                <button class="btn-delete" onclick="deleteClient(${client.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// View Client
function viewClient(id) {
    const clients = JSON.parse(localStorage.getItem('wedding-clients')) || [];
    const client = clients.find(c => c.id === id);

    if (!client) return;

    const modal = document.getElementById('client-modal');
    const modalBody = document.getElementById('modal-body');

    const invitationLink = `invitation.html?id=${client.id}`;

    modalBody.innerHTML = `
        <h3>${client.groomName} & ${client.brideName}</h3>
        <div style="margin-top: 20px;">
            <p><strong>Wedding Date:</strong> ${new Date(client.weddingDate).toLocaleDateString()}</p>
            <p><strong>Wedding Time:</strong> ${client.weddingTime || 'Not specified'}</p>
            <p><strong>Venue:</strong> ${client.venueName || 'Not specified'}</p>
            <p><strong>Address:</strong> ${client.venueAddress || 'Not specified'}</p>
            <p><strong>Amount Charged:</strong> ₹${client.amountCharged}</p>
            <p><strong>Payment Status:</strong> ${client.paymentStatus}</p>
            <p><strong>Created:</strong> ${new Date(client.createdAt).toLocaleDateString()}</p>
            
            <hr style="margin: 20px 0;">
            
            <h4>Invitation Link</h4>
            <div style="background: #f5f1e8; padding: 15px; border-radius: 8px; margin-top: 10px;">
                <input type="text" value="${window.location.origin}/${invitationLink}" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;" readonly>
                <button onclick="copyToClipboard('${window.location.origin}/${invitationLink}')" style="margin-top: 10px; padding: 8px 16px; background: #d4af37; border: none; border-radius: 4px; cursor: pointer;">Copy Link</button>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

// Copy Link
function copyLink(id) {
    const invitationLink = `invitation.html?id=${id}`;
    const fullLink = `${window.location.origin}/${invitationLink}`;
    copyToClipboard(fullLink);
}

// Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ Link copied to clipboard!');
    });
}

// Delete Client
function deleteClient(id) {
    if (!confirm('Are you sure you want to delete this client?')) return;

    let clients = JSON.parse(localStorage.getItem('wedding-clients')) || [];
    clients = clients.filter(c => c.id !== id);
    localStorage.setItem('wedding-clients', JSON.stringify(clients));

    loadDashboard();
    loadClients();
    alert('✅ Client deleted successfully!');
}

// Search Clients
function setupSearch() {
    const searchBox = document.getElementById('search-clients');
    if (searchBox) {
        searchBox.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const clients = JSON.parse(localStorage.getItem('wedding-clients')) || [];
            const filtered = clients.filter(c => 
                c.groomName.toLowerCase().includes(query) || 
                c.brideName.toLowerCase().includes(query)
            );

            const grid = document.getElementById('clients-grid');
            if (filtered.length === 0) {
                grid.innerHTML = '<p class="empty-state">No clients found</p>';
                return;
            }

            grid.innerHTML = filtered.map(client => `
                <div class="client-card">
                    <div class="client-card-header">
                        <div class="client-card-title">${client.groomName} & ${client.brideName}</div>
                        <div class="client-card-status">${client.paymentStatus}</div>
                    </div>
                    <div class="client-card-info">
                        <div>📅 ${new Date(client.weddingDate).toLocaleDateString()}</div>
                        <div>💰 ₹${client.amountCharged}</div>
                        <div>📍 ${client.venueName || 'TBD'}</div>
                    </div>
                    <div class="client-card-actions">
                        <button class="btn-view" onclick="viewClient(${client.id})">View</button>
                        <button class="btn-edit" onclick="copyLink(${client.id})">Copy Link</button>
                        <button class="btn-delete" onclick="deleteClient(${client.id})">Delete</button>
                    </div>
                </div>
            `).join('');
        });
    }
}

// Close Modal
function closeModal() {
    document.getElementById('client-modal').classList.remove('active');
}

// Export Data
function exportData() {
    const clients = JSON.parse(localStorage.getItem('wedding-clients')) || [];
    const dataStr = JSON.stringify(clients, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wedding-clients-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    alert('✅ Data exported successfully!');
}

// Clear All Data
function clearAllData() {
    if (!confirm('⚠️ This will delete ALL client data. Are you sure?')) return;
    localStorage.removeItem('wedding-clients');
    loadDashboard();
    loadClients();
    alert('✅ All data cleared!');
}

// Show Help
function showHelp() {
    alert(`
📖 WEDDING INVITATION ADMIN - HELP

1. ADD NEW CLIENT
   - Fill in couple details, wedding info, and media
   - Click "Create Client & Invitation"
   - Share the generated link with your client

2. MANAGE CLIENTS
   - View all clients in the "All Clients" tab
   - Search by couple names
   - Copy invitation links
   - Delete clients if needed

3. TRACK REVENUE
   - Dashboard shows total revenue
   - Track payment status (Pending/Paid/Partial)
   - Export data for records

4. SETTINGS
   - Set default pricing
   - Export/Import data
   - Backup your information

Each client gets a UNIQUE invitation link.
No code changes needed!

Questions? Check the documentation.
    `);
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('client-modal');
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});
