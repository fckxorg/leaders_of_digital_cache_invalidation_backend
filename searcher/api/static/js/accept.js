document.addEventListener('DOMContentLoaded', function () {
    $('.filter-button').on('click', () => {
        let filter_form = {
          name: $('.name-input').val(),
          trip: $('.trip-input').val()
        };
    
        console.log(filter_form);

        fetch('/trip/accept', {
            method: 'post',
            body: JSON.stringify(filter_form)
        })
        .then(response => {
            if (response.status !== 200) {
                console.log("Error! Not accepted. Status: " + response.status);
                return;
            }
            console.log("Status: 200")
            
    
            $('.accept-form').html(`
              <div class="greeter flex xl:flex-row flex-col items-center font-medium text-gray-900 dark:text-white pb-2 mb-2 w-full">
              Спасибо! <br>
              Ожидайте, с вами свяжется наш сотрудник.
              </div>
              `);
            });
        })
});
