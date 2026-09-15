// Essay Data
const essays = [
    {
        id: "essay-1",
        title: "The Role of Youth in National Development",
        instructions: "Write a coherent essay of 2000-2500 words with clear introduction, body and conclusion.",
        defaultTime: 1800 // 30 minutes
    },
    {
        id: "essay-2",
        title: "Climate Change: Challenges and Mitigation Strategies for Pakistan",
        instructions: "Discuss causes, impacts and feasible solutions for Pakistan's context. Minimum 2000 words.",
        defaultTime: 1800
    },
    {
        id: "essay-3",
        title: "Digital Transformation: Opportunities and Risks in Governance",
        instructions: "Analyze how digital tools can improve public service delivery while addressing privacy concerns.",
        defaultTime: 1800
    },
    {
        id: "essay-4",
        title: "Education System Reform in Pakistan",
        instructions: "Critically analyze current education challenges and propose comprehensive reforms.",
        defaultTime: 1800
    },
    {
        id: "essay-5",
        title: "Economic Development vs Environmental Conservation",
        instructions: "Discuss the balance between economic growth and environmental protection in Pakistan.",
        defaultTime: 1800
    }
];

let currentEssay = null;
let timeLeft = 0;
let timerInterval = null;
let startTime = null;
let essayStartTime = null;

// DOM Elements
const essaySelection = document.getElementById('essay-selection');
const essayWriting = document.getElementById('essay-writing');
const essaySubmitted = document.getElementById('essay-submitted');
const essayList = document.getElementById('essay-list');
const essayTitle = document.getElementById('essay-title');
const essayInstructions = document.getElementById('essay-instructions');
const essayTextarea = document.getElementById('essay-textarea');
const timerDisplay = document.getElementById('timer-display');
const wordCount = document.getElementById('word-count');
const charCount = document.getElementById('char-count');
const paraCount = document.getElementById('para-count');

// Modal Elements
const timerModal = document.getElementById('timer-modal');
const timerMinutesInput = document.getElementById('timer-minutes');
const timerSecondsInput = document.getElementById('timer-seconds');
const timerAdjustBtn = document.getElementById('timer-adjust-btn');
const timerApplyBtn = document.getElementById('timer-apply-btn');
const timerCancelBtn = document.getElementById('timer-cancel-btn');
const closeModal = document.querySelector('.close');

// Action Buttons
const saveEssayBtn = document.getElementById('save-essay-btn');
const submitEssayBtn = document.getElementById('submit-essay-btn');
const newEssayBtn = document.getElementById('new-essay-btn');
const practiceAnotherBtn = document.getElementById('practice-another-btn');
const viewSavedBtn = document.getElementById('view-saved-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadEssayList();
    setupEventListeners();
});

function loadEssayList() {
    essayList.innerHTML = '';
    essays.forEach(essay => {
        const essayCard = document.createElement('div');
        essayCard.className = 'essay-card';
        essayCard.innerHTML = `
            <h3>${essay.title}</h3>
            <p>${essay.instructions}</p>
            <p class="essay-time">⏱️ Recommended: ${essay.defaultTime / 60} minutes</p>
            <button class="btn-card" onclick="startEssay('${essay.id}')">Start Essay</button>
        `;
        essayList.appendChild(essayCard);
    });
}

function startEssay(essayId) {
    currentEssay = essays.find(e => e.id === essayId);
    if (!currentEssay) return;

    // Show essay writing view
    essaySelection.style.display = 'none';
    essayWriting.style.display = 'block';
    essaySubmitted.style.display = 'none';

    // Set essay details
    essayTitle.textContent = currentEssay.title;
    essayInstructions.textContent = currentEssay.instructions;
    essayTextarea.value = '';
    essayTextarea.focus();

    // Initialize timer
    timeLeft = currentEssay.defaultTime;
    timerMinutesInput.value = Math.floor(currentEssay.defaultTime / 60);
    timerSecondsInput.value = currentEssay.defaultTime % 60;
    updateTimerDisplay();

    // Start timing
    essayStartTime = Date.now();
    startTimer();

    // Reset stats
    updateStats();
}

function setupEventListeners() {
    essayTextarea.addEventListener('input', updateStats);
    
    timerAdjustBtn.addEventListener('click', () => {
        timerModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        timerModal.style.display = 'none';
    });

    timerCancelBtn.addEventListener('click', () => {
        timerModal.style.display = 'none';
    });

    timerApplyBtn.addEventListener('click', () => {
        const minutes = parseInt(timerMinutesInput.value) || 0;
        const seconds = parseInt(timerSecondsInput.value) || 0;
        
        if (minutes < 5) {
            alert('Minimum time is 5 minutes');
            return;
        }
        
        if (minutes > 180) {
            alert('Maximum time is 180 minutes');
            return;
        }

        clearInterval(timerInterval);
        timeLeft = minutes * 60 + seconds;
        updateTimerDisplay();
        startTimer();
        timerModal.style.display = 'none';
    });

    saveEssayBtn.addEventListener('click', saveEssay);
    submitEssayBtn.addEventListener('click', submitEssay);
    newEssayBtn.addEventListener('click', backToSelection);
    practiceAnotherBtn.addEventListener('click', backToSelection);
    viewSavedBtn.addEventListener('click', viewSavedEssays);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === timerModal) {
            timerModal.style.display = 'none';
        }
    });
}

function updateStats() {
    const text = essayTextarea.value;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const chars = text.length;
    const paras = text.trim() === '' ? 0 : text.split('\n\n').filter(p => p.trim()).length;

    wordCount.textContent = words;
    charCount.textContent = chars;
    paraCount.textContent = paras;
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('⏰ Time is up! Your essay will be submitted.');
            submitEssay();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Change color if less than 5 minutes
    if (timeLeft < 300) {
        timerDisplay.style.color = '#d32f2f';
    } else {
        timerDisplay.style.color = '#006600';
    }
}

function saveEssay() {
    const essayContent = essayTextarea.value;
    
    if (essayContent.trim().length === 0) {
        alert('Cannot save empty essay');
        return;
    }

    const savedEssays = JSON.parse(localStorage.getItem('saved-essays') || '[]');
    const essay = {
        id: Date.now(),
        essayId: currentEssay.id,
        title: currentEssay.title,
        content: essayContent,
        wordCount: wordCount.textContent,
        savedAt: new Date().toLocaleString(),
        status: 'draft'
    };

    savedEssays.push(essay);
    localStorage.setItem('saved-essays', JSON.stringify(savedEssays));
    alert('✓ Essay saved as draft!');
}

function submitEssay() {
    const essayContent = essayTextarea.value;
    const words = parseInt(wordCount.textContent);

    if (words < 500) {
        alert('Please write at least 500 words');
        return;
    }

    clearInterval(timerInterval);

    // Calculate time taken
    const timeTaken = Math.floor((Date.now() - essayStartTime) / 1000);
    const minutesTaken = Math.floor(timeTaken / 60);
    const secondsTaken = timeTaken % 60;

    // Save to history
    const submittedEssays = JSON.parse(localStorage.getItem('submitted-essays') || '[]');
    const submission = {
        id: Date.now(),
        essayId: currentEssay.id,
        title: currentEssay.title,
        content: essayContent,
        wordCount: words,
        submittedAt: new Date().toLocaleString(),
        timeTaken: timeTaken,
        status: 'submitted'
    };

    submittedEssays.push(submission);
    localStorage.setItem('submitted-essays', JSON.stringify(submittedEssays));

    // Show submission screen
    essayWriting.style.display = 'none';
    essaySubmitted.style.display = 'block';
    document.getElementById('final-word-count').textContent = words;
    document.getElementById('final-char-count').textContent = essayContent.length;
    document.getElementById('time-taken').textContent = `${String(minutesTaken).padStart(2, '0')}:${String(secondsTaken).padStart(2, '0')}`;
}

function backToSelection() {
    clearInterval(timerInterval);
    essaySelection.style.display = 'block';
    essayWriting.style.display = 'none';
    essaySubmitted.style.display = 'none';
    loadEssayList();
}

function viewSavedEssays() {
    const savedEssays = JSON.parse(localStorage.getItem('saved-essays') || '[]');
    
    if (savedEssays.length === 0) {
        alert('No saved essays yet');
        return;
    }

    let message = 'Saved Essays:\n\n';
    savedEssays.forEach((essay, index) => {
        message += `${index + 1}. ${essay.title}\n`;
        message += `   Words: ${essay.wordCount} | Saved: ${essay.savedAt}\n\n`;
    });

    alert(message);
    backToSelection();
}
