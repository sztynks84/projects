document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('commentForm');
    const commentsList = document.getElementById('commentsList');
  
    function loadComments() {
      fetch('/comments.json')
        .then(response => response.json())
        .then(comments => {
          commentsList.innerHTML = '';
          comments.forEach(comment => {
            const div = document.createElement('div');
            div.innerHTML = `<strong>${comment.name}</strong>: ${comment.comment}`;
            commentsList.appendChild(div);
          });
        });
    }
  
    form.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const name = document.getElementById('name').value;
      const comment = document.getElementById('comment').value;
  
      fetch('/comments.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, comment })
      })
      .then(response => response.json())
      .then(() => {
        loadComments();
        form.reset();
      })
      .catch(error => {
        console.error('Błąd podczas wysyłania komentarza:', error);
      });
    });
  
    loadComments();
  });
  