import util from "./utility.js";
const DateTime = luxon.DateTime;

let monthlySquadSalesChart;
let monthlySquadChart;
let yearlySquadSalesChart;
let yearlySquadChart;

(function startFunction() {
  const URL = window.location.href;
  const squadId = URL.substring(URL.indexOf("/", URL.indexOf("squad")) + 1);
  monthlyData(squadId);
  yearlyData(squadId);
})();

async function monthlyData(squadId) {
  const startDay = DateTime.now().startOf("month").toFormat("yyyy-LL-dd");
  const endDay = DateTime.now().toFormat("yyyy-LL-dd");
  const beforeYearStartDay = DateTime.now().startOf("month").minus({ years: 1 }).toFormat("yyyy-LL-dd");
  const beforeYearEndDay = DateTime.now().minus({ years: 1 }).toFormat("yyyy-LL-dd");

  const thisYearURL = `${util.host}/squad/${squadId}/sales?startDay=${startDay}&endDay=${endDay}`;
  const beforeYearURL = `${util.host}/squad/${squadId}/sales?startDay=${beforeYearStartDay}&endDay=${beforeYearEndDay}`;
  const thisYearData = await util.fetchData(thisYearURL, "GET");
  const beforeYearData = await util.fetchData(beforeYearURL, "GET");

  document.getElementById("squad-name").innerText = thisYearData.actual[0].squad_name;

  const countDays = Number(DateTime.now().endOf("month").toFormat("dd"));
  let labels = [];
  let budgetSales = [];
  for (let i = 0; i < countDays; i++) {
    labels.push(DateTime.now().toFormat("LL") + "-" + (i < 9 ? "0" + (i + 1) : i + 1));
    budgetSales.push(Math.round(thisYearData.budget.sales / 1000000));
  }

  let stepThisYearSales = [];
  thisYearData.actual
    .map((r) => Math.round(r.sales_price / 1000000))
    .reduce((acc, cur) => {
      stepThisYearSales.push(acc + cur);
      return acc + cur;
    }, 0);

  let stepBeforeYearSales = [];
  beforeYearData.actual
    .map((r) => Math.round(r.sales_price / 1000000))
    .reduce((acc, cur) => {
      stepBeforeYearSales.push(acc + cur);
      return acc + cur;
    }, 0);

  const sumThisYearSales = thisYearData.actual.map((r) => Number(r.sales_price)).reduce((acc, cur) => acc + cur, 0);
  const sumBeforeYearSales = beforeYearData.actual.map((r) => Number(r.sales_price)).reduce((acc, cur) => acc + cur, 0);
  const ratioBefore = (sumThisYearSales / sumBeforeYearSales).toFixed(2);
  const ratioBudget = (sumThisYearSales / thisYearData.budget.sales).toFixed(2);

  monthlySalesChart(ratioBefore, ratioBudget, labels, budgetSales, stepThisYearSales, stepBeforeYearSales);

  const commission =
    squadId == "consignment" || squadId == "strategic"
      ? thisYearData.actual.map((r) => Number(r.commission)).reduce((acc, cur) => acc + cur, 0)
      : sumThisYearSales;
  const cost = thisYearData.actual.map((r) => Number(r.cost)).reduce((acc, cur) => acc + cur, 0);
  const coupon =
    squadId == "consignment" || squadId == "strategic"
      ? thisYearData.actual.map((r) => Number(r.order_coupon)).reduce((acc, cur) => acc + cur, 0)
      : thisYearData.actual.map((r) => Number(r.order_coupon)).reduce((acc, cur) => acc + cur, 0) +
        thisYearData.actual.map((r) => Number(r.product_coupon)).reduce((acc, cur) => acc + cur, 0);
  const expense =
    Number(thisYearData.logistic.fee) +
    thisYearData.actual.map((r) => Number(r.mileage)).reduce((acc, cur) => acc + cur, 0) +
    thisYearData.actual.map((r) => Number(r.pg_expense)).reduce((acc, cur) => acc + cur, 0);
  const marketing =
    Number(thisYearData.directMarketing.fee) +
    Number(thisYearData.indirectMarketing.fee) +
    Number(thisYearData.liveMarketing.fee);
  const margin = commission - cost - coupon - marketing - expense;

  const bottomData = [
    0,
    Math.round((commission - cost) / 1000000),
    Math.round((commission - cost - coupon) / 1000000),
    Math.round((commission - cost - coupon - marketing) / 1000000),
    Math.round((commission - cost - coupon - marketing - expense) / 1000000),
    0,
  ];
  const topData = [
    Math.round(commission / 1000000),
    Math.round(cost / 1000000),
    Math.round(coupon / 1000000),
    Math.round(marketing / 1000000),
    Math.round(expense / 1000000),
    Math.round(margin / 1000000),
  ];
  monthlyChart(bottomData, topData);
}

async function monthlySalesChart(ratioBefore, ratioBudget, labels, budgetSales, thisYearSales, beforeYearSales) {
  document.getElementById("monthly-sales-chart-summary").innerHTML = `
  <div class="d-flex">
  <i class="fa ${ratioBefore > 1 ? "fa-arrow-up text-success" : "fa-arrow-down text-danger"}"></i> 
  <span class="font-weight-bold me-2">전년비 ${Math.round(ratioBefore * 100)}%</span>
  <i class="fa ${ratioBudget > 1 ? "fa-arrow-up text-success" : "fa-arrow-down text-danger"}"></i> 
  <span class="font-weight-bold">목표비 ${Math.round(ratioBudget * 100)}%</span>
</div>`;

  const monthlySalesCtx = document.getElementById("monthly-sales-chart").getContext("2d");

  const gradientStroke1 = monthlySalesCtx.createLinearGradient(0, 230, 0, 50);
  gradientStroke1.addColorStop(1, "rgba(203,12,159,0.2)");
  gradientStroke1.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke1.addColorStop(0, "rgba(203,12,159,0)");

  const gradientStroke2 = monthlySalesCtx.createLinearGradient(0, 230, 0, 50);
  gradientStroke2.addColorStop(1, "rgba(20,23,39,0.2)");
  gradientStroke2.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke2.addColorStop(0, "rgba(20,23,39,0)");

  const gradientStroke3 = monthlySalesCtx.createLinearGradient(0, 230, 0, 50);
  gradientStroke2.addColorStop(1, "rgba(20,23,39,0.2)");
  gradientStroke2.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke2.addColorStop(0, "rgba(20,23,39,0)");

  if (monthlySquadSalesChart) {
    monthlySquadSalesChart.destroy();
  }

  monthlySquadSalesChart = new Chart(monthlySalesCtx, {
    type: "line",
    data: {
      labels: labels,
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

async function monthlyChart(bottomData, topData) {
  const optionsData = {
    responsive: true,
    plugins: {
      datalabels: {
        color: "white",
        display: true,
        font: {
          size: 11,
          family: "Open Sans",
          style: "normal",
          lineHeight: 2,
        },
      },
      legend: {
        labels: {
          boxWidth: 0,
          boxHeight: 0,
        },
        display: false,
      },
    },
    scales: {
      y: {
        stacked: true,
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
        stacked: true,
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

  const monthlyCtx = document.getElementById("monthly-chart").getContext("2d");
  if (monthlySquadChart) {
    monthlySquadChart.destroy();
  }

  monthlySquadChart = new Chart(monthlyCtx, {
    plugins: [ChartDataLabels],
    type: "bar",
    data: {
      labels: ["매출", "원가", "쿠폰", "마케팅", "기타", "공헌이익"],
      datasets: [
        {
          label: "",
          data: bottomData,
          borderSkipped: false,
          backgroundColor: ["rgba(0, 0, 0, 0)"],
          datalabels: {
            display: false,
            align: "center",
            anchor: "center",
          },
        },
        {
          label: "실적",
          data: topData,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: ["#002B5B", "#EA5455", "#EA5455", "#EA5455", "#EA5455", "#93BFCF"],
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

async function yearlyData(squadId) {
  const startDay = DateTime.now().startOf("year").toFormat("yyyy-LL-dd");
  const endDay = DateTime.now().toFormat("yyyy-LL-dd");
  const beforeYearStartDay = DateTime.now().startOf("year").minus({ years: 1 }).toFormat("yyyy-LL-dd");
  const beforeYearEndDay = DateTime.now().minus({ years: 1 }).toFormat("yyyy-LL-dd");

  const thisYearURL = `${util.host}/squad/${squadId}/sales?startDay=${startDay}&endDay=${endDay}`;
  const beforeYearURL = `${util.host}/squad/${squadId}/sales?startDay=${beforeYearStartDay}&endDay=${beforeYearEndDay}`;
  const thisYearData = await util.fetchData(thisYearURL, "GET");
  const beforeYearData = await util.fetchData(beforeYearURL, "GET");

  const countDays = Number(DateTime.now().toFormat("ll"));
  let labels = [];
  let budgetSales = [];
  for (let i = 0; i < countDays; i++) {
    labels.push(i + 1 + "월");
    budgetSales.push(Math.round(thisYearData.budget.sales / 1000000));
  }

  let stepThisYearSales = [];
  thisYearData.actual
    .map((r) => Math.round(r.sales_price / 1000000))
    .reduce((acc, cur) => {
      stepThisYearSales.push(acc + cur);
      return acc + cur;
    }, 0);

  let stepBeforeYearSales = [];
  beforeYearData.actual
    .map((r) => Math.round(r.sales_price / 1000000))
    .reduce((acc, cur) => {
      stepBeforeYearSales.push(acc + cur);
      return acc + cur;
    }, 0);

  const sumThisYearSales = thisYearData.actual.map((r) => Number(r.sales_price)).reduce((acc, cur) => acc + cur, 0);
  const sumBeforeYearSales = beforeYearData.actual.map((r) => Number(r.sales_price)).reduce((acc, cur) => acc + cur, 0);
  const ratioBefore = (sumThisYearSales / sumBeforeYearSales).toFixed(2);
  const ratioBudget = (sumThisYearSales / thisYearData.budget.sales).toFixed(2);

  yearlySalesChart(ratioBefore, ratioBudget, labels, budgetSales, stepThisYearSales, stepBeforeYearSales);

  const commission =
    squadId == "consignment" || squadId == "strategic"
      ? thisYearData.actual.map((r) => Number(r.commission)).reduce((acc, cur) => acc + cur, 0)
      : sumThisYearSales;
  const cost = thisYearData.actual.map((r) => Number(r.cost)).reduce((acc, cur) => acc + cur, 0);
  const coupon =
    squadId == "consignment" || squadId == "strategic"
      ? thisYearData.actual.map((r) => Number(r.order_coupon)).reduce((acc, cur) => acc + cur, 0)
      : thisYearData.actual.map((r) => Number(r.order_coupon)).reduce((acc, cur) => acc + cur, 0) +
        thisYearData.actual.map((r) => Number(r.product_coupon)).reduce((acc, cur) => acc + cur, 0);
  const expense =
    Number(thisYearData.logistic.fee) +
    thisYearData.actual.map((r) => Number(r.mileage)).reduce((acc, cur) => acc + cur, 0) +
    thisYearData.actual.map((r) => Number(r.pg_expense)).reduce((acc, cur) => acc + cur, 0);
  const marketing =
    Number(thisYearData.directMarketing.fee) +
    Number(thisYearData.indirectMarketing.fee) +
    Number(thisYearData.liveMarketing.fee);
  const margin = commission - cost - coupon - marketing - expense;

  const bottomData = [
    0,
    Math.round((commission - cost) / 1000000),
    Math.round((commission - cost - coupon) / 1000000),
    Math.round((commission - cost - coupon - marketing) / 1000000),
    Math.round((commission - cost - coupon - marketing - expense) / 1000000),
    0,
  ];
  const topData = [
    Math.round(commission / 1000000),
    Math.round(cost / 1000000),
    Math.round(coupon / 1000000),
    Math.round(marketing / 1000000),
    Math.round(expense / 1000000),
    Math.round(margin / 1000000),
  ];
  yearlyChart(bottomData, topData);
}

async function yearlySalesChart(ratioBefore, ratioBudget, labels, budgetSales, thisYearSales, beforeYearSales) {
  document.getElementById("yearly-sales-chart-summary").innerHTML = `
  <div class="d-flex">
    <i class="fa ${ratioBefore > 1 ? "fa-arrow-up text-success" : "fa-arrow-down text-danger"}"></i> 
    <span class="font-weight-bold me-2">전년비 ${Math.round(ratioBefore * 100)}%</span>
    <i class="fa ${ratioBudget > 1 ? "fa-arrow-up text-success" : "fa-arrow-down text-danger"}"></i> 
    <span class="font-weight-bold">목표비 ${Math.round(ratioBudget * 100)}%</span>
  </div>`;

  const yearlySalesCtx = document.getElementById("yearly-sales-chart").getContext("2d");

  const gradientStroke1 = yearlySalesCtx.createLinearGradient(0, 230, 0, 50);
  gradientStroke1.addColorStop(1, "rgba(203,12,159,0.2)");
  gradientStroke1.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke1.addColorStop(0, "rgba(203,12,159,0)");

  const gradientStroke2 = yearlySalesCtx.createLinearGradient(0, 230, 0, 50);
  gradientStroke2.addColorStop(1, "rgba(20,23,39,0.2)");
  gradientStroke2.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke2.addColorStop(0, "rgba(20,23,39,0)");

  const gradientStroke3 = yearlySalesCtx.createLinearGradient(0, 230, 0, 50);
  gradientStroke2.addColorStop(1, "rgba(20,23,39,0.2)");
  gradientStroke2.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke2.addColorStop(0, "rgba(20,23,39,0)");

  if (yearlySquadSalesChart) {
    yearlySquadSalesChart.destroy();
  }

  yearlySquadSalesChart = new Chart(yearlySalesCtx, {
    type: "line",
    data: {
      labels: labels,
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

async function yearlyChart(bottomData, topData) {
  const optionsData = {
    responsive: true,
    plugins: {
      datalabels: {
        color: "white",
        display: true,
        font: {
          size: 11,
          family: "Open Sans",
          style: "normal",
          lineHeight: 2,
        },
      },
      legend: {
        labels: {
          boxWidth: 0,
          boxHeight: 0,
        },
        display: false,
      },
    },
    scales: {
      y: {
        stacked: true,
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
        stacked: true,
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

  const yearlyCtx = document.getElementById("yearly-chart").getContext("2d");
  if (yearlySquadChart) {
    yearlySquadChart.destroy();
  }

  yearlySquadChart = new Chart(yearlyCtx, {
    plugins: [ChartDataLabels],
    type: "bar",
    data: {
      labels: ["매출", "원가", "쿠폰", "마케팅", "기타", "공헌이익"],
      datasets: [
        {
          label: "",
          data: bottomData,
          borderSkipped: false,
          backgroundColor: ["rgba(0, 0, 0, 0)"],
          datalabels: {
            display: false,
            align: "center",
            anchor: "center",
          },
        },
        {
          label: "실적",
          data: topData,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: ["#9EA1D4", "#FD8A8A", "#FD8A8A", "#FD8A8A", "#FD8A8A", "#A8D1D1"],
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
