const DateTime = luxon.DateTime;
let koreaSalesChart;
let koreaWeatherChart;

async function fetchData(URL, method) {
  const response = await fetch(URL, {method: method});
  const data = await response.json()
  return data;
}

(function startFunction() {
  salesData();
})();

async function salesData() {
  const thisYearURL = `http://localhost:3000/korea/sales?today=${DateTime.now().toFormat('yyyy-LL-dd')}&type=10`;
  const beforeYearURL = `http://localhost:3000/korea/sales?today=${DateTime.now().minus({ years: 1 }).toFormat('yyyy-LL-dd')}&type=10`;

  const thisYeardata = await fetchData(thisYearURL, "GET");
  const beforeYeardata = await fetchData(beforeYearURL, "GET");
  const thisYearSalesData = thisYeardata.map( r => Math.round(r.sales_price/10000) );
  const beforeYearSalesData = beforeYeardata.map( r => Math.round(r.sales_price/10000) );

  const labelData = thisYeardata.map( r => DateTime.fromISO(r.payment_date).toFormat('LL/dd') );
  const thisYearLabel = "Y" + DateTime.now().toFormat('yyyy');
  const beforeYearLabel = "Y" + DateTime.now().minus({ years: 1 }).toFormat('yyyy');

  salesChart( labelData, thisYearLabel, beforeYearLabel, thisYearSalesData, beforeYearSalesData );
};

async function salesChart( labelData, thisYearLabel, beforeYearLabel, thisYearSalesData, beforeYearSalesData ) {
  var ctx2 = document.getElementById("korea-sales-chart").getContext("2d");

  var gradientStroke1 = ctx2.createLinearGradient(0, 230, 0, 50);
  gradientStroke1.addColorStop(1, 'rgba(203,12,159,0.2)');
  gradientStroke1.addColorStop(0.2, 'rgba(72,72,176,0.0)');
  gradientStroke1.addColorStop(0, 'rgba(203,12,159,0)'); 

  var gradientStroke2 = ctx2.createLinearGradient(0, 230, 0, 50);
  gradientStroke2.addColorStop(1, 'rgba(20,23,39,0.2)');
  gradientStroke2.addColorStop(0.2, 'rgba(72,72,176,0.0)');
  gradientStroke2.addColorStop(0, 'rgba(20,23,39,0)');

  if(koreaSalesChart) { koreaSalesChart.destroy() };

  koreaSalesChart = new Chart(ctx2, {
    type: "line",
    data: {
      labels: labelData,
      datasets: [{
          label: thisYearLabel,
          tension: 0.4,
          borderWidth: 0,
          pointRadius: 0,
          borderColor: "#cb0c9f",
          borderWidth: 3,
          backgroundColor: gradientStroke1,
          fill: true,
          data: thisYearSalesData,
          maxBarThickness: 6

        },
        {
          label: beforeYearLabel,
          tension: 0.4,
          borderWidth: 0,
          pointRadius: 0,
          borderColor: "#3A416F",
          borderWidth: 3,
          backgroundColor: gradientStroke2,
          fill: true,
          data: beforeYearSalesData,
          maxBarThickness: 6
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        }
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
      scales: {
        y: {
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5]
          },
          ticks: {
            display: true,
            padding: 10,
            color: '#b2b9bf',
            font: {
              size: 11,
              family: "Open Sans",
              style: 'normal',
              lineHeight: 2
            },
          }
        },
        x: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
            borderDash: [5, 5]
          },
          ticks: {
            display: true,
            color: '#b2b9bf',
            padding: 20,
            font: {
              size: 11,
              family: "Open Sans",
              style: 'normal',
              lineHeight: 2
            },
          }
        },
      },
    },
  });
};

async function weatherData() {
  const thisYearURL = `http://localhost:3000/korea/weather/${DateTime.now().toFormat('yyyy-LL-dd')}`;
  const beforeYearURL = `http://localhost:3000/korea/weather/${DateTime.now().minus({ years: 1 }).toFormat('yyyy-LL-dd')}`;

  const thisYearData = await fetchData(thisYearURL, "GET");
  const beforeYearData = await fetchData(beforeYearURL, "GET");
  const thisYearTemp = thisYearData.map( r => [r.min, r.max] );
  const beforeYearTemp = beforeYearData.map( r => [r.min, r.max] );

  const labelData = thisYearData.map( r => DateTime.fromISO(r.payment_date).toFormat('LL/dd') );
  const thisYearLabel = "Y" + DateTime.now().toFormat('yyyy');
  const beforeYearLabel = "Y" + DateTime.now().minus({ years: 1 }).toFormat('yyyy');

  weatherChart( thisYearTemp, beforeYearTemp, labelData, thisYearLabel, beforeYearLabel );
};

async function weatherChart( thisYearTemp, beforeYearTemp, labelData, thisYearLabel, beforeYearLabel ) {
  const ctx = document.getElementById("korea-weather-chart").getContext("2d");

  const dayLabels = labelData;
  const thisYearTemperature = thisYearTemp;
  const beforYearTemperature = beforeYearTemp;
  const colorCode = ["#696969","#696969","#696969","#696969","#fff","#696969","#696969"];

  if(koreaWeatherChart) { koreaWeatherChart.destroy() };

  koreaWeatherChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: dayLabels,
      datasets: [
        {
          label: beforeYearLabel,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 4,
          borderSkipped: false,
          backgroundColor: "#696969",
          data: beforYearTemperature,
          maxBarThickness: 6
        },
        {
          label: thisYearLabel,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 4,
          borderSkipped: false,
          backgroundColor: "#fff",
          data: thisYearTemperature,
          maxBarThickness: 6
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        }
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
      scales: {
        y: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          ticks: {
            suggestedMin: -20,
            suggestedMax: 20,
            beginAtZero: true,
            padding: 5,
            font: {
              size: 12,
              family: "Open Sans",
              style: 'normal',
              lineHeight: 2
            },
            color: "#fff"
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false
          },
          ticks: {
            display: true,
            color: colorCode,
          },
        },
      },
    },
  });
}
