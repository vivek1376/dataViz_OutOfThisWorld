var gData;  // to use in browser debugging console

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

            // console.log("numPlanet v stars");
            // console.log(numPlanetsVsStars);

            // create bar chart for num of exoplanets vs num of stars in the system
            let planetChart = new barChart ({
                'parentElement': '#vizplanetsvStars',
                'contentHeight': 350,
                'barWidth': 45,
                'scaleType': 'log'
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
                'contentHeight': 350,
                'barWidth': 45,
                'scaleType': 'log'
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
                'contentHeight': 350,
                'barWidth': 45,
                'scaleType': 'linear'
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
                'contentWidth': 400,
                'marginLeft': 200,
                'barHeight': 45,
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
                'contentWidth': 400,
                'marginLeft': 200,
                'barHeight': 45,
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

            console.log("planet distance distribution:", arrPlanetDistance);


            new histogram({
                'parentElement': '#vizhistogram',
                'contentWidth': 600,
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
                'contentWidth': 600,
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

                planetMassVsRadius.push({"mass": +planetMass, "radius": +planetRadius});
            }

            console.log("planetMassVsRadius:", planetMassVsRadius);

            new scatterPlot ({
                'parentElement': '#vizscatterplot',
                'contentWidth': 2400,
                'contentHeight': 2400,
                'scaleType': 'linear'
            }, planetMassVsRadius);










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
