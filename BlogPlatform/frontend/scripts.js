document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    console.log("Token:", token);

    if (token) {
        const decodedToken = parseJwt(token);
        const userRole = decodedToken.role;
        console.log("User role:", userRole);

        // Show the Create Post section only for Editors or Admins
        if (userRole === 'Editor' || userRole === 'Admin') {
            document.getElementById('create-post-section').style.display = 'block';
        }

        // Hide the login and register forms
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('register-section').style.display = 'none';

        // Show the logout button
        document.getElementById('logout-button').style.display = 'inline-block';
    } else {
        console.log("Not logged in, showing login/register sections");

        // Show the login and register forms
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('register-section').style.display = 'block';

        // Hide the logout button and create post section
        document.getElementById('logout-button').style.display = 'none';
        document.getElementById('create-post-section').style.display = 'none';
    }

    // Handle registration form submission
    document.getElementById('register-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const role = document.getElementById('register-role').value;

        try {
            const response = await fetch('http://localhost:4000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, role })
            });

            if (response.ok) {
                alert('User registered successfully!');
                document.getElementById('register-form').reset();
            } else {
                alert('Registration failed');
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    });

    // Handle login form submission
    document.getElementById('login-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('http://localhost:4000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            console.log("Login response:", data);

            if (response.ok) {
                alert('Logged in successfully!');
                localStorage.setItem('token', data.token);
                document.getElementById('login-form').reset();
                window.location.reload(); // Reload to apply changes
            } else {
                alert('Login failed: ' + (data.message || data));
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    });

    // Handle logout
    document.getElementById('logout-button').addEventListener('click', function() {
        localStorage.removeItem('token'); // Remove token from storage
        window.location.reload(); // Reload to apply changes
    });

    // Fetch and display blog posts
    fetchPosts();
});

// Function to fetch and display blog posts
async function fetchPosts() {
    try {
        const response = await fetch('http://localhost:4000/api/posts');
        const posts = await response.json();

        const postsContainer = document.getElementById('blog-posts');
        postsContainer.innerHTML = '';

        posts.forEach(post => {
            const postElement = document.createElement('article');
            postElement.classList.add('post');

            postElement.dataset.postId = post._id;

            postElement.innerHTML = `
                <h2 class="post-title">${post.title}</h2>
                <p class="post-content">${post.content}</p>
                <p class="post-author">By ${post.author}</p>
            `;

            postsContainer.appendChild(postElement);

            // Fetch and display comments for each post
            fetchComments(post._id);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        const postsContainer = document.getElementById('blog-posts');
        postsContainer.innerHTML = `<p>Error loading posts. Please try again later.</p>`;
    }
}

// Function to fetch and display comments for a specific post
async function fetchComments(postId) {
    try {
        const response = await fetch(`http://localhost:4000/api/posts/${postId}/comments`);
        if (response.ok) {
            const comments = await response.json();
            const commentsList = document.getElementById('comments-list');
            commentsList.innerHTML = '';

            comments.forEach(comment => {
                const commentElement = document.createElement('li');
                commentElement.innerHTML = `
                    <p><strong>${comment.username}</strong>: ${comment.content}</p>
                    <p class="comment-date">${new Date(comment.date).toLocaleString()}</p>
                `;
                commentsList.appendChild(commentElement);
            });

            // Show the comment form if the user is logged in
            const token = localStorage.getItem('token');
            if (token) {
                document.getElementById('comment-form').style.display = 'block';
            }

            // Ensure the comment section is displayed
            document.getElementById('comments-section').style.display = 'block';
        } else {
            console.error('Failed to fetch comments, status:', response.status);
        }
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}



// Helper function to decode a JWT token
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(base64);
}
