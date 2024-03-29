class heatmap {
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            margin: { top: 15, bottom: 85, right: 80, left: 20},
            scaleType: _config.scaleType
            // margin: { top: 10, bottom: 30, right: 10, left: 30 }
        }

        let dataLength = undefined;

        if (typeof _data === 'object')
            dataLength = Object.keys(_data).length * _config.barWidth;

        this.config.contentWidth = _config.contentWidth || dataLength || 600;
        this.config.contentHeight = _config.contentHeight || 400;
        this.config.containerWidth = this.config.contentWidth + this.config.margin.left 
            + this.config.margin.right;
        this.config.containerHeight = this.config.contentHeight + this.config.margin.top
            + this.config.margin.bottom;

        // Call a class function

        this.data = _data;
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.width = vis.config.containerWidth - vis.config.margin.left -
            vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - 
            vis.config.margin.bottom;

        vis.xValue = d => d.radius;
        vis.yValue = d => d.mass;

        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},
                ${vis.config.margin.top})`);

        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`);
            // .attr('transform', `translate(0, 300));

        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis');

        // vis.xScale = d3.scaleBand()
        //     .range([ 0, vis.width ])
        //     .domain([d3.min(vis.data, vis.xValue), d3.max(vis.data, vis.xValue)])
        //     .padding(0.01);

        // vis.xScale = d3.scaleLog()
        //     .base(10)
        //     .range([0, vis.width]);

        // vis.yScale = d3.scaleBand()
        //     .range([vis.height, 0])
        //     .domain([d3.min(vis.data, vis.yValue), d3.max(vis.data, vis.yValue)])
        //     .padding(0.01);

        vis.xScale = d3.scaleLog()
            .base(10)
            .range([0, vis.width])
            .domain([d3.min(vis.data, vis.xValue), d3.max(vis.data, vis.xValue)]);

        vis.yScale = d3.scaleLog()
            .base(10)
        // .range([0, vis.height]);
            .range([vis.height, 0])  // TODO why reverse ?
            .domain([d3.min(vis.data, vis.yValue), d3.max(vis.data, vis.yValue)]);


        let zones = 10;

        // let bandSize = (d3.max(vis.data, vis.xValue) - 
        //     d3.min(vis.data, vis.xValue)) / zones;

        let xMinMaxVal = d3.extent(vis.data.map(d => vis.xScale(vis.xValue(d))));
        let yMinMaxVal = d3.extent(vis.data.map(d => vis.yScale(vis.yValue(d))));

        console.log("xMinMaxVal:", xMinMaxVal);

        let xBandSize = (xMinMaxVal[1] - xMinMaxVal[0]) / zones;
        let yBandSize = (yMinMaxVal[1] - yMinMaxVal[0]) / zones;

        // console.log("min max:", minMaxVal);
        // console.log("band size:", bandSize);
        // console.log("vis.data length:", vis.data.length);  // result seems okay

        // add x and y zone to each heatmap block
        for (const planet of vis.data) {
            let xVal = vis.xScale(vis.xValue(planet));
            let yVal = vis.yScale(vis.yValue(planet));
            // console.log("y val:", vis.yScale(vis.yValue(planet)));

            // for each individual planet, assign it a zone
            for (let i = 0, step = 0; i < zones; i++) {
                if (vis.xScale(vis.xValue(planet)) >= step &&
                    vis.xScale(vis.xValue(planet)) < step + xBandSize) {
                    planet.xzone = i;
                    break;
                }

                step += xBandSize;
            }

            // TODO check if zone exists in planet, if not set zone to last one ?
            if (!planet.hasOwnProperty("xzone")) {
                console.log("x key does not exist!!!, so adding");
                planet.xzone = zones - 1;
            }


            for (let i = 0, step = 0; i < zones; i++) {
                if (vis.yScale(vis.yValue(planet)) >= step &&
                    vis.yScale(vis.yValue(planet)) < step + yBandSize) {
                    planet.yzone = i;
                    break;
                }

                step += yBandSize;
            }

            // TODO check if zone exists in planet, if not set zone to last one ?
            if (!planet.hasOwnProperty("yzone")) {
                console.log("y key does not exist!!!, so adding");
                planet.yzone = zones - 1;
            }
        }

        // console.log("after zone:", vis.data);
        scatterplotdata = vis.data;

        for (const planet of vis.data) {
            if (!planet.hasOwnProperty("xzone") || !planet.hasOwnProperty("yzone"))
                console.log("NO x or y ZONE!!!!!!!!");
        }


        var heatmapZoneMap = {};  // stores info about each zone

        for (let i = 0; i < zones; i++)
            for (let j = 0; j < zones; j++)
                heatmapZoneMap[i + "," + j] = 0;

        // TODO determine count for each cell
        for (const planet of vis.data) {
            const zoneKey = planet.xzone + "," + planet.yzone;

            // if (!heatmapZoneMap.hasOwnProperty(zoneKey))
            //     heatmapZoneMap[zoneKey] = 0;

            heatmapZoneMap[zoneKey]++;

            // TODO also add other info about the planets
        }

        console.log("Object entries heatmapZoneMap:", Object.entries(heatmapZoneMap));

        var maxPlanets = 0;
        var totalPlanets = 0;

        for (const key in heatmapZoneMap) {

            if (heatmapZoneMap[key] > maxPlanets) {
                maxPlanets = heatmapZoneMap[key];
            }

            totalPlanets += heatmapZoneMap[key];
        }

        console.log("total planets: ", totalPlanets);

        vis.xAxis = d3.axisBottom(vis.xScale)
            .ticks(6);

        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(6);

        // vis.xAxisG
        //     .call(vis.xAxis);
            // .call(g => g.select('.domain').remove());

        // vis.yAxisG
        //     .call(vis.yAxis);

        vis.color = d3.scaleLinear()
            // .range(["#92d6c7", "#032b22"])
            .range(["#d4dbe5", "#283d57"])
            .domain([0, maxPlanets]);

        // vis.chart.selectAll('rect')
        //     .data([1,2,3], function(d) {console.log(d);})
        //     .enter()
        //     .append('rect')
        //     .attr("x", 50)
        //     .attr("y", 50)
        //     .attr("width", 100)
        //     .attr("height", 100)
        //     .style("fill", "brown");

        const heatZones = vis.chart.selectAll('rect')
            .data(Object.entries(heatmapZoneMap))
            // .data(Object.entries(heatmapZoneMap), function(d) {console.log("data is: ", d);})
            .enter()
            .append('rect')
            // .attr('x', d => vis.xScale(vis.xValue(d)))
            // .attr('y', d => vis.yScale(vis.yValue(d)))
            .attr("x", function(d) {
                // console.log("d value:", d);
                const xVal = d[0].split(',')[0];
                console.log("xval int val: ", parseInt(xVal));
                return 30 * parseInt(xVal);
            })
            // .attr('y', d => vis.yScale(vis.yValue(d)))
            .attr("y", function(d) {
                const yVal = d[0].split(',')[1];

                return 30 * parseInt(yVal);
            })
            // .attr('width', d => vis.xScale.bandwidth())
            // .attr('height', d => vis.yScale.bandwidth())
            .attr("width", 26)
            .attr("height", 26)
            .attr("class", d => d[0])
            // .attr("style", "outline: thin solid red;")
            // .style("fill", d => vis.color(vis.xValue(d)));
            .style("fill", function(d) {
                if (d[1] === 0)
                    return "white";
                else 
                    return vis.color(d[1]);
            })
        .on('mouseover', function(event, d) {
            // console.log("entering ", d);
            // console.log("e:", event.target.style);
            // event.target.style.fill = "red";
            // event.target.style.outlineColor = "red";
            // event.target.style.outlineWidth = "4";
            event.target.style.outline = "4px solid #c42351";

            // event.target.style.fill = "red";
            // event.target.style.fill = "red";
            // console.log("event:", event.target.attr("style", "outline: thin solid red;"));
        })
        .on('mouseleave', (event, d) => {
            event.target.style.outline = "0";
            // console.log("leaving ", d);
        })
        .on('click', function(event, d) {
            console.log("click d:", d);

            filterData(d);
        });
            // .style("fill", d => vis.color(d[1]));
            // .style("fill", "brown");

        // heatZones
        //     .on('mouseover', (event, d) => {
        //     // console.log("heatzone event:", event);
        //     console.log("heatzone d:", d);

        //     d3.select('svg.' + d[0])
        //         .attr("style", "outline: thin solid red;");
        // })
        //     .on('mouseleave', (event, d) => {
        //         d3.select('svg.' + d[0])
        //             .attr("style", "outline: 0;");
        //     });

    }

    updateVis() {

    }

    renderVis() {

    }
};
