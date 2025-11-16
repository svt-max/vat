// --- APPLICATION STATE ---
const state = {
    currentView: 'role-selection-view', // Default app view
    user: {
        id: null,
        name: '',
        email: '',
        // New onboarding data
        onboarding: {
            mentorOrMentee: null, // 'mentor', 'mentee', or 'both'
            menteeGoals: [],
            mentorFocus: [],
            availability: '',
            formats: [],
            cultureAnswers: []
        }
    },
    // Personality Test
    questions: [],
    scales: [],
    currentQuestionIndex: 0,
    answers: [],
    
    // Personality Results & Matches
    personalityResults: {
        scores: {},
        remoteFit: 0,
        topTrait: { name: '', description: '' }
    },
    matches: {
        projects: [],
        mentors: [],
        mentees: []
    },
    
    // Company Flow
    company: {
        id: null,
        name: '',
        cultureTestId: null,
        cultureAnswers: []
    },
    currentProject: {
        type: '',
        count: 1,
        structure: 'individual'
    },
    projectMatches: {
        talent: [],
        teams: []
    },
    
    // Comparison View
    comparison: {
        user1: { name: '', scores: {} },
        user2: { name: '', scores: {} },
        teamsight: { convergent: {}, divergent: {} },
        analysis: {}
    },
    
    // Transient app data (e.g., for assessments)
    appData: {
        currentOnboardingFlow: 'freelancer', // 'freelancer' or 'company'
        cultureQuestions: [], // TDL Culture Test questions
        currentCultureCategoryIndex: 0
    },

    previousView: 'role-selection-view' // To store where to go back to
};

// --- MOCK API DATA (Based on TDL API Docs & Comparison PDF) ---
const MOCK_API = {
    // ... (Original MOCK_API functions: getQuestions, getScales, sendAnswers, createUser, getInsightsAndMatches, createCompany, findTalentForProject, getComparison) ...
    // [Omitting original mock functions for brevity, they are unchanged]
    // Simulated GET /api/headless/personality/questions
    getQuestions: async () => {
        // console.log('SIMULATING: GET /api/headless/personality/questions');
        await new Promise(res => setTimeout(res, 300));
        return {
            success: true,
            data: [
                { id: 1, text: "I am the life of the party." },
                { id: 2, text: "I am always prepared." },
                { id: 3, text: "I get stressed out easily." },
                { id: 4, text: "I have a rich vocabulary." },
                { id: 5, text: "I feel little concern for others." },
                { id: 6, text: "I am relaxed most of the time." },
                { id: 7, text: "I pay attention to details." },
            ]
        };
    },
    // Simulated GET /api/headless/personality/scales
    getScales: async () => {
        // console.log('SIMULATING: GET /api/headless/personality/scales');
        await new Promise(res => setTimeout(res, 300));
        return {
            success: true,
            data: [
                { id: 1, title: "Completely Disagree" },
                { id: 2, title: "Disagree" },
                { id: 3, title: "Neutral" },
                { id: 4, title: "Agree" },
                { id: 5, title: "Completely Agree" }
            ]
        };
    },
    // Simulated POST /api/headless/personality/answers
    sendAnswers: async (subject_id, answers) => {
        console.log('SIMULATING: POST /api/headless/personality/answers', { subject_id, answers });
        await new Promise(res => setTimeout(res, 1000));
        return {
            success: true,
            data: { message: "Answers saved!" }
        };
    },
    // Simulated POST /api/headless/subject
    createUser: async (name, email) => {
        console.log('SIMULATING: POST /api/headless/subject', { first_name: name, last_name: '', email });
        await new Promise(res => setTimeout(res, 500)); // Simulate network delay
        const userId = Math.floor(Math.random() * 1000) + 1;
        return {
            success: true,
            data: {
                id: userId,
                name: name,
                test_types: [{ id: 1, name: "Personality Test", status: "New candidate", completed: 0 }]
            }
        };
    },
    // Simulated GET /api/headless/personality/results/:subjectId
    getInsightsAndMatches: async (subject_id) => {
        console.log('SIMULATING: GET /api/headless/personality/results/', subject_id);
        await new Promise(res => setTimeout(res, 2000)); // Simulate analysis delay
        const personalityData = {
            scores: {
                'Emotional Stability': Math.floor(Math.random() * 40) + 30, 'Agreeableness': Math.floor(Math.random() * 40) + 50, 'Conscientiousness': Math.floor(Math.random() * 40) + 40, 'Extraversion': Math.floor(Math.random() * 40) + 20, 'Openness': Math.floor(Math.random() * 30) + 70,
            }, remoteFit: Math.floor(Math.random() * 10) + 85, topTrait: { name: 'Openness', description: 'You have a vivid imagination and are curious about new ideas and experiences.' }
        };
        const matchData = {
            projects: [{ id: 1, title: "Global E-commerce Platform", role: "UX Lead", match: 92 }, { id: 2, title: "AI-Driven Marketing Strategy", role: "Project Manager", match: 85 }],
            mentors: [{ id: 101, name: "Dr. Elena Rodriguez", title: "Principal UX Designer", fitScore: 95.8 }, { id: 102, name: "Marcus Cole", title: "Senior Strategist", fitScore: 88.2 }],
            mentees: [{ id: 201, name: "Jia Li", title: "Junior Product Designer", fitScore: 91.5 }, { id: 202, name: "Sam O'Connell", title: "Aspiring Strategist", fitScore: 84.0 }]
        };
        return { success: true, data: { personalityResults: personalityData, matches: matchData } };
    },
    // Simulated POST for company login
    createCompany: async (name, email) => {
        console.log('SIMULATING: Company Login', { name, email });
        await new Promise(res => setTimeout(res, 500));
        const companyId = Math.floor(Math.random() * 1000) + 1;
        return {
            success: true,
            data: { id: companyId, name: name }
        };
    },
    // Simulated GET for project matches
    findTalentForProject: async (project) => {
        console.log('SIMULATING: Finding talent for project', project);
        await new Promise(res => setTimeout(res, 2000));
        const talent = [
            { id: 301, name: "Alex Johnson", title: "Senior UX Designer", fitScore: 94.2 }, { id: 302, name: "Maria Garcia", title: "Lead Data Scientist", fitScore: 91.5 }, { id: 101, name: "Dr. Elena Rodriguez", title: "Principal UX Designer", fitScore: 89.8 }, { id: 303, name: "Kenji Watanabe", title: "Full-Stack Developer", fitScore: 88.0 }, { id: 102, name: "Marcus Cole", title: "Senior Strategist", fitScore: 85.1 }
        ];
        let teams = [];
        if (project.structure === 'team') {
            teams = [{ id: 501, name: `Project "${project.type.split(' ')[0]}" Team`, teamFit: 92.5, members: [talent[0], talent[3], talent[4]].slice(0, project.count) }];
        }
        return { success: true, data: { talent: talent.slice(0, 5), teams: teams } };
    },
    // Simulated GET /api/headless/personality/interpersonal-fit/:subjectAId/:subjectBId
    getComparison: async (userId, otherUserName) => {
        console.log(`SIMULATING: GET Interpersonal Fit for ${userId} and ${otherUserName}`);
        await new Promise(res => setTimeout(res, 1000));
        const user1Scores = state.personalityResults.scores;
        const user1Name = state.user.name;
        // FIX: user2Name was not defined in the original.
        const user2Name = otherUserName; 
        const user2Scores = {
            'Emotional Stability': Math.floor(Math.random() * 50) + 50, 'Agreeableness': Math.floor(Math.random() * 40) + 60, 'Conscientiousness': Math.floor(Math.random() * 40) + 40, 'Extraversion': Math.floor(Math.random() * 50) + 50, 'Openness': Math.floor(Math.random() * 50) + 20,
        };
        const analysisData = {
            emotionalStability: `Because ${otherUserName} lies in-between the two extremes...`, agreeableness: `Since ${user1Name} and ${otherUserName} are not too far away...`, conscientiousness: `It is likely that together ${user1Name} & ${otherUserName} are able to achieve a good work-life balance...`, extraversion: `If you combine ${user1Name} & ${otherUserName} with one another you are likely to end up with a balanced...`, openness: `Due to the fact that ${otherUserName}'s personality sits in the middle-part...`
        };
        return {
            success: true,
            data: {
                user1: { name: user1Name, scores: user1Scores }, user2: { name: user2Name, scores: user2Scores },
                teamsight: { convergent: { score: 20, description: "Poor Convergent Fit..." }, divergent: { score: 66, description: "Fair Divergent Fit..." } },
                analysis: analysisData
            }
        };
    },

    // --- NEW MOCK API FUNCTIONS for TDL Culture Test ---
    
    // (Freelancer) Simulated GET /api/headless/culture/questions (TDL 3.1)
    getCultureQuestions: async () => {
        console.log('SIMULATING: GET /api/headless/culture/questions');
        await new Promise(res => setTimeout(res, 500));
        return {
            success: true,
            data: [
                {
                    category_id: 1, title: "People and Workplace",
                    questions: [
                        { id: 1, text: "A creative and high-energy work environment" },
                        { id: 2, text: "A friendly work environment" },
                        { id: 3, text: "Working with people from different walks of life" },
                    ]
                },
                {
                    category_id: 2, title: "Values and Mission",
                    questions: [
                        { id: 9, text: "Attractive products and services" },
                        { id: 10, text: "A clear and inspiring mission" },
                        { id: 11, text: "A strong focus on sustainability" },
                    ]
                }
            ]
        };
    },
    // (Freelancer) Simulated POST /api/headless/culture/answers (TDL 3.2)
    sendCultureAnswers: async (subject_id, categories) => {
        console.log('SIMULATING: POST /api/headless/culture/answers', { subject_id, categories });
        await new Promise(res => setTimeout(res, 1000));
        return {
            success: true,
            data: { message: "Answers saved!" }
        };
    },
    // (Company) Simulated POST /api/headless/culture/company (TDL 7.1)
    createCompanyCultureTest: async (companyName) => {
        console.log('SIMULATING: POST /api/headless/culture/company', { name: companyName });
        await new Promise(res => setTimeout(res, 500));
        const testId = Math.floor(Math.random() * 100) + 50;
        return { test_id: testId };
    },
    // (Company) Simulated GET /api/headless/culture/company/categories (TDL 7.2)
    getCompanyCultureCategories: async () => {
        console.log('SIMULATING: GET /api/headless/culture/company/categories');
        await new Promise(res => setTimeout(res, 300));
        return [
            { id: 1, text: "People and Workplace", short_text: "", validation: "required" },
            { id: 2, text: "Values and Mission", short_text: "", validation: "required" }
        ];
    },
    // (Company) Simulated GET /api/headless/culture/company/questions/category/{id} (TDL 7.3)
    getCompanyCultureQuestionsForCategory: async (categoryId) => {
        console.log('SIMULATING: GET /api/headless/culture/company/questions/category/', categoryId);
        await new Promise(res => setTimeout(res, 300));
        const questions = {
            1: [
                { id: 1, text: "A creative and high-energy work environment", category_id: 1 },
                { id: 2, text: "A friendly work environment", category_id: 1 },
                { id: 3, text: "Working with people from different walks of life", category_id: 1 },
            ],
            2: [
                { id: 9, text: "Attractive products and services", category_id: 2 },
                { id: 10, text: "A clear and inspiring mission", category_id: 2 },
                { id: 11, text: "A strong focus on sustainability", category_id: 2 },
            ]
        };
        return questions[categoryId] || [];
    },
    // (Company) Simulated POST /api/headless/culture/company/category/answers (TDL 7.5)
    postCompanyCultureAnswers: async (test_id, category_id, answers) => {
        console.log('SIMULATING: POST /api/headless/culture/company/category/answers', { test_id, category_id, answers });
        await new Promise(res => setTimeout(res, 500));
        return { message: "Answers saved!" };
    }
};

// --- DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {

    // --- NEW SVG ICONS ---
    const personIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 21.75c-2.673 0-5.316-.351-7.812-1.04a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
        </svg>`;
    
    const projectIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a.375.375 0 0 1-.375-.375V6.75A3.75 3.75 0 0 0 10.5 3h-1.875a.375.375 0 0 1-.375-.375V1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clip-rule="evenodd" />
            <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.5a.375.375 0 0 0 .375.375h1.875a5.23 5.23 0 0 1 3.434 1.279.75.75 0 0 0 1.06-1.06A6.73 6.73 0 0 0 16.5 6.75h-1.875a1.875 1.875 0 0 1-1.875-1.875V3.375a6.73 6.73 0 0 0-4.06-1.279.75.75 0 0 0-.27.72Z" />
        </svg>`;
    // --- End SVG ICONS ---

    // --- DOM Elements ---
    const appBody = document.body;
    const landingPage = document.getElementById('landing-page');
    const appContainer = document.getElementById('app-container');
    const getStartedButtons = document.querySelectorAll('.get-started-btn');
    const backToHomeButtons = document.querySelectorAll('.back-to-home');

    const views = document.querySelectorAll('.view');
    const registerForm = document.getElementById('register-form');
    const assessmentForm = document.getElementById('assessment-form');
    const questionText = document.getElementById('question-text');
    const scalesContainer = document.getElementById('scales-container');
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');
    const nextButton = document.getElementById('next-button');
    const answerError = document.getElementById('answer-error');
    
    const resultsHeader = document.getElementById('results-header');
    const projectsList = document.getElementById('projects-list');
    const mentorsList = document.getElementById('mentors-list');
    const menteesList = document.getElementById('mentees-list');

    // Role Selection Elements
    const roleSelectionView = document.getElementById('role-selection-view');
    const roleFreelancerButton = document.getElementById('role-freelancer');
    const roleCompanyButton = document.getElementById('role-company');
    const backToRoleButtons = document.querySelectorAll('.back-to-role'); // Back to role select
    

    // Company Flow Elements
    const companyLoginForm = document.getElementById('company-login-form');
    const projectCreateForm = document.getElementById('project-create-form');
    const companyResultsView = document.getElementById('company-results-view');
    
    const companyResultsHeader = document.getElementById('company-results-header');
    const companyProjectDetails = document.getElementById('company-project-details');
    const teamResultsContainer = document.getElementById('team-results-container');
    const teamList = document.getElementById('team-list');
    const talentList = document.getElementById('talent-list');
    const newProjectButton = document.getElementById('new-project-button');

    // Insights View Elements
    const insightsView = document.getElementById('insights-view');
    const personalityChartCanvas = document.getElementById('personality-chart');
    const remoteFitScore = document.getElementById('remote-fit-score');
    const topTraitName = document.getElementById('top-trait-name');
    const topTraitDesc = document.getElementById('top-trait-desc');
    const seeMatchesButton = document.getElementById('see-matches-button');
    const viewInsightsButton = document.getElementById('view-insights-button');
    let personalityChart = null; // To hold the chart instance

    // Comparison View Elements
    const comparisonView = document.getElementById('comparison-view');
    const comparisonHeader = document.getElementById('comparison-header');
    const comparisonSubheader = document.getElementById('comparison-subheader');
    const comparisonChartCanvas = document.getElementById('comparison-chart');
    const convergentScore = document.getElementById('convergent-score');
    const convergentDesc = document.getElementById('convergent-desc');
    const divergentScore = document.getElementById('divergent-score');
    const divergentDesc = document.getElementById('divergent-desc');
    const traitAnalysisContainer = document.getElementById('trait-analysis-container');
    const backToMatchesButton = document.getElementById('back-to-matches-button');
    let comparisonChart = null; // To hold the comparison chart instance

    // --- NEW DOM Elements (from Views 10-19) ---

    // View 10: Mentor/Mentee Role Selection
    const selectFindMentor = document.getElementById('select-find-mentor');
    const selectBeMentor = document.getElementById('select-be-mentor');
    const selectBothRoles = document.getElementById('select-both-roles');

    // View 11: Mentee Goals
    const menteeGoalsForm = document.getElementById('mentee-goals-form');
    const backToMentorSelectBtns = document.querySelectorAll('.back-to-mentor-select-btn'); // Shared class

    // View 12: Mentor Focus
    const mentorFocusForm = document.getElementById('mentor-focus-form');

    // View 13: Logistics & Availability
    const logisticsForm = document.getElementById('logistics-form');

    // View 14: Work Values Assessment (WVA)
    const wvaProgressText = document.getElementById('wva-progress-text');
    const wvaProgressBar = document.getElementById('wva-progress-bar');
    const wvaCategoryTitle = document.getElementById('wva-category-title');
    const wvaForm = document.getElementById('wva-form');
    const wvaScalesContainer = document.getElementById('wva-scales-container');
    const wvaNextButton = document.getElementById('wva-next-button');

    // View 15: Company Culture Start
    const companyCultureStartForm = document.getElementById('company-culture-start-form');

    // View 16: Dashboard
    const freelancerDashboardContent = document.getElementById('freelancer-dashboard-content');
    const freelancerWelcome = document.getElementById('freelancer-welcome');
    const myMentorCard = document.getElementById('my-mentor-card');
    const myMenteesList = document.getElementById('my-mentees-list');
    const dashboardProjectsList = document.getElementById('dashboard-projects-list');
    const dashboardSeeAllMatchesBtn = document.getElementById('dashboard-see-all-matches-btn');
    const dashboardViewInsightsBtn = document.getElementById('dashboard-view-insights-btn');

    const clientDashboardContent = document.getElementById('client-dashboard-content');
    const clientWelcome = document.getElementById('client-welcome');
    const dashboardPostChallengeBtn = document.getElementById('dashboard-post-challenge-btn');
    const activeChallengesList = document.getElementById('active-challenges-list');
    const dashboardEditCultureBtn = document.getElementById('dashboard-edit-culture-btn');

    // View 17: PM Workspace
    const pmProjectTitle = document.getElementById('pm-project-title');
    const milestoneList = document.getElementById('milestone-list');
    const fileList = document.getElementById('file-list');
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const backToDashboardBtn = document.getElementById('back-to-dashboard-btn');
    const projectCreateBackBtn = document.getElementById('project-create-back-to-dashboard');

    // View 18: Project Review
    const projectReviewForm = document.getElementById('project-review-form');
    const reviewProjectTitle = document.getElementById('review-project-title');
    const clientReviewSection = document.getElementById('client-review-section');
    const reviewFreelancerName = document.getElementById('review-freelancer-name');
    const freelancerReviewSection = document.getElementById('freelancer-review-section');
    const reviewClientName = document.getElementById('review-client-name');
    const reviewComments = document.getElementById('review-comments');
    const submitReviewBtn = document.getElementById('submit-review-btn');

    // View 19: Mentor Feedback
    const mentorFeedbackForm = document.getElementById('mentor-feedback-form');
    const menteeFeedbackSection = document.getElementById('mentee-feedback-section');
    const feedbackMentorName = document.getElementById('feedback-mentor-name');
    const mentorFeedbackSection = document.getElementById('mentor-feedback-section');
    const feedbackMenteeName = document.getElementById('feedback-mentee-name');
    const feedbackComments = document.getElementById('feedback-comments');
    const submitFeedbackBtn = document.getElementById('submit-feedback-btn');
    const skipFeedbackBtn = document.getElementById('skip-feedback-btn');

    // --- NEW: Scroll Animation Logic ---
    const fadeInElements = document.querySelectorAll('.fade-in');
    
    // Check if the Intersection Observer API is supported
    if ("IntersectionObserver" in window) {
        const observerOptions = {
            root: null, // relative to the viewport
            rootMargin: '0px',
            threshold: 0.1 // 10% of the element must be visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add the "is-visible" class to trigger the animation
                    entry.target.classList.add('is-visible');
                    // Stop observing the element once it has faded in
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe each .fade-in element
        fadeInElements.forEach(el => {
            if (el) { // Check if element exists
                observer.observe(el);
            }
        });
    } else {
        // Fallback for older browsers (just show the elements)
        fadeInElements.forEach(el => {
            if (el) {
                el.classList.add('is-visible');
            }
        });
    }
    // --- End of New Scroll Logic ---

    // --- NEW: Landing Page Scroll-Spy Logic ---
    const landingSections = document.querySelectorAll('.landing-section');
    const navLinks = document.querySelectorAll('.nav-link');

    // This observer will watch the landing page sections
    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Check if section is more than 50% visible
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    const id = entry.target.getAttribute('id');
                    // Remove active from all links
                    navLinks.forEach(link => {
                        link.classList.remove('nav-link-active');
                    });
                    
                    // Add active to the corresponding nav link
                    const activeLink = document.querySelector(`#nav-${id}`);
                    if (activeLink) {
                        activeLink.classList.add('nav-link-active');
                    }
                }
            });
        }, { threshold: 0.5 }); // 50% of the section must be visible

        // Observe each landing-section
        landingSections.forEach(section => {
            if (section) {
                sectionObserver.observe(section);
            }
        });
    }
    // --- End of Landing Page Scroll-Spy Logic ---


    // --- VIEW MANAGEMENT ---
    
    function startApp() {
        appBody.classList.add('app-active');
        changeView('role-selection-view');
    }

    function goToLandingPage() {
        appBody.classList.remove('app-active');
        resetAllState();
    }

    function changeView(viewId) {
        if (viewId !== state.previousView) {
            state.previousView = state.currentView;
        }

        views.forEach(view => {
            if (view.id === viewId) {
                view.style.display = (view.id.includes('loading')) ? 'flex' : 'block';
            } else {
                view.style.display = 'none';
            }
        });
        state.currentView = viewId;
        window.scrollTo(0, 0);
    }

    // --- EVENT LISTENERS ---
    
    // Landing Page Listeners
    getStartedButtons.forEach(btn => btn.addEventListener('click', startApp));
    backToHomeButtons.forEach(btn => btn.addEventListener('click', goToLandingPage));

    // App Listeners
    registerForm.addEventListener('submit', handleRegistration);
    assessmentForm.addEventListener('submit', handleAnswerSubmit); // Personality Test

    // Role Selection Listeners
    roleFreelancerButton.addEventListener('click', () => handleRoleSelection('freelancer'));
    roleCompanyButton.addEventListener('click', () => handleRoleSelection('company'));
    backToRoleButtons.forEach(btn => btn.addEventListener('click', () => changeView('role-selection-view')));

    // Company Flow Listeners
    companyLoginForm.addEventListener('submit', handleCompanyLogin);
    projectCreateForm.addEventListener('submit', handleProjectCreate);
    newProjectButton.addEventListener('click', handleCreateNewProject);
// --- NEW Project Wizard Navigation ---
    const wizardButtons = document.querySelectorAll('.wizard-nav-btn');
    const wizardSteps = document.querySelectorAll('.wizard-step');
    const wizardIndicators = document.querySelectorAll('.wizard-step-indicator');

    function showWizardStep(stepNumber) {
        wizardSteps.forEach(step => {
            step.classList.toggle('active', step.dataset.step == stepNumber);
        });
        wizardIndicators.forEach(indicator => {
            indicator.classList.toggle('active', indicator.dataset.stepIndicator <= stepNumber);
        });
    }

    wizardButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const nextStep = e.target.dataset.next;
            const backStep = e.target.dataset.back;
            
            if (nextStep) {
                // Basic validation for step 1
                if (nextStep == "2") {
                    const projectType = document.getElementById('project-type').value;
                    if (!projectType) {
                        alert("Please describe your project goal.");
                        return;
                    }
                }
                showWizardStep(nextStep);
            } else if (backStep) {
                showWizardStep(backStep);
            }
        });
    });

    // Insights & Results Listeners
    seeMatchesButton.addEventListener('click', () => {
        renderResults();
        changeView('results-view');
    });
    viewInsightsButton.addEventListener('click', () => changeView('insights-view'));

    // Comparison View Listeners
    backToMatchesButton.addEventListener('click', () => changeView(state.previousView));

    // --- NEW EVENT LISTENERS (Views 10-19) ---

    // View 10: Mentor/Mentee Role Selection
    selectFindMentor.addEventListener('click', () => handleMentorSelect('mentee'));
    selectBeMentor.addEventListener('click', () => handleMentorSelect('mentor'));
    selectBothRoles.addEventListener('click', () => handleMentorSelect('both'));

    // View 11: Mentee Goals
    menteeGoalsForm.addEventListener('submit', handleMenteeGoalsSubmit);
    backToMentorSelectBtns.forEach(btn => {
        btn.addEventListener('click', () => changeView('mentor-mentee-select-view'));
    });

    // View 12: Mentor Focus
    mentorFocusForm.addEventListener('submit', handleMentorFocusSubmit);

    // View 13: Logistics
    logisticsForm.addEventListener('submit', handleLogisticsSubmit);

    // View 14: Work Values Assessment (Shared by Freelancer & Company)
    wvaForm.addEventListener('submit', handleWvaSubmit);

    // View 15: Company Culture Start
    companyCultureStartForm.addEventListener('submit', handleCompanyCultureStart);

    // View 16: Dashboard
    dashboardSeeAllMatchesBtn.addEventListener('click', () => {
        renderResults();
        changeView('results-view');
    });
    dashboardViewInsightsBtn.addEventListener('click', () => changeView('insights-view'));
    dashboardPostChallengeBtn.addEventListener('click', () => changeView('project-create-view'));
    dashboardEditCultureBtn.addEventListener('click', handleCompanyCultureStart); // Re-take test
    backToDashboardBtn.addEventListener('click', () => changeView('dashboard-view'));
projectCreateBackBtn.addEventListener('click', () => changeView('dashboard-view'));

    // View 17: PM Workspace
    chatForm.addEventListener('submit', handleChatSubmit);

    // View 18: Project Review
    projectReviewForm.addEventListener('submit', handleReviewSubmit);

    // View 19: Mentor Feedback
    mentorFeedbackForm.addEventListener('submit', handleFeedbackSubmit);
// ... (rest of your listeners) ...
    skipFeedbackBtn.addEventListener('click', () => changeView('dashboard-view'));

    // View 20: Project Health Check-in
    projectHealthForm.addEventListener('submit', handleHealthCheckSubmit);
    if (skipHealthCheckBtn) {
        skipHealthCheckBtn.addEventListener('click', closeHealthCheckModal);
    }
    
    // Temp Test Button Listener
    document.getElementById('temp-health-check-trigger').addEventListener('click', showProjectHealthCheckModal);
    
    // Add click listener for the 5-star rating buttons
    healthCheckRatingButtons.addEventListener('click', (e) => {
        if (e.target.classList.contains('health-rating-btn')) {
            // Remove 'selected' from all buttons
            healthCheckRatingButtons.querySelectorAll('.health-rating-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            // Add 'selected' to the clicked button
            e.target.classList.add('selected');
            // Update the hidden input
            healthCheckFitRatingInput.value = e.target.dataset.value;
        }
    });


    // --- LOGIC ---

    function resetAllState() {
        // Reset freelancer state
        state.user = { 
            id: null, name: '', email: '',
            onboarding: { mentorOrMentee: null, menteeGoals: [], mentorFocus: [], availability: '', formats: [], cultureAnswers: [] }
        };
        state.currentQuestionIndex = 0;
        state.answers = [];
        state.personalityResults = {};
        state.matches = { projects: [], mentors: [], mentees: [] };
        
        // Reset company state
        state.company = { id: null, name: '', cultureTestId: null, cultureAnswers: [] };
        state.currentProject = { type: '', count: 1, structure: 'individual' };
        state.projectMatches = { talent: [], teams: [] };
        
        // Reset app data
        state.appData = {
            currentOnboardingFlow: 'freelancer', cultureQuestions: [], currentCultureCategoryIndex: 0
        };

        // Clear forms
        registerForm.reset();
        companyLoginForm.reset();
        projectCreateForm.reset();
        menteeGoalsForm.reset();
        mentorFocusForm.reset();
        logisticsForm.reset();
        
        // Destroy charts
        if (personalityChart) personalityChart.destroy();
        if (comparisonChart) comparisonChart.destroy();
        personalityChart = null;
        comparisonChart = null;
    }


    // Handle Role Selection
    function handleRoleSelection(role) {
        if (role === 'freelancer') {
            changeView('register-view');
        } else if (role === 'company') {
            changeView('company-login-view');
        }
    }

    // --- Freelancer Onboarding Flow ---

    // Step 1: Handle User Registration
    async function handleRegistration(e) {
        e.preventDefault();
        changeView('loading-view');
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        const response = await MOCK_API.createUser(name, email);
        if (response.success) {
            state.user = { ...state.user, ...response.data };
            // START of new onboarding flow
            changeView('mentor-mentee-select-view');
        } else {
            alert("Registration failed. Please try again.");
            changeView('register-view');
        }
    }

    // Step 2: Handle Mentor/Mentee Selection
    function handleMentorSelect(role) {
        state.user.onboarding.mentorOrMentee = role;
        if (role === 'mentee') {
            changeView('mentee-goals-view');
        } else if (role === 'mentor') {
            changeView('mentor-focus-view');
        } else if (role === 'both') {
            changeView('mentee-goals-view'); // Start with mentee goals first
        }
    }

    // Step 3: Handle Mentee Goals
    function handleMenteeGoalsSubmit(e) {
        e.preventDefault();
        const goals = Array.from(menteeGoalsForm.querySelectorAll('input[name="mentee-goal"]:checked'))
                           .map(cb => cb.value);
        state.user.onboarding.menteeGoals = goals;
        
        if (state.user.onboarding.mentorOrMentee === 'both') {
            changeView('mentor-focus-view'); // Go to mentor form next
        } else {
            changeView('logistics-availability-view'); // Skip to logistics
        }
    }

    // Step 4: Handle Mentor Focus
    function handleMentorFocusSubmit(e) {
        e.preventDefault();
        const focus = Array.from(mentorFocusForm.querySelectorAll('input[name="mentor-focus"]:checked'))
                           .map(cb => cb.value);
        state.user.onboarding.mentorFocus = focus;
        changeView('logistics-availability-view'); // Go to logistics
    }

    // Step 5: Handle Logistics
    function handleLogisticsSubmit(e) {
        e.preventDefault();
        const availability = logisticsForm.querySelector('input[name="availability"]:checked').value;
        const formats = Array.from(logisticsForm.querySelectorAll('input[name="format"]:checked'))
                               .map(cb => cb.value);
        state.user.onboarding.availability = availability;
        state.user.onboarding.formats = formats;

        // Mentorship onboarding complete. Start Work Values (Culture) onboarding.
        loadCultureAssessment('freelancer');
    }

    // Step 6: Load Work Values (Culture) Assessment (Shared Function)
    async function loadCultureAssessment(flow) {
        changeView('loading-view');
        state.appData.currentOnboardingFlow = flow; // 'freelancer' or 'company'
        
        let questionsData;
        if (flow === 'freelancer') {
            const res = await MOCK_API.getCultureQuestions();
            if (res.success) questionsData = res.data;
        } else {
            // For company, fetch categories then questions for each
            const categories = await MOCK_API.getCompanyCultureCategories();
            questionsData = [];
            for (const category of categories) {
                const questions = await MOCK_API.getCompanyCultureQuestionsForCategory(category.id);
                questionsData.push({
                    category_id: category.id,
                    title: category.text,
                    questions: questions
                });
            }
        }

        if (questionsData && questionsData.length > 0) {
            state.appData.cultureQuestions = questionsData;
            state.appData.currentCultureCategoryIndex = 0;
            renderCultureCategory();
            changeView('work-values-assessment-view');
        } else {
            alert("Failed to load culture assessment.");
            changeView(state.previousView);
        }
    }

    // Step 7: Render Current Culture Category
    function renderCultureCategory() {
        const category = state.appData.cultureQuestions[state.appData.currentCultureCategoryIndex];
        wvaCategoryTitle.textContent = category.title;

        // Update progress
        const progress = ((state.appData.currentCultureCategoryIndex + 1) / state.appData.cultureQuestions.length) * 100;
        wvaProgressText.textContent = `Category ${state.appData.currentCultureCategoryIndex + 1} of ${state.appData.cultureQuestions.length}`;
        wvaProgressBar.style.width = `${progress}%`;

        // Render questions
        wvaScalesContainer.innerHTML = '';
        category.questions.forEach(q => {
            const div = document.createElement('div');
            div.className = 'wva-question py-2';
            div.innerHTML = `
                <label for="wva-q-${q.id}" class="block text-lg font-medium text-gray-700 mb-3">${q.text}</label>
                <div class="flex items-center space-x-4">
                    <span class="text-sm text-gray-500">Not Important</span>
                    <input type="range" id="wva-q-${q.id}" data-question-id="${q.id}" min="0" max="100" value="50" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                    <span class="text-sm text-gray-500">Very Important</span>
                </div>
            `;
            wvaScalesContainer.appendChild(div);
        });

        // Update button text
        if (state.appData.currentCultureCategoryIndex === state.appData.cultureQuestions.length - 1) {
            wvaNextButton.textContent = "Submit & Continue";
        } else {
            wvaNextButton.textContent = "Next Category";
        }
    }

    // Step 8: Handle Work Values (Culture) Submission
    async function handleWvaSubmit(e) {
        e.preventDefault();
        
        // Save answers for current category
        const sliders = wvaForm.querySelectorAll('input[type="range"]');
        const answers = Array.from(sliders).map(slider => ({
            question_id: parseInt(slider.dataset.questionId, 10),
            value: parseInt(slider.value, 10)
        }));
        const category_id = state.appData.cultureQuestions[state.appData.currentCultureCategoryIndex].category_id;

        // Store based on flow
        if (state.appData.currentOnboardingFlow === 'freelancer') {
            state.user.onboarding.cultureAnswers.push({ category_id, answers });
        } else {
            state.company.cultureAnswers.push({ category_id, answers });
        }
        
        // Check if assessment is complete
        if (state.appData.currentCultureCategoryIndex < state.appData.cultureQuestions.length - 1) {
            // Next category
            state.appData.currentCultureCategoryIndex++;
            renderCultureCategory();
        } else {
            // Assessment is finished
            changeView('loading-view');
            
            if (state.appData.currentOnboardingFlow === 'freelancer') {
                // Freelancer flow: send answers, then start *personality* test
                await MOCK_API.sendCultureAnswers(state.user.id, state.user.onboarding.cultureAnswers);
                console.log("Freelancer culture test complete. Starting personality test.");
                await loadAssessment(); // This is the original personality test
            } else {
                // Company flow: send answers, then go to dashboard
                for (const cat of state.company.cultureAnswers) {
                    await MOCK_API.postCompanyCultureAnswers(state.company.cultureTestId, cat.category_id, cat.answers);
                }
                console.log("Company culture profile complete. Go to dashboard.");
                renderClientDashboard();
                changeView('dashboard-view');
            }
        }
    }


    // Step 9: Load Personality Assessment (Original function)
    async function loadAssessment() {
        // This is now step 9 of onboarding
        const [questionsRes, scalesRes] = await Promise.all([
            MOCK_API.getQuestions(),
            MOCK_API.getScales()
        ]);

        if (questionsRes.success && scalesRes.success) {
            state.questions = questionsRes.data;
            state.scales = scalesRes.data;
            state.currentQuestionIndex = 0;
            state.answers = [];
            renderQuestion();
            changeView('assessment-view');
        } else {
            alert("Failed to load personality assessment. Please try again.");
            changeView(state.previousView);
        }
    }

    // Step 10: Render Personality Question (Original function)
    function renderQuestion() {
        const question = state.questions[state.currentQuestionIndex];
        questionText.textContent = question.text;
        const progress = ((state.currentQuestionIndex + 1) / state.questions.length) * 100;
        progressText.textContent = `Question ${state.currentQuestionIndex + 1} of ${state.questions.length}`;
        progressBar.style.width = `${progress}%`;
        scalesContainer.innerHTML = '';
        state.scales.forEach(scale => {
            const label = document.createElement('label');
            label.className = "flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition";
            label.innerHTML = `
                <input type="radio" name="answer" value="${scale.id}" class="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500" required>
                <span class="ml-4 text-gray-700 text-lg">${scale.title}</span>
            `;
            scalesContainer.appendChild(label);
        });
        nextButton.textContent = (state.currentQuestionIndex === state.questions.length - 1) ? "Submit & See Results" : "Next";
    }

    // Step 11: Handle Personality Answer Submission (Original function, MODIFIED)
    async function handleAnswerSubmit(e) {
        e.preventDefault();
        const selected = document.querySelector('input[name="answer"]:checked');
        
        if (!selected) {
            answerError.style.display = 'block';
            return;
        }
        answerError.style.display = 'none';

        state.answers.push({
            question_id: state.questions[state.currentQuestionIndex].id,
            scale_id: parseInt(selected.value)
        });

        if (state.currentQuestionIndex < state.questions.length - 1) {
            state.currentQuestionIndex++;
            renderQuestion();
        } else {
            // *** ENTIRE ONBOARDING IS FINISHED ***
            changeView('loading-view');
            await MOCK_API.sendAnswers(state.user.id, state.answers);
            const insightsRes = await MOCK_API.getInsightsAndMatches(state.user.id);
            if (insightsRes.success) {
                state.matches = insightsRes.data.matches;
                state.personalityResults = insightsRes.data.personalityResults;
                
                // NEW: Go to Dashboard instead of Insights
                renderFreelancerDashboard();
                changeView('dashboard-view');
            } else {
                alert("Failed to get results.");
                changeView('assessment-view');
            }
        }
    }

    // --- Dashboard Rendering ---

    function renderFreelancerDashboard() {
        clientDashboardContent.style.display = 'none';
        freelancerDashboardContent.style.display = 'block';

        freelancerWelcome.textContent = `Welcome, ${state.user.name}!`;
        
        // Mock render dashboard lists (in a real app, you'd fetch this)
// --- NEW Mentee List Render ---
        myMenteesList.innerHTML = ''; // Clear it
        state.matches.mentees.forEach(mentee => {
           const li = document.createElement('li');
            li.innerHTML = `
                <button data-name="${mentee.name}" class="comparison-button match-card">
                    <div class="match-card-icon person">${personIcon}</div>
                    <div class="match-card-content">
                        <p class="match-card-title">${mentee.name}</p>
                        <p class="match-card-subtitle">${mentee.title}</p>
                    </div>
                    <div class="match-card-score">
                        <span class="score-value">${mentee.fitScore.toFixed(1)}%</span>
                        <span class="score-label">Fit Score</span>
                    </div>
                </button>`;
            myMenteesList.appendChild(li);
        });
        // Re-add event listeners for these new buttons
        myMenteesList.querySelectorAll('.comparison-button').forEach(button => {
            button.addEventListener('click', () => handleShowComparison(button.dataset.name));
        });

        // --- NEW Dashboard Project List Render ---
        dashboardProjectsList.innerHTML = ''; // Clear it first
        state.matches.projects.slice(0, 2).forEach(p => { // Show top 2
            const li = document.createElement('li');
            li.innerHTML = `
                <button class="match-card">
                    <div class="match-card-icon project">${projectIcon}</div>
                    <div class="match-card-content">
                        <p class="match-card-title">${p.title}</p>
                        <p class="match-card-subtitle">${p.role}</p>
                    </div>
                    <div class="match-card-score">
                        <span class="score-value">${p.match}%</span>
                        <span class="score-label">Match</span>
                    </div>
                </button>
            `;
            dashboardProjectsList.appendChild(li);
        });
    }

    function renderClientDashboard() {
        freelancerDashboardContent.style.display = 'none';
        clientDashboardContent.style.display = 'block';

        clientWelcome.textContent = `${state.company.name} Dashboard`;
        
        // Mock render active challenges (in real app, you'd fetch this)
// Mock render active challenges (in real app, you'd fetch this)
        activeChallengesList.innerHTML = ''; // Clear it
        // Mock data
        const challenges = [
            { id: 1, title: "Global E-commerce Platform", teamFit: 92.5, team: "Alex Johnson, Kenji Watanabe" }
        ];

        challenges.forEach(challenge => {
            const li = document.createElement('li');
            li.innerHTML = `
                <button class="match-card" data-project-id="${challenge.id}">
                    <div class="match-card-icon project">${projectIcon}</div>
                    <div class="match-card-content">
                        <p class="match-card-title">${challenge.title}</p>
                        <p class="match-card-subtitle"><strong>Team:</strong> ${challenge.team}</p>
                    </div>
                    <div class="match-card-score">
                        <span class="score-value">${challenge.teamFit}%</span>
                        <span class="score-label">Team Fit</span>
                    </div>
                </button>
            `;
            // Add click listener to go to workspace
            li.querySelector('button').addEventListener('click', () => {
                // In a real app, you'd load the project data here
                document.getElementById('pm-project-title').textContent = challenge.title;
                changeView('pm-workspace-view');
            });
            activeChallengesList.appendChild(li);
        });
    }

    // --- Personal Insights & Results (Original Functions) ---

    function renderInsightsReport() {
        const { scores, remoteFit, topTrait } = state.personalityResults;
        remoteFitScore.textContent = `${remoteFit}%`;
        topTraitName.textContent = topTrait.name;
        topTraitDesc.textContent = topTrait.description;

        const chartData = {
            labels: Object.keys(scores),
            datasets: [{
                label: 'Your Profile', data: Object.values(scores), fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: 'rgb(59, 130, 246)',
                pointBackgroundColor: 'rgb(59, 130, 246)', pointBorderColor: '#fff',
            }]
        };
        const chartOptions = {
            scales: { r: { angleLines: { display: false }, suggestedMin: 0, suggestedMax: 100, pointLabels: { font: { size: 14 } } } },
            plugins: { legend: { display: false } }
        };
        if (personalityChart) personalityChart.destroy();
        personalityChart = new Chart(personalityChartCanvas, { type: 'radar', data: chartData, options: chartOptions });
    }

function renderResults() {
        resultsHeader.textContent = `Welcome, ${state.user.name}!`;
        projectsList.innerHTML = '';
        mentorsList.innerHTML = '';
        menteesList.innerHTML = '';

        // --- NEW Project List Render ---
        state.matches.projects.forEach(project => {
            const li = document.createElement('li');
            // We make the <li> the card itself, but use a <button> inside for accessibility
            li.innerHTML = `
                <button class="match-card">
                    <div class="match-card-icon project">${projectIcon}</div>
                    <div class="match-card-content">
                        <p class="match-card-title">${project.title}</p>
                        <p class="match-card-subtitle">${project.role}</p>
                    </div>
                    <div class="match-card-score">
                        <span class="score-value">${project.match}%</span>
                        <span class="score-label">Match</span>
                    </div>
                </button>`;
            projectsList.appendChild(li);
        });
        
        // --- NEW Mentor List Render ---
        state.matches.mentors.forEach(mentor => {
            const li = document.createElement('li');
            li.innerHTML = `
                <button data-name="${mentor.name}" class="comparison-button match-card">
                    <div class="match-card-icon person">${personIcon}</div>
                    <div class="match-card-content">
                        <p class="match-card-title">${mentor.name}</p>
                        <p class="match-card-subtitle">${mentor.title}</p>
                    </div>
                    <div class="match-card-score">
                        <span class="score-value">${mentor.fitScore.toFixed(1)}%</span>
                        <span class="score-label">Fit Score</span>
                    </div>
                </button>`;
            mentorsList.appendChild(li);
        });

        // --- NEW Mentee List Render ---
        state.matches.mentees.forEach(mentee => {
            const li = document.createElement('li');
            li.innerHTML = `
                <button data-name="${mentee.name}" class="comparison-button match-card">
                    <div class="match-card-icon person">${personIcon}</div>
                    <div class="match-card-content">
                        <p class="match-card-title">${mentee.name}</p>
                        <p class="match-card-subtitle">${mentee.title}</p>
                    </div>
                    <div class="match-card-score">
                        <span class="score-value">${mentee.fitScore.toFixed(1)}%</span>
                        <span class="score-label">Fit Score</span>
                    </div>
                </button>`;
            menteesList.appendChild(li);
        });
        
        // This original code is still correct and finds the new buttons
        document.querySelectorAll('.comparison-button').forEach(button => {
            button.addEventListener('click', () => handleShowComparison(button.dataset.name));
        });
    }

    // --- Company Flow Logic ---

    // Step C1: Handle Company Login (MODIFIED)
    async function handleCompanyLogin(e) {
        e.preventDefault();
        changeView('company-loading-view');
        
        const name = document.getElementById('company-name').value;
        const email = document.getElementById('company-email').value;

        const response = await MOCK_API.createCompany(name, email);
        if (response.success) {
            state.company = { ...state.company, ...response.data };
            // Start company onboarding
            changeView('company-culture-start-view');
        } else {
            alert("Registration failed. Please try again.");
            changeView('company-login-view');
        }
    }

    // Step C2: Handle Company Culture Start
    async function handleCompanyCultureStart(e) {
        e.preventDefault();
        changeView('loading-view');
        const testRes = await MOCK_API.createCompanyCultureTest(state.company.name);
        state.company.cultureTestId = testRes.test_id;
        
        // Start the shared culture assessment, but in 'company' mode
        await loadCultureAssessment('company');
    }


// Step C3: Handle Project Creation (MODIFIED for Wizard)
    async function handleProjectCreate(e) {
        e.preventDefault();

        // Check for personality input
        const personality = projectCreateForm.querySelector('input[name="project-personality"]:checked');
        if (!personality) {
            alert("Please select a project personality.");
            return;
        }

        state.currentProject = {
            type: document.getElementById('project-type').value,
            count: parseInt(document.getElementById('freelancer-count').value, 10),
            structure: document.querySelector('input[name="team-structure"]:checked').value,
            personality: personality.value // <-- NEW DATA
        };

        changeView('company-loading-view');
        const matchesRes = await MOCK_API.findTalentForProject(state.currentProject);
        if (matchesRes.success) {
            state.projectMatches = matchesRes.data;
            renderCompanyResults();
        } else {
            alert("Failed to find matches. Please try again.");
            changeView('project-create-view');
        }
    }

// Step C4: Render Company Match Results
    function renderCompanyResults() {
        companyResultsHeader.textContent = `Matches for ${state.company.name}`;
        companyProjectDetails.textContent = `Here are the best matches for "${state.currentProject.type}".`;
        talentList.innerHTML = '';
        teamList.innerHTML = '';
        
        // --- NEW Talent List Render ---
        state.projectMatches.talent.forEach(talent => {
            const li = document.createElement('li');
            li.innerHTML = `
                <button data-name="${talent.name}" class="comparison-button match-card">
                    <div class="match-card-icon person">${personIcon}</div>
                    <div class="match-card-content">
                        <p class="match-card-title">${talent.name}</p>
                        <p class="match-card-subtitle">${talent.title}</p>
                    </div>
                    <div class="match-card-score">
                        <span class="score-value">${talent.fitScore.toFixed(1)}%</span>
                        <span class="score-label">Fit Score</span>
                    </div>
                </button>`;
            talentList.appendChild(li);
        });

        // --- NEW Team List Render ---
        if (state.currentProject.structure === 'team' && state.projectMatches.teams.length > 0) {
            state.projectMatches.teams.forEach(team => {
                const memberNames = team.members.map(m => m.name).join(', ');
                const li = document.createElement('li');
                li.innerHTML = `
                    <button class="match-card">
                        <div class="match-card-icon project">${projectIcon}</div>
                        <div class="match-card-content">
                            <p class="match-card-title">${team.name}</p>
                            <p class="match-card-subtitle">Members: ${memberNames}</p>
                        </div>
                        <div class="match-card-score">
                            <span class="score-value">${team.teamFit.toFixed(1)}%</span>
                            <span class="score-label">Team Fit</span>
                        </div>
                    </button>`;
                teamList.appendChild(li);
            });
            teamResultsContainer.style.display = 'block';
        } else {
            teamResultsContainer.style.display = 'none';
        }

        // This original code is still correct
        document.querySelectorAll('.comparison-button').forEach(button => {
            button.addEventListener('click', () => handleShowComparison(button.dataset.name));
        });
        changeView('company-results-view');
    }
    
    // Step C5: Handle Create New Project
    function handleCreateNewProject() {
        projectCreateForm.reset();
        changeView('project-create-view');
    }
    
    // --- Comparison Flow Logic (Original) ---

    async function handleShowComparison(otherUserName) {
        if (!state.user.id || !state.personalityResults.scores || Object.keys(state.personalityResults.scores).length === 0) {
            state.user.name = state.company.name || "Your Company";
            state.personalityResults.scores = {
                'Emotional Stability': 50, 'Agreeableness': 50, 'Conscientiousness': 50, 'Extraversion': 50, 'Openness': 50,
            };
        }
        changeView('loading-view');
        const compRes = await MOCK_API.getComparison(state.user.id, otherUserName);
        if (compRes.success) {
            state.comparison = compRes.data;
            renderComparisonReport();
            changeView('comparison-view');
        } else {
            alert("Could not load comparison.");
            changeView(state.previousView);
        }
    }

    function renderComparisonReport() {
        const { user1, user2, teamsight, analysis } = state.comparison;
        comparisonHeader.textContent = `${user1.name} & ${user2.name}`;
        comparisonSubheader.textContent = "Interpersonal Fit Report";
        convergentScore.textContent = `${teamsight.convergent.score}%`;
        convergentDesc.textContent = teamsight.convergent.description;
        divergentScore.textContent = `${teamsight.divergent.score}%`;
        divergentDesc.textContent = teamsight.divergent.description;
        traitAnalysisContainer.innerHTML = '';
        const traitMap = {
            'Emotional Stability': analysis.emotionalStability, 'Agreeableness': analysis.agreeableness, 'Conscientiousness': analysis.conscientiousness, 'Extraversion': analysis.extraversion, 'Openness': analysis.openness
        };
        for (const [trait, text] of Object.entries(traitMap)) {
            const div = document.createElement('div');
            div.className = 'p-4 border rounded-lg';
            div.innerHTML = `<h3 class="text-xl font-semibold text-gray-800 mb-2">${trait}</h3><p class="text-gray-700 leading-relaxed">${text}</p>`;
            traitAnalysisContainer.appendChild(div);
        }
        const chartData = {
            labels: Object.keys(user1.scores),
            datasets: [
                {
                    label: user1.name, data: Object.values(user1.scores), fill: true,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: 'rgb(59, 130, 246)',
                    pointBackgroundColor: 'rgb(59, 130, 246)', pointBorderColor: '#fff'
                },
                {
                    label: user2.name, data: Object.values(user2.scores), fill: true,
                    backgroundColor: 'rgba(22, 163, 74, 0.2)', borderColor: 'rgb(22, 163, 74)',
                    pointBackgroundColor: 'rgb(22, 163, 74)', pointBorderColor: '#fff'
                }
            ]
        };
        const chartOptions = {
            scales: { r: { angleLines: { display: false }, suggestedMin: 0, suggestedMax: 100, pointLabels: { font: { size: 14 } } } },
            plugins: { legend: { position: 'top' } }
        };
        if (comparisonChart) comparisonChart.destroy();
        comparisonChart = new Chart(comparisonChartCanvas, { type: 'radar', data: chartData, options: chartOptions });
    }

    // --- NEW Handlers for Workspace & Feedback ---

    function handleChatSubmit(e) {
        e.preventDefault();
        const message = chatInput.value;
        if (!message.trim()) return;

        // Render user's message
        const messageEl = document.createElement('div');
        messageEl.className = 'flex justify-end';
        messageEl.innerHTML = `
            <div class="p-3 bg-blue-600 text-white rounded-lg max-w-xs">
                <p class="text-sm">${message}</p>
                <p class="text-xs text-blue-100 text-right mt-1">Me</p>
            </div>
        `;
        chatMessages.appendChild(messageEl);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
    }

    function handleReviewSubmit(e) {
        e.preventDefault();
        const comments = reviewComments.value;
        console.log("SUBMITTING REVIEW:", { comments }); // In real app, get rating
        alert("Review submitted! Returning to dashboard.");
        changeView('dashboard-view');
    }
    
    function handleFeedbackSubmit(e) {
        e.preventDefault();
        const comments = feedbackComments.value;
        console.log("SUBMITTING FEEDBACK:", { comments }); // In real app, get rating
        alert("Feedback submitted! Returning to dashboard.");
        changeView('dashboard-view');
    }

    // --- NEW: Project Health Check-in Functions ---

    function showProjectHealthCheckModal() {
        // In a real app, you'd populate this with the project data
        document.getElementById('health-check-project-title').textContent = '"Global E-commerce Platform"';
        document.getElementById('health-check-partner-name').textContent = 'Acme Inc.';
        
        // Reset form
        projectHealthForm.reset();
        healthCheckRatingButtons.querySelectorAll('.health-rating-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        healthCheckFitRatingInput.value = "";

        // Show the modal
        projectHealthModal.style.display = 'block';
    }

    function closeHealthCheckModal() {
        projectHealthModal.style.display = 'none';
    }

    function handleHealthCheckSubmit(e) {
        e.preventDefault();
        
        const fitRating = healthCheckFitRatingInput.value;
        // FIX: Check if a status is selected before trying to read .value
        const projectStatusInput = projectHealthForm.querySelector('input[name="project_status"]:checked');
        
        if (!fitRating) {
            alert("Please select a 'fit' rating.");
            return;
        }

        if (!projectStatusInput) {
            alert("Please select a project status.");
            return;
        }
        
        const projectStatus = projectStatusInput.value;

        const feedbackData = {
            project: document.getElementById('health-check-project-title').textContent,
            partner: document.getElementById('health-check-partner-name').textContent,
            fitRating: parseInt(fitRating, 10),
            projectStatus: projectStatus
        };

        // This is the data you feed back to the algorithm
        console.log("PROJECT HEALTH CHECK SUBMITTED:", feedbackData);
        
        alert("Thank you! Your feedback helps us make better matches.");
        closeHealthCheckModal();
    }

});