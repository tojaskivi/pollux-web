// Inline editing functionality
(function () {
  'use strict';

  // Check if edit mode is enabled via URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const isEditMode = urlParams.get('edit') === 'true';

  if (!isEditMode) {
    return; // Exit if not in edit mode
  }

  // Load edit.css dynamically
  const editCSS = document.createElement('link');
  editCSS.rel = 'stylesheet';
  editCSS.href = '/edit.css';
  document.head.appendChild(editCSS);

  // Verify authentication before enabling edit mode
  verifyAuthAndInit();

  async function verifyAuthAndInit() {
    try {
      const response = await fetch('/api/verify');

      if (!response.ok) {
        showNotification('Authentication check failed. Please try again.', 'error');
        setTimeout(() => {
          window.location.href = '/admin';
        }, 2000);
        return;
      }

      const result = await response.json();

      if (!result.authenticated) {
        // Not authenticated, redirect to login
        showNotification('Please login to edit this page', 'info');
        setTimeout(() => {
          window.location.href = '/admin';
        }, 1500);
        return;
      }

      // User is authenticated, initialize edit mode
      initEditMode();
    } catch (error) {
      console.error('Authentication verification failed:', error);
      showNotification('Authentication check failed. Please try again.', 'error');
      setTimeout(() => {
        window.location.href = '/admin';
      }, 2000);
    }
  }

  function htmlToPlainText(element) {
    // Get innerHTML and clean it up, preserving <br> tags
    let html = element.innerHTML;

    // Replace block-level elements (divs) with their content plus <br>
    html = html.replace(/<div[^>]*>/gi, '');
    html = html.replace(/<\/div>/gi, '<br>');

    // Remove other HTML tags but keep <br>
    html = html.replace(/<(?!br\s*\/?)[^>]+>/gi, '');

    // Clean up excessive <br> tags (more than 2 consecutive)
    html = html.replace(/(<br\s*\/?>){3,}/gi, '<br><br>');

    // Decode HTML entities
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    html = textarea.value;

    // Trim and return
    return html.trim();
  }

  function initEditMode() {
    // Add edit mode indicator
    const indicator = document.createElement('div');
    indicator.className = 'edit-mode-indicator';
    indicator.textContent = '✏️ Edit Mode';
    document.body.appendChild(indicator);

    // Find all editable elements
    const editableElements = document.querySelectorAll('[data-editable]');

    if (editableElements.length === 0) {
      showNotification('No editable elements found', 'error');
      return;
    }

    // Make elements editable
    editableElements.forEach(element => {
      element.contentEditable = 'true';
      // element.setAttribute('spellcheck', 'true');
    });

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'edit-button-container';

    // Create logout button
    const logoutButton = document.createElement('button');
    logoutButton.id = 'logout-button';
    logoutButton.textContent = 'Logout';
    logoutButton.addEventListener('click', handleLogout);
    buttonContainer.appendChild(logoutButton);

    // Create save button
    const saveButton = document.createElement('button');
    saveButton.id = 'save-button';
    saveButton.textContent = 'Save Changes';
    saveButton.addEventListener('click', handleSave);
    buttonContainer.appendChild(saveButton);

    document.body.appendChild(buttonContainer);

    showNotification(`${editableElements.length} fields are now editable`, 'info');
  }

  async function handleSave() {
    const saveButton = document.getElementById('save-button');
    saveButton.disabled = true;
    saveButton.textContent = 'Saving...';

    try {
      // Collect all editable content
      const editableElements = document.querySelectorAll('[data-editable]');
      const updates = {};

      editableElements.forEach(element => {
        const key = element.getAttribute('data-editable');
        // Convert HTML content to plain text with preserved newlines
        const value = htmlToPlainText(element);
        updates[key] = value;
      });

      // Validate that we have content to save
      if (Object.keys(updates).length === 0) {
        throw new Error('No content to save');
      }

      // Send to API (auth via cookie)
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates),
        credentials: 'same-origin' // Include cookies
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(`Save failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        showNotification('✓ Saved! Site is redeploying...', 'success');
        saveButton.textContent = 'Saved!';

        // Reset button after delay
        setTimeout(() => {
          saveButton.disabled = false;
          saveButton.textContent = 'Save Changes';
        }, 3000);
      } else {
        throw new Error('Save failed');
      }

    } catch (error) {
      console.error('Save error:', error);
      showNotification(`✗ Error: ${error.message}`, 'error');
      saveButton.disabled = false;
      saveButton.textContent = 'Save Changes';
    }
  }

  async function handleLogout() {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'same-origin'
      });

      if (response.ok) {
        // Redirect to home page (without edit mode)
        window.location.href = '/';
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      showNotification('Logout failed', 'error');
    }
  }

  function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.edit-notification');
    existingNotifications.forEach(n => n.remove());

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `edit-notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  // Prevent accidental navigation away from page with unsaved changes
  let hasUnsavedChanges = false;

  document.querySelectorAll('[data-editable]').forEach(element => {
    element.addEventListener('input', () => {
      hasUnsavedChanges = true;
    });
  });

  document.getElementById('save-button')?.addEventListener('click', () => {
    hasUnsavedChanges = false;
  });

  window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

})();
