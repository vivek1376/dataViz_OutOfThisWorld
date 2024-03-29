var gData;  // to use in browser debugging console
var scatterplotdata;
var scatterplotzonedata = [];
var objscatterzoneplot;

document.addEventListener("DOMContentLoaded", function() {
    // console.log("hello");
    // d3.select("body").append("p").text("Hello World!");

    d3.csv('data/exoplanets-1.edited.style.csv')
        .then(data => {
            gData = data;
            // console.log(data);

            // for (let key in data[2]) {
            //     let val = data[2][key];
            //     console.log(typeof(val) + `  ${key} : ` + val);
            // }

            var numPlanetsVsStars = {};

            for (const planetData of data) {
                const numStars = planetData['sy_snum'];
                // console.log(`numStarts: ${numStars}` + " " + typeof(numStars));

                if (!numPlanetsVsStars.hasOwnProperty(numStars)) {
                    numPlanetsVsStars[numStars] = 0;
                }

                numPlanetsVsStars[numStars]++;
            }

            console.log("numPlanet v stars");
            console.log(numPlanetsVsStars);

            // create bar chart for num of exoplanets vs num of stars in the system
            let planetChart = new barChart ({
                'parentElement': '#vizplanetsvStars',
                'contentHeight': 242,
                'barWidth': 22,
                'scaleType': 'log',
                'barChartNum': 1
            }, numPlanetsVsStars);


            // how many exoplanets are in systems with 1 planets, 
            // 2 planets, 3 planets and so on 

            var numPlanetsVsPlanets = {};

            for (const planetData of data) {
                // number of planets in the star system ?
                const numPlanets = planetData['sy_pnum'];
                // console.log(`numStarts: ${numStars}` + " " + typeof(numStars));

                if (!numPlanetsVsPlanets.hasOwnProperty(numPlanets)) {
                    numPlanetsVsPlanets[numPlanets] = 0;
                }

                numPlanetsVsPlanets[numPlanets]++;
            }
            // console.log("numplanetvplanet", numPlanetsVsPlanets);

            new barChart({
                'parentElement': '#vizplanetsvPlanets',
                'contentHeight': 242,
                'barWidth': 22,
                'scaleType': 'log',
                'barChartNum': 2
            }, numPlanetsVsPlanets);


            // how many exoplanets orbit stars of different types:
            // The star types are: A, F, G, K and M 
            // check st_spectype

            var numPlanetsVsStarTypes = {};


            for (const planetData of data) {
                if (planetData['st_spectype'] === "" || planetData['st_spectype'] === undefined) 
                    continue;

                const starSpetralType = planetData['st_spectype'].charAt(0);

                let allowedStarTypes = ["A", "F", "G", "K", "M"];

                if (!allowedStarTypes.includes(starSpetralType)) continue;

                if (!numPlanetsVsStarTypes.hasOwnProperty(starSpetralType)) {
                    numPlanetsVsStarTypes[starSpetralType] = 0;
                }

                numPlanetsVsStarTypes[starSpetralType]++;
            }

            // console.log("numPlanetsVsStarTypes:", numPlanetsVsStarTypes);

            new barChart({
                'parentElement': '#vizplanetsvStarTypes',
                'contentHeight': 242,
                'barWidth': 22,
                'scaleType': 'linear',
                'barChartNum': 3
            }, numPlanetsVsStarTypes);

            // TODO pass in array to barChart defining desired order
            // of keys, and map it to array output of object.entries


            // how many exoplanets were discovered by different methods

            var numPlanetsVsDiscoveryMethod = {};

            for (const planetData of data) {

                const planetDiscoveryMethod = planetData['discoverymethod'];

                if (!numPlanetsVsDiscoveryMethod.hasOwnProperty(
                    planetDiscoveryMethod)) {
                    numPlanetsVsDiscoveryMethod[planetDiscoveryMethod] = 0;
                }

                numPlanetsVsDiscoveryMethod[planetDiscoveryMethod]++;
            }

            // console.log("numPlanetsVsStarTypes:", numPlanetsVsStarTypes);

            new horizontalBarChart({
                'parentElement': '#vizplanetsvsDiscoveryMethod',
                'contentWidth': 160,
                'marginLeft': 160,
                'barHeight': 22,
                'scaleType': 'log'
            }, numPlanetsVsDiscoveryMethod);





            // how many exoplanets are within a habitable zone vs outside the 
            // habitable zone.   
            //   The habitable zone depends on both the distance between the star 
            //   and the planet, and the type of star. 
            //   The habitable zone begins and ends according to the list below 
            //   (in astronomical units) 

            // use pl_orbsmax
            // for each star type no of planets outside and inside zone


            let numHabitablePlanetsVsStartype = {};
            for (const planetData of data) {
                if (planetData['st_spectype'] === "" ||
                    planetData['st_spectype'] === undefined) 
                    continue;

                if (planetData['pl_orbsmax'] === "" ||
                    planetData['pl_orbsmax'] === undefined) 
                    continue;

                const starSpetralType = planetData['st_spectype'].charAt(0);
                let allowedStarTypes = ["A", "F", "G", "K", "M"];
                if (!allowedStarTypes.includes(starSpetralType)) continue;

                if (!numHabitablePlanetsVsStartype.hasOwnProperty(starSpetralType)) {
                    numHabitablePlanetsVsStartype[starSpetralType] = {
                        'habitable': 0,
                        'non_habitable': 0
                    };
                }

                switch(starSpetralType) {
                    case 'A':
                        if (planetData['pl_orbsmax'] >= 8.5 &&
                            planetData['pl_orbsmax'] < 12.5) 
                            numHabitablePlanetsVsStartype[starSpetralType]['habitable']++;
                        else
                            numHabitablePlanetsVsStartype[starSpetralType]['non_habitable']++;
                        break;

                    case 'F':
                        if (planetData['pl_orbsmax'] >= 1.5 &&
                            planetData['pl_orbsmax'] < 2.2) 
                            numHabitablePlanetsVsStartype[starSpetralType]['habitable']++;
                        else
                            numHabitablePlanetsVsStartype[starSpetralType]['non_habitable']++;
                        break;

                    case 'G':
                        if (planetData['pl_orbsmax'] >= 0.95 &&
                            planetData['pl_orbsmax'] < 1.4) 
                            numHabitablePlanetsVsStartype[starSpetralType]['habitable']++;
                        else
                            numHabitablePlanetsVsStartype[starSpetralType]['non_habitable']++;
                        break;

                    case 'K':
                        if (planetData['pl_orbsmax'] >= 0.38 &&
                            planetData['pl_orbsmax'] < 0.56) 
                            numHabitablePlanetsVsStartype[starSpetralType]['habitable']++;
                        else
                            numHabitablePlanetsVsStartype[starSpetralType]['non_habitable']++;
                        break;

                    case 'M':
                        if (planetData['pl_orbsmax'] >= 0.08 &&
                            planetData['pl_orbsmax'] < 0.12) 
                            numHabitablePlanetsVsStartype[starSpetralType]['habitable']++;
                        else
                            numHabitablePlanetsVsStartype[starSpetralType]['non_habitable']++;
                        break;
                }

            }

            var stTypeKeys = Object.keys(numHabitablePlanetsVsStartype);

            var groupedDataStType = stTypeKeys.map(function(t) {
                return {
                    'group': t, 
                    'habitable': numHabitablePlanetsVsStartype[t]['habitable'],
                    'non_habitable': numHabitablePlanetsVsStartype[t]['non_habitable'],
                };
            });

            // console.log("numHabitablePlanetsVsStartype:", 
            //     numHabitablePlanetsVsStartype);

            // console.log("numHabitablePlanetsVsStartype:", 
            //     Object.entries(numHabitablePlanetsVsStartype));

            // console.log("groupedDataStType:", groupedDataStType);


            let groupedChart = new groupedBarChart({
                'parentElement': '#vizgroupedchart',
                'contentWidth': 270,
                'contentHeight': 242,
                'marginLeft': 200,
                // 'barHeight': 45,
                'scaleType': 'linear'
            }, groupedDataStType);



            // Allow users to see the distribution of exoplanets by their 
            // distance to us. A histogram is a good choice for these 
            // visualizations. You may use other approaches- see note below.

            // create column of data


            var arrPlanetDistance = [];

            for (const planetData of data) {

                if (planetData['sy_dist'] === "" ||
                    planetData['sy_dist'] === undefined) 
                    continue;

                arrPlanetDistance.push({"distance": planetData['sy_dist']});
            }

            // console.log("planet distance distribution:", arrPlanetDistance);


            new histogram({
                'parentElement': '#vizhistogram',
                'contentWidth': 250,
                'contentHeight': 242,
                'scaleType': 'linear'
            }, arrPlanetDistance);







            // Enable the user to see exoplanet discoveries over time (by year). 
            // They should be able to identify the trends in the discoveries. 
            // line chart ? 

            var numPlanetsVsYear = {};

            for (const planetData of data) {
                // no blank for this column

                const discoveryYear = planetData['disc_year'];

                if (!numPlanetsVsYear.hasOwnProperty(discoveryYear))
                    numPlanetsVsYear[discoveryYear] = 0;

                numPlanetsVsYear[discoveryYear]++;
            }

            // console.log("numplanetYear:", numPlanetsVsYear);


            let arrnumPlanetsVsYear = [];


            Object.entries(numPlanetsVsYear).forEach(item => {
                arrnumPlanetsVsYear.push({"year": item[0], "numPlanets": item[1]
                });
            });

            arrnumPlanetsVsYear.forEach(d => {
                d.year = new Date(d.year);
            });
            // arrnumPlanetsVsYear = [{"year": "1992-05-05", "numPlanets": 100},
            //     {"year": "1993-05-05", "numPlanets": 140}];

            console.log("arrnumPlanetsVsYear:", arrnumPlanetsVsYear);

            new lineChart ({
                'parentElement': '#vizlinechart',
                'contentWidth': 260,
                'contentHeight': 242,
                'scaleType': 'linear'
            }, arrnumPlanetsVsYear);




            var planetMassVsRadius = [];

            for (const planetData of data) {
                // no blank for this column

                if (planetData['pl_bmasse'] === "" ||
                    planetData['pl_bmasse'] === undefined) 
                    continue;

                if (planetData['pl_rade'] === "" ||
                    planetData['pl_rade'] === undefined) 
                    continue;

                const planetMass = planetData['pl_bmasse'];
                const planetRadius = planetData['pl_rade'];

                // if (!numPlanetsVsYear.hasOwnProperty(discoveryYear))
                //     numPlanetsVsYear[discoveryYear] = 0;

                // numPlanetsVsYear[discoveryYear]++;

                planetMassVsRadius.push({
                    "mass": +planetMass, 
                    "radius": +planetRadius,
                    "name": planetData['pl_name'],
                    "discyear": planetData['disc_year'],
                    "distance": planetData['sy_dist']
                });
            }

            console.log("planetMassVsRadius count:", planetMassVsRadius.length);


//             new scatterPlot ({
//                 'parentElement': '#vizscatterplot',
//                 // 'contentWidth': 260,
//                 'contentWidth': 260,
//                 'contentHeight': 260,
//                 'scaleType': 'linear'
//             }, planetMassVsRadius);


            new heatmap ({
                'parentElement': '#vizheatmap',
                'contentWidth': 242,
                'contentHeight': 242,
                'scaleType': 'linear'
            }, planetMassVsRadius);





            objscatterzoneplot = new scatterPlot ({
                'parentElement': '#vizscatterzoneplot',
                // 'contentWidth': 260,
                'contentWidth': 260,
                'contentHeight': 242,
                'scaleType': 'linear'
            }, scatterplotzonedata);


            // TODO not being used
            // Use heatmap as filter and update scatter plot accordingly

            createTable(data);
        })
        .catch(error => {
            console.error('Error loading the data: ' + error);
        });

    // // just to test map
    // d3.csv('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv')
    //     .then(data => {
    //         console.log("!#####data#####!");
    //         console.log(data);
    //         // const subgroups = data.columns.slice(1);
    //         // console.log("subgroups:", subgroups);

    //         // const groups = data.map(d => d.group);
    //         // console.log("groups:", groups);

    //     });






    // view histo data for test
    // d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv").then(function(data) {
    //     console.log("!!!HISTO data:", data);
    // });


    // // linear scale example
    // const iceCreamScale = d3.scaleLinear()
    //     .domain([0, 20000])
    //     .range([0, 400]);

    // // Call the function and pass an input value
    // console.log(iceCreamScale(5000));	// Returns: 100


    // create 'p' elements after body
    // let p2 = d3.select('body').data(iceCreamFlavors).enter()
    //     .append('p');





    console.log("heyyyy!!!!!!");



    // CODE from join tutorial 

    //this is a call to create a random list of letters in alphabetical order
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';


    function randomLetters() {
        let charsToReturn = ''; 

        for (let i = 0; i < characters.length; i++) {
            let random = Math.random() <= 0.5;


            if (random) {
                charsToReturn = charsToReturn + characters[i];
            }
        }

        console.log(charsToReturn);
        return charsToReturn;
    }



    let svg2 = d3.select('#letters')
        .attr('width', 50)
        .attr('height', 500);

    let letters = svg2.selectAll("text")
        .data(randomLetters()) //function call to create a random list of letters
        // .enter()
        // .append("text")
        .join("text")
        .attr("x", 25)
        .attr("y", (d, i) => i * 20)
        .text(d => d);




});



function filterData(d) {

    console.log("filter data:", d);
    // if (difficultyFilter.length == 0) {
    //     scatterPlot2.data = data;
    // } else {
    //     scatterPlot2.data = data.filter(d => difficultyFilter.includes(d.difficulty));
    // }


    xVal = parseInt(d[0].split(',')[0]);
    yVal = parseInt(d[0].split(',')[1]);

    // for (const key in scatterplotdata) {

    scatterplotzonedata = scatterplotdata.filter(function(d) {
        return (d.xzone === xVal && d.yzone === yVal);
    });

    console.log("scatterplotzonedata:", scatterplotzonedata);

    objscatterzoneplot.data = scatterplotzonedata;
    objscatterzoneplot.updateVis();
}

// ref https://codepen.io/blackjacques/pen/RYVpKZ
function createTable(datasetText) {
    // const useCols = ['pl_name', 'host_name', 'discoverymethod
    // d3.text('data/exoplanets-1.edited.style.csv').then(function(datasetText) {
    d3.text('data/exoplanets-1.edited.style.fortable.csv').then(datasetText => {
        var rows  = d3.csvParseRows(datasetText),
            table = d3.select('.fortable').append('table')
            .style("border-collapse", "collapse")
            .style("border", "2px black solid");

        // headers
        table.append("thead").append("tr")
            .selectAll("th")
            .data(rows[0])
            .enter().append("th")
            .text(function(d) { return d; })
            .style("border", "1px black solid")
            .style("padding", "5px")
            .style("background-color", "lightgray")
            .style("font-weight", "bold")
            .style("text-transform", "uppercase");

        // data
        table.append("tbody")
            .selectAll("tr").data(rows.slice(1))
            .enter().append("tr")
            .selectAll("td")
            .data(function(d) { return d;})
            .enter().append("td")
            .style("border", "1px black solid")
            .style("padding", "5px")
            .on("mouseover", function(d) {
                // console.log("td data:", d);
                d3.select(this).style("background-color", "powderblue");
            })
            .on("mouseout", function() {
                d3.select(this).style("background-color", "white");
            })
            .text(function(d) {return d;})
            .style("font-size", "12px");
    });



}
