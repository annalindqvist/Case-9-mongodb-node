function handleDelete(id) {
    fetch(`/profile/${id}`, {
            method: "DELETE"
        })
        .then((res) => {
            if (res.redirected) {
                window.location.href = res.url;
            }
        })
        .catch((err) => console.log(err));
}


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
            .then((res) => {
                if (res.redirected) {

                    window.location.href = res.url;
                }
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