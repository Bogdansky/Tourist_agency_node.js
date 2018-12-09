window.onload = () => {
    $.ajax({
        type: "GET",
        url: '/client/read_resort',
        success: (data) => {
            if (data.id == -1){
                alert("Курорта нет");
            }
            else{
                outputResort(data);
            }
        }
    })
}

function outputResort(resort){
    document.getElementById('country').innerText += resort.country;
    document.getElementById('name').innerHTML += resort.resort;
    document.getElementById('visaRegime').innerText += resort.visa_regime;
    if (resort.visa_cost != 0){
        document.getElementById('visaCost').hidden = false;
        document.getElementById('visaCost').innerText += resort.visa_cost;
    }
    if (resort.video){
        let source = document.createElement('source');
        source.src = resort.videoName;
        document.getElementById('video').appendChild(source);  
    }
}