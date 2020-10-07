document.addEventListener('DOMContentLoaded', function() {
    console.log("Page loaded");
    // load default index page
    document.querySelector('#submit_post').addEventListener("click", create_post);



});

// Create new post
function create_post() {
body = document.querySelector("#post-body").value;
    fetch(`create/`, {
        method: 'POST',
        body: JSON.stringify({
            Body: body,
        })
    })

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
        document.querySelector(`#card-body`).style = "padding: 20px;";
        document.querySelector(`#p-body-${post_id}`).innerHTML = body_value;
}