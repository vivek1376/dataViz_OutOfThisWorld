class Scatterplot {

    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            // colorScale: _config.colorScale,
            // containerWidth: _config.containerWidth || 500,
            // containerHeight: _config.containerHeight || 300,
            margin: _config.margin || {top: 25, right: 20, bottom: 20, left: 35},
            // tooltipPadding: _config.tooltipPadding || 15
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


        this.data = _data;
        this.initVis();
    }


    initVis() {
    }

    updateVis() {
    }

    renderVis() {
    }
}
