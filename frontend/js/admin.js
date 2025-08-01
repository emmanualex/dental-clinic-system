class AdminDashboard {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = null;
        this.init();
    }

    async init() {
        if (!this.token) {
            window.location.href = '../index.html';
            return;
        }

        await this.loadUserProfile();
        this.setupEventListeners();
        this.loadDashboardData();
        this.setupNavigation();
    }

    async loadUserProfile() {
        try {
            const response = await fetch('/api/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (response.ok) {
                this.user = await response.json();
                document.getElementById('adminName').textContent = this.user.name;
            } else {
                localStorage.removeItem('token');
                window.location.href = '../index.html';
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }

    setupEventListeners() {
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = '../index.html';
        });

        // Status update form
        document.getElementById('statusForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateAppointmentStatus();
        });

        // Refresh appointments
        document.getElementById('refreshAppointments').addEventListener('click', () => {
            this.loadAppointments();
        });

        // Modal close
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                closeBtn.closest('.modal').style.display = 'none';
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Hide all tab contents
                document.querySelectorAll('.tab-content').forEach(tab => {
                    tab.classList.remove('active');
                });
                
                // Show selected tab
                const tabId = link.getAttribute('data-tab') + '-tab';
                document.getElementById(tabId).classList.add('active');
                
                // Load data for the tab
                this.loadTabData(link.getAttribute('data-tab'));
            });
        });
    }

    async loadTabData(tab) {
        switch(tab) {
            case 'appointments':
                this.loadAppointments();
                break;
            case 'users':
                this.loadUsers();
                break;
            case 'messages':
                this.loadMessages();
                break;
        }
    }

    async loadDashboardData() {
        try {
            // Load stats
            const appointmentsResponse = await fetch('/api/appointments', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (appointmentsResponse.ok) {
                const appointmentsData = await appointmentsResponse.json();
                document.getElementById('totalAppointments').textContent = appointmentsData.appointments.length;
            }

            // Load recent appointments
            this.loadRecentAppointments();
        } catch (error) {
            console.error('Error loading dashboard ', error);
        }
    }

    async loadRecentAppointments() {
        try {
            const response = await fetch('/api/appointments', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const recentAppointments = data.appointments.slice(0, 5);
                this.renderRecentAppointments(recentAppointments);
            }
        } catch (error) {
            console.error('Error loading recent appointments:', error);
        }
    }

    renderRecentAppointments(appointments) {
        const tbody = document.querySelector('#recentAppointmentsTable tbody');
        tbody.innerHTML = '';

        appointments.forEach(appointment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.patientName}</td>
                <td>${appointment.service}</td>
                <td>${new Date(appointment.date).toLocaleDateString()}</td>
                <td><span class="status-badge status-${appointment.status}">${appointment.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="adminDashboard.openStatusModal('${appointment._id}', '${appointment.status}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    async loadAppointments() {
        try {
            const response = await fetch('/api/appointments', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.renderAppointments(data.appointments);
            }
        } catch (error) {
            console.error('Error loading appointments:', error);
        }
    }

    renderAppointments(appointments) {
        const tbody = document.querySelector('#appointmentsTable tbody');
        tbody.innerHTML = '';

        appointments.forEach(appointment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.patientName}</td>
                <td>${appointment.service}</td>
                <td>${new Date(appointment.date).toLocaleDateString()}</td>
                <td>${appointment.time}</td>
                <td><span class="status-badge status-${appointment.status}">${appointment.status}</span></td>
                <td><span class="payment-badge payment-${appointment.paymentStatus}">${appointment.paymentStatus}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="adminDashboard.openStatusModal('${appointment._id}', '${appointment.status}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="adminDashboard.deleteAppointment('${appointment._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    async loadUsers() {
        try {
            const response = await fetch('/api/users', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.renderUsers(data.users);
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    renderUsers(users) {
        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone || 'N/A'}</td>
                <td><span class="status-badge status-${user.role}">${user.role}</span></td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="adminDashboard.deleteUser('${user._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    async loadMessages() {
        try {
            const response = await fetch('/api/contact', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.renderMessages(data.messages);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    renderMessages(messages) {
        const tbody = document.querySelector('#messagesTable tbody');
        tbody.innerHTML = '';

        messages.forEach(message => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${message.name}</td>
                <td>${message.email}</td>
                <td>${message.subject}</td>
                <td>${new Date(message.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="adminDashboard.viewMessage('${message._id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="adminDashboard.deleteMessage('${message._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    openStatusModal(appointmentId, currentStatus) {
        document.getElementById('appointmentId').value = appointmentId;
        document.getElementById('statusSelect').value = currentStatus;
        document.getElementById('updateStatusModal').style.display = 'block';
    }

    async updateAppointmentStatus() {
        const appointmentId = document.getElementById('appointmentId').value;
        const status = document.getElementById('statusSelect').value;

        try {
            const response = await fetch(`/api/appointments/${appointmentId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                document.getElementById('updateStatusModal').style.display = 'none';
                this.loadAppointments();
                this.loadDashboardData();
                alert('Status updated successfully!');
            } else {
                const error = await response.json();
                alert('Error updating status: ' + error.message);
            }
        } catch (error) {
            alert('Error updating status: ' + error.message);
        }
    }

    async deleteAppointment(appointmentId) {
        if (confirm('Are you sure you want to delete this appointment?')) {
            try {
                const response = await fetch(`/api/appointments/${appointmentId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                if (response.ok) {
                    this.loadAppointments();
                    this.loadDashboardData();
                    alert('Appointment deleted successfully!');
                } else {
                    const error = await response.json();
                    alert('Error deleting appointment: ' + error.message);
                }
            } catch (error) {
                alert('Error deleting appointment: ' + error.message);
            }
        }
    }

    async deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`/api/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                if (response.ok) {
                    this.loadUsers();
                    alert('User deleted successfully!');
                } else {
                    const error = await response.json();
                    alert('Error deleting user: ' + error.message);
                }
            } catch (error) {
                alert('Error deleting user: ' + error.message);
            }
        }
    }

    async deleteMessage(messageId) {
        if (confirm('Are you sure you want to delete this message?')) {
            try {
                const response = await fetch(`/api/contact/${messageId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                if (response.ok) {
                    this.loadMessages();
                    alert('Message deleted successfully!');
                } else {
                    const error = await response.json();
                    alert('Error deleting message: ' + error.message);
                }
            } catch (error) {
                alert('Error deleting message: ' + error.message);
            }
        }
    }
}

// Initialize admin dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.adminDashboard = new AdminDashboard();
});
