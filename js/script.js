var data;

document.addEventListener("DOMContentLoaded", function() {
    console.log("hello");
    d3.select("body").append("p").text("Hello World!");


    d3.csv('data/exoplanets-1.edited.style.csv')
        .then(data1 => {
            data = data1;
            console.log(data);

            for (let key in data[2]) {
                let val = data[2][key];
                console.log(typeof(val) + " : " + val);
            }
        })
        .catch(error => {
            console.error('Error loading the data: ' + error);
        });


});
