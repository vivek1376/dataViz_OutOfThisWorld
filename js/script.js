var gData;  // to use in browser debugging console


document.addEventListener("DOMContentLoaded", function() {
    console.log("hello");
    // d3.select("body").append("p").text("Hello World!");

    d3.csv('data/exoplanets-1.edited.style.csv')
        .then(data => {
            gData = data;
            console.log(data);

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
                'contentHeight': 350,
                'translateX': 0,  // TODO remove this ?
                'translateY': 0,
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
            console.log("numplanetvplanet", numPlanetsVsPlanets);

            new barChart({
                'parentElement': '#vizplanetsvPlanets',
                'contentHeight': 350,
                'translateX': 0,
                'translateY': 0,
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
                'translateX': 0,
                'translateY': 0,
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
                'translateX': 0,
                'translateY': 0,
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

            console.log("groupedDataStType:", groupedDataStType);


            let groupedChart = new groupedBarChart({
                'parentElement': '#vizgroupedchart',
                'contentWidth': 400,
                'marginLeft': 200,
                'translateX': 0,
                'translateY': 0,
                'barHeight': 45,
                'scaleType': 'linear'
            }, groupedDataStType);
            

        })
        .catch(error => {
            console.error('Error loading the data: ' + error);
        });

    // just to test map
    d3.csv('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv')
        .then(data => {
            // console.log("!#####data#####!");
            // console.log(data);
            const subgroups = data.columns.slice(1);
            console.log("subgroups:", subgroups);

            const groups = data.map(d => d.group);
            console.log("groups:", groups);

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
