// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDUuXg9zLhx_Yff03ItxcE5wIdGrUbCVN8",
    authDomain: "smart-complaint-box-8b946.firebaseapp.com",
    projectId: "smart-complaint-box-8b946",
    storageBucket: "smart-complaint-box-8b946.firebasestorage.app",
    messagingSenderId: "314069861183",
    appId: "1:314069861183:web:6757ce227e6e631141098a"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Global Variables
  let complaints = [];
  let currentView = 'form'; // 'form' or 'admin'
  
  // DOM Elements
  const complaintForm = document.getElementById('complaintFormElement');
  const adminPanel = document.getElementById('adminPanel');
  const complaintsList = document.getElementById('complaintsList');
  const statsGrid = document.getElementById('statsGrid');
  const loadingSpinner = document.getElementById('loadingSpinner');
  
  // Initialize App
  document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadComplaints();
  });
  
  function initializeApp() {
    // Show loading initially
    showLoading(true);
    
    // Initialize Firebase Auth (if needed for admin access)
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in
        console.log('Admin logged in:', user.email);
      } else {
        // User is signed out
        console.log('No admin logged in');
      }
    });
    
    showLoading(false);
  }
  
  function setupEventListeners() {
    // Form submission
    if (complaintForm) {
      complaintForm.addEventListener('submit', handleComplaintSubmission);
    }
    
    // Real-time listener for complaints
    db.collection('complaints')
      .orderBy('timestamp', 'desc')
      .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
          if (change.type === "added") {
            addComplaintToList(change.doc.data(), change.doc.id);
          }
          if (change.type === "modified") {
            updateComplaintInList(change.doc.data(), change.doc.id);
          }
          if (change.type === "removed") {
            removeComplaintFromList(change.doc.id);
          }
        });
        updateStats();
      });
  }
  
  async function loadComplaints() {
    try {
      showLoading(true);
      const snapshot = await db.collection('complaints')
        .orderBy('timestamp', 'desc')
        .get();
      
      complaints = [];
      complaintsList.innerHTML = '';
      
      if (snapshot.empty) {
        complaintsList.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-inbox"></i>
            <h4>No complaints yet</h4>
            <p>Complaints will appear here once submitted</p>
          </div>
        `;
      } else {
        snapshot.forEach(doc => {
          const complaint = doc.data();
          addComplaintToList(complaint, doc.id);
          complaints.push({ ...complaint, id: doc.id });
        });
      }
      
      updateStats();
    } catch (error) {
      console.error('Error loading complaints:', error);
      showAlert('Failed to load complaints', 'error');
    } finally {
      showLoading(false);
    }
  }
  
  async function handleComplaintSubmission(e) {
    e.preventDefault();
    
    const submitBtn = complaintForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
      // Show loading state
      submitBtn.classList.add('btn-loading');
      submitBtn.textContent = 'Submitting...';
      
      const formData = new FormData(complaintForm);
      const name = formData.get('name') || 'Anonymous';
      const complaint = formData.get('complaint');
      const email = formData.get('email') || '';
      const phone = formData.get('phone') || '';
      
      if (!complaint.trim()) {
        throw new Error('Please enter your complaint');
      }
      
      // Categorize complaint using AI
      const category = formData.get('category');
if (!category) {
  throw new Error('Please select a complaint category.');
}

      
      // Add to Firebase
      const docRef = await db.collection('complaints').add({
        name: name,
        complaint: complaint,
        category: category,
        email: email,
        phone: phone,
        status: 'pending',
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        priority: determinePriority(category, complaint)
      });
      
      // Show success message
      showAlert('Complaint submitted successfully! We will review it shortly.', 'success');
      
      // Reset form
      complaintForm.reset();
      
      // Add to local list
      addComplaintToList({
        name: name,
        complaint: complaint,
        category: category,
        email: email,
        phone: phone,
        status: 'pending',
        timestamp: new Date(),
        priority: determinePriority(category, complaint)
      }, docRef.id);
      
    } catch (error) {
      console.error('Error submitting complaint:', error);
      showAlert(error.message || 'Failed to submit complaint. Please try again.', 'error');
    } finally {
      // Reset button state
      submitBtn.classList.remove('btn-loading');
      submitBtn.textContent = originalText;
    }
  }
  
  async function categorizeComplaint(text) {
    try {
      // Simple keyword-based categorization (fallback)
      const keywords = {
        'maintenance': ['broken', 'repair', 'fix', 'maintenance', 'damaged', 'leak', 'drain'],
        'cleanliness': ['dirty', 'clean', 'mess', 'trash', 'garbage', 'hygiene', 'sanitation'],
        'electricity': ['power', 'electric', 'light', 'switch', 'outlet', 'electrical', 'voltage'],
        'suggestion': ['suggest', 'improve', 'better', 'idea', 'recommend', 'proposal']
      };
      
      const lowerText = text.toLowerCase();
      let maxScore = 0;
      let bestCategory = 'Uncategorized';
      
      for (const [category, words] of Object.entries(keywords)) {
        let score = 0;
        for (const word of words) {
          if (lowerText.includes(word)) {
            score++;
          }
        }
        if (score > maxScore) {
          maxScore = score;
          bestCategory = category.charAt(0).toUpperCase() + category.slice(1);
        }
      }
      
      return bestCategory;
    } catch (error) {
      console.error('Error categorizing complaint:', error);
      return 'Uncategorized';
    }
  }
  
  function determinePriority(category, complaint) {
    const urgentKeywords = ['urgent', 'emergency', 'broken', 'leak', 'power', 'dangerous', 'safety'];
    const lowerText = complaint.toLowerCase();
    
    // Check for urgent keywords
    const hasUrgentKeywords = urgentKeywords.some(keyword => lowerText.includes(keyword));
    
    // Category-based priority
    const categoryPriority = {
      'Electricity': 'high',
      'Maintenance': 'medium',
      'Cleanliness': 'low',
      'Suggestion': 'low'
    };
    
    if (hasUrgentKeywords) return 'urgent';
    return categoryPriority[category] || 'medium';
  }
  
  function addComplaintToList(complaint, id) {
    // Remove empty state if it exists
    const emptyState = complaintsList.querySelector('.empty-state');
    if (emptyState) {
      emptyState.remove();
    }
    
    const complaintElement = createComplaintElement(complaint, id);
    complaintsList.insertBefore(complaintElement, complaintsList.firstChild);
    complaints.push({ ...complaint, id });
  }
  
  function createComplaintElement(complaint, id) {
    const div = document.createElement('div');
    div.className = 'complaint-item';
    div.id = `complaint-${id}`;
    
    const timestamp = complaint.timestamp?.toDate ? complaint.timestamp.toDate() : new Date(complaint.timestamp);
    const formattedDate = timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString();
    
    div.innerHTML = `
      <div class="complaint-header">
        <div class="complaint-meta">
          <strong>${complaint.name}</strong>
          <span class="category-badge category-${complaint.category.toLowerCase()}">${complaint.category}</span>
          <span class="priority-badge priority-${complaint.priority}">${complaint.priority}</span>
          <span class="status-badge status-${complaint.status}">${complaint.status}</span>
          <small>${formattedDate}</small>
        </div>
        <div class="complaint-actions">
          <button class="btn btn-sm btn-success" onclick="markAsResolved('${id}')">Resolve</button>
          <button class="btn btn-sm btn-danger" onclick="deleteComplaint('${id}')">Delete</button>
        </div>
      </div>
      <div class="complaint-text">${complaint.complaint}</div>
      ${complaint.email ? `<div><strong>Email:</strong> ${complaint.email}</div>` : ''}
      ${complaint.phone ? `<div><strong>Phone:</strong> ${complaint.phone}</div>` : ''}
    `;
    
    return div;
  }
  
  function updateComplaintInList(complaint, id) {
    const existingElement = document.getElementById(`complaint-${id}`);
    if (existingElement) {
      const newElement = createComplaintElement(complaint, id);
      existingElement.replaceWith(newElement);
    }
  }
  
  function removeComplaintFromList(id) {
    const element = document.getElementById(`complaint-${id}`);
    if (element) {
      element.remove();
    }
    complaints = complaints.filter(c => c.id !== id);
    
    // Show empty state if no complaints
    if (complaints.length === 0) {
      complaintsList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-inbox"></i>
          <h4>No complaints yet</h4>
          <p>Complaints will appear here once submitted</p>
        </div>
      `;
    }
  }
  
  async function markAsResolved(id) {
    try {
      await db.collection('complaints').doc(id).update({
        status: 'resolved',
        resolvedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      showAlert('Complaint marked as resolved!', 'success');
    } catch (error) {
      console.error('Error marking as resolved:', error);
      showAlert('Failed to mark as resolved', 'error');
    }
  }
  
  async function deleteComplaint(id) {
    if (confirm('Are you sure you want to delete this complaint?')) {
      try {
        await db.collection('complaints').doc(id).delete();
        showAlert('Complaint deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting complaint:', error);
        showAlert('Failed to delete complaint', 'error');
      }
    }
  }
  
  function updateStats() {
    const stats = {
      total: complaints.length,
      pending: complaints.filter(c => c.status === 'pending').length,
      resolved: complaints.filter(c => c.status === 'resolved').length,
      urgent: complaints.filter(c => c.priority === 'urgent').length
    };
    
    const categoryStats = {};
    complaints.forEach(c => {
      categoryStats[c.category] = (categoryStats[c.category] || 0) + 1;
    });
    
    if (statsGrid) {
      statsGrid.innerHTML = `
        <div class="stat-card">
          <div class="stat-number">${stats.total}</div>
          <div class="stat-label">Total Complaints</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${stats.pending}</div>
          <div class="stat-label">Pending</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${stats.resolved}</div>
          <div class="stat-label">Resolved</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${stats.urgent}</div>
          <div class="stat-label">Urgent</div>
        </div>
      `;
    }
  }
  
  function showFormView() {
    currentView = 'form';
    document.getElementById('complaintForm').style.display = 'block';
    adminPanel.style.display = 'none';
    
    // Update navbar active state
    document.querySelectorAll('.navbar-menu a').forEach(link => {
      link.classList.remove('active');
    });
    document.querySelector('.navbar-menu a[onclick="showFormView()"]').classList.add('active');
  }
  
  function showAdminView() {
    currentView = 'admin';
    document.getElementById('complaintForm').style.display = 'none';
    adminPanel.style.display = 'block';
    updateStats();
    
    // Update navbar active state
    document.querySelectorAll('.navbar-menu a').forEach(link => {
      link.classList.remove('active');
    });
    document.querySelector('.navbar-menu a[onclick="showAdminView()"]').classList.add('active');
  }
  
  function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    `;
    
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Add new alert
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 5000);
  }
  
  function showLoading(show) {
    if (loadingSpinner) {
      loadingSpinner.style.display = show ? 'flex' : 'none';
    }
  }
  
  // Export functions for global access
  window.markAsResolved = markAsResolved;
  window.deleteComplaint = deleteComplaint;
  window.complaints = complaints;
  window.showFormView = showFormView;
  window.showAdminView = showAdminView; 