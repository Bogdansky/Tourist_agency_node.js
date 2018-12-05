window.onload = () => {
    $.ajax({
        type: "GET",
        url: "/admin/readall",
        success: (data) => {   
            fillManagerTable(data);
        }
    });
    $("#removeManager").click(() => {
        let id = $('input[name=manager]:checked').val();
        let data = {
            id: id
        };
        $.ajax({
            type: "POST",
            url: "/admin/remove",
            data: JSON.stringify(data),
            dataType: "text",
            contentType: "application/json",
            success: (result) => {
                data = JSON.parse(result);
                alert(data['status'] ? data['status'] : data['error']);
                if (data.status){
                    document.getElementById(id).remove();
                }
            }
        })
    })
    $("#addManager").click(() => {
        let manager = {
            surname: document.getElementsByName('surname')[0].value || null,
            name: document.getElementsByName('name')[0].value || null,
            patronymic: document.getElementsByName('patronymic')[0].value || null,
            login: document.getElementsByName('login')[0].value || null,
            password: document.getElementsByName('password')[0].value || null
        };
        $.ajax({
            type: "POST",
            url: "/admin/create",
            data: JSON.stringify(manager),
            dataType: "json",
            contentType: "application/json",
            success: (data) => {
                result = JSON.parse(data);
                alert(result["message"] ? result["message"] : result["error"]);
                if (result["message"]){
                    delete data.message;
                    appendManagerCell(manager);
                }
            }
        })
    })
}

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
    let radio = document.createElement('input');
    radio.type = "radio";
    radio.name = "manager";
    radio.value = row.id;
    row.appendChild(radio);
    document.getElementById('managers').appendChild(row);
}
