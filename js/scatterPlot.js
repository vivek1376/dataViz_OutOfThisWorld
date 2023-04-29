class scatterPlot {
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            margin: { top: 50, bottom: 50, right: 50, left: 50 },
            scaleType: _config.scaleType
            // margin: { top: 10, bottom: 30, right: 10, left: 30 }
        }

        let dataLength = undefined;

        if (typeof _data === 'object')
            dataLength = Object.keys(_data).length * _config.barWidth;

        // this.config.contentWidth = _config.contentWidth || dataLength || 600;
        this.config.contentWidth = _config.contentWidth;
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



//         vis.xScale = d3.scaleLinear()
//             .range([0, vis.width]);

//         vis.yScale = d3.scaleLinear()
//             .range([vis.height, 0]);


        vis.xScale = d3.scaleLog()
            .base(10)
            .range([0, vis.width]);

        vis.yScale = d3.scaleLog()
            .base(10)
            // .range([0, vis.height]);
            .range([vis.height, 0]);  // TODO why reverse ?

        // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale)
            .ticks(4)
        // .tickSize(-vis.height - 10);
        // .tickPadding(10)
        // .tickFormat(d => d + ' earth distance');
            .tickFormat(d => d);

        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(3)
            // .tickFormat(d => d + ' earth mass');
            .tickFormat(d => d);
            // .tickSize(-vis.width - 10)
            // .tickPadding(10);

        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        vis.svg.append('text')
            .attr('x', 140)
            .attr('y', 320)
            .text('Earth radius');

        // y title
        vis.svg.append('text')
            .attr('x', 20)
            .attr('y', 36)
            .text('Earth mass');

        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},
                ${vis.config.margin.top})`);

        vis.xAxisG = vis.chart.append('g')
            // .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`);


        vis.yAxisG = vis.chart.append('g');
            // .attr('class', 'axis y-axis');

        this.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.xValue = d => d.radius;
        vis.yValue = d => d.mass;

        console.log("min rad:", d3.min(vis.data, vis.xValue));
        console.log("max mass:", d3.max(vis.data, vis.yValue));

        // // Set the scale input domains
        // vis.xScale.domain([0, d3.max(vis.data, vis.xValue)]);
        // vis.yScale.domain([0, d3.max(vis.data, vis.yValue)]);

        // Set the scale input domains
        // vis.xScale.domain([1, d3.max(vis.data, vis.xValue)]);
        vis.xScale.domain([d3.min(vis.data, vis.xValue), d3.max(vis.data, vis.xValue)]);
        // vis.yScale.domain([1, d3.max(vis.data, vis.yValue)]);
        vis.yScale.domain([d3.min(vis.data, vis.yValue), d3.max(vis.data, vis.yValue)]);

        console.log("max X:", d3.max(vis.data, vis.xValue));
        console.log("max Y:", d3.max(vis.data, vis.yValue));

        vis.renderVis();
    }

    renderVis() {

        let vis = this;


        // Add circles
        vis.chart.selectAll('circle')
            // .data(vis.data, function (d) {console.log(d); return d.radius;})
            .data(vis.data)
            .join('circle')
            // .enter()
            // .append('circle')
            // .attr('class', 'point')
            .attr('r', 4)
            .attr('cy', d => vis.yScale(vis.yValue(d)))
            .attr('cx', d => vis.xScale(vis.xValue(d)))
            .attr('fill', '#283d57')
            .on('mouseover', function(event, d) {
                event.target.style.outline = "2px solid #c42351";
                // event.target.style = {"border-radius": "4px"};
                // console.log("style:", event.target.style);
                // console.log("d:", d);

                d3.select('div#tooltip').html(`
                   <li><em>name: ${d.name}</em></li>
                   <li><em>distance: ${d.distance}</em></li> 
                   <li><em>discovered in ${d.year}</em></li> 
                `);
            })
            .on('mouseleave', (event, d) => {
                event.target.style.outline = "0";
                d3.select('div#tooltip').html(``);

                // console.log("leaving ", d);
            });


        // Update the axes/gridlines
        // We use the second .call() to remove the axis and just show gridlines
        vis.xAxisG
            .call(vis.xAxis);
            // .call(g => g.select('.domain').remove());

        vis.yAxisG
            .call(vis.yAxis);
            // .call(g => g.select('.domain').remove());
    }
};
