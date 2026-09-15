// Load statistics and history on page load
document.addEventListener('DOMContentLoaded', () => {
    loadStatistics();
    loadQuizHistory();
    setupTabNavigation();
    setupActions();
});

function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            // Remove active class from all buttons and tabs
            tabButtons.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.style.display = 'none';
            });
            
            // Add active class to clicked button and show tab
            btn.classList.add('active');
            const tabContent = document.getElementById(tabName);
            if (tabContent) {
                tabContent.style.display = 'block';
                
                // Load appropriate history
                if (tabName === 'quiz-history') {
                    loadQuizHistory();
                } else if (tabName === 'essay-history') {
                    loadEssayHistory();
                } else if (tabName === 'test-history') {
                    loadTestHistory();
                }
            }
        });
    });
}

function loadStatistics() {
    // Get quiz history
    const quizHistory = JSON.parse(localStorage.getItem('quiz-history') || '[]');
    
    // Get essay submissions
    const submittedEssays = JSON.parse(localStorage.getItem('submitted-essays') || '[]');
    
    // Get test progress
    const testProgress = JSON.parse(localStorage.getItem('test-progress') || '[]');
    
    // Calculate total tests (quizzes + test attempts)
    const totalTests = quizHistory.length + testProgress.length;
    document.getElementById('total-tests').textContent = totalTests;
    
    // Total essays
    const totalEssays = submittedEssays.length;
    document.getElementById('total-essays').textContent = totalEssays;
    
    // Calculate average score from quizzes
    let avgScore = 0;
    if (quizHistory.length > 0) {
        const totalScore = quizHistory.reduce((sum, quiz) => {
            return sum + (quiz.score / quiz.total * 100);
        }, 0);
        avgScore = Math.round(totalScore / quizHistory.length);
    }
    document.getElementById('avg-score').textContent = avgScore + '%';
    
    // Calculate study hours from essay submissions
    let studyHours = 0;
    if (submittedEssays.length > 0) {
        const totalSeconds = submittedEssays.reduce((sum, essay) => sum + (essay.timeTaken || 0), 0);
        studyHours = Math.round(totalSeconds / 3600);
    }
    document.getElementById('study-hours').textContent = studyHours;
}

function loadQuizHistory() {
    const quizHistory = JSON.parse(localStorage.getItem('quiz-history') || '[]');
    const quizList = document.getElementById('quiz-list');
    
    if (quizHistory.length === 0) {
        quizList.innerHTML = '<p class="empty-message">No quiz attempts yet. Start a quiz to begin!</p>';
        return;
    }
    
    quizList.innerHTML = '';
    
    // Sort by most recent first
    const sortedHistory = quizHistory.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    sortedHistory.forEach((quiz, index) => {
        const percentage = Math.round((quiz.score / quiz.total) * 100);
        const statusClass = percentage >= 70 ? 'good' : percentage >= 50 ? 'fair' : 'poor';
        
        const historyItem = document.createElement('div');
        historyItem.className = `history-item ${statusClass}`;
        historyItem.innerHTML = `
            <div class="history-item-content">
                <h4>${quiz.title}</h4>
                <p>Score: <strong>${quiz.score}/${quiz.total}</strong> (${percentage}%)</p>
                <p class="history-timestamp">${quiz.timestamp}</p>
            </div>
            <div class="history-item-badge">${percentage}%</div>
        `;
        quizList.appendChild(historyItem);
    });
}

function loadEssayHistory() {
    const submittedEssays = JSON.parse(localStorage.getItem('submitted-essays') || '[]');
    const essayList = document.getElementById('essay-list');
    
    if (submittedEssays.length === 0) {
        essayList.innerHTML = '<p class="empty-message">No essays submitted yet. Write an essay to begin!</p>';
        return;
    }
    
    essayList.innerHTML = '';
    
    // Sort by most recent first
    const sortedEssays = submittedEssays.sort((a, b) => {
        return new Date(b.submittedAt) - new Date(a.submittedAt);
    });
    
    sortedEssays.forEach((essay) => {
        const minutes = Math.floor(essay.timeTaken / 60);
        const seconds = essay.timeTaken % 60;
        
        const essayItem = document.createElement('div');
        essayItem.className = 'history-item';
        essayItem.innerHTML = `
            <div class="history-item-content">
                <h4>${essay.title}</h4>
                <p>Words: <strong>${essay.wordCount}</strong> | Characters: <strong>${essay.content.length}</strong></p>
                <p>Time Taken: <strong>${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}</strong></p>
                <p class="history-timestamp">${essay.submittedAt}</p>
            </div>
            <div class="history-item-action">
                <button class="btn-view" onclick="viewEssayContent('${essay.id}')">View</button>
            </div>
        `;
        essayList.appendChild(essayItem);
    });
}

function loadTestHistory() {
    const testProgress = JSON.parse(localStorage.getItem('test-progress') || '[]');
    const testList = document.getElementById('test-list');
    
    if (testProgress.length === 0) {
        testList.innerHTML = '<p class="empty-message">No test attempts yet. Take a mock test to begin!</p>';
        return;
    }
    
    testList.innerHTML = '';
    
    // Sort by most recent first
    const sortedTests = testProgress.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    sortedTests.forEach((test) => {
        const testItem = document.createElement('div');
        testItem.className = 'history-item';
        testItem.innerHTML = `
            <div class="history-item-content">
                <h4>${test.testId}</h4>
                <p>Status: <strong>In Progress</strong></p>
                <p class="history-timestamp">${test.timestamp}</p>
            </div>
            <div class="history-item-action">
                <button class="btn-view" onclick="resumeTest('${test.testId}')">Resume</button>
            </div>
        `;
        testList.appendChild(testItem);
    });
}

function viewEssayContent(essayId) {
    const submittedEssays = JSON.parse(localStorage.getItem('submitted-essays') || '[]');
    const essay = submittedEssays.find(e => e.id == essayId);
    
    if (essay) {
        const modal = document.createElement('div');
        modal.className = 'modal-view';
        modal.innerHTML = `
            <div class="modal-view-content">
                <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h3>${essay.title}</h3>
                <div class="essay-view-text">
                    ${essay.content}
                </div>
                <div class="modal-view-stats">
                    <p>Words: ${essay.wordCount} | Characters: ${essay.content.length}</p>
                    <p>Submitted: ${essay.submittedAt}</p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

function resumeTest(testId) {
    alert('Resume functionality coming soon!');
}

function setupActions() {
    const exportBtn = document.getElementById('export-btn');
    const clearBtn = document.getElementById('clear-btn');
    const backHomeBtn = document.getElementById('back-home-btn');
    
    exportBtn.addEventListener('click', exportProgress);
    clearBtn.addEventListener('click', clearHistory);
    backHomeBtn.addEventListener('click', () => window.location.href = 'index.html');
}

function exportProgress() {
    const quizHistory = JSON.parse(localStorage.getItem('quiz-history') || '[]');
    const submittedEssays = JSON.parse(localStorage.getItem('submitted-essays') || '[]');
    const testProgress = JSON.parse(localStorage.getItem('test-progress') || '[]');
    
    const exportData = {
        exportDate: new Date().toLocaleString(),
        statistics: {
            totalTests: quizHistory.length + testProgress.length,
            totalEssays: submittedEssays.length,
            quizHistory: quizHistory,
            essayHistory: submittedEssays,
            testHistory: testProgress
        }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `css-prep-progress-${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    alert('✓ Progress exported successfully!');
}

function clearHistory() {
    if (confirm('Are you sure? This will delete all your learning history!')) {
        localStorage.removeItem('quiz-history');
        localStorage.removeItem('submitted-essays');
        localStorage.removeItem('test-progress');
        localStorage.removeItem('saved-essays');
        
        alert('✓ History cleared!');
        location.reload();
    }
}
