import util from "./utility.js"
const DateTime = luxon.DateTime;
let koreaSalesChart;
let koreaWeatherChart;

(function startFunction() {
  salesData();
  weatherData();
})();

async function salesData() {
  const URL = `${util.host}/korea/chart-sales`;
  const data = await util.fetchData(URL, "GET");

  const labelData = data[0].map( r => DateTime.fromISO(r.payment_date).toFormat('LL/dd') );
  const thisYearSales = data[0].map( r => Math.round(r.sales_price/1000) );
  const beforeYearSales = data[1].map( r => Math.round(r.sales_price/1000) );

  const sumThisYearSales = thisYearSales.reduce( (acc, cur) => acc + cur, 0 );
  const sumBeforeYearSales = beforeYearSales.reduce( (acc, cur) => acc + cur, 0 );
  const ratio = (sumThisYearSales / sumBeforeYearSales).toFixed(2);

  const koreaSalesChartSummary = document.getElementById("korea-sales-chart-summary");
  koreaSalesChartSummary.innerHTML = `<i class="fa ${ratio > 1 ? 'fa-arrow-up text-success' : 'fa-arrow-down text-danger'}"></i> 
  <span class="font-weight-bold">전년대비 ${ratio * 100}%</span>`;
  
  salesChart( labelData, thisYearSales, beforeYearSales );
};

async function salesChart( labelData, thisYearSales, beforeYearSales ) {
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
          label: "Y" + DateTime.now().toFormat('yyyy'),
          tension: 0.4,
          borderWidth: 0,
          pointRadius: 0,
          borderColor: "#cb0c9f",
          borderWidth: 3,
          backgroundColor: gradientStroke1,
          fill: true,
          data: thisYearSales,
          maxBarThickness: 6

        },
        {
          label: "Y" + DateTime.now().minus({ years: 1 }).toFormat('yyyy'),
          tension: 0.4,
          borderWidth: 0,
          pointRadius: 0,
          borderColor: "#3A416F",
          borderWidth: 3,
          backgroundColor: gradientStroke2,
          fill: true,
          data: beforeYearSales,
          maxBarThickness: 6
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
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
  const URL = `${util.host}/weather/seoul`;
  const data = await util.fetchData(URL, "GET");
  console.log(data);
  const thisYearTemp = data[0].map( r => [r.Weather_temperature_min, r.Weather_temperature_max] );
  const beforeYearTemp = data[1].map( r => [r.Weather_temperature_min, r.Weather_temperature_max] );

  const labelData = thisYearData.map( r => DateTime.fromISO(r.Weather_date).toFormat('LL/dd') );

  weatherChart( thisYearTemp, beforeYearTemp, labelData );
};

async function weatherChart( thisYearTemp, beforeYearTemp, labelData ) {
  const ctx = document.getElementById("korea-weather-chart").getContext("2d");
  const colorCode = ["#696969","#696969","#696969","#696969","#fff","#696969","#696969"];

  if(koreaWeatherChart) { koreaWeatherChart.destroy() };

  koreaWeatherChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labelData,
      datasets: [
        {
          label: "Y" + DateTime.now().minus({ years: 1 }).toFormat('yyyy'),
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 4,
          borderSkipped: false,
          backgroundColor: "#696969",
          data: beforeYearTemp,
          maxBarThickness: 6
        },
        {
          label: "Y" + DateTime.now().toFormat('yyyy'),
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 4,
          borderSkipped: false,
          backgroundColor: "#fff",
          data: thisYearTemp,
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
