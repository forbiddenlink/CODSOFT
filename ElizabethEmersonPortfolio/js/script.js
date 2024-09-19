// Function to start the main content
function startSite() {
    // Hide the loading screen and display the main content
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    // Scroll to the top of the page once content is shown
    window.scrollTo(0, 0);
}

// Show the start button when the loading animation completes
window.onload = function() {
    // Wait for 3 seconds before showing the start button
    setTimeout(function() {
        document.getElementById('start-button').classList.add('show');
    }, 3000); // Match the duration of the loading animation
};

// Sticky navigation and reveal animation for project cards
window.onscroll = function() {
    stickyNav(); // Call the function to handle sticky navigation
    revealProjects(); // Call the function to reveal project cards on scroll
};

// Reference to the header element
var header = document.querySelector("header");
var sticky = header.offsetTop; // Get the header's initial position

// Function to handle sticky navigation
function stickyNav() {
    // If the page scrolls past the header's position, make it sticky
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    } else {
        // Remove sticky class when scrolled back to the top
        header.classList.remove("sticky");
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default anchor click behavior
        // Scroll smoothly to the section referenced by the link's href
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Scroll animations for revealing project cards
function revealProjects() {
    const projects = document.querySelectorAll('.project-card'); // Select all project cards
    projects.forEach(function(project) {
        const projectPosition = project.getBoundingClientRect().top; // Get the card's position relative to the viewport
        const screenPosition = window.innerHeight / 1.3; // Trigger the animation when the card is 1/3rd from the top

        // Add the visible class when the card is within view
        if (projectPosition < screenPosition) {
            project.classList.add('scroll-visible');
        }
    });
}

// Form validation function
function validateForm() {
    // Get form elements by their IDs
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    let isValid = true; // Flag to track if the form is valid

    // Validate the name input
    if (name.value === '') {
        name.classList.add('error'); // Add error styling if name is empty
        isValid = false;
    } else {
        name.classList.remove('error'); // Remove error styling if name is filled
    }

    // Email validation using a simple regex pattern
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.value.match(emailPattern)) {
        email.classList.add('error'); // Add error styling if email is invalid
        isValid = false;
    } else {
        email.classList.remove('error'); // Remove error styling if email is valid
    }

    // Validate the message input
    if (message.value === '') {
        message.classList.add('error'); // Add error styling if message is empty
        isValid = false;
    } else {
        message.classList.remove('error'); // Remove error styling if message is filled
    }

    // If the form is valid, show the success message and clear the fields
    if (isValid) {
        document.getElementById('success-message').style.display = 'block';
        name.value = '';
        email.value = '';
        message.value = '';
    }

    return false; // Prevent form submission for demo purposes
}

// Add event listener to form submit button
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    validateForm(); // Call the validation function
});

// Scroll animation for the About Me section
window.addEventListener('scroll', function() {
    const aboutSection = document.getElementById('about'); // Select the About Me section
    const position = aboutSection.getBoundingClientRect().top; // Get its position relative to the viewport
    const screenPosition = window.innerHeight / 1.2; // Trigger when the section is 1/5th from the top
    if (position < screenPosition) {
        aboutSection.classList.add('scroll-active'); // Add the scroll-active class to trigger the animation
    }
});

// Function to open a modal with project details
function openModal(projectId) {
    var modal = document.getElementById('project-modal'); // Select the modal element
    var modalContent = document.getElementById('project-modal-content'); // Select the modal content container

    document.body.style.overflow = 'hidden'; // Prevent scrolling when the modal is open

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

    modal.style.display = 'flex'; // Display the modal
}

// Close the modal
function closeModal() {
    document.getElementById('project-modal').style.display = 'none'; // Hide the modal
    document.body.style.overflow = 'auto'; // Re-enable page scrolling
}

// Close modal if the user clicks outside the modal content
window.onclick = function(event) {
    var modal = document.getElementById('project-modal');
    if (event.target === modal) {
        modal.style.display = 'none'; // Close the modal if the user clicks outside of it
    }
}
