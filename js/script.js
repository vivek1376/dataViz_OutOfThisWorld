var gData;  // to use in browser debugging console

document.addEventListener("DOMContentLoaded", function() {
    console.log("hello");
    // d3.select("body").append("p").text("Hello World!");


    d3.csv('data/exoplanets-1.edited.style.csv')
        .then(data => {
            gData = data;
            console.log(data);

            for (let key in data[2]) {
                let val = data[2][key];
                console.log(typeof(val) + `  ${key} : ` + val);
            }

            var numPlanetsVsStars = {};
            
            for (const planetData of data) {
                const numStars = planetData['sy_snum'];
                console.log(`numStarts: ${numStars}` + " " + typeof(numStars));

                if (!numPlanetsVsStars.hasOwnProperty(numStars)) {
                    console.log("not found");
                    numPlanetsVsStars[numStars] = 0;
                }

                numPlanetsVsStars[numStars]++;
            }

            console.log(numPlanetsVsStars);
        })
        .catch(error => {
            console.error('Error loading the data: ' + error);
        });

    // const iceCreamFlavors = ['vanilla', 'chocolate', 'strawberry', 'cookies and cream', 'cookie dough'];

//     d3.select('body').selectAll('p')
//         .data(iceCreamFlavors)
//         .enter()
//         .append('p') //now we have a paragraph for each element in the array
//         .text(d => d);


    // linear scale example
    const iceCreamScale = d3.scaleLinear()
        .domain([0, 20000])
        .range([0, 400]);

    // Call the function and pass an input value
    // does what ??
    console.log(iceCreamScale(5000));	// Returns: 100


    // create 'p' elements after body
    // let p2 = d3.select('body').data(iceCreamFlavors).enter()
    //     .append('p');
});
