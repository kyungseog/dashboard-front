import util from "./utility.js"
const DateTime = luxon.DateTime;

let consignmentMonthChart;
let consignmentAccumChart;
let strategicMonthChart;
let strategicAccumChart;

(function startFunction() {
  
})();

async function sqaudData() {
  consignmentChart();
  strategicChart();
};

async function consignmentChart() {
  const consignmentMonthctx = document.getElementById("consignment-squad-month-chart").getContext("2d");
  if(consignmentMonthChart) { consignmentMonthChart.destroy() };

  consignmentMonthChart = new Chart(consignmentMonthctx, {
    type: "bar",
    data: {
      labels: ["목표","실판가","매출이익","직접비","광고비","공헌이익","목표"],
      datasets: [
        {
          label: "당월 추정",
          data: [
            [0,3070],
            [0,3070],
            [0, 2500],
            [2300, 2500],
            [2000, 2300],
            [1500, 2000],
            [0, 1500],
            [0, 1500],
          ],
          tension: 0.4,
          borderWidth: 0,
          borderSkipped: false,
          backgroundColor: "#696969",
          
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: '당월',
        },
        datalabels: {
          color: '#b2b9bf',
          align: 'top',
        },
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
              size: 10,
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
            padding: 10,
            font: {
              size: 10,
              family: "Open Sans",
              style: 'normal',
              lineHeight: 2
            },
          }
        },
      },
    },
  });

  const consignmentAccumctx = document.getElementById("consignment-squad-accum-chart").getContext("2d");
  if(consignmentAccumChart) { consignmentAccumChart.destroy() };

  consignmentAccumChart = new Chart(consignmentAccumctx, {
    type: "bar",
    data: {
      labels: ["목표","실판가","매출이익","직접비","광고비","공헌이익","목표"],
      datasets: [
        {
          label: "당월 추정",
          data: [
            [0,3070],
            [0,3070],
            [0, 2500],
            [2300, 2500],
            [2000, 2300],
            [1500, 2000],
            [0, 1500],
            [0, 1500],
          ],
          tension: 0.4,
          borderWidth: 0,
          borderSkipped: false,
          backgroundColor: "#696969",
          
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: '누적',
        },
        datalabels: {
          color: '#b2b9bf',
          align: 'top',
        },
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
              size: 10,
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
            padding: 10,
            font: {
              size: 10,
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

async function strategicChart() {
  const strategicMonthctx = document.getElementById("strategic-squad-month-chart").getContext("2d");
  if(strategicMonthChart) { strategicMonthChart.destroy() };

  strategicMonthChart = new Chart(strategicMonthctx, {
    type: "bar",
    data: {
      labels: ["목표","실판가","매출이익","직접비","광고비","공헌이익","목표"],
      datasets: [
        {
          label: "당월 추정",
          data: [
            [0,3070],
            [0,3070],
            [0, 2500],
            [2300, 2500],
            [2000, 2300],
            [1500, 2000],
            [0, 1500],
            [0, 1500],
          ],
          tension: 0.4,
          borderWidth: 0,
          borderSkipped: false,
          backgroundColor: "#696969",
          
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: '당월',
        },
        datalabels: {
          color: '#b2b9bf',
          align: 'top',
        },
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
              size: 10,
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
            padding: 10,
            font: {
              size: 10,
              family: "Open Sans",
              style: 'normal',
              lineHeight: 2
            },
          }
        },
      },
    },
  });

  const strategicAccumctx = document.getElementById("strategic-squad-accum-chart").getContext("2d");
  if(strategicAccumChart) { strategicAccumChart.destroy() };

  strategicAccumChart = new Chart(strategicAccumctx, {
    type: "bar",
    data: {
      labels: ["목표","실판가","매출이익","직접비","광고비","공헌이익","목표"],
      datasets: [
        {
          label: "당월 추정",
          data: [
            [0,3070],
            [0,3070],
            [0, 2500],
            [2300, 2500],
            [2000, 2300],
            [1500, 2000],
            [0, 1500],
            [0, 1500],
          ],
          tension: 0.4,
          borderWidth: 0,
          borderSkipped: false,
          backgroundColor: "#696969",
          
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: '누적',
        },
        datalabels: {
          color: '#b2b9bf',
          align: 'top',
        },
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
              size: 10,
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
            padding: 10,
            font: {
              size: 10,
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