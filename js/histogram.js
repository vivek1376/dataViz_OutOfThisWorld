class histogram {

    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            margin: { top: 50, bottom: 50, right: 50, left: 50 },
            scaleType: _config.scaleType
            // margin: { top: 10, bottom: 30, right: 10, left: 30 }
        }

        this.config.contentWidth = _config.contentWidth || Object.keys(_data).length 
            * _config.barWidth;
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

        // Width and height as the inner dimensions of the chart area- as before
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        // Define 'svg' as a child-element (g) from the drawing area and include spaces
        // Add <svg> element (drawing space)
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight)

        let translateX = vis.config.margin.left;
        let translateY = vis.config.margin.top;

        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${translateX}, 
                ${translateY})`);

        // Initialize linear and ordinal scales (input domain and output 
        // range)

        // const xScale = d3.scaleBand()
        //     .domain(Object.keys(vis.data))
        //     .range([0, vis.width])
        //     .paddingInner(0.2);

        var xScale = d3.scaleLinear()
            .domain([0, d3.max(vis.data, d => +d.distance)])
            .range([0, vis.width]);
            // .paddingInner(0.2);
        console.log("d3 max:", d3.max(vis.data, d => +d.distance));
        console.log("xScale:", xScale("100"));
        // set the parameters for the histogram
        var histogram = d3.histogram()
            .value(function(d) { 
                // console.log("!!!inside histogram", +d.distance); 
                return +d.distance; 
            })   // I need to give the vector of value
            .domain(xScale.domain())  // then the domain of the graphic
            .thresholds(xScale.ticks(30)); // then the numbers of bins


        console.log("!!vis.data for histogram", vis.data);

        var bins = histogram(vis.data);

        console.log("!!!bins data", bins);

        var yScale;
        var yAxisScale;

        if (vis.config.scaleType === "log") {
            // TODO modify this
            // yScale = d3.scaleLog()
            //     .base(10)
            //     .domain([1, d3.max(Object.values(vis.data))])
            //     .range([0, vis.height]);

            // yAxisScale = d3.scaleLog()
            //     .base(10)
            // // .domain([d3.max(Object.values(vis.data)), 1])
            //     .domain([1, d3.max(Object.values(vis.data))])
            // // .range([0, vis.height]);
            //     .range([vis.height, 0]);
        } else {
            
            yScale = d3.scaleLinear()
                // .domain([0, d3.max(Object.values(vis.data))])
                .domain([0, d3.max(bins, d => d.length)])
                .range([0, vis.height]);

            // TODO purpose of separate yAxisScale? to invert scale?
            yAxisScale = d3.scaleLinear()
                // .domain([0, d3.max(Object.values(vis.data))])
                .domain([0, d3.max(bins, d => d.length)])
            // .range([0, vis.height]);
                .range([vis.height, 0]);
        }

        vis.xAxis = d3.axisBottom()
            .scale(xScale);

        vis.yAxis = d3.axisLeft()
            .scale(yAxisScale);
            // .ticks(4);
        // .tickSizeOuter(0);

        // Draw the axis
        vis.xAxisGroup = vis.chart.append('g')
            .attr('transform', `translate(0, ${vis.height})`)
        // .attr('class', 'axis x-axis') 
            .call(vis.xAxis);

        vis.yAxisGroup = vis.chart.append('g')
        // .attr('class', 'axis y-axis')
            .call(vis.yAxis);

        // create the bar rectangles
        vis.chart.selectAll('rect')
            .data(bins)
            .enter()
            .append('rect')
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; })
            .attr("width", function(d) { return xScale(d.x1) - xScale(d.x0) -1 ; })
            .attr("height", function(d) { return vis.height - yScale(d.length); })
            .style("fill", "#1b6663");

            // .attr('fill', '#1b6663')
            // .attr('width', xScale.bandwidth())
            // .attr('width', d => xScale(parseInt(d[0])))
            // .attr('height', function(d) {
            //     console.log("inside attr");
            //     console.log(d);
            // })
            // .attr('height', d => yScale(d[1]))
            // .attr('x', d => xScale(d[0]))
            // .attr('y', d => (vis.height - yScale(d[1])));

        
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
