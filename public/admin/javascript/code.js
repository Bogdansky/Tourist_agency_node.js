window.onload = () => {
    $.ajax({
        type: "GET",
        url: "/admin/readall",
        success: (data) => {
            fillManagerTable(data);
        }
    })
}
/* $("#login_action").click(() => {
    let data = {
        login: document.forms["login_form"].login.value,
        password: document.forms["login_form"].password.value
    };
    $.ajax({
        type: "POST",
        url: "/login",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: (data) => {
            let responce = JSON.parse(data);
            alert(responce['result']);
        }
    })
}) */

function fillManagerTable(managers){
    managers.forEach(manager => {
        appendManagerCell(manager);
    });   
}

function appendManagerCell(manager){
    let row = document.createElement("tr");
    row.id = manager.id;
    delete manager.id;
    for(key in manager){
        let td = document.createElement('td');
        td.textContent = manager[key];
        row.appendChild(td);
    }
    document.getElementById('managers').appendChild(row);
}