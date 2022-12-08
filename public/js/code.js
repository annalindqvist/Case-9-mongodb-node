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

newDate("Tue Dec 06 2022 12:43:52 GMT+0100 (centraleuropeisk normaltid)")

function newDate(date) {

    let dateOfPost = new Date(date);
    let day = dateOfPost.getDate();
    let month = dateOfPost.getMonth();
    let correctDate = day + " " + month;
    console.log(correctDate)
    return dateOfPost;
}


// function showFlash() {

//     let element = document.getElementsByClassName("flash-message");
//     for (var i = 0; i < element.length; i++) {
//         element[i].classList.add('visibleFlash');
//         setTimeout = ((i) => { element[i].classList = element[i].classList.replace("visibleFlash", ""); }, 4000);
//     }

//     // setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
//     // setTimeout = (() => { flashContainer.classList.remove("visibleFlash"); }, 4000);

// }

function timeSince(date) {
    
    console.log("date", date)

    if (typeof date !== 'object') {
        date = new Date(date);
    }

    let seconds = Math.floor((new Date() - date) / 1000);
    let intervalType;

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        intervalType = 'year';
    } else {
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            intervalType = 'month';
        } else {
            interval = Math.floor(seconds / 86400);
            if (interval >= 1) {
                intervalType = 'day';
            } else {
                interval = Math.floor(seconds / 3600);
                if (interval >= 1) {
                    intervalType = "hour";
                } else {
                    interval = Math.floor(seconds / 60);
                    if (interval >= 1) {
                        intervalType = "minute";
                    } else {
                        interval = seconds;
                        intervalType = "second";
                    }
                }
            }
        }
    }

    if (interval > 1 || interval === 0) {
        intervalType += 's';
    }

    // console.log(interval + ' ' + intervalType);
    return interval + ' ' + intervalType;
};

let aDay = 24 * 60 * 60 * 1000;
console.log("timeSince test", timeSince(new Date("Tue Dec 08 2022 09:43:52 GMT+0100 (centraleuropeisk normaltid)")));

