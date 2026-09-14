// Mock Test Data Structure
const mockTests = {
    "english-essay": [
        {
            id: "essay-1",
            title: "The Role of Youth in National Development",
            timeLimit: 180, // 3 minutes
            instructions: "Write a coherent essay of 2000-2500 words with clear introduction body and conclusion."
        },
        {
            id: "essay-2",
            title: "Climate Change: Challenges and Mitigation Strategies for Pakistan",
            timeLimit: 180,
            instructions: "Discuss causes impacts and feasible solutions for Pakistan's context."
        },
        {
            id: "essay-3",
            title: "Digital Transformation: Opportunities and Risks in Governance",
            timeLimit: 180,
            instructions: "Analyze how digital tools can improve public service delivery while addressing privacy concerns."
        }
    ],
    "english-precis": [
        {
            id: "precis-1",
            title: "Precis Writing Practice",
            timeLimit: 30, // 3 minutes for precis
            instructions: "Read the passage below and write a precis in one-third of the original length.",
            passage: "Pakistan's economy faces multifaceted challenges including inflation energy shortages and trade deficits. While agricultural output remains strong industrial growth has stalled due to inconsistent policies and infrastructure gaps. The services sector particularly IT and telecom shows promise but requires skilled workforce development. Addressing these issues demands coherent fiscal reforms investment in human capital and regional cooperation to harness trade opportunities."
        }
    ],
    "gen-science": [
        {
            id: "gs-1",
            title: "General Science Mixed Quiz",
            timeLimit: 600, // 10 minutes
            questions: [
                {
                    q: "What is the chemical formula of water?",
                    options: ["H2O", "CO2", "O2", "NaCl"],
                    answer: 0
                },
                {
                    q: "Which planet is known as the Red Planet?",
                    options: ["Venus", "Mars", "Jupiter", "Saturn"],
                    answer: 1
                },
                {
                    q: "What is the powerhouse of the cell?",
                    options: ["Nucleus", "Ribosome", "Mitochondria", "Chloroplast"],
                    answer: 2
                }
            ]
        }
    ],
    "islamic-studies": [
        {
            id: "is-1",
            title: "Islamic Studies Quiz",
            timeLimit: 600,
            questions: [
                {
                    q: "How many pillars are there in Islam?",
                    options: ["Three", "Four", "Five", "Six"],
                    answer: 2
                },
                {
                    q: "Which month is observed for fasting in Islam?",
                    options: ["Rajab", "Shaaban", "Ramadan", "Shawwal"],
                    answer: 2
                }
            ]
        }
    ],
    "pak-studies": [
        {
            id: "ps-1",
            title: "Pakistan Studies Quiz",
            timeLimit: 600,
            questions: [
                {
                    q: "In which year was the Objectives Resolution passed?",
                    options: ["1940", "1949", "1956", "1962"],
                    answer: 1
                },
                {
                    q: "Which river is called the 'Father of Rivers' in Pakistan?",
                    options: ["Indus", "Jhelum", "Chenab", "Ravi"],
                    answer: 0
                }
            ]
        }
    ]
};

// DOM Elements
const testContainer = document.getElementById('test-container');
const subjectCards = document.querySelectorAll('.subject-card');
let currentTest = null;
let timerInterval = null;
let timeLeft = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Handle subject card clicks
    subjectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const subject = card.dataset.subject;
            loadTestInterface(subject);
        });
    });

    // Handle nav links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
            document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
        });
    });
});

// Load test interface for a subject
function loadTestInterface(subject) {
    const tests = mockTests[subject];
    if (!tests || tests.length === 0) {
        testContainer.innerHTML = '<p>No mock tests available for this subject yet.</p>';
        return;
    }

    let testsHTML = '<h3>Select a Mock Test</h3>';
    testsHTML += '<div class="test-options">';

    tests.forEach(test => {
        testsHTML += `
            <div class="test-option" data-test-id="${test.id}">
                <h4>${test.title}</h4>
                <p>${test.instructions || ''}</p>
                ${test.passage ? `<div class="passage-preview">${test.passage.substring(0, 100)}...</div>` : ''}
                ${test.questions ? `<p><small>${test.questions.length} questions</small></p>` : ''}
                <button class="btn-start-test">Start Test</button>
            </div>
        `;
    });

    testsHTML += '</div>';
    testContainer.innerHTML = testsHTML;

    // Add event listeners to start buttons
    document.querySelectorAll('.btn-start-test').forEach(button => {
        button.addEventListener('click', () => {
            const testId = button.closest('.test-option').dataset.testId;
            const test = tests.find(t => t.id === testId);
            startTest(test);
        });
    });
}

// Start a test
function startTest(test) {
    currentTest = test;
    timeLeft = test.timeLimit;

    // Clear container
    testContainer.innerHTML = '';

    // Build test interface based on type
    if (test.passage) {
        testContainer.innerHTML = `
            <div class="test-header">
                <h2>${test.title}</h2>
                <p><em>${test.instructions}</em></p>
            </div>
            <div class="passage-full">
                <h3>Passage:</h3>
                <p>${test.passage}</p>
            </div>
            <div id="answer-area">
                <textarea id="test-answer" placeholder="Write your precis here..."></textarea>
                <div id="word-count-test" class="word-count">0 words</div>
            </div>
            <div class="timer-container">
                <div class="timer-display" id="test-timer">${formatTime(timeLeft)}</div>
                <div class="test-controls">
                    <button id="start-test-btn">Start</button>
                    <button id="reset-test-btn" disabled>Reset</button>
                    <button id="submit-test-btn" disabled>Submit</button>
                </div>
            </div>
        `;

        const answerArea = document.getElementById('answer-area');
        const wordCountDisplay = document.getElementById('word-count-test');
        const essayInput = document.getElementById('test-answer');
        const timerDisplay = document.getElementById('test-timer');
        const startBtn = document.getElementById('start-test-btn');
        const resetBtn = document.getElementById('reset-test-btn');
        const submitBtn = document.getElementById('submit-test-btn');

        essayInput.addEventListener('input', () => {
            const text = essayInput.value.trim();
            const wordCount = text === '' ? 0 : text.match(/\b\w+\b/g)?.length || 0;
            wordCountDisplay.textContent = `${wordCount} words`;
        });

        startBtn.addEventListener('click', startTestTimer);
        resetBtn.addEventListener('click', resetTest);
        submitBtn.addEventListener('click', submitTest);
    }
    else if (test.questions) {
        testContainer.innerHTML = `
            <div class="test-header">
                <h2>${test.title}</h2>
                <p>Answer all questions. You have ${formatTime(test.timeLimit)}.</p>
            </div>
            <div id="questions-container">
                ${test.questions.map((q, i) => `
                    <div class="question-card">
                        <p><strong>Q${i+1}:</strong> ${q.q}</p>
                        <div class="options">
                            ${q.options.map((opt, j) => `
                                <label class="option-label">
                                    <input type="radio" name="q${i}" value="${j}">
                                    ${opt}
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="timer-container">
                <div class="timer-display" id="test-timer">${formatTime(timeLeft)}</div>
                <div class="test-controls">
                    <button id="start-test-btn">Start</button>
                    <button id="reset-test-btn" disabled>Reset</button>
                    <button id="submit-test-btn" disabled>Submit</button>
                </div>
            </div>
        `;

        const timerDisplay = document.getElementById('test-timer');
        const startBtn = document.getElementById('start-test-btn');
        const resetBtn = document.getElementById('reset-test-btn');
        const submitBtn = document.getElementById('submit-test-btn');

        startBtn.addEventListener('click', startTestTimer);
        resetBtn.addEventListener('click', resetTest);
        submitBtn.addEventListener('click', submitQuizTest);
    }
    else {
        // Default essay test
        testContainer.innerHTML = `
            <div class="test-header">
                <h2>${test.title}</h2>
                <p><em>${test.instructions}</em></p>
            </div>
            <div id="essay-area">
                <textarea id="essay-input" placeholder="Write your essay here... (Minimum 2000 words)"></textarea>
                <div id="word-count" class="word-count">0 words</div>
            </div>
            <div class="timer-container">
                <div class="timer-display" id="test-timer">${formatTime(timeLeft)}</div>
                <div class="test-controls">
                    <button id="start-test-btn">Start</button>
                    <button id="reset-test-btn" disabled>Reset</button>
                    <button id="submit-test-btn" disabled>Submit</button>
                </div>
            </div>
        `;

        const essayInput = document.getElementById('essay-input');
        const wordCountDisplay = document.getElementById('word-count');
        const timerDisplay = document.getElementById('test-timer');
        const startBtn = document.getElementById('start-test-btn');
        const resetBtn = document.getElementById('reset-test-btn');
        const submitBtn = document.getElementById('submit-test-btn');

        essayInput.addEventListener('input', () => {
            const text = essayInput.value.trim();
            const wordCount = text === '' ? 0 : text.match(/\b\w+\b/g)?.length || 0;
            wordCountDisplay.textContent = `${wordCount} words`;
            // Enable submit only if reasonable length
            submitBtn.disabled = wordCount < 100; // Very basic check
        });

        startBtn.addEventListener('click', startTestTimer);
        resetBtn.addEventListener('click', resetTest);
        submitBtn.addEventListener('click', submitEssayTest);
    }
}

// Timer functions
function startTestTimer() {
    document.getElementById('start-test-btn').disabled = true;
    document.getElementById('reset-test-btn').disabled = false;
    document.getElementById('submit-test-btn').disabled = false;

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('test-timer').textContent = formatTime(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.getElementById('test-timer').textContent = '00:00';
            alert('Time is up! Please submit your test.');
            submitTest(); // Auto submit on time out
        }
    }, 1000);
}

function resetTest() {
    clearInterval(timerInterval);
    timeLeft = currentTest.timeLimit;
    document.getElementById('test-timer').textContent = formatTime(timeLeft);
    document.getElementById('start-test-btn').disabled = false;
    document.getElementById('reset-test-btn').disabled = true;
    document.getElementById('submit-test-btn').disabled = true;

    // Reset inputs based on test type
    if (currentTest.passage) {
        document.getElementById('test-answer').value = '';
        document.getElementById('word-count-test').textContent = '0 words';
    }
    else if (currentTest.questions) {
        document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
    }
    else {
        document.getElementById('essay-input').value = '';
        document.getElementById('word-count').textContent = '0 words';
        document.getElementById('submit-test-btn').disabled = true;
    }
}

function submitTest() {
    clearInterval(timerInterval);
    // In a real app you'd send this to a backend - here we just show results
    alert('Test submitted! Check LocalStorage for your attempt (for demo purposes).');
    saveAttempt();
    showResults();
}

function submitEssayTest() {
    const essayInput = document.getElementById('essay-input');
    const wordCount = essayInput.value.trim().match(/\b\w+\b/g)?.length || 0;
    if (wordCount < 200) {
        alert('Please write at least 200 words to submit.');
        return;
    }
    submitTest();
}

function submitQuizTest() {
    const answers = [];
    currentTest.questions.forEach((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        answers.push(selected ? parseInt(selected.value) : -1);
    });
    // Calculate score
    let score = 0;
    currentTest.questions.forEach((q, i) => {
        if (answers[i] === q.answer) score++;
    });
    alert(`Your score: ${score}/${currentTest.questions.length}`);
    saveAttempt({ score, total: currentTest.questions.length });
    showResults();
}

function saveAttempt(result = null) {
    const attempts = JSON.parse(localStorage.getItem('css-test-attempts') || '[]');
    attempts.push({
        subject: Object.keys(mockTests).find(key => mockTests[key].includes(currentTest)) || 'unknown',
        testId: currentTest.id,
        title: currentTest.title,
        timestamp: new Date().toISOString(),
        result: result
    });
    localStorage.setItem('css-test-attempts', JSON.stringify(attempts));
}

function showResults() {
    testContainer.innerHTML = `
        <div class="results-screen">
            <h2>Test Completed</h2>
            <p>Your attempt has been saved locally. Review your answers and try again to improve!</p>
            <button id="try-another-btn" class="btn-start-test">Try Another Test</button>
            <button id="view-history-btn">View Attempt History</button>
        </div>
    `;

    document.getElementById('try-another-btn').addEventListener('click', () => {
        loadTestInterface(Object.keys(mockTests).find(key => mockTests[key].includes(currentTest)) || 'english-essay');
    });

    document.getElementById('view-history-btn').addEventListener('click', () => {
        const attempts = JSON.parse(localStorage.getItem('css-test-attempts') || '[]');
        let historyHTML = '<h3>Your Attempt History</h3>';
        if (attempts.length === 0) {
            historyHTML += '<p>No attempts recorded yet.</p>';
        }
        else {
            historyHTML += '<ul>';
            attempts.slice(-5).reverse().forEach(att => {
                historyHTML += `<li><strong>${att.title}</strong> (${new Date(att.timestamp).toLocaleString()})`;
                if (att.result) {
                    if (att.result.score !== undefined) {
                        historyHTML += ` - Score: ${att.result.score}/${att.result.total}`;
                    }
                    else {
                        historyHTML += ` - Essay attempt`;
                    }
                }
                historyHTML += '</li>';
            });
            historyHTML += '</ul>';
        }
        historyHTML += '<button id="close-history">Close</button>';
        testContainer.innerHTML = historyHTML;
        document.getElementById('close-history').addEventListener('click', () => {
            loadTestInterface(Object.keys(mockTests).find(key => mockTests[key].includes(currentTest)) || 'english-essay');
        });
    });
}

// Helper function
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
