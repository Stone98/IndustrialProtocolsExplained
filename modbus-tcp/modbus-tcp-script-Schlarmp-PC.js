// Quiz data
const quizData = [
    {
        question: "What is the default port number for Modbus TCP communication?",
        options: [
            "80",
            "502",
            "443",
            "23"
        ],
        correct: 1,
        explanation: "Modbus TCP uses port 502 as the default communication port."
    },
    {
        question: "Which of the following is NOT a primary data type in Modbus?",
        options: [
            "Coils",
            "Discrete Inputs",
            "Holding Registers",
            "String Registers"
        ],
        correct: 3,
        explanation: "The four primary Modbus data types are: Coils, Discrete Inputs, Input Registers, and Holding Registers."
    },
    {
        question: "What function code is used to read holding registers?",
        options: [
            "01",
            "02",
            "03",
            "04"
        ],
        correct: 2,
        explanation: "Function code 03 is used to read holding registers, while 04 reads input registers."
    },
    {
        question: "In Modbus TCP, what does ADU stand for?",
        options: [
            "Application Data Unit",
            "Automatic Data Upload",
            "Advanced Data Usage",
            "Application Device Unit"
        ],
        correct: 0,
        explanation: "ADU stands for Application Data Unit, which is the complete Modbus TCP message format."
    },
    {
        question: "Which communication model does Modbus TCP follow?",
        options: [
            "Peer-to-peer",
            "Client-Server (Master-Slave)",
            "Broadcast only",
            "Mesh network"
        ],
        correct: 1,
        explanation: "Modbus TCP follows a client-server model, where the client initiates requests and the server responds."
    },
    {
        question: "What is the size of a Modbus register?",
        options: [
            "8 bits",
            "16 bits",
            "32 bits",
            "64 bits"
        ],
        correct: 1,
        explanation: "Modbus registers are 16-bit (2 bytes) values."
    },
    {
        question: "Which data type in Modbus is read-only and typically represents digital inputs?",
        options: [
            "Coils",
            "Discrete Inputs",
            "Holding Registers",
            "Input Registers"
        ],
        correct: 1,
        explanation: "Discrete Inputs are read-only 1-bit values typically representing digital input signals."
    },
    {
        question: "What is the Protocol ID field value in a Modbus TCP message?",
        options: [
            "0x0001",
            "0x0000",
            "0xFFFF",
            "0x0502"
        ],
        correct: 1,
        explanation: "The Protocol ID field in Modbus TCP is always 0x0000 to identify it as a Modbus protocol."
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
    quizResults.style.display = 'none';
    
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
    quizResults.style.display = 'block';
    
    // Display score
    const percentage = Math.round((score / quizData.length) * 100);
    scoreDisplay.innerHTML = `
        <h3>Quiz Complete! 🎉</h3>
        <div style="font-size: 3rem; font-weight: bold; margin: 1rem 0;">${score}/${quizData.length}</div>
        <div style="font-size: 1.8rem; color: white; margin: 0.5rem 0;">${percentage}%</div>
        <div style="margin-top: 1.5rem; font-size: 1.1rem; background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 8px;">
            ${getScoreMessage(percentage)}
        </div>
    `;
    
    // Display answer review
    displayAnswerReview();
    
    // Scroll to results
    quizResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    if (percentage >= 90) return "Excellent! You have a strong understanding of Modbus TCP.";
    if (percentage >= 70) return "Good job! You have a solid grasp of the basics.";
    if (percentage >= 50) return "Not bad! Consider reviewing the material and trying again.";
    return "Keep studying! Review the sections above and retake the quiz.";
}

// Display detailed answer review
function displayAnswerReview() {
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
    quizResults.style.display = 'none';
    
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

// Highlight active navigation link
function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Add animation to elements when they come into view
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    const animatedElements = document.querySelectorAll('.function-card, .example-card, .step, .practice, .data-type, .consideration, .term-card, .addressing-card, .format-card, .challenge-card, .practice-item, .device, .practical-example');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize quiz
    initializeQuiz();
    
    // Quiz navigation
    prevBtn.addEventListener('click', previousQuestion);
    nextBtn.addEventListener('click', nextQuestion);
    submitBtn.addEventListener('click', submitQuiz);
    retakeBtn.addEventListener('click', retakeQuiz);
    
    // Initialize other features
    initializeSmoothScrolling();
    updateActiveNavLink();
    initializeScrollAnimations();
    
    // Add some interactivity to the Modbus diagram
    const modbusBoxes = document.querySelectorAll('.client-box, .server-box');
    modbusBoxes.forEach(box => {
        box.addEventListener('mouseenter', () => {
            box.style.transform = 'scale(1.05)';
            box.style.transition = 'transform 0.3s ease';
        });
        
        box.addEventListener('mouseleave', () => {
            box.style.transform = 'scale(1)';
        });
    });
});

// Add CSS for active nav link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #3498db !important;
        position: relative;
    }
    
    .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 2px;
        background: #3498db;
    }
`;
document.head.appendChild(style);

// Navigate to RTU page
function navigateToRTU(event) {
    event.preventDefault();
    try {
        window.location.href = '../modbus-rtu/modbus-rtu-index.html';
    } catch (error) {
        // Fallback for file:// protocol
        window.open('../modbus-rtu/modbus-rtu-index.html', '_blank');
    }
}
