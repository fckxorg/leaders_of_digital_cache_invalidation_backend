document.addEventListener('DOMContentLoaded', function () {
    $('.send-email-button').on('click', () => {
        let blogers_names = [];

        $('.email-checkbox:checkbox:checked').each((index, cur_elem) => {
            let cur_elem_id = $(cur_elem).attr('id');
            let name = cur_elem_id.split('-input', 1);

            blogers_names.push({name: name[0]});
        });


        let email_form = {
            subject: $('.mail-subject-input').val(),
            template: $('.mail-template-input').val(),
            blogers: blogers_names
        }

        fetch('/bloger/send_email', {
            method: 'post',
            body:JSON.stringify(email_form)
        })
        .then(response => {
            if (response.status !== 200) {
                console.log("Nothing. Status: " + response.status);
                return;
            }
        })
        .catch(error => {
            console.log("Fetch error: -S", error);
        });

        console.log(email_form);
    });


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
                console.log(data.blogers);

                let bloger_cards_html = "";

                data.blogers.forEach((bloger, key, blogers) => {
                    console.log(bloger);

                    let bloger_card_class = 'bloger-card'
                    if (key % 2 !== 0) {
                        bloger_card_class = 'last-bloger-card';
                    }

                    bloger_cards_html += `
                    <div class="${bloger_card_class} bg-white p-3 flex flex-col rounded-md dark:bg-gray-800 shadow">
                        <div class="flex xl:flex-row flex-col items-center font-medium text-gray-900 dark:text-white pb-2 mb-2 xl:border-b border-gray-200 border-opacity-75 dark:border-gray-700 w-full">
                            <img src="${bloger.photo}" class="w-7 h-7 mr-2 rounded-full" alt="profile" />
                            <a href="${bloger.link}" target="_blank">${bloger.name}</a>
                        <div class="network">
                        <div class="text-gray-400">${bloger.welness}</div>
                            ${network_icon(bloger.network)}
                            </div>
                        </div>
                        <div class="flex items-center w-full margin-down-5">
                            <div class="text-xs py-1 px-2 leading-none dark:bg-gray-900 bg-blue-100 text-blue-500 rounded-md">Почта</div>
                            <div class="ml-auto text-xs text-gray-500">${bloger.email}</div>
                        </div>
                        <div class="flex items-center w-full margin-down-5">
                            <div class="text-xs py-1 px-2 leading-none dark:bg-gray-900 bg-blue-100 text-blue-500 rounded-md">Телефон</div>
                            <div class="ml-auto text-xs text-gray-500">${bloger.phone}</div>
                        </div>
                        <div class="flex items-center w-full margin-down-5">
                            <div class="text-xs py-1 px-2 leading-none dark:bg-gray-900 bg-yellow-100 text-yellow-600 rounded-md">Подписчики</div>
                            <div class="ml-auto text-xs text-gray-400">${bloger.subs}</div>
                        </div>
                        <div class="flex items-center w-full margin-down-5">
                            <div class="text-xs py-1 px-2 leading-none dark:bg-gray-900 bg-yellow-100 text-yellow-600 rounded-md">Лайки</div>
                            <div class="ml-auto text-xs text-gray-400">${bloger.avg_likes}</div>
                        </div>
                        <div class="flex items-center w-full margin-down-5">
                            <div class="text-xs py-1 px-2 leading-none dark:bg-gray-900 bg-yellow-100 text-yellow-600 rounded-md">Просмотры</div>
                            <div class="ml-auto text-xs text-gray-400">${bloger.avg_view}</div>
                        </div>

                        <div class="flex items-center w-full">
                            <div class="text-xs py-1 px-2 leading-none dark:bg-gray-900 bg-green-100 text-green-600 rounded-md">Выбрать</div>
                            <input type="checkbox" class="ml-auto text-xs text-gray-400 email-checkbox" id="${bloger.name}-input"></input>
                        </div>
                    </div>
                `;
                });

                $('.bloger-cards-container').html(bloger_cards_html);

            });
        })
        .catch(error => {
            console.log("Fetch error: -S", error);
        });
    });
});

function network_icon(name) {
    if (name === 'youtube') {
        return '<i class="fab fa-youtube network-icon youtube-icon"></i>';
    } 
    else if (name === 'instagram') {
        return '<i class="fab fa-instagram network-icon"></i>';
    }
}

function bloger_card_class(blogers, ) {

}
