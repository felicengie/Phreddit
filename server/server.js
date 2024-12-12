// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const commentsModel = require('./models/comments');
const communitiesModel = require('./models/communities');
const linkflairsModel = require('./models/linkflairs');
const postsModel = require('./models/posts');
const userModel = require('./models/user')
const app = express();

app.use(express.json());
app.use(cors());

// MongoDB connection URI and database name
const mongoURI = "mongodb://127.0.0.1:27017/phreddit"; // Full URI

// Function to connect to MongoDB using Mongoose
async function connectToMongoDB() {
    try {
        await mongoose.connect(mongoURI);
        console.log(`Connected to MongoDB database: phreddit`);
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
    }
}

// Start server
app.get("/", function (req, res) {
    res.send("Hello Phreddit!");
});

// Route for fetching comments
  
app.get('/api/comments', async (req, res) => {
    try {
    const comments = await commentsModel.find();
    res.json(comments);
    } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
    }
});

app.get('/api/comments/:id', async (req, res) => {
  try {
    const commentID = req.params.id;
    const comment = await commentsModel.findById(commentID)
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: "Error fetching comment by ID" });
  }
});

app.post('/api/comments', async (req, res) => {
    try {
      const newComment = new commentsModel(req.body);
      const savedComment = await newComment.save();
      res.json(savedComment);
    } catch (err) {
      console.log(err)
      res.status(400).json({ error: err.message });
    }
  });

// Route for fetching communities
app.get('/api/communities', async (req, res) => {
  try {
    const communities = await communitiesModel.find();
    res.json(communities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// app.get('/api/communities', (req, res) => {
//     communitiesModel.getAllCommunities()
//         .then(communities => res.json(communities))
//         .catch(err => res.status(500).json({ error: err.message }));
// });

// Route for fetching linkflairs
app.get('/api/linkflairs', async (req, res) => {
    try {
      const linkFlairs = await linkflairsModel.find();
      res.json(linkFlairs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
// app.get('/api/linkflairs', (req, res) => {
//     linkflairsModel.getAllLinkflairs()
//         .then(linkflairs => res.json(linkflairs))
//         .catch(err => res.status(500).json({ error: err.message }));
// });

// Route for fetching posts
app.get('/api/posts', async (req, res) => {
    try {
      const posts = await postsModel.find()
      res.json(posts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/posts/:id', async (req, res) => {
    try {
      const postID = req.params.id;
      const post = await postsModel.findById(postID)
      res.json(post);
    } catch (err) {
      res.status(500).json({ message: "Error fetching post by ID" });
    }
  });

// app.get('/api/posts', (req, res) => {
//     postsModel.getAllPosts()
//         .then(posts => res.json(posts))
//         .catch(err => res.status(500).json({ error: err.message }));
// });


app.post('/api/posts', async (req, res) => {
  try {
    const newPost = new postsModel(req.body);
    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/communities", async (req,res) => {
  try{
    const newCommunity = new communitiesModel(req.body)
    const savedCommunity = await newCommunity.save();
    res.json(savedCommunity)
  }catch(err){
    res.status(500).json({message: "Error creating community", error: err})
  }

})

app.post("/api/linkflairs", async (req,res) => {
  try{
    const newLinkFlair = new linkflairsModel(req.body)
    console.log(newLinkFlair)
    const savedLinkFlair = await newLinkFlair.save()
    res.json(savedLinkFlair)
  }catch (err){
    res.status(500).json({message: "Error creating LinkFlair"})
  }
})

app.put("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  const updatedPost = req.body;
  try {
    // Find the post by ID and update it
    const post = await postsModel.findByIdAndUpdate(id, updatedPost, { new: true });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post); // Return the updated post
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/communities/:id", async (req, res) =>{
  const {id} = req.params;
  const updatedCommunity = req.body;
  try{
    const community = await communitiesModel.findByIdAndUpdate(id, updatedCommunity,{new :true})
    res.status(200).json(community)
  }catch (error){
    res.status(500).json({message: 'Error updating community', error})
  }
})

app.put("/api/comments/:id", async (req,res) =>{
  const {id} = req.params;
  const updatedComment = req.body

  try{
    const comment = await commentsModel.findByIdAndUpdate(id, updatedComment,{ new: true } )
    res.status(200).json(comment)
  }catch (error){
    res.status(500).json({message: 'Error updating comment', error})
  }
})

app.get('/status', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.get('/api/linkflairs', async (req, res) => {
  try {
    const linkFlairs = await linkflairsModel.find();
    res.json(linkFlairs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users', async (req, res) =>{
  try{
    const users = await userModel.find();
    res.json(users)
  }catch (err){
    res.status(500).json({error: err.message})
  }
});

app.put("/api/users/:id", async (req,res) =>{
  const {id} = req.params;
  const updatedUser = req.body

  try{
    const user = await userModel.findByIdAndUpdate(id, updatedUser,{ new: true } )
    res.status(200).json(user)
  }catch (error){
    res.status(500).json({message: 'Error updating user', error})
  }
})

app.put("/api/users/displayName/:displayName", async (req,res) =>{
  const {displayName} = req.params;
  const updatedUser = req.body

  try{
    const user = await userModel.findByIdAndUpdate(displayName, updatedUser,{ new: true } )
    res.status(200).json(user)
  }catch (error){
    res.status(500).json({message: 'Error updating user', error})
  }
})

app.post("/api/users", async (req,res) => {
  try{
    const newUser = new userModel(req.body)
    console.log(newUser)
    const savedUser = await newUser.save()
    res.json(savedUser)
  }catch (err){
    res.status(500).json({message: "Error creating new User"})
  }
})


app.get("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id; // Extract the user ID from the route parameter
    const user = await userModel.findById(userId); // Find user by ID

    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Return 404 if no user is found
    }

    res.json(user); // Respond with the user data
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({ message: "Error fetching user by ID" }); // Handle server errors
  }
});

app.get("/api/users/email/:email", async (req, res) => {
  try {
    const email = req.params.email; // Extract the email from the route parameter
    const user = await userModel.findOne({ email }); // Find user by email

    if (!user) {s
      return res.status(404).json({ message: "User not found" }); // Return 404 if no user is found
    }

    res.json(user); // Respond with the user data
  } catch (err) {
    console.error("Error fetching user by email:", err);
    res.status(500).json({ message: "Error fetching user by email" }); // Handle server errors
  }
});

app.get("/api/users/displayName/:displayName", async (req, res) => {
  try {
    const displayName = req.params.displayName; // Extract the email from the route parameter
    const user = await userModel.findOne({ displayName }); // Find user by email

    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Return 404 if no user is found
    }

    res.json(user); // Respond with the user data
  } catch (err) {
    console.error("Error fetching user by displayName:", err);
    res.status(500).json({ message: "Error fetching user by displayName" }); // Handle server errors
  }
});

//Delete

app.delete('/api/comments/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the comment exists
    const comment = await commentsModel.findByIdAndDelete(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Optionally, handle any clean-up like removing it from posts or related data
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Check if the comment exists
    const post = await postsModel.findByIdAndDelete(id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    // Optionally, handle any clean-up like removing it from posts or related data
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/communities/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Attempt to delete the community
    const community = await communitiesModel.findByIdAndDelete(id);

    if (!community) {
      // If no document was found, handle it here
      return res.status(404).json({ message: 'Community not found' });
    }

    res.status(200).json({ message: 'Community deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}); 

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the comment exists
    const user = await userModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Optionally, handle any clean-up like removing it from posts or related data
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


  
// Start server and connect to MongoDB
app.listen(8000, async () => {
    console.log("Server listening on port 8000...");
    await connectToMongoDB();
});

// Graceful shutdown: Disconnect MongoDB on server termination
process.on('SIGINT', async () => {
    if (db) {
        await db.client.close();  // Close the MongoDB connection
        console.log("Server closed. Database instance disconnected.");
    }
    process.exit(0);  // Exit the process gracefully
});

