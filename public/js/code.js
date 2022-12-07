function handleDelete(id) {
    fetch(`/profile/${id}`, {
            method: "DELETE"
        })
        .then(response => response.json())
        .then((data) => {

            console.log("data", data.message);
            document.getElementById(id).remove();
            // need to refresh page to see it 
            document.getElementsByClassName("flash-message").innerText = data.message;
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

                console.log("data", data.message);
                // needs to refresh page to show.. 
                document.getElementsByClassName("flash-message").innerText = data.message;

                // yes or no? works, but if i want to edit it again it gets the "original" edit that was from start..
                let postEl = document.getElementById(`post.${id}`);
                let visibilityEl = document.getElementById(`visibility.${id}`);
                postEl.innerText = updatedPost;
                visibilityEl.innerText = updatedVisibility;
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
                window.location.href = res.url;
            }
        })
        .catch((err) => console.log(err));
}


// remove 
// let jsonData = JSON.stringify(res.json);
// console.log("jsonData", jsonData);

// console.log(res.json)


// document.getElementById(id).remove();
// document.getElementsByClassName("flash-message").innerText = res.json.message;
// console.log("jsonDATA 2", jsonData);
// console.log(res.json)
// //window.location.href = res.url;