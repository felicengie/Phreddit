const mongoose = require('mongoose');
const Post = require('./models/posts');
const Comment = require('./models/comments');

// Mock database URL for testing
const TEST_DB_URL = 'mongodb://localhost:27017/testdb';

beforeAll(async () => {
  // Connect to a test database
  await mongoose.connect(TEST_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  // Drop the database and close the connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

test('Deleting a post also deletes its comments', async () => {
  // Step 1: Create a post with the required 'createdBy' field
  const post = await Post.create({ 
    title: 'Test Post', 
    content: 'Test Content', 
    createdBy: new mongoose.Types.ObjectId() // Mocking a createdBy field (user ID) with 'new'
  });

  // Step 2: Create comments for the post, including 'createdBy'
  const createdBy = new mongoose.Types.ObjectId(); // Mocking a user ID for comments

  const comment1 = await Comment.create({ 
    postId: post._id, 
    content: 'First comment', 
    createdBy: createdBy 
  });

  const comment2 = await Comment.create({ 
    postId: post._id, 
    content: 'Reply to comment', 
    parentId: comment1._id,
    createdBy: createdBy
  });

  // Step 3: Collect the IDs to validate deletion later
  const postId = post._id;
  const commentIds = [comment1._id, comment2._id];

  // Step 4: Delete the post
  await Post.deleteOne({ _id: postId });

  // Step 5: Validate deletion
  const postCheck = await Post.findById(postId);
  const commentsCheck = await Comment.find({ _id: { $in: commentIds } });

  // Assertions
  expect(postCheck).toBeNull();
});
