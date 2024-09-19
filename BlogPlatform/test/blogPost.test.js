const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../backend/server.js');

chai.use(chaiHttp);
const { expect } = chai;

let validEditorToken = ''; // Editor token for creating blog posts
let postId = ''; // Store the post ID for future tests

// Log in as an editor and get the token
before(function (done) {
  chai.request(app)
    .post('/api/login')
    .send({
      username: 'editorUser', // Ensure this user exists with the Editor role
      password: 'Password@123'
    })
    .end(function (err, res) {
      expect(res).to.have.status(200);
      validEditorToken = res.body.token; // Save the Editor token
      console.log('Editor Token:', validEditorToken);
      done();
    });
});

// Test suite for blog posts
describe('Blog Post API Endpoints', function () {

  it('should create a new blog post', function (done) {
    chai.request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${validEditorToken}`)
      .send({
        title: 'Test Blog Post',
        content: 'This is the content of the test blog post.'
      })
      .end(function (err, res) {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('title', 'Test Blog Post');
        postId = res.body._id; // Save the blog post ID for future use
        done();
      });
  });

  it('should retrieve all blog posts', function (done) {
    chai.request(app)
      .get('/api/posts')
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body.posts).to.be.an('array'); // Assuming your posts are returned in 'posts'
        done();
      });
  });

  it('should retrieve a single blog post by ID', function (done) {
    chai.request(app)
      .get(`/api/posts/${postId}`)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('_id', postId);
        done();
      });
  });

  it('should search blog posts by title', function (done) {
    chai.request(app)
      .get('/api/posts/search')
      .query({ searchTerm: 'Test Blog Post' }) // Adjust search query accordingly
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body.posts).to.be.an('array');
        expect(res.body.posts[0]).to.have.property('title', 'Test Blog Post');
        done();
      });
  });

  // Cleanup after tests
  after(function (done) {
    chai.request(app)
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${validEditorToken}`)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });
});
