// Quiz Data for Modbus RTU
const quizData = [
    {
        question: "What is the primary physical layer used by Modbus RTU?",
        options: [
            "Ethernet (TCP/IP)",
            "RS-485 serial communication",
            "USB interface",
            "Wi-Fi wireless"
        ],
        correct: 1,
        explanation: "Modbus RTU primarily uses RS-485 serial communication for its physical layer. RS-485 supports multi-drop networks with up to 32 devices and provides differential signaling for noise immunity."
    },
    {
        question: "What is the maximum number of devices that can be connected on a single RS-485 Modbus RTU network?",
        options: [
            "32 devices",
            "247 devices",
            "255 devices",
            "No limit"
        ],
        correct: 1,
        explanation: "While RS-485 can theoretically support up to 32 devices without repeaters, Modbus RTU supports device addresses from 1-247 (address 0 is reserved for broadcast). With proper network design and repeaters, 247 devices can be addressed on a single network."
    },
    {
        question: "What character format is typically used in Modbus RTU communication?",
        options: [
            "7 data bits, even parity, 1 stop bit",
            "8 data bits, no parity, 1 stop bit",
            "8 data bits, even parity, 1 stop bit",
            "7 data bits, odd parity, 2 stop bits"
        ],
        correct: 2,
        explanation: "The most common Modbus RTU format is 8 data bits, even parity, 1 stop bit (8-E-1). This provides error detection through parity checking while maintaining efficient data transmission."
    },
    {
        question: "What is the purpose of the Silent Interval in Modbus RTU?",
        options: [
            "To save power between transmissions",
            "To separate messages and frames",
            "To allow network diagnostics",
            "To synchronize device clocks"
        ],
        correct: 1,
        explanation: "The Silent Interval (minimum 3.5 character times) is crucial for frame separation in RTU. It indicates the start and end of messages, allowing devices to properly detect message boundaries on the shared serial bus."
    },
    {
        question: "Which error detection method does Modbus RTU use?",
        options: [
            "Checksum calculation",
            "CRC-16 (Cyclic Redundancy Check)",
            "Hamming code",
            "Simple parity check only"
        ],
        correct: 1,
        explanation: "Modbus RTU uses CRC-16 (Cyclic Redundancy Check) for error detection. This provides robust error detection capabilities, capable of detecting most transmission errors including burst errors."
    },
    {
        question: "What happens when a Modbus RTU slave device receives a message with an incorrect CRC?",
        options: [
            "It sends an error response",
            "It ignores the message silently",
            "It requests retransmission",
            "It processes the message anyway"
        ],
        correct: 1,
        explanation: "When a Modbus RTU slave receives a message with an incorrect CRC, it silently ignores the message. This prevents processing of corrupted data and maintains network reliability."
    },
    {
        question: "In Modbus RTU, how is data transmitted?",
        options: [
            "As ASCII characters",
            "As binary (hex) values",
            "As decimal numbers",
            "As BCD (Binary Coded Decimal)"
        ],
        correct: 1,
        explanation: "Modbus RTU transmits data as binary (hexadecimal) values, making it more compact and efficient than ASCII transmission. This reduces bandwidth requirements and transmission time."
    },
    {
        question: "What is the standard baud rate most commonly used for Modbus RTU?",
        options: [
            "9600 bps",
            "19200 bps",
            "38400 bps",
            "115200 bps"
        ],
        correct: 0,
        explanation: "While Modbus RTU can operate at various baud rates, 9600 bps is the most commonly used standard rate. It provides a good balance between speed and reliability over longer cable runs."
    }
];

// Quiz state
let currentQuestion = 0;
let userAnswers = [];
let quizCompleted = false;

// DOM elements
const questionContainer = document.getElementById('questionContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const quizResults = document.getElementById('quizResults');
const scoreDisplay = document.getElementById('scoreDisplay');
const answersReview = document.getElementById('answersReview');
const retakeBtn = document.getElementById('retakeBtn');

// Initialize quiz
function initializeQuiz() {
    currentQuestion = 0;
    userAnswers = Array(quizData.length).fill(null);
    quizCompleted = false;
    
    document.querySelector('.quiz-container').style.display = 'block';
    if (quizResults) {
        quizResults.style.display = 'none';
    }
    
    loadQuestion();
    updateProgress();
    updateButtons();
}

// Load current question
function loadQuestion() {
    const question = quizData[currentQuestion];
    
    questionContainer.innerHTML = `
        <div class="question">
            <h3>Question ${currentQuestion + 1}: ${question.question}</h3>
            <ul class="options">
                ${question.options.map((option, index) => `
                    <li class="option" data-index="${index}">
                        <input type="radio" name="answer" value="${index}" id="option${index}" 
                               ${userAnswers[currentQuestion] === index ? 'checked' : ''}>
                        <label for="option${index}">${option}</label>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
    
    // Add click handlers to options
    const options = questionContainer.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', handleOptionClick);
        
        // If this option was previously selected, add the selected class and show feedback
        const input = option.querySelector('input');
        if (input.checked) {
            option.classList.add('selected');
            showImmediateFeedback(parseInt(option.dataset.index));
        }
    });
}

// Handle option selection
function handleOptionClick(event) {
    const option = event.currentTarget;
    const index = parseInt(option.dataset.index);
    const input = option.querySelector('input');
    
    // Remove selected class from all options
    const allOptions = questionContainer.querySelectorAll('.option');
    allOptions.forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
    });
    
    // Add selected class to clicked option
    option.classList.add('selected');
    input.checked = true;
    
    // Store answer
    userAnswers[currentQuestion] = index;
    
    // Show immediate feedback
    showImmediateFeedback(index);
    
    // Update buttons
    updateButtons();
}

// Show immediate feedback for the selected answer
function showImmediateFeedback(selectedIndex) {
    const question = quizData[currentQuestion];
    const allOptions = questionContainer.querySelectorAll('.option');
    
    // Add feedback classes to all options
    allOptions.forEach((option, index) => {
        if (index === question.correct) {
            option.classList.add('correct');
        } else if (index === selectedIndex && index !== question.correct) {
            option.classList.add('incorrect');
        }
    });
    
    // Show explanation
    const existingExplanation = questionContainer.querySelector('.immediate-feedback');
    if (existingExplanation) {
        existingExplanation.remove();
    }
    
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'immediate-feedback';
    
    const isCorrect = selectedIndex === question.correct;
    feedbackDiv.innerHTML = `
        <div class="feedback-content ${isCorrect ? 'correct-feedback' : 'incorrect-feedback'}">
            <h4>${isCorrect ? '✅ Correct!' : '❌ Incorrect'}</h4>
            <p><strong>Explanation:</strong> ${question.explanation}</p>
            ${!isCorrect ? `<p><strong>Correct answer:</strong> ${question.options[question.correct]}</p>` : ''}
        </div>
    `;
    
    questionContainer.appendChild(feedbackDiv);
    
    // Disable all options after selection
    allOptions.forEach(option => {
        option.style.pointerEvents = 'none';
    });
}

// Update progress bar
function updateProgress() {
    const progress = ((currentQuestion + 1) / quizData.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
}

// Update button states
function updateButtons() {
    prevBtn.disabled = currentQuestion === 0;
    
    if (currentQuestion === quizData.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = userAnswers[currentQuestion] !== null ? 'block' : 'none';
    } else {
        nextBtn.style.display = 'block';
        nextBtn.disabled = userAnswers[currentQuestion] === null;
        submitBtn.style.display = 'none';
    }
}

// Navigate to previous question
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
        updateProgress();
        updateButtons();
    }
}

// Navigate to next question
function nextQuestion() {
    if (currentQuestion < quizData.length - 1 && userAnswers[currentQuestion] !== null) {
        currentQuestion++;
        loadQuestion();
        updateProgress();
        updateButtons();
    }
}

// Submit quiz and show results
function submitQuiz() {
    quizCompleted = true;
    const score = calculateScore();
    
    // Hide quiz container and show results
    document.querySelector('.quiz-container .quiz-progress').style.display = 'none';
    document.querySelector('.quiz-container #questionContainer').style.display = 'none';
    document.querySelector('.quiz-container .quiz-controls').style.display = 'none';
    
    if (quizResults) {
        quizResults.style.display = 'block';
        
        // Display score
        const percentage = Math.round((score / quizData.length) * 100);
        if (scoreDisplay) {
            scoreDisplay.innerHTML = `
                <h3>Quiz Complete! 🎉</h3>
                <div style="font-size: 3rem; font-weight: bold; margin: 1rem 0;">${score}/${quizData.length}</div>
                <div style="font-size: 1.8rem; color: white; margin: 0.5rem 0;">${percentage}%</div>
                <div style="margin-top: 1.5rem; font-size: 1.1rem; background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 8px;">
                    ${getScoreMessage(percentage)}
                </div>
            `;
        }
        
        // Display answer review
        displayAnswerReview();
        
        // Scroll to results
        quizResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Calculate score
function calculateScore() {
    let score = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === quizData[index].correct) {
            score++;
        }
    });
    return score;
}

// Get score message
function getScoreMessage(percentage) {
    if (percentage >= 90) return "Excellent! You have a strong understanding of Modbus RTU.";
    if (percentage >= 70) return "Good job! You have a solid grasp of the basics.";
    if (percentage >= 50) return "Not bad! Consider reviewing the material and trying again.";
    return "Keep studying! Review the sections above and retake the quiz.";
}

// Display detailed answer review
function displayAnswerReview() {
    if (!answersReview) return;
    
    answersReview.innerHTML = '<h4>📋 Detailed Answer Review:</h4>';
    
    quizData.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correct;
        
        const answerItem = document.createElement('div');
        answerItem.className = `answer-item ${isCorrect ? 'correct' : 'incorrect'}`;
        
        answerItem.innerHTML = `
            <div class="question-header">
                <span class="question-number">Q${index + 1}</span>
                <span class="result-icon">${isCorrect ? '✅' : '❌'}</span>
            </div>
            <div class="question-content">
                <p class="question-text"><strong>${question.question}</strong></p>
                <div class="answer-details">
                    <div class="answer-line">
                        <strong>Your answer:</strong> 
                        <span class="user-answer ${isCorrect ? 'correct-answer' : 'incorrect-answer'}">
                            ${userAnswer !== null ? question.options[userAnswer] : 'Not answered'}
                        </span>
                    </div>
                    ${!isCorrect ? `
                    <div class="answer-line">
                        <strong>Correct answer:</strong> 
                        <span class="correct-answer">${question.options[question.correct]}</span>
                    </div>
                    ` : ''}
                    <div class="explanation">
                        <strong>Explanation:</strong> ${question.explanation}
                    </div>
                </div>
            </div>
        `;
        
        answersReview.appendChild(answerItem);
    });
}

// Retake quiz
function retakeQuiz() {
    // Reset quiz results display
    document.querySelector('.quiz-container .quiz-progress').style.display = 'block';
    document.querySelector('.quiz-container #questionContainer').style.display = 'block';
    document.querySelector('.quiz-container .quiz-controls').style.display = 'flex';
    if (quizResults) {
        quizResults.style.display = 'none';
    }
    
    initializeQuiz();
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section.id;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeQuiz();
    initializeSmoothScrolling();
    
    // Set up scroll listener for active nav updates
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call
    
    // Set up retake button
    if (retakeBtn) {
        retakeBtn.addEventListener('click', retakeQuiz);
    }
});

// Navigate to TCP page
function navigateToTCP(event) {
    event.preventDefault();
    try {
        window.location.href = '../modbus-tcp/modbus-tcp-index.html';
    } catch (error) {
        // Fallback for file:// protocol
        window.open('../modbus-tcp/modbus-tcp-index.html', '_blank');
    }
}
