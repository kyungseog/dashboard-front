import util from "./utility.js";
const DateTime = luxon.DateTime;

let squadSalesChart;
let koreaWeatherChart;
let consignmentSalesChart;
let consignmentMarginChart;
let strategicSalesChart;
let strategicMarginChart;
let buyingSalesChart;
let buyingMarginChart;
let essentialSalesChart;
let essentialMarginChart;

(function startFunction() {
  const URL = window.location.href;
  const squadId = URL.substring(URL.indexOf("/", URL.indexOf("squad")) + 1);
  salesChart(squadId);
  sqaudData();
})();

async function salesChart(squadId) {
  const data = await util.fetchData(`${util.host}/squad/${squadId}/sales`, "GET");

  const labelData = data[0].map((r) => DateTime.fromISO(r.payment_date).toFormat("LL/dd"));
  const thisYearSales = data[0].map((r) => Math.round(r.sales_price / 1000));
  const beforeYearSales = data[1].map((r) => Math.round(r.sales_price / 1000));

  const sumThisYearSales = thisYearSales.reduce((acc, cur) => acc + cur, 0);
  const sumBeforeYearSales = beforeYearSales.reduce((acc, cur) => acc + cur, 0);
  const ratio = (sumThisYearSales / sumBeforeYearSales).toFixed(2);

  const koreaSalesChartSummary = document.getElementById("squad-sales-chart-summary");
  koreaSalesChartSummary.innerHTML = `<i class="fa ${
    ratio > 1 ? "fa-arrow-up text-success" : "fa-arrow-down text-danger"
  }"></i> 
  <span class="font-weight-bold">전년대비 ${ratio * 100}%</span>`;

  const squadSalesCtx = document.getElementById("squad-sales-chart").getContext("2d");

  const gradientStroke1 = squadSalesCtx.createLinearGradient(0, 230, 0, 50);
  gradientStroke1.addColorStop(1, "rgba(203,12,159,0.2)");
  gradientStroke1.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke1.addColorStop(0, "rgba(203,12,159,0)");

  const gradientStroke2 = squadSalesCtx.createLinearGradient(0, 230, 0, 50);
  gradientStroke2.addColorStop(1, "rgba(20,23,39,0.2)");
  gradientStroke2.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke2.addColorStop(0, "rgba(20,23,39,0)");

  const gradientStroke3 = squadSalesCtx.createLinearGradient(0, 230, 0, 50);
  gradientStroke2.addColorStop(1, "rgba(20,23,39,0.2)");
  gradientStroke2.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke2.addColorStop(0, "rgba(20,23,39,0)");

  if (squadSalesChart) {
    squadSalesChart.destroy();
  }

  squadSalesChart = new Chart(squadSalesCtx, {
    type: "line",
    data: {
      labels: labelData,
      datasets: [
        {
          label: "목표",
          tension: 0.4,
          borderWidth: 0,
          pointRadius: 0,
          borderColor: "#3A416F",
          borderWidth: 3,
          backgroundColor: gradientStroke3,
          fill: true,
          data: budgetSales,
          maxBarThickness: 6,
        },
        {
          label: "Y" + DateTime.now().toFormat("yyyy"),
          tension: 0.4,
          borderWidth: 0,
          pointRadius: 0,
          borderColor: "#cb0c9f",
          borderWidth: 3,
          backgroundColor: gradientStroke1,
          fill: true,
          data: thisYearSales,
          maxBarThickness: 6,
        },
        {
          label: "Y" + DateTime.now().minus({ years: 1 }).toFormat("yyyy"),
          tension: 0.4,
          borderWidth: 0,
          pointRadius: 0,
          borderColor: "#3A416F",
          borderWidth: 3,
          backgroundColor: gradientStroke2,
          fill: true,
          data: beforeYearSales,
          maxBarThickness: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      scales: {
        y: {
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
          },
          ticks: {
            display: true,
            padding: 10,
            color: "#b2b9bf",
            font: {
              size: 11,
              family: "Open Sans",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
            borderDash: [5, 5],
          },
          ticks: {
            display: true,
            color: "#b2b9bf",
            padding: 20,
            font: {
              size: 11,
              family: "Open Sans",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
      },
    },
  });
}

async function squadChart(sales, margin) {
  const optionsData = {
    responsive: true,
    plugins: {
      datalabels: {
        color: "white",
        display: true,
        font: {
          size: 11,
          family: "Open Sans",
          style: "bold",
          lineHeight: 2,
        },
      },
      legend: {
        labels: {
          boxWidth: 0,
          boxHeight: 0,
        },
        display: true,
      },
    },
    scales: {
      y: {
        grid: {
          drawBorder: false,
          display: true,
          drawOnChartArea: true,
          drawTicks: false,
          borderDash: [5, 5],
        },
        ticks: {
          display: false,
          padding: 10,
          color: "#b2b9bf",
          font: {
            size: 10,
            family: "Open Sans",
            style: "normal",
            lineHeight: 2,
          },
        },
      },
      x: {
        grid: {
          drawBorder: false,
          display: false,
          drawOnChartArea: false,
          drawTicks: false,
          borderDash: [5, 5],
        },
        ticks: {
          display: true,
          color: "#b2b9bf",
          padding: 10,
          font: {
            size: 10,
            family: "Open Sans",
            style: "normal",
            lineHeight: 2,
          },
        },
      },
    },
  };

  const consignmentSalesCtx = document.getElementById("consignment-squad-sales-chart").getContext("2d");
  if (consignmentSalesChart) {
    consignmentSalesChart.destroy();
  }

  consignmentSalesChart = new Chart(consignmentSalesCtx, {
    plugins: [ChartDataLabels],
    type: "bar",
    data: {
      labels: ["예산", "추정"],
      datasets: [
        {
          label: "실판가매출",
          data: sales.consignment,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: ["#37306B", "#66347F"],
          datalabels: {
            align: "center",
            anchor: "center",
          },
        },
      ],
    },
    options: optionsData,
  });

  const consignmentMarginCtx = document.getElementById("consignment-squad-margin-chart").getContext("2d");
  if (consignmentMarginChart) {
    consignmentMarginChart.destroy();
  }

  consignmentMarginChart = new Chart(consignmentMarginCtx, {
    plugins: [ChartDataLabels],
    type: "bar",
    data: {
      labels: ["예산", "추정"],
      datasets: [
        {
          label: "공헌이익",
          data: margin.consignment,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: ["#37306B", "#66347F"],
          datalabels: {
            align: "center",
            anchor: "center",
          },
        },
      ],
    },
    options: optionsData,
  });

  const strategicSalesCtx = document.getElementById("strategic-squad-sales-chart").getContext("2d");
  if (strategicSalesChart) {
    strategicSalesChart.destroy();
  }

  strategicSalesChart = new Chart(strategicSalesCtx, {
    plugins: [ChartDataLabels],
    type: "bar",
    data: {
      labels: ["예산", "추정"],
      datasets: [
        {
          label: "실판가매출",
          data: sales.strategic,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: ["#37306B", "#66347F"],
          datalabels: {
            align: "center",
            anchor: "center",
          },
        },
      ],
    },
    options: optionsData,
  });

  const strategicMarginCtx = document.getElementById("strategic-squad-margin-chart").getContext("2d");
  if (strategicMarginChart) {
    strategicMarginChart.destroy();
  }

  strategicMarginChart = new Chart(strategicMarginCtx, {
    plugins: [ChartDataLabels],
    type: "bar",
    data: {
      labels: ["예산", "추정"],
      datasets: [
        {
          label: "공헌이익",
          data: margin.strategic,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: ["#37306B", "#66347F"],
          datalabels: {
            align: "center",
            anchor: "center",
          },
        },
      ],
    },
    options: optionsData,
  });

  const buyingSalesCtx = document.getElementById("buying-squad-sales-chart").getContext("2d");
  if (buyingSalesChart) {
    buyingSalesChart.destroy();
  }

  buyingSalesChart = new Chart(buyingSalesCtx, {
    plugins: [ChartDataLabels],
    type: "bar",
    data: {
      labels: ["예산", "추정"],
      datasets: [
        {
          label: "실판가매출",
          data: sales.buying,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: ["#37306B", "#66347F"],
          datalabels: {
            align: "center",
            anchor: "center",
          },
        },
      ],
    },
    options: optionsData,
  });

  const buyingMarginCtx = document.getElementById("buying-squad-margin-chart").getContext("2d");
  if (buyingMarginChart) {
    buyingMarginChart.destroy();
  }

  buyingMarginChart = new Chart(buyingMarginCtx, {
    plugins: [ChartDataLabels],
    type: "bar",
    data: {
      labels: ["예산", "추정"],
      datasets: [
        {
          label: "공헌이익",
          data: margin.buying,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: ["#37306B", "#66347F"],
          datalabels: {
            align: "center",
            anchor: "center",
          },
        },
      ],
    },
    options: optionsData,
  });

  const essentialSalesCtx = document.getElementById("essential-squad-sales-chart").getContext("2d");
  if (essentialSalesChart) {
    essentialSalesChart.destroy();
  }

  essentialSalesChart = new Chart(essentialSalesCtx, {
    plugins: [ChartDataLabels],
    type: "bar",
    data: {
      labels: ["예산", "추정"],
      datasets: [
        {
          label: "실판가매출",
          data: sales.essential,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: ["#37306B", "#66347F"],
          datalabels: {
            align: "center",
            anchor: "center",
          },
        },
      ],
    },
    options: optionsData,
  });

  const essentialMarginCtx = document.getElementById("essential-squad-margin-chart").getContext("2d");
  if (essentialMarginChart) {
    essentialMarginChart.destroy();
  }

  essentialMarginChart = new Chart(essentialMarginCtx, {
    plugins: [ChartDataLabels],
    type: "bar",
    data: {
      labels: ["예산", "추정"],
      datasets: [
        {
          label: "공헌이익",
          data: margin.essential,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: ["#37306B", "#66347F"],
          datalabels: {
            align: "center",
            anchor: "center",
          },
        },
      ],
    },
    options: optionsData,
  });
}
