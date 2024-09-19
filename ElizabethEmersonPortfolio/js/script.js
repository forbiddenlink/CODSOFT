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
            <img src="images/basiccalc.png" alt="Project 1 Image">
            <p>A simple calculator built using HTML, CSS, and JavaScript.</p>
            <a href="projects/BasicCalculator/index.html" class="btn" target="_blank">Open Calculator</a>
        `;
    } else if (projectId === 'project2') {
        modalContent.innerHTML = `
            <h3>To-Do List App</h3>
            <img src="images/todopic.png" alt="To-Do List App Image">
            <p>This task management app helps users manage their tasks with features like task creation, editing, and dark mode. Built with HTML, CSS, and JavaScript.</p>
            <h4>Key Features:</h4>
            <ul>
                <li>Dark mode toggle for a comfortable user experience.</li>
                <li>Task prioritization and due date reminders.</li>
                <li>Interactive UI for adding, editing, and deleting tasks.</li>
                <li>Responsive design for mobile and desktop users.</li>
            </ul>
            <a href="projects/ToDoListApp/index.html" class="btn" target="_blank">Explore To-Do List App</a>
        `;
    } else if (projectId === 'project3') {
        modalContent.innerHTML = `
        <h3>Memory Matching Game</h3>
        <img src="images/memorygame.png" alt="Memory Matching Game Image">
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
        <h3>Blog Platform</h3>
        <img src="images/blogplatpic.png" alt="Blog Platform Image">
        <p>This is a full-stack blogging platform where users can create, read, update, and delete blog posts, leave comments, and manage their profiles.</p>
        <h4>Key Features:</h4>
        <ul>
            <li>User Authentication using JSON Web Tokens (JWT).</li>
            <li>Role-Based Access Control for blog management.</li>
            <li>Blog post creation, editing, and deletion.</li>
            <li>Comment system and profile management.</li>
            <li>Responsive design with dark mode support.</li>
        </ul>
        <a href="https://blog-platform-y7sa.onrender.com/" class="btn" target="_blank">Visit Blog Platform</a>
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
