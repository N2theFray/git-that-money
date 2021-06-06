 async function editFormHandler(event, el) {
    event.preventDefault();
    
    
    
    const title = document.querySelector('input[name="post-title"]').value.trim();
    const post_content = document.querySelector('textarea[name="post-content"]').value.trim()
    const id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
    
    let contact = true
    let interview = true

    console.log(el)
    if(el === 'true'){
      contact = true;
      interview = false;
    } 
    
    if (el === 'false'){
      contact = false;
      interview = true;
    }

    console.log(contact)
    console.log(interview)

    
    const response = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title,
        post_content,
        contact,
        interview
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (response.ok) {
      document.location.replace(`/dashboard/post/${id}`);
    } else {
      alert(response.statusText);
    }
  }

  function madeContact (){
    let el = 'true'
    editFormHandler( event,el)
  }

  function interviewScheduled (){
    let el = 'false'
    editFormHandler(event, el)
  }
  
  document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);