const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../backend/server'); // Make sure this is the correct path

chai.use(chaiHttp);

const { expect } = chai;

describe('Comment API Endpoints', function () {
  let validViewerToken = '';  // Viewer token
  let postId = ''; // Store postId

  before(function (done) {
    // Log in as viewer and get token
    chai.request(app)
      .post('/api/login')
      .send({
        username: 'viewerUser',  // Make sure this user exists with Viewer role
        password: 'Password@123'
      })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        validViewerToken = res.body.token; // Save the token

        // Create a blog post to comment on
        chai.request(app)
          .post('/api/posts')
          .set('Authorization', `Bearer ${validViewerToken}`)
          .send({
            title: 'Blog Post for Comments',
            content: 'This post will be used for comments.',
            author: 'ViewerUser'
          })
          .end(function (err, res) {
            expect(res).to.have.status(201);
            postId = res.body._id; // Save the post ID for comments
            done();
          });
      });
  });

  it('should add a comment to the post', function (done) {
    chai.request(app)
      .post(`/api/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${validViewerToken}`)
      .send({
        comment: 'This is a comment on the blog post'
      })
      .end(function (err, res) {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('comment', 'This is a comment on the blog post');
        done();
      });
  });
});
