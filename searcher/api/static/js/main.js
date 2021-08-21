document.addEventListener('DOMContentLoaded', function () {
    $('.filter-button').on('click', () => {
        let filter_form = {
          query: $('.query-input').val(),
          subs_lo: $('.min-sub-input').val(),
          subs_hi: $('.max-sub-input').val(),
          avg_likes: $('.avg-likes-input').val(),
          avg_views: $('.avg-views-input').val(),
        };
    
        console.log(filter_form);

        fetch('/bloger/search', {
            method: 'post',
            body: JSON.stringify(filter_form)
        })
        .then(response => {
            if (response.status !== 200) {
                console.log("Nothing. Status: " + response.status);
                return;
            }
    
            response.json().then(data => {
                console.log(data);
            });
        })
        .catch(error => {
            console.log("Fetch error: -S", error);
        });
    });
});
