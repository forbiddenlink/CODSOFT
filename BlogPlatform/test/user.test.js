const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../backend/server.js'); // Make sure this points to the correct location

chai.use(chaiHttp);

const { expect } = chai;

describe('Blog Post API Endpoints', function() {
  let validEditorToken = '';  // Save the editor token

  before(function (done) {
    // Log in as an editor and get the token
    chai.request(app)
      .post('/api/login')
      .send({
        username: 'editorUser',  // Use a valid editor username
        password: 'Password@123' // Use a valid password
      })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        validEditorToken = res.body.token; // Save the token
        done();
      });
  });

  it('should create a new blog post', function(done) {
    chai.request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${validEditorToken}`)
      .send({
        title: 'New Blog Post',
        content: 'Content for the new blog post',
        author: 'EditorUser'
      })
      .end(function(err, res) {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('title', 'New Blog Post');
        done();
      });
  });
  
  it('should retrieve all blog posts', function(done) {
    chai.request(app)
      .get('/api/posts')
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should retrieve a single blog post by ID', function(done) {
    // Assuming you have a valid postId to fetch
    const postId = 'validPostId'; // You need to update this with an actual post ID from your DB
    chai.request(app)
      .get(`/api/posts/${postId}`)
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('_id', postId);
        done();
      });
  });
});
