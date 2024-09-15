document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    console.log("Token on load:", token); // Debugging token retrieval

    // Hide blog posts and other sections until user is authenticated
    document.getElementById('blog-posts').style.display = 'none';
    document.getElementById('create-post-section').style.display = 'none';
    document.getElementById('profile-section').style.display = 'none';

    if (token) {
        const decodedToken = parseJwt(token);
        console.log("Decoded token:", decodedToken); // Debug decoded token

        const userRole = decodedToken.role;

        // Show blog posts and profile-related content after login
        document.getElementById('blog-posts').style.display = 'block';
        document.getElementById('view-profile-button').style.display = 'inline-block'; // Show profile button
        document.getElementById('logout-button').style.display = 'inline-block';

        // Show the Create Post section only for Editors or Admins
        if (userRole === 'Editor' || userRole === 'Admin') {
            document.getElementById('create-post-section').style.display = 'block';
        }

        // Hide the login and register forms
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('register-section').style.display = 'none';
    } else {
        // Show the login and register forms
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('register-section').style.display = 'block';

        // Hide the logout button, profile button, and blog content
        document.getElementById('logout-button').style.display = 'none';
        document.getElementById('view-profile-button').style.display = 'none';
        document.getElementById('blog-posts').style.display = 'none';
    }

    // Handle registration form submission
    document.getElementById('register-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const role = document.getElementById('register-role').value;

        try {
            const response = await fetch('http://localhost:4000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
    document.getElementById('login-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('http://localhost:4000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            console.log("Login response data:", data); // Debug login response

            if (response.ok) {
                alert('Logged in successfully!');
                localStorage.setItem('token', data.token);
                document.getElementById('login-form').reset();
                window.location.reload(); // Reload page after successful login
            } else {
                alert(`Login failed: ${data.message || 'An error occurred'}`);
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Login failed due to a network error.');
        }
    });

    // Handle logout
    document.getElementById('logout-button').addEventListener('click', function () {
        localStorage.removeItem('token');
        window.location.reload();
    });

    // Fetch and display blog posts
    fetchPosts();
});

// Fetch and display blog posts
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
                <form id="comment-form-${post._id}" class="comment-form">
                    <textarea id="comment-content-${post._id}" placeholder="Add a comment"></textarea>
                    <button type="submit">Submit Comment</button>
                </form>
                <ul id="comments-list-${post._id}" class="comments-list"></ul>
            `;

            postsContainer.appendChild(postElement);

            document.getElementById(`comment-form-${post._id}`).addEventListener('submit', function (event) {
                event.preventDefault();
                handleCommentSubmit(post._id);
            });

            fetchComments(post._id); // Fetch comments for the post
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Fetch and display comments for a specific post
async function fetchComments(postId) {
    try {
        const response = await fetch(`http://localhost:4000/api/posts/${postId}/comments`);
        const comments = await response.json();

        const commentsList = document.getElementById(`comments-list-${postId}`);
        commentsList.innerHTML = '';

        comments.forEach(comment => {
            const commentElement = document.createElement('li');
            commentElement.innerHTML = `
                <p><strong>${comment.username}</strong>: ${comment.comment}</p>
                <p class="comment-date">${new Date(comment.createdAt).toLocaleString()}</p>
            `;
            commentsList.appendChild(commentElement);
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

// Fetch and display the user's profile
async function fetchUserProfile() {
    const token = localStorage.getItem('token');
    console.log("Fetching profile with token:", token); // Debug token check
    if (!token) {
        alert('You must be logged in to view your profile');
        return;
    }

    try {
        const response = await fetch('http://localhost:4000/api/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const user = await response.json();
            console.log("Profile fetched successfully:", user); // Debug user profile response
            document.getElementById('profile-username').value = user.username;
            document.getElementById('profile-section').style.display = 'block'; // Show profile section
        } else {
            alert('Failed to fetch profile.');
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

// Handle comment submission
async function handleCommentSubmit(postId) {
    const content = document.getElementById(`comment-content-${postId}`).value;
    const token = localStorage.getItem('token');

    if (!token) {
        alert('You must be logged in to comment.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/api/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ comment: content })
        });

        if (response.ok) {
            alert('Comment added successfully!');
            document.getElementById(`comment-form-${postId}`).reset();
            fetchComments(postId);
        } else {
            const errorData = await response.json();
            alert('Failed to add comment: ' + (errorData.message || 'An error occurred.'));
        }
    } catch (error) {
        console.error('Error adding comment:', error);
    }
}

// Helper function to decode a JWT token
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = decodeURIComponent(atob(base64Url).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(base64);
}
