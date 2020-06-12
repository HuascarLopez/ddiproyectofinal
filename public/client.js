 // Acordion class handler
$(".accordion").on("click", "header", function() {
  if (
    $(this)
      .parent()
      .hasClass("hidden")
  ) {
    $(this)
      .parent()
      .removeClass("hidden")
      .siblings()
      .addClass("hidden");
  } else {
    $("section").addClass("hidden");
  }
});

$(document).ready(function() {
  const items = [];
  const itemsRaw = [];
  let datapoints;
  let lastDP;
  let category;

  //BedRoom Label
  $.getJSON("/api/rooms/BjpgUJTT", function(data) {
    data = data.datapoints;
    lastDP = data[data.length - 1].value;

    if (parseInt(lastDP) > 10) {
      category = "ON";
    } else {
      category = "OFF";
    }
    $("#bedroom-value").html(lastDP);
    $("#bedroom-category").html(category);
    $("#bedroom-date").html(new Date());
  });
});

//Dynamic Line Chart
window.onload = function() {
  const now = new Date();
  const items = [];
  const itemsRaw = [];
  let datapoints;
  let lastDP;
  let category;
  let date;
  let dpsBed = []; // dataPoints
  let dpsBath = []; // dataPoints
  let dpsLiving = []; // dataPoints
  let dpsKitchen = []; // dataPoints

  //BedRoom Label
  $.getJSON("/api/rooms/BjpgUJTT", function(data) {
    data = data.datapoints;
    lastDP = parseInt(data[data.length - 1].value);
    date = new Date(data[data.length - 1].date);
    for (let i = 0; i < data.length - 1; i++) {
      //dps.push({ x: new Date(data[i].date), y: parseInt(data[i].value) });
    }
  });

  let chart = new CanvasJS.Chart("chartContainer", {
    title: {
      text: "Fotoresistor Data"
    },
    axisY: {
      includeZero: false
    },
    legend: {
       verticalAlign: "top", 
       fontSize: 12
     },
    data: [
      {
        type: "line",
        showInLegend: true,
        legendText: "Bedroom",
        dataPoints: dpsBed
      },
      {
        type: "line",
        showInLegend: true,
        legendText: "Bathroom",
        dataPoints: dpsBath
      },
      {
        type: "line",
        showInLegend: true,
        legendText: "Livingroom",
        dataPoints: dpsLiving
      },
      {
        type: "line",
        showInLegend: true,
        legendText: "Kitchen",
        dataPoints: dpsKitchen
      }
    ]
  });

  let xVal = new Date();
  let yVal1, yVal2, yVal3, yVal4;
  let updateInterval = 1000;
  let dataLength = 30; // number of dataPoints visible at any point

  let updateChart = function(count) {
    count = count || 1;

    for (let i = 0; i < count; i++) {
      //yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));
      $.getJSON("/api/rooms/BjpgUJTT", function(data) {
        data = data.datapoints;
        lastDP = parseInt(data[data.length - 1].value);
        //lastDP = lastDP + Math.round(5 + Math.random() *(-5));

        if (parseInt(lastDP) > 50) {
          category = "Lights ON";
          $("#bedroom-category").addClass('on');
        } else {
          category = "Lights OFF";
          $("#bedroom-category").addClass('off');
        }
        $("#bedroom-value").html(lastDP);
        $("#bedroom-category").html(category);
        $("#bedroom-date").html(Math.floor((new Date().getTime()- now.getTime())/1000)*0.01 + "kWh");
        yVal1 = parseInt(lastDP);
        yVal2 = 0;
        yVal3 = 0;
        yVal4 = 0;
      });
      dpsBed.push({
        x: xVal,
        y: yVal1
      });
      dpsBath.push({
        x: xVal,
        y: yVal2
      });
      dpsLiving.push({
        x: xVal,
        y: yVal3
      });
      dpsKitchen.push({
        x: xVal,
        y: yVal4
      });
      xVal = new Date();
    }

    if (dpsBed.length > dataLength) {
      dpsBed.shift();
      dpsBath.shift();
      dpsLiving.shift();
      dpsKitchen.shift();
    }

    chart.render();
  };

  updateChart(dataLength);
  setInterval(function() {
    updateChart();
  }, updateInterval);
};
