const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../backend/server.js');

chai.use(chaiHttp);
const { expect } = chai;

let validEditorToken = ''; // Editor token for creating blog posts

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
  let postId = ''; // Store the post ID for future tests

  it('should create a new blog post', function (done) {
    chai.request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${validEditorToken}`)
      .send({
        title: 'Test Blog Post',
        content: 'This is the content of the test blog post.',
        author: 'EditorUser'
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
        expect(res.body).to.be.an('array');
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
});
