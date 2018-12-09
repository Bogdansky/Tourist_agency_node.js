function logout(){
    window.location = "/"
}

function getClientInfo(){
    $.ajax({
        type: "GET",
        url: "/client/info",
        success: (data) => {
            if (data.error){
                alert(error);
            }
            else{
                fillClientInfo(data);
            }
        }
    })
}

function updateClientInfo(){
    let data = {
        surname: document.getElementsByName('surname')[0].value,
        name: document.getElementsByName('name')[0].value,
        patronymic: document.getElementsByName('patronymic')[0].value,
        birthday: document.getElementsByName('birthday')[0].value || null,
        photo: null
    };
    $.ajax({
        type: "POST",
        url: "/client/update",
        data: data,
        success: (data) =>{
            alert(data.error || data.message);
        }
    })
}

function showPersonal(){
    document.getElementById('personal_area').hidden = false;
    document.getElementById('user_buttons').hidden = true;
    document.getElementById('tours_area').hidden = true;
    getClientInfo();
    if (document.getElementById('orders').children.length == 0){
        $.ajax({
            type: "GET",
            url: "/client/show_orders",
            success: (data) => {   
                fillOrderTable(data);
            }
        });
    }
}

function showTours(){
    document.getElementById('tours_area').hidden = false;
    document.getElementById('user_buttons').hidden = true;
    document.getElementById('personal_area').hidden = true;
    if (document.getElementById('tours').children.length == 0){
        $.ajax({
            type: "GET",
            url: "/client/show_tours",
            success: (data) => {   
                fillTourTable(data);
            }
        });
    }
}

function fillOrderTable(orders){
    orders.forEach(order => {
        appendOrderCell(order);
    });   
}

function fillTourTable(tours){
    tours.forEach(tour => {
        appendTourCell(tour);
    })
}

function appendOrderCell(order){
    let row = document.createElement("tr");
    row.id = order.id;
    row.name="order";
    delete order.id;
    for(key in order){
        let td = document.createElement('td');
        td.textContent = order[key];
        row.appendChild(td);
    }
    row.onclick = "showResort(this.id)";
    document.getElementById('orders').appendChild(row);
}

function showResort(){
    let id = $('input[name=tour]:checked').val();
    if (id > 0){
        tryShowResort(id);
    }
    else{
        return;
    }
}

function tryShowResort(id){
    let result = confirm("Хотите просмотреть путёвку?");
    if (result){
        $.ajax({
            type: "GET",
            url: "/client/show_resort",
            data: {id},
            success: (data) => {
                if (data.error){
                    alert(data.error);
                }
                else{
                    window.location="/client/resort.html";
                }
            }
        })
    }
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
        td.textContent = tour[key];
        row.appendChild(td);
    }
    row.appendChild(radio);
    document.getElementById('tours').appendChild(row);
}

function makeOrder(){
    let id = $('input[name=tour]:checked').val();
    alert(id);
    if (id > 0 && confirm('Сделать заказ?')){
        tryDoOrder(id);
    }
    else{
        return;
    }
}

function tryDoOrder(id){
    let abode = document.getElementById('hotel_class').value;
    $.ajax({
        type: 'GET',
        url: '/client/getcost',
        data: {
            tourId: id,
            abode_id: abode
        },
        success: (data) => {
            if (confirm(`Цена данного тура составит ${data.cost}. Продолжить?`)){
                doOrder(id, abode, data.cost);
            }
        }
    })
}

function doOrder(tour,abode,cost){
    let date = new Date();
    let start = document.getElementById('date').value;
    let currentDate = `${date.getFullYear()}-${date.getDate()}-${date.getMonth()}`;
    let order = {
        tour: Number(tour),
        cost: cost,
        start: start ? start : currentDate,
        abode: Number(abode)
    };
    alert(JSON.stringify(order));
    $.ajax({
        type: "POST",
        url: '/client/create_order',
        data: order,    
        success: (data) => {
            if (data.last_id){
                alert('Заказ выполнен!');
            }
            else{
                alert(data.error||data.message);
            }
        }
    })
}

function fillClientInfo(data){
    document.getElementsByName('surname')[0].value = data.surname;
    document.getElementsByName('name')[0].value = data.name;
    document.getElementsByName('patronymic')[0].value = data.patronymic;
    document.getElementsByName('birthday')[0].value = data.birthday;
    if (data.photo){
        document.getElementById('photo').setAttribute('src',data.photoName);
    }
}