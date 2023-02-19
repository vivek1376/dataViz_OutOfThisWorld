// ES6 Class
class BarChart {

    constructor(_config) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 500,
            containerHeight: _config.containerHeight || 140,
            margin: { top: 10, bottom: 30, right: 10, left: 30 }
        }

        // Call a class function
        this.initVis();
    }

    initVis() {
        // setting up the chart- things that won't need to update on user actions
        updateVis();  // call updateVis() at the end 
    }

    updateVis() { 
            // ....
            renderVis(); 

    }

    renderVis() { 
        // ...
    }



        // ...
}
