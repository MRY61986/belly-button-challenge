// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
        let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
        let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        let result = resultArray[0];


    // Use d3 to select the panel with id of `#sample-metadata`
        let panel = d3.select("#sample-metadata");


    // Use `.html("") to clear any existing metadata
        panel.html("");


    // Inside a loop, you will need to use d3 to append new tags for each key-value in the filtered metadata.
        Object.entries(result).forEach(([key, value]) => {
            panel.append("h6").text(`${key.toUpperCase()}: ${value}`);  
        });
    });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
        let samples = data.samples;

    // Filter the samples for the object with the desired sample number
        let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        let result = resultArray[0];

    // Get the otu_ids, otu_labels, and sample_values
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;


    // Build a Bubble Chart
        let bubbleTrace = {
            x: otu_ids, // otu_ids for the x values
            y: sample_values, // sample_values for the y values
            text: otu_labels, // otu_labels for the text values
            mode: "markers",
            marker: {
                size: sample_values, // sample_values for the marker size
                color: otu_ids, // otu_ids for the marker colors
                colorscale: "Earth"
            }
        };

        let bubbleData = [bubbleTrace];

        let bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 30, l: 50 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" }
        };

    // Render the Bubble Chart
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
        let barData = [
            {
                x: sample_values.slice(0, 10).reverse(), // Use sample_values as the values for the bar chart
                y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(), // Map otu_ids to strings
                text: otu_labels.slice(0, 10).reverse(), // Use otu_labels as the hovertext for the chart
                type: "bar",
                orientation: "h" // Horizontal bar chart
            }
        ];


    // Build a Bar Chart. Don't forget to slice and reverse the input data appropriately
        let barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
        };


    // Render the Bar Chart
        Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
        let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
        let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options. Hint: Inside a loop, you will need to use d3 to append a new option for each sample name.
        names.forEach((name) => {
            dropdown.append("option")
                .text(name)
                .property("value", name);
        });

    // Get the first sample from the list
        let firstSample = names[0];

    // Build charts and metadata panel with the first sample
        buildCharts(firstSample);
        buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize the dashboard
init();
