function handleDelete(id) {
    fetch(`/profile/${id}`, {
            method: "DELETE"
        })
        .then(response => response.json())
        .then((data) => {
            // remove post
            document.getElementById(id).remove();
            // add json response for visual feedback and add class for styling
            document.getElementById("flash-message").innerText = data.message.feedback;
            let element = document.getElementsByClassName("flash-message");
            for (var i = 0; i < element.length; i++) {
                element[i].classList.add(data.message.type);
                // showFlash();
            }
        })
        .catch((err) => console.log(err));
};

function handleUpdate(id, post, visibility) {

    const updatePostForm = document.getElementById("update-form");
    updatePostForm.hidden = false;

    updatePostForm.elements.post.value = post;
    updatePostForm.elements.visibility.value = visibility;

    updatePostForm.onsubmit = (e) => {
        e.preventDefault();

        const updatedPost = updatePostForm.elements.post.value;
        const updatedVisibility = updatePostForm.elements.visibility.value;
  

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
                document.getElementById("flash-message").innerText = data.message.feedback;

                let element = document.getElementsByClassName("flash-message");
                for (var i = 0; i < element.length; i++) {
                    element[i].classList.add(data.message.type);
                }

                // update the post
                let postEl = document.getElementById(`post.${id}`);
                let visibilityEl = document.getElementById(`visibility.${id}`);
                postEl.innerText = updatedPost;
                visibilityEl.innerText = updatedVisibility;

                // for now - update the edit form with value of the last edit
                console.log("vis", updatedVisibility)
                updatePostForm.elements.post.value = updatedPost;
                updatePostForm.elements.visibility.value = updatedVisibility;

            })
            .catch((err) => console.log(err));
    }
}

function handleComment(id) {

    const commentForm = document.getElementById("comment-form");
    commentForm.style.display = "flex";

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
        .then((res) => {
            if (res.redirected) {

                // should be on backend 
                // if (document.getElementById("likeBtn").setAttribute('name', 'heart')) {
                //     document.getElementById("likeBtn").setAttribute('name', 'heart-outlined');
                // } else {
                //     document.getElementById("likeBtn").setAttribute('name', 'heart');
                // }


                window.location.href = res.url;
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