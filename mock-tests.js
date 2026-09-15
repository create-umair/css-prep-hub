// Mock Tests Data
const mockTestsData = {
    "english-precis": [
        {
            id: "precis-1",
            title: "Precis Writing Practice 1",
            timeLimit: 900, // 15 minutes
            passage: "Pakistan's economy faces multifaceted challenges including inflation, energy shortages, and trade deficits. Despite these obstacles, the agricultural sector remains resilient, contributing significantly to GDP and employment. However, industrial growth has stagnated due to outdated infrastructure and inadequate technology adoption. The government has initiated several reforms including privatization of state-owned enterprises and investment in renewable energy. These measures are expected to attract foreign direct investment and create sustainable economic growth. Nevertheless, political instability and security concerns continue to hinder progress. To overcome these challenges, Pakistan requires a comprehensive approach involving infrastructure development, human capital investment, and effective governance reforms.",
            minWords: 80,
            maxWords: 120
        },
        {
            id: "precis-2",
            title: "Precis Writing Practice 2",
            timeLimit: 900,
            passage: "Climate change represents one of the most pressing global challenges of our time. Rising temperatures are causing melting ice caps, rising sea levels, and increasingly severe weather events. These changes disproportionately affect developing nations like Pakistan, which lacks the resources to adapt. The country faces water scarcity, agricultural degradation, and increased natural disasters. International climate agreements such as the Paris Agreement aim to limit global warming. However, implementation remains inconsistent across nations. Pakistan must balance economic development with environmental protection through sustainable practices, renewable energy adoption, and green infrastructure investment. Urgent action is required to mitigate climate impacts and ensure long-term sustainability.",
            minWords: 80,
            maxWords: 120
        }
    ],
    "gen-science": [
        {
            id: "gs-quiz-1",
            title: "General Science Quiz 1",
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
                },
                {
                    q: "What is the speed of light?",
                    options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
                    answer: 0
                },
                {
                    q: "How many bones are in the human body?",
                    options: ["186", "206", "226", "246"],
                    answer: 1
                }
            ]
        },
        {
            id: "gs-quiz-2",
            title: "General Science Quiz 2",
            timeLimit: 600,
            questions: [
                {
                    q: "What is the largest organ in the human body?",
                    options: ["Heart", "Brain", "Skin", "Liver"],
                    answer: 2
                },
                {
                    q: "Which element has the symbol 'Au'?",
                    options: ["Silver", "Gold", "Aluminum", "Argon"],
                    answer: 1
                },
                {
                    q: "What is the process by which plants make their own food?",
                    options: ["Respiration", "Photosynthesis", "Digestion", "Fermentation"],
                    answer: 1
                }
            ]
        }
    ],
    "islamic-studies": [
        {
            id: "is-quiz-1",
            title: "Islamic Studies Quiz 1",
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
                },
                {
                    q: "What is the Islamic declaration of faith called?",
                    options: ["Hajj", "Shahada", "Wudu", "Zakat"],
                    answer: 1
                },
                {
                    q: "How many chapters are in the Quran?",
                    options: ["102", "114", "126", "140"],
                    answer: 1
                }
            ]
        }
    ],
    "pak-studies": [
        {
            id: "ps-quiz-1",
            title: "Pakistan Studies Quiz 1",
            timeLimit: 600,
            questions: [
                {
                    q: "In which year was Pakistan created?",
                    options: ["1945", "1947", "1950", "1952"],
                    answer: 1
                },
                {
                    q: "Who is the founder of Pakistan?",
                    options: ["Liaquat Ali Khan", "Muhammad Ali Jinnah", "Allama Iqbal", "Benazir Bhutto"],
                    answer: 1
                },
                {
                    q: "Which river is called the 'Father of Rivers' in Pakistan?",
                    options: ["Indus", "Jhelum", "Chenab", "Ravi"],
                    answer: 0
                },
                {
                    q: "In which year was the Objectives Resolution passed?",
                    options: ["1940", "1949", "1956", "1962"],
                    answer: 1
                }
            ]
        }
    ]
};

let currentTest = null;
let timeLeft = 0;
let timerInterval = null;
let userAnswers = {};
let testStartTime = null;

// DOM Elements
const testSelection = document.getElementById('test-selection');
const testTaking = document.getElementById('test-taking');
const testResults = document.getElementById('test-results');
const testList = document.getElementById('test-list');
const testTitle = document.getElementById('test-title');
const testInstructions = document.getElementById('test-instructions');
const questionsContainer = document.getElementById('questions-container');
const testTimer = document.getElementById('test-timer');
const filterButtons = document.querySelectorAll('.filter-btn');
const saveTestBtn = document.getElementById('save-test-btn');
const submitTestBtn = document.getElementById('submit-test-btn');
const cancelTestBtn = document.getElementById('cancel-test-btn');
const takeAnotherBtn = document.getElementById('take-another-btn');
const backHomeBtn = document.getElementById('back-home-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTests('all');
    setupEventListeners();
});

function setupEventListeners() {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadTests(btn.dataset.subject);
        });
    });

    saveTestBtn.addEventListener('click', saveTestProgress);
    submitTestBtn.addEventListener('click', submitTest);
    cancelTestBtn.addEventListener('click', backToSelection);
    takeAnotherBtn.addEventListener('click', backToSelection);
    backHomeBtn.addEventListener('click', () => window.location.href = 'index.html');
}

function loadTests(subject) {
    testList.innerHTML = '';
    let allTests = [];

    if (subject === 'all') {
        Object.values(mockTestsData).forEach(tests => allTests.push(...tests));
    } else {
        allTests = mockTestsData[subject] || [];
    }

    if (allTests.length === 0) {
        testList.innerHTML = '<p>No tests available for this subject</p>';
        return;
    }

    allTests.forEach(test => {
        const testCard = document.createElement('div');
        testCard.className = 'test-card';
        const testType = test.questions ? 'Multiple Choice' : 'Précis Writing';
        const questionCount = test.questions ? `${test.questions.length} questions` : 'Passage based';
        testCard.innerHTML = `
            <div class="test-card-content">
                <h3>${test.title}</h3>
                <p>${testType} • ${questionCount}</p>
                <p class="test-time">⏱️ ${test.timeLimit / 60} minutes</p>
            </div>
            <button class="btn-card" onclick="startTest('${test.id}')">Start Test</button>
        `;
        testList.appendChild(testCard);
    });
}

function startTest(testId) {
    // Find test across all subjects
    let foundTest = null;
    for (let subject in mockTestsData) {
        foundTest = mockTestsData[subject].find(t => t.id === testId);
        if (foundTest) break;
    }

    if (!foundTest) return;

    currentTest = foundTest;
    userAnswers = {};
    timeLeft = currentTest.timeLimit;
    testStartTime = Date.now();

    // Show test taking view
    testSelection.style.display = 'none';
    testTaking.style.display = 'block';
    testResults.style.display = 'none';

    testTitle.textContent = currentTest.title;

    // Load test content
    if (currentTest.questions) {
        testInstructions.textContent = `Answer all ${currentTest.questions.length} questions. Select the correct option.`;
        loadQuestions();
    } else {
        testInstructions.textContent = `Read the passage and write a précis in ${currentTest.minWords}-${currentTest.maxWords} words.`;
        loadPrecisTest();
    }

    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
}

function loadQuestions() {
    questionsContainer.innerHTML = '';
    currentTest.questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-card';
        questionDiv.innerHTML = `
            <p><strong>Q${index + 1}:</strong> ${q.q}</p>
            <div class="options">
                ${q.options.map((opt, i) => `
                    <label class="option-label">
                        <input type="radio" name="q${index}" value="${i}" onchange="userAnswers['q${index}'] = ${i}">
                        ${opt}
                    </label>
                `).join('')}
            </div>
        `;
        questionsContainer.appendChild(questionDiv);
    });
}

function loadPrecisTest() {
    questionsContainer.innerHTML = `
        <div class="passage-section">
            <h3>Read the following passage:</h3>
            <div class="passage-text">
                ${currentTest.passage}
            </div>
            <p class="passage-hint">Write a précis of ${currentTest.minWords}-${currentTest.maxWords} words</p>
            <textarea id="precis-answer" placeholder="Write your précis here..." style="width: 100%; min-height: 200px; padding: 10px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
            <div id="precis-stats">Words: <strong>0</strong></div>
        </div>
    `;

    const textArea = document.getElementById('precis-answer');
    const statsDiv = document.getElementById('precis-stats');

    textArea.addEventListener('input', () => {
        const words = textArea.value.trim().split(/\s+/).filter(w => w).length;
        statsDiv.innerHTML = `Words: <strong>${words}</strong>`;
        userAnswers['precis'] = textArea.value;
    });
}

function updateTimer() {
    timeLeft--;
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    testTimer.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (timeLeft < 0) {
        clearInterval(timerInterval);
        alert('Time is up!');
        submitTest();
    }
}

function saveTestProgress() {
    const saved = JSON.parse(localStorage.getItem('test-progress') || '[]');
    saved.push({
        testId: currentTest.id,
        answers: userAnswers,
        timestamp: new Date().toLocaleString()
    });
    localStorage.setItem('test-progress', JSON.stringify(saved));
    alert('✓ Progress saved!');
}

function submitTest() {
    clearInterval(timerInterval);

    if (currentTest.questions) {
        submitQuizTest();
    } else {
        submitPrecisTest();
    }
}

function submitQuizTest() {
    let correct = 0;
    let unanswered = 0;

    currentTest.questions.forEach((q, i) => {
        if (userAnswers[`q${i}`] === undefined) {
            unanswered++;
        } else if (userAnswers[`q${i}`] === q.answer) {
            correct++;
        }
    });

    const total = currentTest.questions.length;
    const incorrect = total - correct - unanswered;
    const percentage = Math.round((correct / total) * 100);

    showResults(correct, total, percentage, incorrect, unanswered);
}

function submitPrecisTest() {
    const precisText = userAnswers['precis'] || '';
    const words = precisText.trim().split(/\s+/).filter(w => w).length;
    
    let status = 'Submitted';
    if (words < currentTest.minWords) {
        status = `Below minimum (${words}/${currentTest.minWords} words)`;
    } else if (words > currentTest.maxWords) {
        status = `Exceeds maximum (${words}/${currentTest.maxWords} words)`;
    } else {
        status = `Within range (${words} words)`;
    }

    testResults.style.display = 'block';
    testTaking.style.display = 'none';

    const resultsHTML = `
        <div class="results-container">
            <h2>✓ Précis Submitted</h2>
            <div class="score-display">
                <div class="score-details">
                    <p>Status: <strong>${status}</strong></p>
                    <p>Word Count: <strong>${words}</strong></p>
                    <p>Required: <strong>${currentTest.minWords}-${currentTest.maxWords}</strong></p>
                </div>
            </div>
            <div class="answer-review">
                <h3>Your Précis:</h3>
                <div class="submitted-text">${precisText}</div>
            </div>
            <div class="results-actions">
                <button id="take-another-btn" class="btn-primary">📋 Take Another Test</button>
                <button id="back-home-btn" class="btn-secondary">🏠 Back Home</button>
            </div>
        </div>
    `;

    testResults.innerHTML = resultsHTML;
    document.getElementById('take-another-btn').addEventListener('click', backToSelection);
    document.getElementById('back-home-btn').addEventListener('click', () => window.location.href = 'index.html');
}

function showResults(correct, total, percentage, incorrect, unanswered) {
    testResults.style.display = 'block';
    testTaking.style.display = 'none';

    document.getElementById('score-percentage').textContent = percentage + '%';
    document.getElementById('score-value').textContent = `${correct}/${total}`;
    document.getElementById('correct-count').textContent = correct;
    document.getElementById('incorrect-count').textContent = incorrect;
    document.getElementById('unanswered-count').textContent = unanswered;

    // Build review
    const reviewHTML = currentTest.questions.map((q, i) => {
        const userAnswer = userAnswers[`q${i}`];
        const isCorrect = userAnswer === q.answer;
        const status = userAnswer === undefined ? 'Unanswered' : (isCorrect ? '✓ Correct' : '✗ Incorrect');
        const statusClass = userAnswer === undefined ? 'unanswered' : (isCorrect ? 'correct' : 'incorrect');

        return `
            <div class="review-item ${statusClass}">
                <p><strong>Q${i + 1}: ${q.q}</strong></p>
                <p>Your answer: ${userAnswer !== undefined ? q.options[userAnswer] : 'Not answered'}</p>
                <p>Correct answer: ${q.options[q.answer]}</p>
                <p class="status">${status}</p>
            </div>
        `;
    }).join('');

    document.getElementById('review-container').innerHTML = reviewHTML;

    takeAnotherBtn.addEventListener('click', backToSelection);
    backHomeBtn.addEventListener('click', () => window.location.href = 'index.html');
}

function backToSelection() {
    testSelection.style.display = 'block';
    testTaking.style.display = 'none';
    testResults.style.display = 'none';
    clearInterval(timerInterval);
    loadTests('all');
}
