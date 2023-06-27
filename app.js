// Read in samples.json using D3
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
  // Store the sample data
  let samples = data.samples;
  // Store the metadata
  let metadata = data.metadata;

  // Get the dropdown select element
  let dropdown = d3.select("#selDataset");

  // Populate the dropdown options with sample IDs
  samples.forEach(function(sample) {
    dropdown.append("option").attr("value", sample.id).text(sample.id);
  });

  // Create a function to update the charts and metadata based on the selected sample ID
  function optionChanged(selectedValue) {
    // Filter the samples to get the selected individual's information
    let selectedSample = samples.filter(function(sample) {
      return sample.id === selectedValue;
    })[0];

    // Filter the metadata to get the selected individual's demographic information
    let selectedMetadata = metadata.filter(function(meta) {
      return meta.id.toString() === selectedValue;
    })[0];

    // Update the bar chart
    let barData = [{
      x: selectedSample.sample_values.slice(0, 10).reverse(),
      y: selectedSample.otu_ids.map(otuId => `OTU ${otuId}`).slice(0, 10).reverse(),
      text: selectedSample.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    let barLayout = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };

    Plotly.newPlot("bar", barData, barLayout);

    // Update the bubble chart
    let bubbleData = [{
      x: selectedSample.otu_ids,
      y: selectedSample.sample_values,
      text: selectedSample.otu_labels,
      mode: "markers",
      marker: {
        size: selectedSample.sample_values,
        color: selectedSample.otu_ids,
        colorscale: "Earth"
      }
    }];

    let bubbleLayout = {
      title: "OTU Bubble Chart",
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" }
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Display the sample metadata
    let sampleMetadata = d3.select("#sample-metadata");
    sampleMetadata.html("");

    Object.entries(selectedMetadata).forEach(function([key, value]) {
      sampleMetadata.append("p").text(`${key}: ${value}`);
    });
  }

  // Call the optionChanged function initially with the first sample ID
  optionChanged(samples[0].id);

  // Call the optionChanged function when the dropdown selection changes
  dropdown.on("change", function() {
    let selectedValue = dropdown.property("value");
    optionChanged(selectedValue);
  });
});
