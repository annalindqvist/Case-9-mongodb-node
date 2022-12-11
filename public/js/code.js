function handleDelete(id) {
    fetch(`/profile/${id}`, {
            method: "DELETE"
        })
        .then(response => response.json())
        .then((data) => {
            // remove post
            document.getElementById(id).remove();
            // add json response for visual feedback and add class for styling
            document.getElementById("flash-message-feedback").innerText = data.message.feedback;
            let element = document.getElementsByClassName("flash-message");
            for (var i = 0; i < element.length; i++) {
                element[i].classList.add(data.message.type);
                element[i].classList.add('fadeout');
                element[i].style.display = "block";
            }
        })
        .catch((err) => console.log(err));
};

function handleUpdate(id, post, visibility) {

    const updatePostFormContainer = document.getElementById("updatePostForm");
    updatePostFormContainer.style.display = "block";
    const updatePostForm = document.getElementById("update-form");
    

    updatePostForm.elements.post.value = post;
    updatePostForm.elements.visibility.value = visibility;

    updatePostForm.onsubmit = (e) => {
        e.preventDefault();

        const updatedPost = updatePostForm.elements.post.value;
        const updatedVisibility = updatePostForm.elements.visibility.value;

        if(updatePostFormContainer.style.display === 'none') {
            updatePostFormContainer.style.display = "block";
    
        } else {
            updatePostFormContainer.style.display = "none";
        }
  

        fetch(`/profile/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    post: updatedPost,
                    visibility: updatedVisibility
                }),
            })
            .then(response => response.json())
            .then((data) => {
                // add json response for visual feedback and add class for styling
                document.getElementById("flash-message-feedback").innerText = data.message.feedback;

                let element = document.getElementsByClassName("flash-message");
                for (var i = 0; i < element.length; i++) {
                    element[i].classList.add(data.message.type);
                    element[i].classList.add("fadeout");
                    element[i].style.display = "block";
                }

                // update the post
                let postEl = document.getElementById(`post.${id}`);
                let visibilityEl = document.getElementById(`visibility.${id}`);
                postEl.innerText = updatedPost;
                visibilityEl.innerText = updatedVisibility;

                // for now - update the edit form with value of the last edit
                updatePostForm.elements.post.value = updatedPost;
                updatePostForm.elements.visibility.value = updatedVisibility;

            })
            .catch((err) => console.log(err));
    }
}

function handleComment(id) {

    const commentForm = document.getElementById(`comment-form.${id}`);


    if(commentForm.style.display === 'none') {
        commentForm.style.display = "block";

    } else {
        commentForm.style.display = "none";
    }
   

    commentForm.onsubmit = (e) => {
        e.preventDefault();

        const comment = commentForm.elements.comment.value;

        fetch(`/dashboard/comment/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    comment: comment
                }),
            })
            .then((res) => {
                if (res.redirected) {
                    window.location.href = res.url;
                }
            })
            .catch((err) => console.log(err));
    }
}

function handleLike(id) {

    fetch(`/dashboard/like/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => response.json())
            .then((data) => {
                // add json response for visual feedback and add class for styling
                document.getElementById("flash-message-feedback").innerText = data.message.feedback;

                let element = document.getElementsByClassName("flash-message");
                for (var i = 0; i < element.length; i++) {
                    element[i].classList.add(data.message.type);
                    element[i].classList.add("fadeout");
                    element[i].style.display = "block";
                }
                console.log(data);


                // // update the post
                let postLikeCount = document.getElementById(`postLikeCount.${id}`);


                if(data.message.like == 1) {
                    let num1 = parseInt(postLikeCount.innerText);
                    if(isNaN(num1)|| num1 == null) {
                        num1 = 0;
                    }
                    postLikeCount.innerText = num1 + 1;

                } else if (data.message.like == -1) {
                    let num1 = parseInt(postLikeCount.innerText);
                    if(isNaN(num1) || num1 == null) {
                        num1 = 0;
                    }
                   
                    postLikeCount.innerText = num1 + -1;
                    if (postLikeCount.innerText == 0) {
                        postLikeCount.innerText = "";
                    }
                }
                 else {
                    let num1 = parseInt(postLikeCount.innerText);
                    if(isNaN(num1) || num1 == null) {
                        num1 = 0;
                    }
                   
                    postLikeCount.innerText = num1;
                } 
                  
               

            })
       
        .catch((err) => console.log(err));
}

function timeSince(date) {

    if (typeof date !== 'object') {
        date = new Date(date);
    }

    let seconds = Math.floor((new Date() - date) / 1000);
    let intervalType;

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        intervalType = 'y';
    } else {
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            intervalType = 'month';
        } else {
            interval = Math.floor(seconds / 86400);
            if (interval >= 1) {
                intervalType = 'd';
            } else {
                interval = Math.floor(seconds / 3600);
                if (interval >= 1) {
                    intervalType = "h";
                } else {
                    interval = Math.floor(seconds / 60);
                    if (interval >= 1) {
                        intervalType = "m";
                    } else {
                        interval = seconds;
                        intervalType = "s";
                    }
                }
            }
        }
    }
    
    // console.log(interval + ' ' + intervalType);
    return interval + ''+ intervalType;
};

function postMenu(id) {

   let liElement = document.getElementById(id);
   const menuContainer = liElement.getElementsByClassName('postMenu')[0];

    console.log(menuContainer)

    if(menuContainer.style.display === 'none') {
        menuContainer.style.display = "block";

    } else {
        menuContainer.style.display = "none";
    }
}


function sharePost() {
    const sharePostElement = document.getElementById("sharePostContainer");

    if(sharePostElement.style.display === 'none') {
        sharePostElement.style.display = "block";

    } else {
        sharePostElement.style.display = "none";
    }
}
