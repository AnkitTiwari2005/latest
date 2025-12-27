// Security measures
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('keydown', event => {
    if (event.key === 'F12' ||
        ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'I') ||
        ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'J') ||
        ((event.ctrlKey || event.metaKey) && event.key === 'U')) {
        event.preventDefault();
    }
});

// Disable text selection on critical UI elements
const disableSelect = e => {
    if (e.target.classList.contains('no-select') ||
        e.target.closest('.card-header') ||
        e.target.closest('.sgpa-display') ||
        e.target.closest('.logo')) {
        e.preventDefault();
    }
};
document.addEventListener('selectstart', disableSelect);

// Dynamic UI Generation
function renderUI() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="bg-blob blob-1"></div>
        <div class="bg-blob blob-2"></div>
        
        <div class="container">
            <header>
                <div class="logo">
                    <div class="logo-icon">
                        <i class="fas fa-calculator"></i>
                    </div>
                    <div class="logo-text">GradeFlow Pro</div>
                </div>
                <div class="theme-toggle" id="themeToggle">
                    <i class="fas fa-sun"></i>
                    <i class="fas fa-moon"></i>
                </div>
            </header>
            
            <div class="dashboard">
                <div class="main-content">
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title"><i class="fas fa-keyboard"></i> Calculate Your Grades</h2>
                        </div>
                        
                        <div class="tabs" id="mainTabs">
                            <div class="tab active" data-tab="sgpa-calc">SGPA Calculator</div>
                            <div class="tab" data-tab="cgpa-calc">CGPA Calculator</div>
                        </div>
                        
                        <!-- SGPA Calculator Tab Content -->
                        <div class="tab-content active" id="sgpa-calc">
                            <div class="tabs sub-tabs" id="sgpaSubTabs">
                                <div class="tab active" data-tab="manual-sgpa">Manual Entry</div>
                                <div class="tab" data-tab="paste-sgpa">Paste Results</div>
                            </div>

                            <!-- Manual Entry for SGPA -->
                            <div class="tab-content active" id="manual-sgpa">
                                <div class="input-group">
                                    <label for="subjectName">Subject Name</label>
                                    <input type="text" id="subjectName" placeholder="e.g., Data Structures, Engineering Math">
                                    <span class="error-message" id="subjectNameError"></span>
                                </div>
                                
                                <div class="input-group">
                                    <label for="credits">Credits</label>
                                    <input type="number" id="credits" placeholder="e.g., 4" min="1" max="10" step="0.1">
                                    <span class="error-message" id="creditsError"></span>
                                </div>
                                
                                <div class="input-group">
                                    <label for="grade">Grade</label>
                                    <select id="grade">
                                        <option value="">Select Grade</option>
                                        <option value="10">A+ (10)</option>
                                        <option value="9">A (9)</option>
                                    <option value="8">B+ (8)</option>
                                    <option value="7">B (7)</option>
                                    <option value="6">C+ (6)</option>
                                    <option value="5">C (5)</option>
                                    <option value="4">D (4)</option>
                                    <option value="0">F (0)</option>
                                    <option value="QUALIFIED">Qualified</option>
                                    <option value="ABSENT">Absent</option>
                                    </select>
                                    <span class="error-message" id="gradeError"></span>
                                </div>
                                
                                <button class="add-btn" id="addSubject">
                                    <i class="fas fa-plus"></i> Add Subject
                                </button>
                            </div>
                            
                            <!-- Paste Results for SGPA -->
                            <div class="tab-content" id="paste-sgpa">
                                <div class="input-group paste-input-group">
                                    <div> 
                                        <label for="resultText">Paste Your Result Sheet</label>
                                        <textarea id="resultText" rows="6" placeholder="Paste your result sheet text here..."></textarea>
                                    </div>
                                    <button class="paste-button" id="mobilePasteBtn">
                                        <i class="fas fa-paste"></i> Paste
                                    </button>
                                </div>
                                
                                <button class="add-btn" id="parseResults">
                                    <i class="fas fa-magic"></i> Parse Results
                                </button>
                                
                                <div id="parseStatus" class="status-bar" style="display: none;">
                                    <i class="fas fa-sync fa-spin"></i>
                                    <span>Processing your results...</span>
                                </div>
                            </div>

                            <div class="result-container">
                                <div class="card-header">
                                    <h3 class="card-title"><i class="fas fa-list-alt"></i> Current Semester Subjects</h3>
                                    <button class="action-btn" id="resetBtn" title="Clear all subjects">
                                        <i class="fas fa-trash-alt"></i> Clear All
                                    </button>
                                </div>
                                
                                <table id="resultTable">
                                    <thead>
                                        <tr>
                                            <th>Subject</th>
                                            <th>Credits</th>
                                            <th>Grade</th>
                                            <th>Points</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="resultBody">
                                        <!-- SGPA subjects will be populated here -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <!-- CGPA Calculator Tab Content -->
                        <div class="tab-content" id="cgpa-calc">
                            <div class="input-group cgpa-input-grid">
                                <div>
                                    <label for="semesterSgpa">Semester SGPA</label>
                                    <input type="number" id="semesterSgpa" placeholder="e.g., 8.5" min="0" max="10" step="0.01">
                                    <span class="error-message" id="semesterSgpaError"></span>
                                </div>
                                <div>
                                    <label for="semesterCredits">Total Credits</label>
                                    <input type="number" id="semesterCredits" placeholder="e.g., 20" min="1" step="0.1">
                                    <span class="error-message" id="semesterCreditsError"></span>
                                </div>
                                <button class="add-btn" id="addSemester">
                                    <i class="fas fa-plus-circle"></i> Add Semester
                                </button>
                            </div>

                            <div class="result-container">
                                <div class="card-header">
                                    <h3 class="card-title"><i class="fas fa-history"></i> Previous Semesters</h3>
                                    <button class="action-btn" id="resetCgpaBtn" title="Clear all semester data">
                                        <i class="fas fa-trash-alt"></i> Clear All
                                    </button>
                                </div>
                                <table id="cgpaTable">
                                    <thead>
                                        <tr>
                                            <th>SGPA</th>
                                            <th>Credits</th>
                                            <th>Total Points</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="cgpaBody">
                                        <!-- CGPA semester entries will be populated here -->
                                    </tbody>
                                </table>
                                <div class="empty-state" id="cgpaEmptyState" style="display: block;">
                                    <i class="fas fa-inbox"></i>
                                    <p>No semesters added yet for CGPA calculation. Add your previous semester SGPAs!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Features Grid (retained) -->
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-brain"></i>
                            </div>
                            <div class="feature-text">
                                <h3>Advanced Parsing</h3>
                                <p>Intelligent result sheet extraction</p>
                            </div>
                        </div>
                        
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-rocket"></i>
                            </div>
                            <div class="feature-text">
                                <h3>Blazing Fast</h3>
                                <p>Optimized for quick calculations</p>
                            </div>
                        </div>
                        
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-file-export"></i>
                            </div>
                            <div class="feature-text">
                                <h3>Professional Reports</h3>
                                <p>Beautiful PDF and CSV exports</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="sidebar">
                    <!-- SGPA/CGPA Display Card -->
                    <div class="card sgpa-display">
                        <div class="sgpa-label" id="currentGradeLabel">Your Semester Grade Point Average</div>
                        <div class="sgpa-value" id="currentGradeValue">0.00</div>
                        <div class="sgpa-scale">Scale: 0.00 - 10.00</div>
                        
                        <!-- Chart for SGPA -->
                        <div class="chart-container" id="sgpaChartContainer">
                            <canvas id="gradeChart"></canvas>
                        </div>

                        <!-- Progress Bar for CGPA -->
                        <div class="cgpa-progress-container" id="cgpaProgressBarContainer">
                            <div class="cgpa-progress-bar" id="cgpaProgressBar"></div>
                            <div class="cgpa-progress-label" id="cgpaProgressLabel">0.00 / 10.00</div>
                        </div>
                    </div>
                    
                    <!-- Export Results Card (retained) -->
                    <div class="card" style="margin-bottom: 20px;">
                        <div class="card-header">
                            <h2 class="card-title"><i class="fas fa-download"></i> Export Results</h2>
                        </div>
                        
                        <div class="export-actions">
                            <button class="export-btn pdf" id="exportPdf">
                                <i class="fas fa-file-pdf"></i> Export PDF
                            </button>
                            <button class="export-btn csv" id="exportCsv">
                                <i class="fas fa-file-csv"></i> Export CSV
                            </button>
                        </div>
                    </div>

                    <!-- Report Bug/Feedback Form (retained) -->
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title"><i class="fas fa-bug"></i> Report Bug / Feedback</h2>
                        </div>
                        <div class="input-group">
                            <label for="feedbackText">Describe the issue or provide feedback:</label>
                            <textarea id="feedbackText" rows="4" placeholder="e.g., Calculation error, layout issue, new feature request..."></textarea>
                        </div>
                        <button class="add-btn" id="sendFeedbackBtn">
                            <i class="fas fa-paper-plane"></i> Send Feedback
                        </button>
                    </div>
                </div>
            </div>
            
            <footer>
                <p>Crafted with Precision by Ankit Tiwari</p>
                <a href="https://www.linkedin.com/in/ankit-k-tiwari/" target="_blank" class="linkedin-btn">
                    <i class="fab fa-linkedin"></i> Connect on LinkedIn
                </a>
                <p>GradeFlow Pro &copy; 2025 | All calculations done locally on your device | Advanced Parsing Engine v3.0</p>
            </footer>
        </div>

        <!-- Custom Confirmation Modal -->
        <div class="custom-modal-overlay" id="customConfirmModal">
            <div class="custom-modal-content">
                <h3>Confirm Action</h3>
                <p id="confirmMessage">Are you sure you want to perform this action?</p>
                <div class="custom-modal-buttons">
                    <button class="btn-confirm" id="confirmYes">Yes</button>
                    <button class="btn-cancel" id="confirmNo">Cancel</button>
                </div>
            </div>
        </div>
    `;
}

// Application Logic
function initApp() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const mainTabs = document.querySelectorAll('#mainTabs .tab');
    const sgpaSubTabs = document.querySelectorAll('#sgpaSubTabs .tab');
    const sgpaCalcTabContent = document.getElementById('sgpa-calc');
    const cgpaCalcTabContent = document.getElementById('cgpa-calc');
    const manualSgpaTabContent = document.getElementById('manual-sgpa');
    const pasteSgpaTabContent = document.getElementById('paste-sgpa');
    
    const addSubjectBtn = document.getElementById('addSubject');
    const parseResultsBtn = document.getElementById('parseResults');
    const resetBtn = document.getElementById('resetBtn');
    const exportPdfBtn = document.getElementById('exportPdf');
    const exportCsvBtn = document.getElementById('exportCsv');
    const resultBody = document.getElementById('resultBody');
    const currentGradeValue = document.getElementById('currentGradeValue');
    const currentGradeLabel = document.getElementById('currentGradeLabel');
    const subjectNameInput = document.getElementById('subjectName');
    const creditsInput = document.getElementById('credits');
    const gradeInput = document.getElementById('grade');
    const resultText = document.getElementById('resultText');
    const parseStatus = document.getElementById('parseStatus');
    const feedbackTextarea = document.getElementById('feedbackText');
    const sendFeedbackBtn = document.getElementById('sendFeedbackBtn');
    const mobilePasteBtn = document.getElementById('mobilePasteBtn');

    const subjectNameError = document.getElementById('subjectNameError');
    const creditsError = document.getElementById('creditsError');
    const gradeError = document.getElementById('gradeError');
    const semesterSgpaError = document.getElementById('semesterSgpaError');
    const semesterCreditsError = document.getElementById('semesterCreditsError');

    const addSemesterBtn = document.getElementById('addSemester');
    const resetCgpaBtn = document.getElementById('resetCgpaBtn');
    const semesterSgpaInput = document.getElementById('semesterSgpa');
    const semesterCreditsInput = document.getElementById('semesterCredits');
    const cgpaBody = document.getElementById('cgpaBody');
    const cgpaEmptyState = document.getElementById('cgpaEmptyState');
    const sgpaChartContainer = document.getElementById('sgpaChartContainer');
    const cgpaProgressBarContainer = document.getElementById('cgpaProgressBarContainer');
    const cgpaProgressBar = document.getElementById('cgpaProgressBar');
    const cgpaProgressLabel = document.getElementById('cgpaProgressLabel');

    const customConfirmModal = document.getElementById('customConfirmModal');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmYesBtn = document.getElementById('confirmYes');
    const confirmNoBtn = document.getElementById('confirmNo');

    // Grade mapping
    const gradeMap = {
        '10': 'A+',
        '9': 'A',
        '8': 'B+',
        '7': 'B',
        '6': 'C+',
        '5': 'C',
        '4': 'D',
        '0': 'F',
        'QUALIFIED': 'Qualified',
        'ABSENT': 'Absent'
    };

    const reverseGradeMap = {
        'A+': 10,
        'A': 9,
        'B+': 8,
        'B': 7,
        'C+': 6,
        'C': 5,
        'D': 4,
        'F': 0,
        'E': 0,
        'I': 0,
        'QUALIFIED': 'QUALIFIED',
        'ABSENT': 'ABSENT'
    };

    // Data storage
    let subjects = [];
    let semesters = [];

    // Chart.js initialization
    Chart.defaults.font.family = 'Poppins';
    const ctx = document.getElementById('gradeChart').getContext('2d');
    const gradeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
            datasets: [{
                data: [0, 0, 0, 0, 0, 0, 0, 0],
                backgroundColor: [],
                borderWidth: 0,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '',
                        font: {
                            size: 11
                        },
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed} subjects`;
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });

    // Function to update chart colors based on theme
    function updateChartColors() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        gradeChart.options.plugins.legend.labels.color = isDarkMode ? getComputedStyle(document.body).getPropertyValue('--text-dark') : getComputedStyle(document.body).getPropertyValue('--text-light');
        
        if (isDarkMode) {
            gradeChart.data.datasets[0].backgroundColor = [
                '#4cc9f0', '#4361ee', '#3a0ca3', '#7209b7',
                '#f72585', '#ff6b6b', '#ff9e00', '#adb5bd'
            ];
        } else {
            gradeChart.data.datasets[0].backgroundColor = [
                '#1ABC9C', '#2ECC71', '#3498DB', '#9B59B6',
                '#F1C40F', '#E67E22', '#E74C3C', '#BDC3C7'
            ];
        }
        gradeChart.update();
    }

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('gradeFlowTheme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        updateChartColors();
        updateGradeDisplayColor();
    });

    // Custom Confirmation Modal Logic
    let confirmCallback = null;

    function showCustomConfirm(message, callback) {
        confirmMessage.textContent = message;
        confirmCallback = callback;
        customConfirmModal.classList.add('active');
    }

    confirmYesBtn.addEventListener('click', () => {
        if (confirmCallback) {
            confirmCallback(true);
        }
        customConfirmModal.classList.remove('active');
        confirmCallback = null;
    });

    confirmNoBtn.addEventListener('click', () => {
        if (confirmCallback) {
            confirmCallback(false);
        }
        customConfirmModal.classList.remove('active');
        confirmCallback = null;
    });

    // Input Validation Helper
    function validateInput(inputElement, errorElement, validationFn, errorMessage) {
        if (validationFn(inputElement.value)) {
            inputElement.classList.remove('invalid');
            errorElement.textContent = '';
            return true;
        } else {
            inputElement.classList.add('invalid');
            errorElement.textContent = errorMessage;
            return false;
        }
    }

    // Main Tab Switching (SGPA vs CGPA)
    mainTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            mainTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            sgpaCalcTabContent.classList.remove('active');
            cgpaCalcTabContent.classList.remove('active');

            if (tabId === 'sgpa-calc') {
                sgpaCalcTabContent.classList.add('active');
                sgpaChartContainer.style.display = 'block';
                cgpaProgressBarContainer.style.display = 'none';
                
                subjects = [];
                renderSubjects();
                updateSGPA();
                updateChart();
                currentGradeLabel.textContent = 'Your Semester Grade Point Average';
            } else if (tabId === 'cgpa-calc') {
                cgpaCalcTabContent.classList.add('active');
                sgpaChartContainer.style.display = 'none';
                cgpaProgressBarContainer.style.display = 'block';

                semesters = [];
                renderSemesters();
                updateCGPA();
                
                gradeChart.data.datasets[0].data = gradeChart.data.labels.map(() => 0);
                gradeChart.update();
                currentGradeLabel.textContent = 'Your Cumulative Grade Point Average';
            }
            
            parseStatus.style.display = 'none';
            subjectNameInput.value = '';
            creditsInput.value = '';
            gradeInput.value = '';
            resultText.value = '';
            semesterSgpaInput.value = '';
            semesterCreditsInput.value = '';

            document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        });
    });

    // SGPA Sub-Tab Switching (Manual vs Paste)
    sgpaSubTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            sgpaSubTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            manualSgpaTabContent.classList.remove('active');
            pasteSgpaTabContent.classList.remove('active');

            if (tabId === 'manual-sgpa') {
                manualSgpaTabContent.classList.add('active');
            } else if (tabId === 'paste-sgpa') {
                pasteSgpaTabContent.classList.add('active');
            }
            
            subjectNameInput.value = '';
            creditsInput.value = '';
            gradeInput.value = '';
            resultText.value = '';
            parseStatus.style.display = 'none';

            document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        });
    });

    // Mobile Paste Button functionality
    mobilePasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            resultText.value = text;
            showStatus('Content pasted successfully!', false);
        } catch (err) {
            showStatus('Failed to paste. Please paste manually.', true);
        }
    });

    // Add Subject for SGPA
    addSubjectBtn.addEventListener('click', () => {
        let isValid = true;

        if (!validateInput(subjectNameInput, subjectNameError, val => val.trim() !== '', 'Subject name cannot be empty.')) {
            isValid = false;
        }

        const creditsValue = parseFloat(creditsInput.value);
        if (!validateInput(creditsInput, creditsError, val => !isNaN(parseFloat(val)) && parseFloat(val) > 0 && parseFloat(val) <= 10, 'Credits must be a number between 1 and 10.')) {
            isValid = false;
        }

        if (!validateInput(gradeInput, gradeError, val => val !== '', 'Please select a grade.')) {
            isValid = false;
        }

        if (!isValid) {
            showStatus('Please correct the errors in the form.', true);
            return;
        }

        const name = subjectNameInput.value.trim();
        const credits = creditsValue;
        const gradeValue = gradeInput.value;
        let grade;

        if (gradeValue === 'QUALIFIED' || gradeValue === 'ABSENT') {
            grade = gradeValue;
        } else {
            grade = parseInt(gradeValue);
        }
        
        subjects.push({ 
            name, 
            credits, 
            grade,
            code: name.substring(0, Math.min(name.length, 10)).toUpperCase()
        });
        
        renderSubjects();
        updateSGPA();
        updateChart();
        
        subjectNameInput.value = '';
        creditsInput.value = '';
        gradeInput.value = '';
        
        showStatus('Subject added successfully!', false);
    });

    // Helper functions for parsing
    function stripHtmlTags(htmlString) {
        const doc = new DOMParser().parseFromString(htmlString, 'text/html');
        return doc.body.textContent || "";
    }

    function parseSubjectBlock(blockLines, subjectCodePattern, numberPattern, gradePattern) {
        let subject = { code: '', name: '', credits: 0, grade: undefined };
        let nameParts = [];
        let numericParts = [];
        let foundGradeText = '';
        let isQualifiedOrAbsent = false;

        const codeMatch = subjectCodePattern.exec(blockLines[0]);
        if (!codeMatch) return null;
        subject.code = codeMatch[1];

        for (let i = 1; i < blockLines.length; i++) {
            const line = blockLines[i].trim();
            if (line === "") continue;

            const gradeMatch = gradePattern.exec(line);
            if (gradeMatch) {
                foundGradeText = gradeMatch[1].toUpperCase();
                if (foundGradeText === 'QUALIFIED' || foundGradeText === 'ABSENT') {
                    isQualifiedOrAbsent = true;
                }
                break;
            }

            const numMatch = numberPattern.exec(line);
            if (numMatch) {
                numericParts.push(parseFloat(numMatch[0]));
                continue;
            }

            if (!subjectCodePattern.test(line) && !line.includes("Disclaimer") && !line.includes("University") && !line.includes("Helpline") && !line.includes("Report a Bug")) {
                nameParts.push(line);
            }
        }

        subject.name = nameParts.join(' ').trim();
        
        if (isQualifiedOrAbsent) {
            subject.grade = foundGradeText;
        } else {
            subject.grade = reverseGradeMap[foundGradeText];
        }
        
        if (numericParts.length > 0) {
            subject.credits = numericParts[numericParts.length - 1];
        } else {
            subject.credits = 0;
        }

        if (subject.code && !isNaN(subject.credits) && subject.credits > 0 && subject.grade !== undefined && subject.name) {
            return subject;
        }
        return null;
    }

    function parseResultSheet(text) {
        let rawText = text.trim();
        if (rawText.includes('<') && rawText.includes('>')) {
            rawText = stripHtmlTags(rawText);
        }

        const lines = rawText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        let parsedSubjects = [];

        const subjectCodePattern = /^(\d{2}[A-Z]{3}-\d{3,4})$/i;
        const numberPattern = /^\d+(\.\d+)?$/;
        const gradePattern = /^([A-Z]+[+]?|Qualified|Absent|E|F|I)$/i;
        const singleLineSubjectRegex = /^(\d{2}[A-Z]{3}-\d{3,4})\s+(.+?)\s+(?:(?:\d+(?:\.\d+)?|\s*)\s+){0,2}(\d+(?:\.\d+)?)\s+([A-Z]+[+]?|Qualified|Absent|E|F|I)$/i;
        const endOfSubjectsKeywords = ["Disclaimer:", "University is not responsible", "General Helpline No:", "Email Id:", "Report a Bug", "Chandigarh University, Gharuan, Mohali (Punjab)"];

        let currentBlockLines = [];
        let isInsideSubjectBlock = false;

        for (let i = 0; i < lines.length; i++) {
            const trimmedLine = lines[i].trim();
            if (trimmedLine === "") continue;

            const lowerCaseLine = trimmedLine.toLowerCase();
            const isEndOfSubjectsSection = endOfSubjectsKeywords.some(keyword => lowerCaseLine.includes(keyword.toLowerCase()));

            if (isEndOfSubjectsSection) {
                if (isInsideSubjectBlock && currentBlockLines.length > 0) {
                    const subject = parseSubjectBlock(currentBlockLines, subjectCodePattern, numberPattern, gradePattern);
                    if (subject) parsedSubjects.push(subject);
                }
                isInsideSubjectBlock = false;
                currentBlockLines = [];
                continue;
            }

            const singleLineMatch = singleLineSubjectRegex.exec(trimmedLine);
            if (singleLineMatch) {
                const gradeText = singleLineMatch[4].toUpperCase();
                parsedSubjects.push({
                    code: singleLineMatch[1],
                    name: singleLineMatch[2].trim(),
                    credits: parseFloat(singleLineMatch[3]),
                    grade: (gradeText === 'QUALIFIED' || gradeText === 'ABSENT') ? gradeText : reverseGradeMap[gradeText]
                });
                isInsideSubjectBlock = false;
                currentBlockLines = [];
                continue;
            }

            if (subjectCodePattern.test(trimmedLine)) {
                if (isInsideSubjectBlock && currentBlockLines.length > 0) {
                    const subject = parseSubjectBlock(currentBlockLines, subjectCodePattern, numberPattern, gradePattern);
                    if (subject) parsedSubjects.push(subject);
                }
                currentBlockLines = [trimmedLine];
                isInsideSubjectBlock = true;
            } else if (isInsideSubjectBlock) {
                currentBlockLines.push(trimmedLine);
            }
        }

        if (isInsideSubjectBlock && currentBlockLines.length > 0) {
            const subject = parseSubjectBlock(currentBlockLines, subjectCodePattern, numberPattern, gradePattern);
            if (subject) parsedSubjects.push(subject);
        }
        return parsedSubjects;
    }

    // Parse Results event listener (for SGPA)
    parseResultsBtn.addEventListener('click', () => {
        const text = resultText.value.trim();
        if (!text) {
            showStatus('Please paste your result sheet', true);
            parseStatus.style.display = 'none';
            return;
        }
        
        parseStatus.style.display = 'flex';
        parseStatus.classList.remove('error');
        parseStatus.innerHTML = '<i class="fas fa-sync fa-spin"></i> Processing your results...';
        
        setTimeout(() => {
            try {
                const parsedSubjects = parseResultSheet(text);
                if (parsedSubjects.length === 0) {
                    showStatus('No valid subjects found. Check your format.', true);
                    parseStatus.style.display = 'none';
                    return;
                }
                
                subjects = parsedSubjects;
                renderSubjects();
                updateSGPA();
                updateChart();
                
                showStatus(`Successfully parsed ${parsedSubjects.length} subjects!`, false);
                resultText.value = '';
                
            } catch (error) {
                showStatus(`Error: ${error.message}`, true);
                parseStatus.style.display = 'none';
            }
        }, 100);
    });

    // Reset SGPA Data
    resetBtn.addEventListener('click', () => {
        showCustomConfirm('Are you sure you want to clear all current semester subjects?', (confirmed) => {
            if (confirmed) {
                subjects = [];
                renderSubjects();
                updateSGPA();
                updateChart();
                parseStatus.style.display = 'none';
                showStatus('Current semester subjects cleared!', false);
            }
        });
    });

    // Export PDF
    exportPdfBtn.addEventListener('click', async () => {
        const currentTab = document.querySelector('#mainTabs .tab.active').getAttribute('data-tab');
        if (currentTab === 'sgpa-calc' && subjects.length === 0) {
            showStatus('No SGPA data to export.', true);
            return;
        }
        if (currentTab === 'cgpa-calc' && semesters.length === 0) {
            showStatus('No CGPA data to export.', true);
            return;
        }
        
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            doc.setFontSize(22);
            doc.setTextColor(67, 97, 238);

            let reportTitle = '';
            let mainValueLabel = '';
            let mainValue = 0;
            let headers = [];
            let data = [];

            if (currentTab === 'sgpa-calc') {
                reportTitle = 'SGPA Report';
                mainValueLabel = 'Current SGPA:';
                mainValue = calculateSGPA();
                headers = [['Subject Code', 'Subject Name', 'Credits', 'Grade', 'Points']];
                data = subjects.filter(s => typeof s.grade === 'number' && !isNaN(s.grade) && s.credits > 0)
                                .map(subject => [
                    subject.code,
                    subject.name,
                    subject.credits.toFixed(1),
                    gradeMap[subject.grade],
                    subject.grade.toFixed(2)
                ]);
            } else if (currentTab === 'cgpa-calc') {
                reportTitle = 'CGPA Report';
                mainValueLabel = 'Calculated CGPA:';
                mainValue = calculateCGPA();
                headers = [['Semester SGPA', 'Total Credits', 'Weighted Points']];
                data = semesters.map(sem => [
                    sem.sgpa.toFixed(2),
                    sem.credits.toFixed(1),
                    (sem.sgpa * sem.credits).toFixed(2)
                ]);
            }

            doc.text(reportTitle, 105, 20, null, null, 'center');
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text('Generated by GradeFlow Pro: Your Academic Compass', 105, 28, null, null, 'center');
            
            const now = new Date();
            doc.setFontSize(14);
            doc.setTextColor(document.body.classList.contains('dark-mode') ? 255 : 0);

            doc.text(`Date: ${now.toLocaleDateString()}`, 15, 40);
            doc.text(`${mainValueLabel} ${mainValue.toFixed(2)}`, 15, 50);
            
            doc.autoTable({
                startY: 60,
                head: headers,
                body: data,
                theme: 'grid',
                headStyles: {
                    fillColor: [67, 97, 238],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                styles: {
                    cellPadding: 3,
                    fontSize: 10,
                    valign: 'middle',
                    textColor: document.body.classList.contains('dark-mode') ? 255 : 0
                },
                margin: { top: 10 }
            });
            
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text(`Page ${i} of ${pageCount}`, 105, 287, null, null, 'center');
            }
            
            doc.save(`${reportTitle.replace(' ', '_')}_${now.getTime()}.pdf`);
            showStatus(`${reportTitle} exported successfully!`, false);
        } catch (error) {
            showStatus('Failed to generate PDF: ' + error.message, true);
        }
    });

    // Export CSV
    exportCsvBtn.addEventListener('click', () => {
        const currentTab = document.querySelector('#mainTabs .tab.active').getAttribute('data-tab');
        if (currentTab === 'sgpa-calc' && subjects.length === 0) {
            showStatus('No SGPA data to export.', true);
            return;
        }
        if (currentTab === 'cgpa-calc' && semesters.length === 0) {
            showStatus('No CGPA data to export.', true);
            return;
        }
        
        try {
            let csv = '';
            let filename = '';
            if (currentTab === 'sgpa-calc') {
                csv += 'Subject Code,Subject Name,Credits,Grade,Points\n';
                subjects.filter(s => typeof s.grade === 'number' && !isNaN(s.grade) && s.credits > 0)
                        .forEach(subject => {
                    csv += `"${subject.code}","${subject.name}",${subject.credits.toFixed(1)},"${gradeMap[subject.grade]}",${subject.grade.toFixed(2)}\n`;
                });
                const sgpa = calculateSGPA();
                csv += `\nSGPA,,,${sgpa.toFixed(2)}\n`;
                filename = `sgpa_report_${new Date().getTime()}.csv`;
            } else if (currentTab === 'cgpa-calc') {
                csv += 'Semester SGPA,Total Credits,Weighted Points\n';
                semesters.forEach(sem => {
                    csv += `${sem.sgpa.toFixed(2)},${sem.credits.toFixed(1)},${(sem.sgpa * sem.credits).toFixed(2)}\n`;
                });
                const cgpa = calculateCGPA();
                csv += `\nCGPA,,,${cgpa.toFixed(2)}\n`;
                filename = `cgpa_report_${new Date().getTime()}.csv`;
            }
            
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showStatus('CSV exported successfully!', false);
        } catch (error) {
            showStatus('Failed to generate CSV: ' + error.message, true);
        }
    });

    // Delete Subject (for SGPA)
    window.deleteSubject = function(index) {
        subjects.splice(index, 1);
        renderSubjects();
        updateSGPA();
        updateChart();
        showStatus('Subject deleted.', false);
    };

    // Render Subjects (for SGPA)
    function renderSubjects() {
        resultBody.innerHTML = '';
        
        if (subjects.length === 0) {
            resultBody.innerHTML = `
                <tr class="empty-state">
                    <td colspan="5">
                        <i class="fas fa-inbox"></i>
                        <p>No subjects added yet. Start by adding subjects manually or pasting your results!</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        subjects.forEach((subject, index) => {
            const row = document.createElement('tr');
            const isSpecialGrade = (subject.grade === 'QUALIFIED' || subject.grade === 'ABSENT');
            row.classList.toggle('bg-gray-100', isSpecialGrade);
            row.classList.toggle('text-gray-500', isSpecialGrade);
            row.classList.toggle('italic', isSpecialGrade);

            let gradeDisplayText;
            if (isSpecialGrade) {
                gradeDisplayText = subject.grade;
            } else {
                gradeDisplayText = gradeMap[subject.grade] || 'N/A';
            }

            const pointsDisplayText = isSpecialGrade ? 'N/A' : (subject.grade !== undefined ? subject.grade.toFixed(2) : 'N/A');

            row.innerHTML = `
                <td>
                    <div><strong>${subject.code}</strong></div>
                    <div style="font-size: 0.9em; opacity: 0.8;">${subject.name}</div>
                </td>
                <td>${subject.credits.toFixed(1)}</td>
                <td>${gradeDisplayText}</td>
                <td>${pointsDisplayText}</td>
                <td class="actions">
                    <button class="action-btn" title="Delete" onclick="deleteSubject(${index})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            resultBody.appendChild(row);
        });
    }

    // Calculate SGPA
    function calculateSGPA() {
        if (subjects.length === 0) return 0;
        
        let totalCredits = 0;
        let totalPoints = 0;
        
        subjects.forEach(subject => {
            if (typeof subject.grade === 'number' && !isNaN(subject.grade) && subject.credits > 0) {
                totalCredits += subject.credits;
                totalPoints += subject.credits * subject.grade;
            }
        });
        
        if (totalCredits === 0) return 0;
        
        return (totalPoints / totalCredits);
    }

    // Update SGPA Display
    function updateSGPA() {
        const sgpa = calculateSGPA();
        currentGradeValue.textContent = sgpa.toFixed(2);
        currentGradeValue.classList.add('highlight');
        setTimeout(() => currentGradeValue.classList.remove('highlight'), 2000);
        updateGradeDisplayColor();
    }

    // Update Chart (for SGPA)
    function updateChart() {
        const gradeCount = {
            'A+': 0, 'A': 0, 'B+': 0, 'B': 0,
            'C+': 0, 'C': 0, 'D': 0, 'F': 0
        };
        
        subjects.forEach(subject => {
            if (typeof subject.grade === 'number' && !isNaN(subject.grade) && subject.credits > 0) {
                const grade = gradeMap[subject.grade];
                if (gradeCount.hasOwnProperty(grade)) {
                    gradeCount[grade]++;
                }
            }
        });
        
        gradeChart.data.datasets[0].data = [
            gradeCount['A+'], gradeCount['A'], gradeCount['B+'], gradeCount['B'],
            gradeCount['C+'], gradeCount['C'], gradeCount['D'], gradeCount['F']
        ];
        
        updateChartColors();
        gradeChart.update();
    }

    // CGPA Logic
    addSemesterBtn.addEventListener('click', () => {
        let isValid = true;

        const sgpaValue = parseFloat(semesterSgpaInput.value);
        if (!validateInput(semesterSgpaInput, semesterSgpaError, val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 10, 'SGPA must be between 0 and 10.')) {
            isValid = false;
        }

        const creditsValue = parseFloat(semesterCreditsInput.value);
        if (!validateInput(semesterCreditsInput, semesterCreditsError, val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Credits must be a positive number.')) {
            isValid = false;
        }

        if (!isValid) {
            showStatus('Please correct the errors in the form.', true);
            return;
        }

        semesters.push({ sgpa: sgpaValue, credits: creditsValue });
        renderSemesters();
        updateCGPA();
        showStatus('Semester added for CGPA calculation!', false);

        semesterSgpaInput.value = '';
        semesterCreditsInput.value = '';
    });

    resetCgpaBtn.addEventListener('click', () => {
        showCustomConfirm('Are you sure you want to clear all previous semester data for CGPA?', (confirmed) => {
            if (confirmed) {
                semesters = [];
                renderSemesters();
                updateCGPA();
                showStatus('All semester data cleared for CGPA!', false);
            }
        });
    });

    // Delete Semester
    window.deleteSemester = function(index) {
        semesters.splice(index, 1);
        renderSemesters();
        updateCGPA();
        showStatus('Semester entry deleted.', false);
    };

    function renderSemesters() {
        cgpaBody.innerHTML = '';
        if (semesters.length === 0) {
            cgpaEmptyState.style.display = 'block';
            return;
        }
        cgpaEmptyState.style.display = 'none';

        semesters.forEach((semester, index) => {
            const row = document.createElement('tr');
            const weightedPoints = semester.sgpa * semester.credits;
            row.innerHTML = `
                <td>${semester.sgpa.toFixed(2)}</td>
                <td>${semester.credits.toFixed(1)}</td>
                <td>${weightedPoints.toFixed(2)}</td>
                <td class="actions">
                    <button class="action-btn" title="Delete" onclick="deleteSemester(${index})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            cgpaBody.appendChild(row);
        });
    }

    function calculateCGPA() {
        if (semesters.length === 0) return 0;

        let totalWeightedPoints = 0;
        let totalCreditsSum = 0;

        semesters.forEach(semester => {
            totalWeightedPoints += semester.sgpa * semester.credits;
            totalCreditsSum += semester.credits;
        });

        if (totalCreditsSum === 0) return 0;
        return totalWeightedPoints / totalCreditsSum;
    }

    function updateCGPA() {
        const cgpa = calculateCGPA();
        currentGradeValue.textContent = cgpa.toFixed(2);
        currentGradeValue.classList.add('highlight');
        setTimeout(() => currentGradeValue.classList.remove('highlight'), 2000);
        updateGradeDisplayColor();
        updateCGPAProgressBar(cgpa);
    }

    // Function to update the CGPA progress bar
    function updateCGPAProgressBar(cgpa) {
        const percentage = (cgpa / 10) * 100;
        cgpaProgressBar.style.width = `${percentage}%`;
        cgpaProgressLabel.textContent = `${cgpa.toFixed(2)} / 10.00`;
    }

    // Function to update the color of the displayed SGPA/CGPA value
    function updateGradeDisplayColor() {
        const value = parseFloat(currentGradeValue.textContent);
        const isDarkMode = document.body.classList.contains('dark-mode');
        if (isDarkMode) {
            if (value >= 9.0) {
                currentGradeValue.style.color = '#4cc9f0';
            } else if (value >= 8.0) {
                currentGradeValue.style.color = '#4361ee';
            } else if (value >= 7.0) {
                currentGradeValue.style.color = '#7209b7';
            } else if (value >= 6.0) {
                currentGradeValue.style.color = '#f72585';
            } else {
                currentGradeValue.style.color = '#ff6b6b';
            }
        } else {
            currentGradeValue.style.color = getComputedStyle(document.body).getPropertyValue('--text-dark');
        }
    }

    // Load data from localStorage (only theme persistence)
    function loadData() {
        const savedTheme = localStorage.getItem('gradeFlowTheme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    // Function to show status messages
    function showStatus(message, isError) {
        parseStatus.style.display = 'flex';
        parseStatus.classList.toggle('error', isError);
        parseStatus.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i> <span>${message}</span>`;
        if (!isError) {
            setTimeout(() => {
                parseStatus.style.display = 'none';
            }, 3000);
        }
    }

    // Initialize application on load
    function init() {
        loadData();

        subjects = [];
        semesters = [];
        
        document.querySelector(`#mainTabs .tab[data-tab="sgpa-calc"]`).click();
        document.querySelector(`#sgpaSubTabs .tab[data-tab="manual-sgpa"]`).click();

        renderSubjects();
        renderSemesters();
        updateSGPA();
        updateCGPA();
        updateChart();
        updateChartColors();
        updateGradeDisplayColor();
        
        subjectNameInput.value = '';
        creditsInput.value = '';
        gradeInput.value = '';
        resultText.value = '';
        semesterSgpaInput.value = '';
        semesterCreditsInput.value = '';

        document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    }

    // Initialize the application
    init();

    // Send Feedback/Bug Report
    sendFeedbackBtn.addEventListener('click', () => {
        const feedback = feedbackTextarea.value.trim();
        if (feedback) {
            const subject = encodeURIComponent("GradeFlow Pro Feedback/Bug Report");
            const body = encodeURIComponent(feedback);
            window.location.href = `mailto:futureengineer9915@gmail.com?subject=${subject}&body=${body}`;
            feedbackTextarea.value = '';
        } else {
            showStatus('Please enter your feedback or bug description.', true);
        }
    });
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderUI();
    initApp();
});