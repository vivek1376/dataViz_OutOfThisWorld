class horizontalBarChart {

    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            // containerWidth: _config.containerWidth || 600,
            // containerHeight: _config.containerHeight || 400,
            translateX: _config.translateX,
            translateY: _config.translateY,
            margin: { top: 50, bottom: 50, right: 50, left: 50 },
            scaleType: _config.scaleType
            // margin: { top: 10, bottom: 30, right: 10, left: 30 }
        }

        this.config.margin.left = _config.marginLeft || this.config.margin.left;
        this.config.contentHeight = Object.keys(_data).length * _config.barHeight;
        this.config.contentWidth = _config.contentWidth || 400;
        this.config.containerHeight = this.config.contentHeight + this.config.margin.top +
            this.config.margin.bottom;
        this.config.containerWidth = this.config.contentWidth + this.config.margin.left +
            this.config.margin.right;

        // Call a class function

        this.data = _data;
        this.initVis();
    }

    initVis() {

        let vis = this; 

        // Width and height as the inner dimensions of the chart area- as before
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;        

        // Define 'svg' as a child-element (g) from the drawing area and include spaces
        // Add <svg> element (drawing space)
        vis.svg = d3.select(vis.config.parentElement)
            .attr('height', vis.config.containerHeight)
            .attr('width', vis.config.containerWidth)

        let translateY = vis.config.margin.top + vis.config.translateY;
        let translateX = vis.config.margin.left + vis.config.translateX;

        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${translateX}, 
                ${translateY})`);

        // Initialize linear and ordinal scales (input domain and output 
        // range)
        const yScale = d3.scaleBand()
            .domain(Object.keys(vis.data))
            .range([0, vis.height])
            .paddingInner(0.2);

        var xScale;
        var xAxisScale;

        if (vis.config.scaleType === "log") {
            xScale = d3.scaleLog()
                .base(10)
                .domain([1, d3.max(Object.values(vis.data))])
                .range([0, vis.height]);

            xAxisScale = d3.scaleLog()
                .base(10)
            // .domain([d3.max(Object.values(vis.data)), 1])
                .domain([1, d3.max(Object.values(vis.data))])
            // .range([0, vis.height]);
                .range([0, vis.height]);
        } else {
            
            xScale = d3.scaleLinear()
                .domain([0, d3.max(Object.values(vis.data))])
                .range([0, vis.height]);

            xAxisScale = d3.scaleLinear()
            // .domain([d3.max(Object.values(vis.data)), 1])
                .domain([0, d3.max(Object.values(vis.data))])
            // .range([0, vis.height]);
                .range([0, vis.height]);
        }

        vis.yAxis = d3.axisLeft()
            .scale(yScale);

        vis.xAxis = d3.axisBottom()
            .scale(xAxisScale)
            .ticks(4);
        // .tickSizeOuter(0);

        // Draw the axis
        vis.yAxisGroup = vis.chart.append('g')
        // .attr('transform', `translate(0, ${vis.width})`)
        // .attr('class', 'axis x-axis')
            .call(vis.yAxis);

        vis.xAxisGroup = vis.chart.append('g')
        // .attr('class', 'axis y-axis')
            .call(vis.xAxis);

        vis.chart.selectAll('rect')
            .data(Object.entries(vis.data))
            .enter()
            .append('rect')
            .attr('fill', '#1b6663')
            .attr('height', yScale.bandwidth())
            // .attr('width', d => xScale(parseInt(d[0])))
            // .attr('height', function(d) {
            //     console.log("inside attr");
            //     console.log(d);
            // })
            .attr('width', d => xScale(d[1]))
            .attr('y', d => yScale(d[0]))
            .attr('x', 0);
            // .attr('y', d => (vis.height - yScale(d[1])));

            // TODO fix axes display
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
