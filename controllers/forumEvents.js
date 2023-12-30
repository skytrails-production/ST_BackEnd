const Forum = require('../model/forum');
const User = require('../model/user.model');
const { WebSocketServer } = require('websocket');

const wsServer = WebSocketServer;

function handleNewForumPost(post) {
    // Save the new forum post to the database
    Forum.create(post)
        .then((createdPost) => {
            console.log("createdPost-=-", createdPost);
            // Broadcast the new post to all connected clients
            const message = JSON.stringify({ type: 'new-post', data: createdPost });
            wsServer.broadcast(message);
        })
        .catch((error) => {
            console.error('Error creating a new forum post:', error);
        });
}

// Event handler for a new comment on a forum post
function handleNewForumComment(comment, postId) {
    // Find the forum post by postId and add the comment
    Forum.findByIdAndUpdate(
        postId,
        { $push: { comments: comment } },
        { new: true }
    )
        .then((updatedPost) => {
            if (updatedPost) {
                // Broadcast the updated post to all connected clients
                const message = JSON.stringify({ type: 'new-comment', data: updatedPost });
                wsServer.broadcast(message);
            }
        })
        .catch((error) => {
            console.error('Error adding a new comment to a forum post:', error);
        });
}

// Event handler for liking a forum post
function handleLikeForumPost(userId, postId) {
    // Find the forum post by postId and update the likes
    Forum.findByIdAndUpdate(
        postId,
        { $push: { likes: { user: userId } } },
        { new: true }
    )
        .then((updatedPost) => {
            if (updatedPost) {
                // Broadcast the updated post to all connected clients
                const message = JSON.stringify({ type: 'like-post', data: updatedPost });
                wsServer.broadcast(message);
            }
        })
        .catch((error) => {
            console.error('Error liking a forum post:', error);
        });
}

function handleChatMessage(message, senderConnection) {
    // Broadcast the chat message to all connected clients
    const messageObject = JSON.parse(message);
    const messageToBroadcast = JSON.stringify({
        type: 'chat-message',
        data: {
            message: messageObject.message,
            sender: messageObject.sender,
        },
    });
    wsServer.broadcast(messageToBroadcast);
}


module.exports = {
    handleNewForumPost,
    handleNewForumComment,
    handleLikeForumPost,
    handleChatMessage,
};