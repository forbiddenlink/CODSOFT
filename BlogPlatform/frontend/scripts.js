// Declare variables outside of DOMContentLoaded to ensure proper scope
let currentPage = 1;
const postsPerPage = 5;

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
        const userId = decodedToken._id;

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

    // Handle pagination controls
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchPosts();
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        currentPage++;
        fetchPosts();
    });

    // Handle View Profile button click
    document.getElementById('view-profile-button').addEventListener('click', function () {
        fetchUserProfile(); // Fetch and display the profile
    });

    // Handle close profile button click
    document.getElementById('close-profile').addEventListener('click', function () {
        document.getElementById('profile-section').style.display = 'none';
    });

    // Handle post creation form submission
    document.getElementById('create-post-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        const token = localStorage.getItem('token');

        if (!token) {
            alert('You must be logged in to create a post.');
            return;
        }

        console.log("Submitting post:", { title, content }); // Debug post content
        console.log("Using token:", token); // Debug token

        try {
            const response = await fetch('http://localhost:4000/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, content })
            });

            const data = await response.json();
            console.log("Response from server:", data); // Debug server response

            if (response.ok) {
                alert('Post created successfully!');
                document.getElementById('create-post-form').reset();
                fetchPosts(); // Reload the posts to display the new post
            } else {
                alert('Failed to create post: ' + (data.message || 'Unknown error.'));
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    });

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

    // Fetch initial posts on page load
    fetchPosts();
});

// Fetch and display the user profile (global function)
async function fetchUserProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to view your profile.');
        return;
    }

    try {
        const response = await fetch('http://localhost:4000/api/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const userProfile = await response.json();
            displayUserProfile(userProfile); // Call a function to display the profile
        } else {
            alert('Failed to fetch profile.');
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

// Display the user profile (global function)
function displayUserProfile(profile) {
    const profileSection = document.getElementById('profile-section');
    profileSection.style.display = 'block';

    const profileContent = `
        <h2>User Profile</h2>
        <p><strong>Username:</strong> ${profile.username}</p>
        <p><strong>Role:</strong> ${profile.role}</p>
        <p><strong>Email:</strong> ${profile.email}</p>
        <button id="change-password-button">Change Password</button>
        <button id="close-profile">Close Profile</button>
    `;

    profileSection.innerHTML = profileContent;

    document.getElementById('close-profile').addEventListener('click', function () {
        profileSection.style.display = 'none';
    });

    document.getElementById('change-password-button').addEventListener('click', function () {
        const newPassword = prompt('Enter new password:');
        if (newPassword) {
            changePassword(newPassword);
        }
    });
}

// Change password function
async function changePassword(newPassword) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:4000/api/change-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ password: newPassword })
        });

        if (response.ok) {
            alert('Password changed successfully.');
        } else {
            alert('Failed to change password.');
        }
    } catch (error) {
        console.error('Error changing password:', error);
    }
}

// Fetch and display blog posts with pagination (global function)
async function fetchPosts() {
    const token = localStorage.getItem('token');
    const decodedToken = token ? parseJwt(token) : null;

    try {
        const response = await fetch(`http://localhost:4000/api/posts?page=${currentPage}&limit=${postsPerPage}`);
        const { posts, totalPages } = await response.json();

        const postsContainer = document.getElementById('blog-posts');
        postsContainer.innerHTML = '';

        posts.forEach(post => {
            const postElement = document.createElement('article');
            postElement.classList.add('post');

            postElement.dataset.postId = post._id;

            postElement.innerHTML = `
                <h2 class="post-title">${post.title}</h2>
                <p class="post-content">${post.content}</p>
                <p class="post-author">By ${post.author ? post.author.username : 'Unknown Author'}</p>
                <form id="comment-form-${post._id}" class="comment-form">
                    <textarea id="comment-content-${post._id}" placeholder="Add a comment"></textarea>
                    <button type="submit">Submit Comment</button>
                </form>
                <ul id="comments-list-${post._id}" class="comments-list"></ul>
                ${decodedToken && post.author && decodedToken._id === post.author._id ? `
                    <button onclick="editPost('${post._id}')">Edit Post</button>
                    <button onclick="deletePost('${post._id}')">Delete Post</button>
                ` : ''}
            `;

            postsContainer.appendChild(postElement);

            document.getElementById(`comment-form-${post._id}`).addEventListener('submit', function (event) {
                event.preventDefault();
                handleCommentSubmit(post._id);
            });

            fetchComments(post._id); // Fetch comments for the post
        });

        updatePagination(totalPages);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Handle post deletion (global function)
async function deletePost(postId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to delete a post.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/api/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert('Post deleted successfully!');
            await fetchPosts(); // Reload the posts after deletion
        } else {
            alert('Failed to delete post.');
        }
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}

// Handle post editing (global function)
async function editPost(postId) {
    const newContent = prompt('Enter new content for the post:');
    const token = localStorage.getItem('token');
    if (!token || !newContent) {
        alert('You must be logged in and provide new content to edit the post.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/api/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content: newContent })
        });

        if (response.ok) {
            alert('Post updated successfully!');
            await fetchPosts(); // Reload the posts after update
        } else {
            alert('Failed to update post.');
        }
    } catch (error) {
        console.error('Error updating post:', error);
    }
}

// Handle comment submission (global function)
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

// Fetch and display comments for a specific post (global function)
async function fetchComments(postId) {
    const token = localStorage.getItem('token');
    const decodedToken = token ? parseJwt(token) : null;

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
                ${decodedToken && decodedToken._id === comment.userId ? `
                    <button onclick="editComment('${postId}', '${comment._id}')">Edit Comment</button>
                    <button onclick="deleteComment('${postId}', '${comment._id}')">Delete Comment</button>
                ` : ''}
            `;
            commentsList.appendChild(commentElement);
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

// Handle comment deletion (global function)
async function deleteComment(postId, commentId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to delete a comment.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/api/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert('Comment deleted successfully!');
            await fetchComments(postId); // Reload the comments after deletion
        } else {
            alert('Failed to delete comment.');
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
    }
}

// Handle comment editing (global function)
async function editComment(postId, commentId) {
    const newContent = prompt('Enter new content for the comment:');
    const token = localStorage.getItem('token');
    if (!token || !newContent) {
        alert('You must be logged in and provide new content to edit the comment.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/api/posts/${postId}/comments/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ comment: newContent })
        });

        if (response.ok) {
            alert('Comment updated successfully!');
            await fetchComments(postId); // Reload the comments
        } else {
            alert('Failed to update comment.');
        }
    } catch (error) {
        console.error('Error updating comment:', error);
    }
}

// Handle pagination controls (global function)
function updatePagination(totalPages) {
    const paginationNumbers = document.getElementById('pagination-numbers');
    paginationNumbers.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            fetchPosts();
        });
        paginationNumbers.appendChild(pageButton);
    }
}

// Helper function to decode a JWT token (global function)
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = decodeURIComponent(atob(base64Url).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(base64);
}
