import util from "../utility.js";
const DateTime = luxon.DateTime;

let daySalesChart;
let weekSalesChart;

const spinner = `
<div class="d-flex justify-content-center">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>`;

onceFunction();
startFunction();
// setInterval(startFunction, 1 * 60 * 1000);

async function onceFunction() {
  dailySalesChart();
  weeklySalesChart();
  poorItems();
}

async function startFunction() {
  const startDayList = {
    hour: DateTime.now().minus({ days: 1 }).toFormat("yyyy-LL-dd hh:mm:ss"),
    day: DateTime.now().minus({ days: 7 }).toFormat("yyyy-LL-dd hh:mm:ss"),
    month: DateTime.now().minus({ days: 30 }).toFormat("yyyy-LL-dd hh:mm:ss"),
  };
  const pickList = ["hour", "day", "month"];
  const pick = pickList[Number(DateTime.now().toFormat("mm")) % 3];
  document.getElementById(pick).checked = true;
  const startDay = startDayList[pick];
  const endDay = DateTime.now().toFormat("yyyy-LL-dd hh:mm:ss");

  categorySales(startDay, endDay);
  productSales(startDay, endDay);
}

async function dailySalesChart() {
  const thisStartDay = DateTime.now().minus({ days: 13 }).toFormat("yyyy-LL-dd");
  const thisEndDay = DateTime.now().minus({ days: 1 }).toFormat("yyyy-LL-dd");
  const beforeStartDay = DateTime.now().minus({ years: 1, days: 13 }).toFormat("yyyy-LL-dd");
  const beforeEndDay = DateTime.now().minus({ years: 1 }).plus({ days: 8 }).toFormat("yyyy-LL-dd");

  const thisYear = await util.fetchData(
    `${util.host}/mmz-essential/sales?sumType=day&startDay=${thisStartDay}&endDay=${thisEndDay}`,
    "GET"
  );
  const beforeYear = await util.fetchData(
    `${util.host}/mmz-essential/sales?sumType=day&startDay=${beforeStartDay}&endDay=${beforeEndDay}`,
    "GET"
  );

  const sumThisYearSales = thisYear.map((r) => Number(r.sales)).reduce((cur, acc) => cur + acc, 0);
  const sumBeforeYearSales = beforeYear
    .filter((r) => r.payment_date <= DateTime.now().minus({ years: 1, days: 1 }).toFormat("yyyy-LL-dd"))
    .map((r) => Number(r.sales))
    .reduce((cur, acc) => cur + acc, 0);
  const ratio = sumThisYearSales / sumBeforeYearSales;

  const labelData = beforeYear.map((r) => DateTime.fromISO(r.payment_date).toFormat("LL/dd"));
  const thisYearSales = thisYear.map((r) => Math.round(Number(r.sales) / 1000));
  const beforeYearSales = beforeYear.map((r) => Math.round(Number(r.sales) / 1000));

  const weeklySalesChartSummary = document.getElementById("daily-sales-chart-summary");
  weeklySalesChartSummary.innerHTML = `<i class="fa ${
    ratio > 1 ? "fa-arrow-up text-success" : "fa-arrow-down text-danger"
  }"></i> 
  <span class="font-weight-bold">전년대비 ${Math.round(ratio * 100)}%</span>`;

  const ctx = document.getElementById("daily-sales-chart").getContext("2d");

  const gradientStroke1 = ctx.createLinearGradient(0, 230, 0, 50);
  gradientStroke1.addColorStop(1, "rgba(203,12,159,0.2)");
  gradientStroke1.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke1.addColorStop(0, "rgba(203,12,159,0)");

  const gradientStroke2 = ctx.createLinearGradient(0, 230, 0, 50);
  gradientStroke2.addColorStop(1, "rgba(20,23,39,0.2)");
  gradientStroke2.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke2.addColorStop(0, "rgba(20,23,39,0)");

  if (daySalesChart) {
    daySalesChart.destroy();
  }

  daySalesChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labelData,
      datasets: [
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

async function weeklySalesChart() {
  const thisStartDay = DateTime.now().minus({ weeks: 5 }).startOf("week").toFormat("yyyy-LL-dd");
  const thisEndDay = DateTime.now().minus({ days: 1 }).toFormat("yyyy-LL-dd");
  const beforeStartDay = DateTime.now().minus({ years: 1, weeks: 5 }).startOf("week").toFormat("yyyy-LL-dd");
  const beforeEndDay = DateTime.now().minus({ years: 1, days: 1 }).toFormat("yyyy-LL-dd");

  const thisYear = await util.fetchData(
    `${util.host}/mmz-essential/sales?sumType=week&startDay=${thisStartDay}&endDay=${thisEndDay}`,
    "GET"
  );
  const beforeYear = await util.fetchData(
    `${util.host}/mmz-essential/sales?sumType=week&startDay=${beforeStartDay}&endDay=${beforeEndDay}`,
    "GET"
  );

  const sumThisYearSales = thisYear.map((r) => Number(r.sales)).reduce((cur, acc) => cur + acc, 0);
  const sumBeforeYearSales = beforeYear.map((r) => Number(r.sales)).reduce((cur, acc) => cur + acc, 0);
  const ratio = sumThisYearSales / sumBeforeYearSales;

  const labelData = thisYear.map((r) => r.year_week.substring(2) + "주");
  const thisYearSales = thisYear.map((r) => Math.round(Number(r.sales) / 1000));
  const beforeYearSales = beforeYear.map((r) => Math.round(Number(r.sales) / 1000));

  const weeklySalesChartSummary = document.getElementById("weekly-sales-chart-summary");
  weeklySalesChartSummary.innerHTML = `<i class="fa ${
    ratio > 1 ? "fa-arrow-up text-success" : "fa-arrow-down text-danger"
  }"></i> 
  <span class="font-weight-bold">전년대비 ${Math.round(ratio * 100)}%</span>`;

  const ctx = document.getElementById("weekly-sales-chart").getContext("2d");

  const gradientStroke1 = ctx.createLinearGradient(0, 230, 0, 50);
  gradientStroke1.addColorStop(1, "rgba(203,12,159,0.2)");
  gradientStroke1.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke1.addColorStop(0, "rgba(203,12,159,0)");

  const gradientStroke2 = ctx.createLinearGradient(0, 230, 0, 50);
  gradientStroke2.addColorStop(1, "rgba(20,23,39,0.2)");
  gradientStroke2.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke2.addColorStop(0, "rgba(20,23,39,0)");

  if (weekSalesChart) {
    weekSalesChart.destroy();
  }

  weekSalesChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labelData,
      datasets: [
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

async function poorItems() {
  const season = "Summer";
  const salesData = await util.fetchData(`${util.host}/mmz-essential/season?planYear=2023&season=${season}`, "GET");
  let dataArray = [];
  salesData.forEach((el) => {
    const firstDay = DateTime.fromISO(el.payment_date);
    const checkDay = DateTime.now();
    const duringDiff = checkDay.diff(firstDay, "days").toObject();
    const rowData = {
      customCostId: el.custom_cost_id,
      age: el.age,
      item: el.product_name,
      color: el.color,
      firstSalesDay: DateTime.fromISO(el.payment_date).toFormat("LL-dd"),
      duringDiff: Number(duringDiff.days),
      inQuantity: Number(el.in_quantity),
      salesQuantity: Number(el.in_quantity) - Number(el.usable_quantity),
      actualSalesQuantity: Number(el.quantity),
      stockQuantity: Number(el.usable_quantity),
      salesRatio: Math.round(((Number(el.in_quantity) - Number(el.usable_quantity)) / Number(el.in_quantity)) * 100),
      checkPoorItem:
        Math.round(((Number(el.in_quantity) - Number(el.usable_quantity)) / Number(el.in_quantity)) * 100) -
        Number(duringDiff.days),
    };
    dataArray.push(rowData);
  });
  console.log(dataArray);

  let brandHtml = "";
  for (let el of salesData) {
    let html = `
      <tr>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${Number(el.order_count).toLocaleString("ko-kr")} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${Number(el.order_count).toLocaleString("ko-kr")} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${Number(el.quantity).toLocaleString("ko-kr")} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${util.chunwon(Number(el.sales_price))} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${util.chunwon(expense + logistic)} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${util.chunwon(directMarketing + indirectMarketing)} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="${
            calculateMargin >= 0 ? "text-success" : "text-danger"
          } text-xs font-weight-bold"> ${util.chunwon(calculateMargin)} </span>
       </td>
      </tr>`;
    brandHtml = brandHtml + html;
  }
  document.getElementById("poor-items").innerHTML = brandHtml;
}

async function categorySales(startDay, endDay) {
  const categorySalesData = document.getElementById("category-sales-data");
  categorySalesData.innerHTML = spinner;

  const categoryData = await util.fetchData(
    `${util.host}/mmz-essential/category?startDay=${startDay}&endDay=${endDay}`,
    "GET"
  );

  const kidsData = categoryData.filter((r) => r.age === "kids").sort((a, b) => b.sales_price - a.sales_price);
  const babyData = categoryData.filter((r) => r.age === "baby").sort((a, b) => b.sales_price - a.sales_price);

  const kidsHtml = tableTr(kidsData);
  const babyHtml = tableTr(babyData);
  categorySalesData.innerHTML = kidsHtml + babyHtml;
}

async function productSales(startDay, endDay) {
  const kidsProductsData = document.getElementById("kids-products-data");
  const babyProductsData = document.getElementById("baby-products-data");

  kidsProductsData.innerHTML = spinner;
  babyProductsData.innerHTML = spinner;

  const productData = await util.fetchData(
    `${util.host}/mmz-essential/product?startDay=${startDay}&endDay=${endDay}`,
    "GET"
  );

  const kidsData = productData.filter((r) => r.age == "kids");
  kidsData.length = 6;
  const kidsProductHtml = itemDiv(kidsData);
  kidsProductsData.innerHTML = "<h6>Kids</h6>" + kidsProductHtml;

  const babyData = productData.filter((r) => r.age == "baby");
  babyData.length = 6;
  const babyProductHtml = itemDiv(babyData);
  babyProductsData.innerHTML = "<h6>Baby</h6>" + babyProductHtml;
}

function tableTr(data) {
  let dataHtml = "";
  let totalQuantity = 0;
  let totalSales = 0;
  let totalCost = 0;
  for (let el of data) {
    let html = `
      <tr>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${el.age} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${el.category} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${Number(el.quantity).toLocaleString("ko-kr")} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${util.chunwon(Number(el.sales_price))} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${util.chunwon(Number(el.sales_price - el.cost))} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${el.quantity} </span>
        </td>
      </tr>`;
    totalQuantity = totalQuantity + Number(el.quantity);
    totalSales = totalSales + Number(el.sales_price);
    totalCost = totalCost + Number(el.cost);
    dataHtml = dataHtml + html;
  }
  let totalHtml = `
      <tr class="table-active pb-0">
        <td class="align-middle text-center text-sm" colspan = "2">
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${totalQuantity.toLocaleString("ko-kr")} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${util.chunwon(totalSales)} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${util.chunwon(totalSales - totalCost)} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${totalQuantity} </span>
        </td>
      </tr>`;
  return dataHtml + totalHtml;
}

function itemDiv(data) {
  let dataHtml = "";
  for (let item of data) {
    let html = `
    <div class="col-md-4 col-xl-2 mb-2">
      <div class="card card-blog card-plain">
        <div class="position-relative">
          <a class="d-block shadow-xl border-radius-xl">
            <img src="${item.image}" alt="img-blur-shadow" class="img-fluid shadow border-radius-xl">
          </a>
        </div>
        <div class="card-body px-1 pt-2">
          <h5 class="text-xs">${item.product_name}</h5>
          <p class="mb-4 text-xs">수량 ${item.quantity}개<br>실판가 ${util.chunwon(item.sales_price)}천원</p>
        </div>
      </div>
    </div>`;
    dataHtml = dataHtml + html;
  }
  return dataHtml;
}
