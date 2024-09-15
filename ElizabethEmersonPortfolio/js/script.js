// Function to start the main content
function startSite() {
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    window.scrollTo(0, 0); // Ensures the page starts at the top
}

// Show the start button when the loading animation completes
window.onload = function() {
    setTimeout(function() {
        document.getElementById('start-button').classList.add('show');
    }, 3000); // Match the duration of the loading animation
};

// JavaScript for Sticky Navigation Fallback
window.onscroll = function() {stickyNav(); revealProjects();};

var header = document.querySelector("header");
var sticky = header.offsetTop;

function stickyNav() {
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
}

// Smooth scrolling function for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Scroll animations for Projects Section
function revealProjects() {
    const projects = document.querySelectorAll('.project-card');
    projects.forEach(function(project) {
        const projectPosition = project.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (projectPosition < screenPosition) {
            project.classList.add('scroll-visible');
        }
    });
}

// Form Validation and Success Message
function validateForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    let isValid = true;

    // Name validation
    if (name.value === '') {
        name.classList.add('error');
        isValid = false;
    } else {
        name.classList.remove('error');
    }

    // Email validation (simple regex check)
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.value.match(emailPattern)) {
        email.classList.add('error');
        isValid = false;
    } else {
        email.classList.remove('error');
    }

    // Message validation
    if (message.value === '') {
        message.classList.add('error');
        isValid = false;
    } else {
        message.classList.remove('error');
    }

    // If valid, show success message and clear fields
    if (isValid) {
        document.getElementById('success-message').style.display = 'block';
        name.value = '';
        email.value = '';
        message.value = '';
    }

    return false; // Prevent form from submitting for this demo
}

// Add an event listener to the form submit button
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents actual form submission
    validateForm(); // Calls validation function
});

// Scroll animations for About Me section
window.addEventListener('scroll', function() {
    const aboutSection = document.getElementById('about');
    const position = aboutSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.2;
    if (position < screenPosition) {
        aboutSection.classList.add('scroll-active');
    }
});

// Modal JavaScript
function openModal(projectId) {
    var modal = document.getElementById('project-modal');
    var modalContent = document.getElementById('project-modal-content');

    document.body.style.overflow = 'hidden';
    
    // Populate modal with project-specific details
    if (projectId === 'project1') {
        modalContent.innerHTML = `
            <h3>Basic Calculator</h3>
            <img src="images/basiccalc.png" alt="Project 1 Image" class="small-image">
            <p>A simple calculator built using HTML, CSS, and JavaScript.</p>
            <a href="projects/BasicCalculator/index.html" class="btn" target="_blank">Open Calculator</a>
        `;
    } else if (projectId === 'project2') {
        modalContent.innerHTML = `
            <h3>Project Title 2</h3>
            <img src="images/project2.jpg" alt="Project 2 Image">
            <p>Description of Project 2 goes here.</p>
            <a href="#" class="btn">Coming Soon</a>
        `;
    } else if (projectId === 'project3') {
        modalContent.innerHTML = `
        <h3>Memory Matching Game</h3>
        <img src="images/memorygame.png" alt="Memory Matching Game Image" class="small-image">
        <p>A fun memory game built using HTML, CSS, and JavaScript. Players find matching pairs of cards, with themes and difficulty levels.</p>
        <h4>Key Features:</h4>
        <ul>
            <li>Custom themes like animals, space, and abstract designs.</li>
            <li>Easy, medium, and hard difficulty levels.</li>
            <li>Responsive design for mobile, tablet, and desktop.</li>
            <li>Score based on time and moves.</li>
            <li>Interactive sounds and animations.</li>
            <li>Game over screen with score and restart option.</li>
        </ul>
        <a href="projects/MemoryMatchingGame/index.html" class="btn" target="_blank">Play Game</a>
    `;
    
    } else if (projectId === 'project4') {
        modalContent.innerHTML = `
            <h3>Project Title 4</h3>
            <img src="images/project4.jpg" alt="Project 4 Image">
            <p>Description of Project 4 goes here.</p>
            <a href="#" class="btn">Coming Soon</a>
        `;
    }
    
    modal.style.display = 'flex';
}

    
 
   

// Close the modal
function closeModal() {
    document.getElementById('project-modal').style.display = 'none';
}

document.body.style.overflow = 'auto';

// Close modal if the user clicks outside the modal content
window.onclick = function(event) {
    var modal = document.getElementById('project-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
