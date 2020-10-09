document.addEventListener('DOMContentLoaded', function() {
    // clear textarea for new post
    document.querySelector('#post-body').value = "";

    // enable / disable post button based on user input
    document.querySelector('#post-body').addEventListener('keyup', function() {
        console.log(this.value.length);
        if (this.value.length > 0) {
            document.querySelector('#submit_post').className = "btn btn-primary";
            document.querySelector('#submit_post').removeAttribute('disabled');
        }
        else {
            document.querySelector('#submit_post').className = "btn btn-primary";
            document.querySelector('#submit_post').setAttribute('disabled', true);
        }
    });

    // submit new post when clicked on post button
    document.querySelector('#submit_post').addEventListener("click", create_post);
});



// Create new post
function create_post() {
const body = document.querySelector("#post-body").value;
    if (body.length > 0) {
        fetch(`create/`, {
            method: 'POST',
            body: JSON.stringify({
                Body: body,
            })

        })

    }

}


// Update existing post
function update_post(post_id) {
    console.log(`Update post ${post_id}..`);
    const div_post = document.querySelector(`#post-${post_id}`);
        let text_body = '';
    fetch(`/post/${post_id}`)
      .then(response => response.json())
      .then(post => {
          // Print posts
          console.log(post.body);
          text_body = post.body;

          // Fill this data to textarea field
          div_post.querySelector(`#p-body-${post_id}`).style.display = "none";
          div_post.querySelector(`#card-body`).style.padding = "0px";
          div_post.querySelector(`#post-body-${post_id}`).className = "form-control";
          div_post.querySelector(`#post-body-${post_id}`).style = "width: 100%; padding: 10px; height: 100px; resize: none; border-radius: 0px; max-length: 500;display=block;";
          div_post.querySelector(`#post-body-${post_id}`).value = post.body;

          // show save button
          div_post.querySelector(`#save-button-${post_id}`).style = 'display: block; margin-top: 5px;';

          // button on main page
            div_post.querySelector(`#save-button-${post_id}`).addEventListener('click', () => {
            fetch(`/update/${post_id}`, {
            method: 'PUT',
             body: JSON.stringify({
                      Body: div_post.querySelector(`#post-body-${post_id}`).value,

                  })

                })
                .then(result => {
                    setTimeout(function() { switch_view(post_id); }, 500);

                 });
            });

      });

}


// --------------------------   SWITCH VIEW ----------------------------------------------------------------------------
function switch_view(post_id) {
        const body_value = document.querySelector(`#post-body-${post_id}`).value;
        document.querySelector(`#p-body-${post_id}`).style.display = "block";
        document.querySelector(`#post-body-${post_id}`).style.display = 'none';
        document.querySelector(`#save-button-${post_id}`).style.display = 'none';
        document.querySelector(`#p-body-${post_id}`).innerHTML = body_value;
        document.querySelector(`#p-body-${post_id}`).style = "padding: 20px;";
}


// ---------------------------- REFRESH LIKE DISPLAY AFTER ADD REMOVE --------------------------------------------------
function likes(post_id) {
    console.log("Like/Unlike toggler");
            fetch(`/post/${post_id}`,{
                method: 'PUT'

    });


    const div_post = document.querySelector(`#post-${post_id}`);
    const like_button_color = div_post.querySelector('#like-button').style.color;
    if (like_button_color === "red") {
        div_post.querySelector('#like-button').style.color = "darkgray";
        div_post.querySelector('#like-button').setAttribute('title', 'like');
        var count = div_post.querySelector("#like-counter");
        var update_count = parseInt(count.innerHTML) - 1;
        count.innerHTML = update_count.toString();
    }
    else {
        div_post.querySelector('#like-button').style.color = "red";
        div_post.querySelector('#like-button').setAttribute('title', 'unlike');
        var count = div_post.querySelector("#like-counter");
        var update_count = parseInt(count.innerHTML) + 1;
        count.innerHTML = update_count.toString();
    }

}


function follow_toggler(user_id){
    console.log("Executed Follow toggler for user id: " + user_id);
    fetch(`/follow/${user_id}`,{
                method: 'PUT'

    });

    let follow_button = document.querySelector('#follow-button');
    if (follow_button.innerHTML === "Follow"){
        document.querySelector('#follow-button').className = 'btn btn-sm btn-danger';
        document.querySelector('#follow-button').innerHTML = 'Un-Follow';
        var count = document.querySelector("#followers-count");
        var update_count = parseInt(count.innerHTML) + 1;
        count.innerHTML = update_count.toString();
    }
    else {
        document.querySelector('#follow-button').className = 'btn btn-sm btn-primary';
        document.querySelector('#follow-button').innerHTML = 'Follow';
        var count = document.querySelector("#followers-count");
        var update_count = parseInt(count.innerHTML) -1;
        count.innerHTML = update_count.toString();
    }
}