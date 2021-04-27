// The portion of the code append the SVG element was taken from class examples

// if the SVG area isn't empty when the browser loads,
// remove it and replace it with a resized version of the chart
var svgArea = d3.select("body").select("svg");

// clear svg is not empty
if (!svgArea.empty()) {
    svgArea.remove();
}

// SVG wrapper dimensions are determined by the current width and
// height of the browser window.
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 60,
    right: 60,
    bottom: 60,
    left: 60
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// Append SVG element
var svg = d3
    .select(".plot")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Append group element
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read CSV
var url = "assets/data/data.csv"
d3.csv(url).then(function (censusData) {
    
    // parse data
    censusData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(censusData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d.healthcare)])
        .range([height, 0]);

    // create axes
    var xAxis = d3.axisBottom(xLinearScale).ticks(7);
    var yAxis = d3.axisLeft(yLinearScale).ticks(6);

    // append axes
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);
    
    // Append xaxis title
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 40})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .text("% In Poverty");

    // Append yaxis title
    chartGroup.append("text")
        .attr("transform", `translate(-30, ${height/2})rotate(270)`)
        // .attr("transform", `translate(0, ${height/2})`)
        // .attr("transform", "rotate(-90deg)")
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .text("% Lacking Healthcare");

    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .classed("stateCircle", true);

    var fontSize = 12
    var statesGroup = chartGroup.selectAll(null)
        .data(censusData)
        .enter()
        .append('text')
        .text(d => d.abbr)
        .attr('x', d => xLinearScale(d.poverty))
        .attr('y', d => yLinearScale(d.healthcare)+(fontSize/2))
        .attr('font-size', `${fontSize}px`)
        .classed('stateText', true);

}).catch(function (error) {
    console.log(error);
});


