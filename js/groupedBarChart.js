class groupedBarChart {

    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            // containerWidth: _config.containerWidth || 600,
            // containerHeight: _config.containerHeight || 400,
            margin: { top: 50, bottom: 50, right: 50, left: 50 },
            scaleType: _config.scaleType
            // margin: { top: 10, bottom: 30, right: 10, left: 30 }
        }

        // this.config.contentWidth = Object.keys(_data).length * _config.barWidth;
        this.config.contentWidth = _config.contentWidth || 600;
        this.config.contentHeight = _config.contentHeight || 400;
        this.config.containerWidth = this.config.contentWidth + this.config.margin.left +
            this.config.margin.right;
        this.config.containerHeight = this.config.contentHeight + this.config.margin.top +
            this.config.margin.bottom;

        // Call a class function

        this.data = _data;
        this.initVis();
    }

    initVis() {

        let vis = this; 

        // Width and height as the inner dimensions of the chart area- as before
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        // Define 'svg' as a child-element (g) from the drawing area and include spaces
        // Add <svg> element (drawing space)
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        // x title
        vis.svg.append('text')
            .attr('x', 140)
            .attr('y', 330)
            .text('Star type');

        // y title
        vis.svg.append('text')
            .attr('x', 20)
            .attr('y', 36)
            .text('Count');

        this.svg.append("circle").attr("cx",100).attr("cy", 46).attr("r", 6).style("fill", "#6c7f96");
        this.svg.append("circle").attr("cx",100).attr("cy", 66).attr("r", 6).style("fill", "#283d57");

        this.svg.append("text").attr("x", 110).attr("y", 50).text("habitable").style("font-size", "15px").attr("alignment-baseline","middle");
        this.svg.append("text").attr("x", 110).attr("y", 70).text("non-habitable").style("font-size", "15px").attr("alignment-baseline","middle");

        let translateX = vis.config.margin.left;
        let translateY = vis.config.margin.top;

        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${translateX}, 
                ${translateY})`);

        const subgroups = ['habitable', 'non_habitable'];
        // const groups = Object.keys(vis.data);
        const groups = ['F', 'M', 'K', 'G', 'A'];

        // const arrData = Object.entries(vis.data);


        // Initialize linear and ordinal scales (input domain and output 
        // range)
        const xScale = d3.scaleBand()
            .domain(groups)
            .range([0, vis.width])
            .paddingInner(0.2);

        // Another scale for subgroup position?
        const xSubscale = d3.scaleBand()
            .domain(subgroups)
            .range([0, xScale.bandwidth()])
            .padding([0.05]);

        // color palette = one color per subgroup
        const color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#6c7f96','#283d57']);

        // console.log("xscale test");
        // console.log(xScale("2"));
        // console.log(xScale("4"));

        var yScale;
        var yAxisScale;

        if (vis.config.scaleType === "log") {
            yScale = d3.scaleLog()
                .base(10)
                .domain([1, d3.max(Object.values(vis.data))])
                .range([0, vis.height]);

            yAxisScale = d3.scaleLog()
                .base(10)
            // .domain([d3.max(Object.values(vis.data)), 1])
                .domain([1, d3.max(Object.values(vis.data))])
            // .range([0, vis.height]);
                .range([vis.height, 0]);
        } else {
            console.log("!!!grouped data!!", vis.data);
            // var maxVal = d3.max(vis.data, function(d) {
            //         return d3.max([d['habitable'], d['non_habitable']]);
            //     });

            // console.log("maxval:", maxVal);


            yScale = d3.scaleLinear()
                .domain([0, d3.max(vis.data, function(d) {
                    return d3.max([d['habitable'], d['non_habitable']]);
                })])
                // .domain([0, d3.max(Object.values(vis.data))])
                .range([0, vis.height]);

            yAxisScale = d3.scaleLinear()
                .domain([0, d3.max(vis.data, function(d) {
                    return d3.max([d['habitable'], d['non_habitable']]);
                })])
            // .domain([d3.max(Object.values(vis.data)), 1])
            // .range([0, vis.height]);
                .range([vis.height, 0]);
        }

        // console.log("!!!!!yScale!!");
        // console.log(yScale(1000));

        vis.xAxis = d3.axisBottom()
            .scale(xScale);

        vis.yAxis = d3.axisLeft()
            .scale(yAxisScale)
            .ticks(6);
        // .tickSizeOuter(0);

        // Draw the axis
        vis.xAxisGroup = vis.chart.append('g')
            .attr('transform', `translate(0, ${vis.height})`)
        // .attr('class', 'axis x-axis') 
            .call(vis.xAxis);

        vis.yAxisGroup = vis.chart.append('g')
        // .attr('class', 'axis y-axis')
            .call(vis.yAxis);

        vis.chart.append('g')
        // vis.svg.append('g')
            .selectAll('g')
            .data(vis.data)  // TODO change data. for what ??
            .join('g')
            .attr("transform", d => `translate(${xScale(d.group)}, 0)`)
            // .attr("transform", function(d) {
            //     console.log("!!!!!transform", d);
            //     console.log("!!!xScale", xScale(d.group));
            //     return `translate(${xScale(d.group)}, 0)`;
            // })
            .selectAll('rect')
            .data(function(d) { 
                return subgroups.map(function(key) { 
                    return {key: key, value: d[key]}; 
                }); 
            })
            .join('rect')
            .attr('x', d => xSubscale(d.key))
            .attr('y', d => (vis.height - yScale(d.value)))
            .attr('width', xSubscale.bandwidth())
            .attr('height', d => yScale(d.value))
        //     .attr('x', d => xSubscale(d
            .attr("fill", d => color(d.key));






        // vis.chart.selectAll('rect')
        //     .data(Object.entries(vis.data))
        //     .enter()
        //     .append('rect')
        //     .attr('fill', '#1b6663')
        //     .attr('width', xScale.bandwidth())
        //     // .attr('width', d => xScale(parseInt(d[0])))
        //     // .attr('height', function(d) {
        //     //     console.log("inside attr");
        //     //     console.log(d);
        //     // })
        //     .attr('height', d => yScale(d[1]))
        //     // .attr('x', d => xScale(d[0]))
        //     .attr('x', d => xSubscale(d
        //     .attr('y', d => (vis.height - yScale(d[1])));

        
        // updateVis(); //leave this empty for now...
    }


    //leave this empty for now
    updateVis() { 

        renderVis(); 

    }


    //leave this empty for now...
    renderVis() { 

    }


};
