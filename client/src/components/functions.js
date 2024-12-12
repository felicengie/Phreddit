
import React from 'react';
import { UsePhredditContext } from './phredditContext';
import { deleteComment, fetchPost, fetchComment, deletePost, updateComment, updatePost } from './api';


export function displayPosts({ showCommunityName = true, posts }) {
  const { currentPage, communities, comments, linkflairs, loadPage, user } = UsePhredditContext();
  let memberPosts = [];
  let nonMemberPosts = [];

  if(user && (currentPage === "home" || currentPage === "searchResults")){
    // Separate posts into two categories based on membership
      memberPosts = posts.filter(post => {
      const community = communities.find(c => c.postIDs.includes(post._id));
      return community?.members.includes(user.displayName);
    });

      nonMemberPosts = posts.filter(post => {
      const community = communities.find(c => c.postIDs.includes(post._id));
      return !community?.members.includes(user.displayName);
    });

  }
 
  const renderPosts = (postArray, label) => {
    if (postArray.length === 0) return null; // Do not render section if no posts

    return (
      <>
        {label && <h3 className="post-section-label">{label}</h3>}
        {postArray.map(post => {
          const community = communities.find(c => c.postIDs.includes(post._id));
          const postUser = post.createdBy;
          const postTime = getTimeDifference(post.postedDate.toLocaleString());
          const postFlair = linkflairs.find(f => f._id === post.linkFlairID)?.content || '';
          const commentCount = calculateCommentCount(post, comments);

          const communityName = showCommunityName ? `${community?.name || 'Unknown Community'} | ` : '';

          return (
            <div key={post._id} className="card-list">
              <a
                href="#"
                className="post-link"
                onClick={e => {
                  e.preventDefault();
                  loadPage('post', null, post._id);
                }}
              >
                <div className = "card">
                  <div className="post-header">{communityName}{postUser} | {postTime}</div>
                  <h2 className="post-title">{post.title}</h2>
                  <p>{postFlair}</p>
                  <p>{post.content.substring(0, 80)}...</p>
                  <div>Views: {post.views} | Comments: {commentCount} | Vote Count: {post.upvoters.length - post.downvoters.length} </div>
                </div>
              </a>
            </div>
          );
        })}
      </>
    );
  };


  return (
    <div className="post-list">
      {user && (currentPage === "home" || currentPage === "searchResults") ? (
        <>
          {renderPosts(memberPosts, "Posts from Communities You Are Part Of")}
          {renderPosts(nonMemberPosts, "Other Posts")}
        </>
      ) : (
        renderPosts(posts) // No filtering, just render posts as-is
      )}
    </div>
  );
}


export function getTimeDifference(submittedDate) {
    const now = new Date();  // Current date and time
    const submitted = new Date(submittedDate);  // The date the item was submitted
    
    const diffInSeconds = Math.floor((now - submitted) / 1000);  // Difference in seconds
    
    // Less than 1 minute (seconds)
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
  
    // Less than 1 hour (minutes)
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }
  
    // Less than 24 hours (hours)
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }
  
    // Less than 30 days (days)
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} days ago`;
    }
  
    // Less than 12 months (months)
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month(s) ago`;
    }
  
    // More than 1 year (years)
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year(s) ago`;
  }

  // sortPosts.js
export function sortPosts(posts, type, comments = null) {
    let sortedPosts = [];
    switch (type) {
      case 'newest':
        sortedPosts = [...posts].sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
        break;
      case 'oldest':
        sortedPosts = [...posts].sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
        break;
        case 'active':
          // Sort by the latest comment date (including replies)
          sortedPosts = [...posts].sort((a, b) => {
              const latestCommentA = Math.max(...a.commentIDs.map(commentID => getLatestCommentDate(commentID, comments)));
              const latestCommentB = Math.max(...b.commentIDs.map(commentID => getLatestCommentDate(commentID, comments)));
              return latestCommentB - latestCommentA; // Sort descending
          });
          break;
      default:
        sortedPosts = posts;
    }
    return sortedPosts;
  }
  
  // Helper function to recursively find the latest comment date (including replies)
export function getLatestCommentDate(commentID, comments) {
  const comment = comments.find(c => c._id === commentID);

  // Get the latest date of the current comment
  let latestDate = new Date(comment.commentedDate).getTime();

  // Recursively check all replies to this comment (if any) and update the latest date
  comment.commentIDs.forEach(replyID => {
      const replyDate = getLatestCommentDate(replyID, comments); // Recursive call for replies
      if (replyDate > latestDate) {
          latestDate = replyDate;
      }
  });

  return latestDate;
}

  export function calculateCommentCount(post, comments) {
    // Helper function to count comments recursively
    //console.log("POST", post)
    // console.log("comments: ", comments)
    const countReplies = (commentIDs) => { 
      let totalCount = 0;
      commentIDs.forEach(id => {
        const comment = comments.find(c => c._id === id);
        //console.log("found comment:", comment)
        if (comment) { totalCount += 1 + countReplies(comment.commentIDs); }
      });
      return totalCount;
    };
    return countReplies(post.commentIDs);
  }


  // export const deleteCommentsRecursively = async (comment) => {
  //   const {comments, setComments} = UsePhredditContext()
  //   console.log(comment)
  //   try {
  //     // If the comment has replies (commentIDs), recursively delete those first
  //     if (comment.commentIDs && comment.commentIDs.length > 0) {
  //       for (const replyId of comment.commentIDs) {
  //         const reply = comments.find((r) => r._id === replyId);
  //         await deleteCommentsRecursively(reply); // Recursively delete each reply
  //       }
  //     }
  
  //     // Now that all replies are deleted, delete the current comment
  //     await deleteComment(comment._id);
  //     console.log(`Deleted comment with ID: ${comment._id}`);
  
  //     // Optionally, remove the deleted comment from the state to update the UI
  //     // This assumes you have a state like 'comments' where you store the comments list
  //     setComments((prevComments) =>
  //       prevComments.filter((c) => c._id !== comment._id)
  //     );
  //     console.log(`comments array: ${comments}`);
      
  //   } catch (error) {
  //     console.error('Error deleting comment:', error);
  //   }
  // };

  // export const deletePosts = async (postIDs) => {
  //   const {setPosts, posts} = UsePhredditContext()
  //   try {
  //       for (const postID of postIDs) {
  //         console.log(`Deleting post with ID: ${postID}`);
            
  //         const post = await fetchPost(postID);
  //         if (!post) {
  //           console.warn(`Post with ID: ${postID} not found or already deleted.`);
  //           return;
  //         }
          
  //         console.log(`Post with ID: ${postID} fetched successfully.`);

  //         // Step 2: Fetch and recursively delete associated comments
  //           if (post.commentIDs && post.commentIDs.length > 0) {
  //               console.log(`Processing ${post.commentIDs.length} comments associated with the post.`);
  //               for (const commentID of post.commentIDs) {
  //               console.log("CommentID: ", commentID)
  //               const comment = await fetchComment(commentID);
  //               if (comment) {
  //                   await deleteCommentsRecursively(comment); // Call the recursive function directly
  //               }
  //               }
  //           }
  //         // Call the API to delete the post
  //           await deletePost(postID); // Ensure `deletePost` is implemented to make an API request
  //           // Update the state to remove the deleted post
  //           setPosts((prevPosts) =>
  //               prevPosts.filter((p) => p._id !== postID)
  //           );
  //           console.log(`Post with ID: ${postID} deleted successfully.`);
  //       }
  //       console.log("All posts in the community have been deleted.");
  //       console.log("posts array now: ", posts)
      
  //   } catch (error) {
  //       console.error("Error deleting posts:", error);
  //   }
  // }


export function usePostDeletion() {
  const { setPosts, setComments, posts, comments } = UsePhredditContext();

  const deleteCommentsRecursively = async (comment) => {
    try {
      if (comment.commentIDs && comment.commentIDs.length > 0) {
        for (const replyId of comment.commentIDs) {
          const reply = comments.find((r) => r._id === replyId);
          if (reply) await deleteCommentsRecursively(reply); // Recursive call
        }
      }
      await deleteComment(comment._id);
      setComments((prevComments) => prevComments.filter((c) => c._id !== comment._id));

      const parentComment = comments.find((parent) => parent.commentIDs.includes(comment._id));
      if (parentComment) {
       // Remove the current comment's _id from the parent's commentIDs array
    const updatedCommentIDs = parentComment.commentIDs.filter((id) => id !== comment._id);

    // Make an API call to update the parent comment in the database
        try {
            await updateComment(parentComment._id, { commentIDs: updatedCommentIDs });
            console.log(`Parent comment ${parentComment._id} updated successfully in the database.`);
        } catch (error) {
            console.error(`Error updating parent comment ${parentComment._id}:`, error);
            return; 
        }

        // Update the parent comment in the state
        setComments((prevComments) =>
            prevComments.map((c) =>
                c._id === parentComment._id ? { ...c, commentIDs: updatedCommentIDs } : c
            )
        );
      }

      const post = posts.find((p) => p.commentIDs && p.commentIDs.includes(comment._id));
      if (post) {
          // Remove the deleted comment _id from the post's commentIDs array
          const updatedCommentIDs = post.commentIDs.filter((id) => id !== comment._id);

          // Make an API call to update the post in the database
          try {
              await updatePost(post._id, { commentIDs: updatedCommentIDs });
              console.log(`Post ${post._id} updated successfully in the database.`);
          } catch (error) {
              console.error(`Error updating post ${post._id}:`, error);
              return; // Optionally handle this error to avoid further processing
          }

          // Update the post in the state
          setPosts((prevPosts) =>
              prevPosts.map((p) =>
                  p._id === post._id ? { ...p, commentIDs: updatedCommentIDs } : p
              )
          );
        }


    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const deletePosts = async (postIDs) => {
    try {
      for (const postID of postIDs) {
        const post = await fetchPost(postID);
        if (!post) {
          console.warn(`Post with ID: ${postID} not found or already deleted.`);
          continue;
        }

        if (post.commentIDs && post.commentIDs.length > 0) {
          for (const commentID of post.commentIDs) {
            const comment = await fetchComment(commentID);
            if (comment) {
              await deleteCommentsRecursively(comment);
            }
          }
        }

        console.log(comments)

        await deletePost(postID);
        setPosts((prevPosts) => prevPosts.filter((p) => p._id !== postID));
      }
    } catch (error) {
      console.error('Error deleting posts:', error);
    }
  };

  return { deleteCommentsRecursively, deletePosts };
}
