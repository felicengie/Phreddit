// initializeDB.js - Will add initial application data to MongoDB database
// Run this script to test your schema
// Start the mongoDB service as a background process before running the script
// Pass URL of your mongoDB instance as first argument
// (e.g., mongodb://127.0.0.1:27017/fake_so)

const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose');
const CommunityModel = require('./models/communities');
const PostModel = require('./models/posts');
const CommentModel = require('./models/comments');
const LinkFlairModel = require('./models/linkflairs');
const UserModel = require("./models/user");

let userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

if (userArgs.length < 4) {
    console.log('ERROR: Please provide email, display name, and password for the admin user as additional arguments.');
    return;
}

const [mongoDB, adminEmail, adminDisplayName, adminPassword] = userArgs;
mongoose.connect(mongoDB);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


async function createAdminUser(email, displayName, password) {
    const hashedPassword = await bcryptjs.hash(password, 10); // Hash the password
    const adminUser = new UserModel({
        firstName: "Prof",
        lastName:"Kane",
        email,
        displayName,
        password: hashedPassword,
        role:"admin",
        reputation: 1000,
        dateJoined: new Date('2015-01-01T12:00:00')
    });
    return adminUser.save();
}

function createUser(userObj) {
    const newUser = new UserModel(userObj);
    return newUser.save();
}

function createLinkFlair(linkFlairObj) {
    const newLinkFlairDoc = new LinkFlairModel(linkFlairObj);
    return newLinkFlairDoc.save();
}

function createComment(commentObj) {
    const newCommentDoc = new CommentModel(commentObj);
    return newCommentDoc.save();
}

function createPost(postObj) {
    const newPostDoc = new PostModel(postObj);
    return newPostDoc.save();
}

function createCommunity(communityObj) {
    const newCommunityDoc = new CommunityModel(communityObj);
    return newCommunityDoc.save();
}


async function initializeDB() {

    const users = [
        { firstName: "first", lastName: "user" , email: 'user1@gmail.com', displayName: 'UserOne', password: await bcryptjs.hash('password1', 10), dateJoined: new Date('2016-04-12T08:15:00') },
        { firstName: "second", lastName: "user" , email: 'user2@gmail.com', displayName: 'UserTwo', password: await bcryptjs.hash('password2', 10), dateJoined: new Date('2017-03-22T14:45:00') },
        { firstName: "third", lastName: "user", email: 'user3@gmail.com', displayName: 'UserThree', password: await bcryptjs.hash('password3', 10), dateJoined: new Date('2018-09-10T09:00:00') },
        { firstName: "fourth", lastName: "user", email: 'user4@gmail.com', displayName: 'UserFour', password: await bcryptjs.hash('password4', 10), reputation: 45, dateJoined: new Date('2019-05-05T10:30:00') }
    ];

    const userRefs = await Promise.all(users.map(createUser));

    const linkFlairs = [
        { content: 'Discussion' },
        { content: 'Question' },
        { content: 'My life is seg faulting'}
    ];
    const linkFlairRefs = await Promise.all(linkFlairs.map(createLinkFlair));

        
    const comments = [
        { content: 'Great post! Thanks for sharing.', createdBy: userRefs[1].displayName, commentedDate: new Date('2018-07-15T10:20:00') },
        { content: 'I have a question about this topic.', createdBy: userRefs[2].displayName, commentedDate: new Date('2019-03-22T15:35:00') },
        { content: 'Here’s my reply to your question.', createdBy: userRefs[3].displayName, commentedDate: new Date('2019-03-22T16:00:00') },
        { content: 'Adding my thoughts.', createdBy: userRefs[0].displayName, commentedDate: new Date('2020-11-10T08:45:00') },
        { content: 'This is really insightful!', createdBy: userRefs[2].displayName, commentedDate: new Date('2021-06-18T12:30:00') },
        { content: 'Thanks for the feedback!', createdBy: userRefs[1].displayName, commentedDate: new Date('2022-05-03T09:10:00') },
        { content: 'Here’s a reply to your feedback.', createdBy: userRefs[0].displayName, commentedDate: new Date('2022-05-03T09:25:00') },
        { content: 'A follow-up question about your reply.', createdBy: userRefs[3].displayName, commentedDate: new Date('2023-04-27T18:15:00') }
    ];


    const commentRefs = await Promise.all(comments.map(createComment));
    const posts = [
        {
            title: 'First Post',
            content: 'This is the content of the first post.',
            createdBy: userRefs[0].displayName,
            commentIDs: [commentRefs[0]._id, commentRefs[1]._id],
            postedDate: new Date('2018-06-01T14:00:00'),
            linkFlairID: linkFlairRefs[2]._id
        },
        {
            title: 'Second Post',
            content: 'This is the content of the second post.',
            createdBy: userRefs[1].displayName,
            commentIDs: [commentRefs[2]._id],
            postedDate: new Date('2020-10-05T11:15:00'),
            linkFlairID: linkFlairRefs[1]._id
        }
    ];
    const postRefs = await Promise.all(posts.map(createPost));


    const communities = [
        {
            name: 'Community One',
            description: 'This is the first community.',
            createdBy: userRefs[0].displayName,
            postIDs: [postRefs[0]._id],
            members: [userRefs[0]._id, userRefs[1]._id],
            startDate: new Date('2018-05-15T09:30:00')
        },
        {
            name: 'Comfmunity Two',
            description: 'This is the second community.',
            createdBy: userRefs[1].displayName,
            postIDs: [postRefs[1]._id],
            members: [userRefs[2]._id, userRefs[3]._id],
            startDate: new Date('2020-09-25T13:45:00')
        }
    ];
    await Promise.all(communities.map(createCommunity));

     // Create admin user
     try {
        const adminUser = await createAdminUser(adminEmail, adminDisplayName, adminPassword);
        console.log('Admin user created:', adminUser.email);
    } catch (err) {
        console.error('Failed to create admin user:', err.message);
        return;
    }

    if (db) {
        db.close();
    }
    console.log("done");
}

initializeDB()
    .catch((err) => {
        console.log('ERROR: ' + err);
        console.trace();
        if (db) {
            db.close();
        }
    });

console.log('processing...');