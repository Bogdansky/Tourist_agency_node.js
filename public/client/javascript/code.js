function logout(){
    window.location = "/"
}

function showPersonal(){
    document.getElementById('user_buttons').hidden = true;
    document.getElementById('personal_area').hidden = false;
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
    document.getElementById('user_buttons').hidden = true;
    document.getElementById('tours_area').hidden = false;
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
    let result = confirm("Хотите просмотреть путёвку?");
    if (result){
        let id = $('input[name=tour]:checked').val();
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
    row.id = tour.id_resort;
    row.setAttribute("name","tour");
    delete tour.id_resort;
    for(key in tour){
        let td = document.createElement('td');
        td.textContent = tour[key];
        row.appendChild(td);
    }
    let radio = document.createElement('input');
    radio.type = "radio";
    radio.name = "tour";
    radio.value = row.id;
    row.appendChild(radio);
    document.getElementById('tours').appendChild(row);
}