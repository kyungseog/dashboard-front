import util from "./utility.js";
const DateTime = luxon.DateTime;

let koreaSalesChart;
let japanSalesChart;

startFunction();
setInterval(startFunction, 1 * 60 * 1000);

async function startFunction() {
  const nowTime = DateTime.now().toFormat("yyyy-LL-dd HH:mm:ss");
  const startTime = DateTime.now().minus({ days: 1 }).toFormat("yyyy-LL-dd HH:00:00");
  const koreaSalesData = await util.fetchData(
    `${util.host}/korea/sales?sumType=hour&startDay=${startTime}&endDay=${nowTime}`,
    "GET"
  );
  koreaHeadlines(koreaSalesData);
  japanHeadlines(koreaSalesData);
  salesChartKorea(koreaSalesData);
  salesChartJapan(koreaSalesData);
  koreaProductSales();
  japanProductSales();
}

async function koreaHeadlines(koreaSalesData) {
  const user = 0;
  const orderCount = koreaSalesData.map((r) => Number(r.order_count)).reduce((acc, cur) => acc + cur, 0);
  const sales = koreaSalesData.map((r) => Number(r.sales_price)).reduce((acc, cur) => acc + cur, 0);

  document.getElementById("korea-user").innerHTML = `${util.chunwon(user)} 명`;
  document.getElementById("korea-order-count").innerHTML = `${Number(orderCount).toLocaleString("ko-KR")} 건`;
  document.getElementById("korea-sales").innerHTML = `${util.chunwon(sales)} 천원`;
}

async function salesChartKorea(koreaSalesData) {
  const timeSales = koreaSalesData.map((r) => Number(r.sales_price));
  let cumulSales = [];
  koreaSalesData
    .map((r) => Number(r.sales_price))
    .reduce((acc, cur) => {
      cumulSales.push(acc + cur);
      return acc + cur;
    }, 0);

  const labelData = koreaSalesData.map((r) => String(r.payment_day) + "-" + String(r.payment_hour));

  const ctx = document.getElementById("korea-sales-chart").getContext("2d");

  const gradientStroke1 = ctx.createLinearGradient(0, 230, 0, 50);
  gradientStroke1.addColorStop(1, "rgba(203,12,159,0.2)");
  gradientStroke1.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke1.addColorStop(0, "rgba(203,12,159,0)");

  const gradientStroke2 = ctx.createLinearGradient(0, 230, 0, 50);
  gradientStroke2.addColorStop(1, "rgba(20,23,39,0.2)");
  gradientStroke2.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke2.addColorStop(0, "rgba(20,23,39,0)");

  if (koreaSalesChart) {
    koreaSalesChart.destroy();
  }

  koreaSalesChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labelData,
      datasets: [
        {
          label: "해당시간",
          yAxisID: "y",
          tension: 0.4,
          borderWidth: 0,
          pointRadius: 0,
          borderColor: "#cb0c9f",
          borderWidth: 3,
          backgroundColor: gradientStroke1,
          fill: true,
          data: timeSales,
          maxBarThickness: 6,
        },
        {
          label: "누적",
          type: "line",
          yAxisID: "y1",
          tension: 0.4,
          borderWidth: 0,
          pointRadius: 0,
          borderColor: "#3A416F",
          borderWidth: 3,
          backgroundColor: gradientStroke2,
          fill: true,
          data: cumulSales,
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
          position: "left",
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
        y1: {
          position: "right",
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

async function koreaProductSales() {
  const nowTime = DateTime.now().toFormat("yyyy-LL-dd HH:mm:ss");
  const timeBeforeHour = DateTime.now().minus({ hours: 24 }).toFormat("yyyy-LL-dd HH:mm:ss");
  const URL = `${util.host}/korea/product?sumType=hourPeriod&startDay=${timeBeforeHour}&endDay=${nowTime}`;
  const data = await util.fetchData(URL, "GET");
  data.length = 4;
  let productHtml = "";
  for (let item of data) {
    let html = `
    <div class="col-3 mb-2">
      <div class="card card-blog card-plain">
        <div class="text-center">
          <h5 class="text-sm mb-0">${item.brand_name}</h5>
          <p class="text-sm mb-0">${item.quantity}개 | ${util.chunwon(item.sales_price)}천원</p>
        </div>
        <div class="position-relative">
          <a class="d-block shadow-xl border-radius-xl">
            <img src="${item.image}" alt="img-blur-shadow" class="img-fluid shadow border-radius-xl">
          </a>
        </div>
        <div class="card-body px-1 pt-2">
          <h5 class="text-sm">${item.product_name}</h5>
        </div>
      </div>
    </div>`;
    productHtml = productHtml + html;
  }
  document.getElementById("korea-products-data").innerHTML = productHtml;
}

async function japanHeadlines(koreaSalesData) {
  const user = 0;
  const orderCount = koreaSalesData.map((r) => Number(r.order_count)).reduce((acc, cur) => acc + cur, 0);
  const sales = koreaSalesData.map((r) => Number(r.sales_price)).reduce((acc, cur) => acc + cur, 0);

  document.getElementById("japan-user").innerHTML = `${util.chunwon(user)} 명`;
  document.getElementById("japan-order-count").innerHTML = `${Number(orderCount).toLocaleString("ko-KR")} 건`;
  document.getElementById("japan-sales").innerHTML = `${util.chunwon(sales)} 천원`;
}

async function salesChartJapan(koreaSalesData) {
  const timeSales = koreaSalesData.map((r) => Number(r.sales_price));
  let cumulSales = [];
  koreaSalesData
    .map((r) => Number(r.sales_price))
    .reduce((acc, cur) => {
      cumulSales.push(acc + cur);
      return acc + cur;
    }, 0);

  const labelData = koreaSalesData.map((r) => String(r.payment_day) + "-" + String(r.payment_hour));

  const ctx = document.getElementById("japan-sales-chart").getContext("2d");

  const gradientStroke1 = ctx.createLinearGradient(0, 230, 0, 50);
  gradientStroke1.addColorStop(1, "rgba(203,12,159,0.2)");
  gradientStroke1.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke1.addColorStop(0, "rgba(203,12,159,0)");

  const gradientStroke2 = ctx.createLinearGradient(0, 230, 0, 50);
  gradientStroke2.addColorStop(1, "rgba(20,23,39,0.2)");
  gradientStroke2.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke2.addColorStop(0, "rgba(20,23,39,0)");

  if (japanSalesChart) {
    japanSalesChart.destroy();
  }

  japanSalesChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labelData,
      datasets: [
        {
          label: "해당시간",
          yAxisID: "y",
          tension: 0.4,
          borderWidth: 0,
          pointRadius: 0,
          borderColor: "#cb0c9f",
          borderWidth: 3,
          backgroundColor: gradientStroke1,
          fill: true,
          data: timeSales,
          maxBarThickness: 6,
        },
        {
          label: "누적",
          type: "line",
          yAxisID: "y1",
          tension: 0.4,
          borderWidth: 0,
          pointRadius: 0,
          borderColor: "#3A416F",
          borderWidth: 3,
          backgroundColor: gradientStroke2,
          fill: true,
          data: cumulSales,
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
          position: "left",
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
        y1: {
          position: "right",
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

async function japanProductSales() {
  const nowTime = DateTime.now().toFormat("yyyy-LL-dd HH:mm:ss");
  const timeBeforeHour = DateTime.now().minus({ hours: 1 }).toFormat("yyyy-LL-dd HH:mm:ss");
  const URL = `${util.host}/korea/product?sumType=hourPeriod&startDay=${timeBeforeHour}&endDay=${nowTime}`;
  const data = await util.fetchData(URL, "GET");
  data.length = 4;
  let productHtml = "";
  for (let item of data) {
    let html = `
    <div class="col-3 mb-2">
      <div class="card card-blog card-plain">
        <div class="text-center">
          <h5 class="text-sm mb-0">${item.brand_name}</h5>
          <p class="text-sm mb-0">${item.quantity}개 | ${util.chunwon(item.sales_price)}천원</p>
        </div>
        <div class="position-relative">
          <a class="d-block shadow-xl border-radius-xl">
            <img src="${item.image}" alt="img-blur-shadow" class="img-fluid shadow border-radius-xl">
          </a>
        </div>
        <div class="card-body px-1 pt-2">
          <h5 class="text-sm">${item.product_name}</h5>
        </div>
      </div>
    </div>`;
    productHtml = productHtml + html;
  }
  document.getElementById("japan-products-data").innerHTML = productHtml;
}
