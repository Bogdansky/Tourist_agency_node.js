function logout(){
    window.location = "/";
}

function showClients(){
    document.getElementById('clients').hidden = false;
    document.getElementById('tours').hidden = true;
    document.getElementById('resorts').hidden = true;
    document.getElementById('countries').hidden = true;
    if (document.getElementById('client_info').children.length == 0){
        $.ajax({
            type: "GET",
            url: "/manager/show_clients",
            success: (data) => {   
                fillClientTable(data);
            }
        });
    }
}

function showTours(){
    document.getElementById('clients').hidden = true;
    document.getElementById('tours').hidden = false;
    document.getElementById('resorts').hidden = true;
    document.getElementById('countries').hidden = true;
    if (document.getElementById('tour_info').children.length == 0){
        $.ajax({
            type: "GET",
            url: "/client/show_tours",
            success: (data) => {   
                fillTourTable(data);
            }
        });
    }
}


function showResorts(){
    document.getElementById('clients').hidden = true;
    document.getElementById('tours').hidden = true;
    document.getElementById('resorts').hidden = false;
    document.getElementById('countries').hidden = true;
    if (document.getElementById('resort_info').children.length == 0){
        $.ajax({
            type: "GET",
            url: "/manager/show_resorts",
            success: (data) => {   
                fillResortTable(data);
            }
        });
    }
}


function showCountries(){
    document.getElementById('clients').hidden = true;
    document.getElementById('tours').hidden = true;
    document.getElementById('resorts').hidden = true;
    document.getElementById('countries').hidden = false;
    if (document.getElementById('country_info').children.length == 0){
        $.ajax({
            type: "GET",
            url: "/manager/show_countries",
            success: (data) => {   
                fillCountryTable(data);
            }
        });
    }
}

function fillTourTable(tours){
    tours.forEach(tour => {
        appendTourCell(tour);
    })
}

function appendTourCell(tour){
    let row = document.createElement("tr");
    row.id = tour.id;
    row.setAttribute("name","tour");
    let radio = document.createElement('input');
    radio.type = "radio";
    radio.name = "tour";
    radio.value = tour.id_resort;
    delete tour.id_resort;
    delete tour.id;
    for(key in tour){
        let td = document.createElement('td');
        td.textContent = tour[key] ? tour[key] : 'Нет данных';
        row.appendChild(td);
    }
    row.appendChild(radio);
    document.getElementById('tour_info').appendChild(row);
}

function fillClientTable(clients){
    clients.forEach(client => {
        appendClientCell(client);
    })
}

function appendClientCell(client){
    let row = document.createElement("tr");
    row.id = client.id;
    row.setAttribute("name","client");
    let radio = document.createElement('input');
    radio.type = "radio";
    radio.name = "client";
    radio.value = client.id;
    appendClient(row, client);
    row.appendChild(radio);
    document.getElementById('client_info').appendChild(row);
}

function appendClient(row, client){
    let surname = document.createElement('td');
    surname.textContent = client.surname;
    let name = document.createElement('td');
    name.textContent = client.name;
    let patronymic = document.createElement('td');
    patronymic.textContent = client.patronymic ? client.patronymic : 'Нет данных';
    let birth = document.createElement('td');
    birth.textContent = client.birthday ? client.birthday : 'Нет данных';
    let status = document.createElement('td');
    status.textContent = client.status ? 'Заблокирован' : 'Активен';
    row.appendChild(surname);
    row.appendChild(name);
    row.appendChild(patronymic);
    row.appendChild(birth);
    row.appendChild(status);
}

function fillResortTable(resorts){
    resorts.forEach(resort => {
        appendResortCell(resort);
    })
}

function appendResortCell(resort){
    let row = document.createElement("tr");
    row.id = resort.id;
    row.setAttribute("name","resort");
    let radio = document.createElement('input');
    radio.type = "radio";
    radio.name = "resort";
    radio.value = resort.video;
    radio.id = resort.id;
    appendResort(row, resort);
    row.appendChild(radio);
    document.getElementById('resort_info').appendChild(row);
}

function appendResort(row, resort){
    let name = document.createElement('td');
    name.textContent = resort.resort;
    let country = document.createElement('td');
    country.textContent = resort.country ? resort.country : 'Нет данных';
    let status = document.createElement('td');
    status.textContent = resort.status ? 'Заблокирован' : 'Активен';
    row.appendChild(name);
    row.appendChild(country);
    row.appendChild(status);
}

function fillCountryTable(countries){
    countries.forEach(country => {
        appendCountryCell(country);
    })
}

function appendCountryCell(country){
    let row = document.createElement("tr");
    row.id = country.id;
    row.setAttribute("name","country");
    let radio = document.createElement('input');
    radio.type = "radio";
    radio.name = "country";
    radio.value = country.id;
    delete country.id;
    for(key in country){
        let td = document.createElement('td');
        td.textContent = country[key] ? country[key] : '-';
        row.appendChild(td);
    }
    row.appendChild(radio);
    document.getElementById('country_info').appendChild(row);
}

function blockClient(){
    let id = document.querySelector('input[name=client]:checked').value;
    if (id){
        $.ajax({
            type: "GET",
            url: '/manager/client_block',
            data: {
                block: 1,
                id: id
            },
            success: (data) => {
                if (data.error){
                    alert(data.error);
                }
                else{
                    window.location.reload();
                }
            }
        })
    }
}

function unblockClient(){
    let id = document.querySelector('input[name=client]:checked').value;
    if (id){
        $.ajax({
            type: "GET",
            data: {
                block: 0,
                id: id
            },
            url: '/manager/client_block',
            success: (data) => {
                if (data.error){
                    alert(data.error);
                }
                else{
                    window.location.reload();
                }
            }
        })
    }
}

function blockResort(){
    let id = document.querySelector('input[name=resort]:checked').id;
    if (id){
        $.ajax({
            type: "GET",
            url: '/manager/resort_block',
            data: {block: 1, id: id},
            success: (data) => {
                if (data.error){
                    alert(data.error);
                }
                else{
                    window.location.reload();
                }
            }
        })
    }
}

function unblockResort(){
    let id = document.querySelector('input[name=resort]:checked').id;
    if (id){
        $.ajax({
            type: "GET",
            url: '/manager/resort_block',
            data: {block: 0, id: id},
            success: (data) => {
                if (data.error){
                    alert(data.error);
                }
                else{
                    window.location.reload();
                }
            }
        })
    }
}

function deleteClient(){
    let id = document.querySelector('input[name=client]:checked').id;
    if (id){
        $.ajax({
            type: "GET",
            url: "/manager/delete_client",
            data: {
                id
            },
            success: (data) => {
                alert(data["result"] || data["error"]);
                if (data.result){
                    window.location.reload();
                }
            }
        })
    }
}

function createTour(){
    let tour = {
        name: document.getElementById('tour_name').value
    };
}