document.addEventListener('DOMContentLoaded', function () {
    $('.map-block').hide();
    $('.feedback-block').hide();

    $(document.body).on('click', '.trip-card', function () {
        $(this).parent().find('.trip-card').css('background-color', 'rgba(255, 255, 255, var(--tw-bg-opacity))');
        $(this).css('background-color', 'rgba(244, 244, 245, var(--tw-bg-opacity))');

        let bloger_req = {
            name: 'Мифы и Легенды Самары'
        }

        fetch('/trip/bloger', {
            method: 'post',
            body: JSON.stringify(bloger_req)
        })
        .then(response => {
            if (response.status !== 200) {
                console.log("Nothing. Status: " + response.status);
                return;
            }
    
            response.json().then(data => {
                console.log(data);
                
                let blogers_cards_html = "";

                data.blogers.forEach((bloger, key, blogers) => {
                    blogers_cards_html += `
                    <div class="trip-card cursor-pointer bg-white p-3 flex flex-col rounded-md dark:bg-gray-800 shadow">
                        <div class="flex xl:flex-row flex-col items-center font-medium text-gray-900 dark:text-white pb-2 mb-2 xl:border-b border-gray-200 border-opacity-75 dark:border-gray-700 w-full">
                            <img src="${bloger.photo}" class="w-7 h-7 mr-2 rounded-full" alt="profile" />
                            <a href="${bloger.link}" target="_blank">${bloger.name}</a>
                            <div class="network">
                                <div class="text-gray-400">${bloger.welness}</div>
                                <i class="fab fa-instagram network-icon"></i>
                            </div>
                        </div>
                    </div>
                `;
                });

                $('.blogers-col').html(blogers_cards_html);
            });
        })
        .catch(error => {
            console.log("Fetch error: -S", error);
        });
    });


    $('.email-view-button').on('click', () => {
        $('.email-view-button').addClass('bg-blue-100 text-blue-500');
        $('.feedback-view-button').removeClass('bg-blue-100 text-blue-500');

        $('.map-block').hide();
        $('.feedback-block').hide();

        $('.filter-and-cards-block').show();
        $('.email-block').show();
    });

    $('.feedback-view-button').on('click', () => {

        $('.feedback-view-button').addClass('bg-blue-100 text-blue-500');
        $('.email-view-button').removeClass('bg-blue-100 text-blue-500');

        $('.filter-and-cards-block').hide();
        $('.email-block').hide();

        $('.map-block').show();
        $('.feedback-block').show();
    });

    fetch('/trip/get')
    .then(response => {
        if (response.status !== 200) {
            console.log("Nothing. Status: " + response.status);
            return;
        }

        response.json().then(data => {
            console.log(data);

            let trip_cards_html = "";

                data.trips.forEach((trip, key, trips) => {
                    console.log(trip);

                    trip_cards_html += `
                    <div class="trip-card cursor-pointer bg-white p-3 flex flex-col rounded-md dark:bg-gray-800 shadow">
                        <div class="flex xl:flex-row flex-col items-center font-medium text-gray-900 dark:text-white pb-2 mb-2 xl:border-b border-gray-200 border-opacity-75 dark:border-gray-700 w-full">
                            <div class="trip-name">${trip.name}</div>
                        </div>
                        <div class="flex items-center w-full margin-down-5">
                            <div class="text-xs py-1 px-2 leading-none dark:bg-gray-900 bg-blue-100 text-blue-500 rounded-md">Начало</div>
                            <div class="ml-auto text-xs text-gray-500">${trip.date_start}</div>
                        </div>
                        <div class="flex items-center w-full margin-down-5">
                            <div class="text-xs py-1 px-2 leading-none dark:bg-gray-900 bg-blue-100 text-blue-500 rounded-md">Конец</div>
                            <div class="ml-auto text-xs text-gray-500">${trip.date_end}</div>
                        </div>
                        <div class="flex items-center w-full margin-down-5">
                            <div class="text-xs py-1 px-2 leading-none dark:bg-gray-900 bg-yellow-100 text-yellow-600 rounded-md">Описание</div>
                        </div>
                        <div class="text-xs text-gray-400">${trip.description}</div>
                    </div>
                `;
                });

                $('.trips-col').html(trip_cards_html);
        });
    })
    .catch(error => {
        console.log("Fetch error: -S", error);
    });

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

            $('.send-email-button').toggleClass("bg-blue-500 bg-green-100");
            $('.send-email-button').addClass("text-green-600");
            $('.send-email-button').text("Отправлено!");
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

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 53.1955, lng: 50.102179 },
        zoom: 11,
    });

    fetch('/attraction/get')
    .then(response => {
        if (response.status !== 200) {
            console.log("Nothing. Status: " + response.status);
            return;
        }

        response.json().then(data => {
            console.log(data);

            data.attractions.forEach(element => {
                let content_info = `
                    <div class="flex xl:flex-col flex-row items-center font-medium text-gray-900 dark:text-white pb-2 border-gray-200 border-opacity-75 dark:border-gray-700 w-full">
                        <img src="${element.photo}" class="w-20 h-20 mr-2 rounded-full" alt="profile" />
                        <div class="sightseeing-name-popular">
                            <div class="text-lg sightseeing-name">${element.name}</div>
                            <div class="popularity flex flex-row justify-start">
                                <div>Популярность: </div>
                                <div class="text-gray-400 network">${element.curr_interest - element.base_interest}</div>
                                ${interest_arrow(element.curr_interest, element.base_interest)}
                            </div>
                        </div>
                    </div>
                `;

                const infowindow = new google.maps.InfoWindow({
                    content: content_info,
                });

                const marker = new google.maps.Marker({
                    position: { lat: element.lat, lng: element.lng },
                    map,
                });

                marker.addListener("click", () => {
                    infowindow.open({
                        anchor: marker,
                        map,
                        shouldFocus: false,
                    });
                });
            });
        });
    })
    .catch(error => {
        console.log("Fetch error: -S", error);
    });
}

function interest_arrow(current, base) {
    if (current - base >= 0) {
        return '<i class="fas fa-arrow-up green-arrow-up"></i>';
    }
    else {
        return '<i class="fas fa-arrow-down red-arrow-down"></i>';
    }
}