// APK Decompiler Pro - Main JavaScript File

class APKDecompiler {
    constructor() {
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.progressSection = document.getElementById('progressSection');
        this.resultsSection = document.getElementById('resultsSection');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.fileInfo = document.getElementById('fileInfo');
        this.appDetails = document.getElementById('appDetails');
        this.permissionsGrid = document.getElementById('permissionsGrid');
        this.securityScore = document.getElementById('securityScore');
        this.securityDetails = document.getElementById('securityDetails');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.hamburgerMenu = document.getElementById('hamburgerMenu');
        this.navMenu = document.getElementById('navMenu');
        
        // Bind methods to preserve context
        this.preventDefaults = this.preventDefaults.bind(this);
        this.highlight = this.highlight.bind(this);
        this.unhighlight = this.unhighlight.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleFiles = this.handleFiles.bind(this);
        
        this.init();
    }

    init() {
        this.setupDragAndDrop();
        this.setupTouchEvents();
        this.setupFileInput();
        this.setupDownloadButton();
        this.setupContactForm(); // Add contact form setup
        this.setupHamburgerMenu();
        this.setupNavigation();
        this.addMobileGestures(); // Add mobile gesture support
    }

    setupDragAndDrop() {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.uploadArea.addEventListener(eventName, this.preventDefaults, false);
            document.body.addEventListener(eventName, this.preventDefaults, false);
        });

        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            this.uploadArea.addEventListener(eventName, this.highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            this.uploadArea.addEventListener(eventName, this.unhighlight, false);
        });

        // Handle dropped files
        this.uploadArea.addEventListener('drop', this.handleDrop, false);
    }

    setupTouchEvents() {
        // Add touch support for mobile devices
        let touchStartY = 0;
        let touchStartX = 0;
        let isDragging = false;

        this.uploadArea.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            isDragging = false;
        }, { passive: true });

        this.uploadArea.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                const touchY = e.touches[0].clientY;
                const touchX = e.touches[0].clientX;
                const deltaY = Math.abs(touchY - touchStartY);
                const deltaX = Math.abs(touchX - touchStartX);
                
                // If moving more than 10px, consider it a drag
                if (deltaY > 10 || deltaX > 10) {
                    isDragging = true;
                    this.highlight();
                }
            }
        }, { passive: true });

        this.uploadArea.addEventListener('touchend', (e) => {
            if (isDragging) {
                this.unhighlight();
                // Show file picker on touch end if it was a drag gesture
                setTimeout(() => {
                    this.fileInput.click();
                }, 100);
            }
        }, { passive: true });

        // Add click handler for mobile
        this.uploadArea.addEventListener('click', (e) => {
            // Only trigger file input if it's a direct click (not from touch events)
            if (e.target === this.uploadArea || e.target.closest('.upload-content')) {
                this.fileInput.click();
            }
        });
    }

    setupFileInput() {
        this.fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                this.handleFiles(files);
            }
        });
    }

    setupDownloadButton() {
        this.downloadBtn.addEventListener('click', () => {
            this.downloadReport();
        });
    }

    setupContactForm() {
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(contactForm);
            });
        }
    }

    handleContactForm(form) {
        const formData = new FormData(form);
        const name = form.querySelector('input[type="text"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const message = form.querySelector('textarea').value;

        // Simple validation
        if (!name || !email || !message) {
            this.showError('Please fill in all fields.');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showError('Please enter a valid email address.');
            return;
        }

        // Show success message
        this.showSuccess('Thank you for your message! We\'ll get back to you soon.');
        
        // Reset form
        form.reset();
        
        // Simulate form submission
        this.simulateFormSubmission();
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-notification';
        successDiv.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
                <button class="success-close">&times;</button>
            </div>
        `;
        
        // Add styles
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, #51cf66, #40c057);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(81, 207, 102, 0.4);
            z-index: 1000;
            max-width: 90%;
            width: auto;
            animation: slideDown 0.3s ease-out;
        `;
        
        // Add close button functionality
        const closeBtn = successDiv.querySelector('.success-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: 15px;
            padding: 0;
        `;
        
        closeBtn.addEventListener('click', () => {
            successDiv.remove();
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 5000);
        
        document.body.appendChild(successDiv);
    }

    simulateFormSubmission() {
        // Add loading state to submit button
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    setupHamburgerMenu() {
        this.hamburgerMenu.addEventListener('click', () => {
            this.toggleMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.hamburgerMenu.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMenu();
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
                
                // Get target section
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // Smooth scroll to target
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu
                    this.closeMenu();
                }
            });
        });

        // Update active link on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavLink();
        });
    }

    toggleMenu() {
        this.hamburgerMenu.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (this.navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMenu() {
        this.hamburgerMenu.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlight(e) {
        this.uploadArea.classList.add('dragover');
    }

    unhighlight(e) {
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        this.handleFiles(files);
    }

    handleFiles(files) {
        const file = files[0];
        if (file && file.name.toLowerCase().endsWith('.apk')) {
            this.analyzeAPK(file);
        } else {
            this.showError('Please select a valid APK file.');
        }
    }

    async analyzeAPK(file) {
        // Show progress section
        this.progressSection.style.display = 'block';
        this.resultsSection.style.display = 'none';
        
        // Update file info
        this.fileInfo.innerHTML = `
            <div class="detail-item">
                <div class="detail-label">File Name</div>
                <div class="detail-value">${file.name}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">File Size</div>
                <div class="detail-value">${this.formatFileSize(file.size)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Upload Time</div>
                <div class="detail-value">${new Date().toLocaleString()}</div>
            </div>
        `;

        // Simulate analysis progress
        await this.simulateAnalysis();
        
        // Show results
        this.showResults(file);
    }

    async simulateAnalysis() {
        const steps = [
            { progress: 10, text: 'Uploading APK file...' },
            { progress: 25, text: 'Extracting APK contents...' },
            { progress: 40, text: 'Parsing AndroidManifest.xml...' },
            { progress: 60, text: 'Analyzing permissions...' },
            { progress: 80, text: 'Performing security scan...' },
            { progress: 100, text: 'Analysis complete!' }
        ];

        for (const step of steps) {
            await this.updateProgress(step.progress, step.text);
            await this.delay(800);
        }
    }

    async updateProgress(progress, text) {
        this.progressFill.style.width = `${progress}%`;
        this.progressText.textContent = text;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showResults(file) {
        this.progressSection.style.display = 'none';
        this.resultsSection.style.display = 'block';
        this.resultsSection.classList.add('fade-in');

        // Generate mock app details
        this.generateAppDetails(file);
        
        // Generate mock permissions
        this.generatePermissions();
        
        // Generate security analysis
        this.generateSecurityAnalysis();
    }

    generateAppDetails(file) {
        const mockAppInfo = {
            'Package Name': 'com.example.futuristicapp',
            'Version Name': '2.1.0',
            'Version Code': '210',
            'Min SDK': 'API 21 (Android 5.0)',
            'Target SDK': 'API 33 (Android 13)',
            'App Size': this.formatFileSize(file.size),
            'Developer': 'Futuristic Labs Inc.',
            'Install Location': 'Internal Storage'
        };

        this.appDetails.innerHTML = Object.entries(mockAppInfo)
            .map(([label, value]) => `
                <div class="detail-item">
                    <div class="detail-label">${label}</div>
                    <div class="detail-value">${value}</div>
                </div>
            `).join('');
    }

    generatePermissions() {
        const permissions = [
            {
                name: 'android.permission.INTERNET',
                description: 'Full network access',
                level: 'normal',
                icon: 'fas fa-globe'
            },
            {
                name: 'android.permission.READ_EXTERNAL_STORAGE',
                description: 'Read from external storage',
                level: 'normal',
                icon: 'fas fa-folder-open'
            },
            {
                name: 'android.permission.WRITE_EXTERNAL_STORAGE',
                description: 'Write to external storage',
                level: 'dangerous',
                icon: 'fas fa-edit'
            },
            {
                name: 'android.permission.CAMERA',
                description: 'Take pictures and record video',
                level: 'dangerous',
                icon: 'fas fa-camera'
            },
            {
                name: 'android.permission.ACCESS_FINE_LOCATION',
                description: 'Precise location access',
                level: 'dangerous',
                icon: 'fas fa-map-marker-alt'
            },
            {
                name: 'android.permission.RECORD_AUDIO',
                description: 'Record audio',
                level: 'dangerous',
                icon: 'fas fa-microphone'
            },
            {
                name: 'android.permission.READ_CONTACTS',
                description: 'Read contact information',
                level: 'dangerous',
                icon: 'fas fa-address-book'
            },
            {
                name: 'android.permission.SEND_SMS',
                description: 'Send SMS messages',
                level: 'dangerous',
                icon: 'fas fa-sms'
            }
        ];

        this.permissionsGrid.innerHTML = permissions
            .map(permission => `
                <div class="permission-item">
                    <div class="permission-icon ${permission.level}">
                        <i class="${permission.icon}"></i>
                    </div>
                    <div class="permission-info">
                        <div class="permission-name">${permission.name}</div>
                        <div class="permission-description">${permission.description}</div>
                    </div>
                </div>
            `).join('');
    }

    generateSecurityAnalysis() {
        const securityScore = 75; // Mock score
        let scoreClass = 'medium';
        let scoreText = 'Moderate Security';

        if (securityScore >= 80) {
            scoreClass = 'high';
            scoreText = 'High Security';
        } else if (securityScore < 60) {
            scoreClass = 'low';
            scoreText = 'Low Security';
        }

        this.securityScore.innerHTML = `
            <div class="score-circle ${scoreClass}">
                ${securityScore}
            </div>
            <div class="score-text">${scoreText}</div>
        `;

        const securityItems = [
            {
                title: 'Code Obfuscation',
                status: 'Enabled',
                class: 'positive',
                icon: 'fas fa-shield-alt'
            },
            {
                title: 'SSL Pinning',
                status: 'Not Detected',
                class: 'warning',
                icon: 'fas fa-lock'
            },
            {
                title: 'Root Detection',
                status: 'Enabled',
                class: 'positive',
                icon: 'fas fa-user-shield'
            },
            {
                title: 'Debug Mode',
                status: 'Disabled',
                class: 'positive',
                icon: 'fas fa-bug'
            },
            {
                title: 'Backup Enabled',
                status: 'Enabled',
                class: 'negative',
                icon: 'fas fa-database'
            },
            {
                title: 'Network Security',
                status: 'Configured',
                class: 'positive',
                icon: 'fas fa-network-wired'
            }
        ];

        this.securityDetails.innerHTML = securityItems
            .map(item => `
                <div class="security-item ${item.class}">
                    <i class="${item.icon}" style="font-size: 1.5rem; margin-bottom: 10px; color: #00ffff;"></i>
                    <div style="font-weight: 600; margin-bottom: 5px;">${item.title}</div>
                    <div style="font-size: 0.9rem; color: #b0b0b0;">${item.status}</div>
                </div>
            `).join('');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showError(message) {
        // Create a mobile-friendly error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
                <button class="error-close">&times;</button>
            </div>
        `;
        
        // Add styles
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, #ff6b6b, #ee5a52);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(255, 107, 107, 0.4);
            z-index: 1000;
            max-width: 90%;
            width: auto;
            animation: slideDown 0.3s ease-out;
        `;
        
        // Add close button functionality
        const closeBtn = errorDiv.querySelector('.error-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: 15px;
            padding: 0;
        `;
        
        closeBtn.addEventListener('click', () => {
            errorDiv.remove();
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
        
        document.body.appendChild(errorDiv);
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from {
                    transform: translateX(-50%) translateY(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add mobile gesture support
    addMobileGestures() {
        // Swipe to refresh functionality
        let startY = 0;
        let currentY = 0;
        let isSwiping = false;
        
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                startY = e.touches[0].clientY;
                isSwiping = false;
            }
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && startY > 0) {
                currentY = e.touches[0].clientY;
                const deltaY = currentY - startY;
                
                // Swipe down from top to refresh
                if (deltaY > 50 && startY < 100) {
                    isSwiping = true;
                }
            }
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (isSwiping) {
                // Reset the page state
                this.resetToInitialState();
                isSwiping = false;
            }
            startY = 0;
            currentY = 0;
        }, { passive: true });
    }
    
    resetToInitialState() {
        // Hide progress and results sections
        this.progressSection.style.display = 'none';
        this.resultsSection.style.display = 'none';
        
        // Reset file input
        this.fileInput.value = '';
        
        // Show upload section
        this.uploadArea.style.display = 'flex';
        
        // Add visual feedback
        this.uploadArea.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
            this.uploadArea.style.animation = '';
        }, 500);
    }

    downloadReport() {
        // Create a comprehensive report
        const report = this.generateReport();
        
        // Create blob and download
        const blob = new Blob([report], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'apk_analysis_report.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    generateReport() {
        const timestamp = new Date().toLocaleString();
        return `APK Decompiler Pro - Analysis Report
Generated: ${timestamp}

=== APPLICATION INFORMATION ===
Package Name: com.example.futuristicapp
Version Name: 2.1.0
Version Code: 210
Min SDK: API 21 (Android 5.0)
Target SDK: API 33 (Android 13)
Developer: Futuristic Labs Inc.

=== PERMISSIONS ANALYSIS ===
1. android.permission.INTERNET (Normal)
   - Full network access
   - Required for app functionality

2. android.permission.READ_EXTERNAL_STORAGE (Normal)
   - Read from external storage
   - Standard file access

3. android.permission.WRITE_EXTERNAL_STORAGE (Dangerous)
   - Write to external storage
   - Can modify user files

4. android.permission.CAMERA (Dangerous)
   - Take pictures and record video
   - Privacy-sensitive permission

5. android.permission.ACCESS_FINE_LOCATION (Dangerous)
   - Precise location access
   - Privacy-sensitive permission

6. android.permission.RECORD_AUDIO (Dangerous)
   - Record audio
   - Privacy-sensitive permission

7. android.permission.READ_CONTACTS (Dangerous)
   - Read contact information
   - Privacy-sensitive permission

8. android.permission.SEND_SMS (Dangerous)
   - Send SMS messages
   - Privacy-sensitive permission

=== SECURITY ANALYSIS ===
Overall Security Score: 75/100 (Moderate Security)

Positive Security Features:
- Code Obfuscation: Enabled
- Root Detection: Enabled
- Debug Mode: Disabled
- Network Security: Configured

Areas of Concern:
- SSL Pinning: Not Detected
- Backup Enabled: Yes (potential security risk)

=== RECOMMENDATIONS ===
1. Implement SSL certificate pinning for enhanced network security
2. Consider disabling backup functionality for sensitive apps
3. Review dangerous permissions and implement runtime permission requests
4. Ensure all network communications use HTTPS
5. Implement additional anti-tampering measures

=== END OF REPORT ===
Generated by APK Decompiler Pro - Advanced Android Application Analysis System`;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new APKDecompiler();
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.app-info-card, .permissions-card, .security-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click effects to buttons
    const buttons = document.querySelectorAll('.browse-btn, .download-btn');
    buttons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    });
});
