class barChart {

    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 600,
            containerHeight: _config.containerHeight || 400,
            margin: { top: 50, bottom: 50, right: 50, left: 50 }
            // margin: { top: 10, bottom: 30, right: 10, left: 30 }
        }

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
            .attr('height', vis.config.containerHeight)

        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left}, 
                ${vis.config.margin.top})`);

        // Initialize linear and ordinal scales (input domain and output 
        // range)
        const xScale = d3.scaleBand()
            .domain(Object.keys(vis.data))
            .range([0, vis.width])
            .paddingInner(0.1);

        // console.log("xscale test");
        // console.log(xScale("2"));
        // console.log(xScale("4"));

        const yScale = d3.scaleLog()
            .base(10)
            .domain([1, d3.max(Object.values(vis.data))])
            .range([0, vis.height]);

        const yAxisScale = d3.scaleLog()
            .base(10)
        // .domain([d3.max(Object.values(vis.data)), 1])
            .domain([1, d3.max(Object.values(vis.data))])
        // .range([0, vis.height]);
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(xScale);

        vis.yAxis = d3.axisLeft()
            .scale(yAxisScale)
            .ticks(4);
        // .tickSizeOuter(0);

        // Draw the axis
        vis.xAxisGroup = vis.chart.append('g')
            .attr('transform', `translate(0, ${vis.height})`)
        // .attr('class', 'axis x-axis') 
            .call(vis.xAxis);

        vis.yAxisGroup = vis.chart.append('g')
        // .attr('class', 'axis y-axis')
            .call(vis.yAxis);

        vis.chart.selectAll('rect')
            .data(Object.entries(vis.data))
            .enter()
            .append('rect')
            .attr('fill', '#1b6663')
            .attr('width', xScale.bandwidth())
            // .attr('width', d => xScale(parseInt(d[0])))
            // .attr('height', function(d) {
            //     console.log("inside attr");
            //     console.log(d);
            // })
            .attr('height', d => yScale(d[1]))
            .attr('x', d => xScale(d[0]))
            .attr('y', d => (vis.height - yScale(d[1])));

        
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
