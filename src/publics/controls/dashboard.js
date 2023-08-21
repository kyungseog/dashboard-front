import util from "./utility.js";
import { TwoLineChart } from "./graph.js";
const DateTime = luxon.DateTime;

let dailySalesChart;
let weeklySalesChart;

const today = DateTime.now().toFormat("yyyy-LL-dd");
const yesterday = DateTime.now().minus({ days: 1 }).toFormat("yyyy-LL-dd");
const beforeYesterday = DateTime.now().minus({ days: 2 }).toFormat("yyyy-LL-dd");

(function startFunction() {
  headlines();
  dailyChart();
  weeklyChart();
  brandSales();
  productSales("moomooz", "yesterday");
})();

async function headlines() {
  const todaySalesData = await util.fetchData(
    `${util.host}/korea/sales?startDay=${yesterday}&endDay=${yesterday}`,
    "GET"
  );
  const monthlySalesData = await util.fetchData(
    `${util.host}/korea/sales?startDay=${DateTime.now().startOf("month").toFormat("yyyy-LL-dd")}&endDay=${yesterday}`,
    "GET"
  );
  document.getElementById("korea-order-count").innerHTML = `${Number(todaySalesData.order_count).toLocaleString(
    "ko-KR"
  )} 건`;
  document.getElementById("korea-sales").innerHTML = `${util.bmwon(todaySalesData.sales_price)} 백만원`;
  document.getElementById("korea-monthly-sales").innerHTML = `${util.bmwon(monthlySalesData.sales_price)} 백만원`;

  const yesterdayUserData = await util.fetchData(
    `${util.host}/korea/users?startDay=${yesterday}&endDay=${yesterday}`,
    "GET"
  );
  document.getElementById("korea-new-user").innerHTML = `${Number(yesterdayUserData.count_users).toLocaleString(
    "ko-KR"
  )} 명`;

  const monthlyUserData = await util.fetchData(
    `${util.host}/korea/users?startDay=${DateTime.now().startOf("month").toFormat("yyyy-LL-dd")}&endDay=${today}`,
    "GET"
  );
  document.getElementById("korea-monthly-user").innerHTML = `${Number(monthlyUserData.count_users).toLocaleString(
    "ko-KR"
  )} 명`;

  const totalUserData = await util.fetchData(`${util.host}/korea/users?startDay=2020-02-01&endDay=${today}`, "GET");
  document.getElementById("korea-total-user").innerHTML = `확인중`;
}

async function dailyChart() {
  const thisYear = await util.fetchData(
    `${util.host}/korea/sales?sumType=day&startDay=${DateTime.now()
      .minus({ days: 10 })
      .toFormat("yyyy-LL-dd")}&endDay=${yesterday}`,
    "GET"
  );
  const beforeYear = await util.fetchData(
    `${util.host}/korea/sales?sumType=day&startDay=${DateTime.now()
      .minus({ years: 1, days: 10 })
      .toFormat("yyyy-LL-dd")}&endDay=${DateTime.now().minus({ years: 1 }).plus({ days: 6 }).toFormat("yyyy-LL-dd")}`,
    "GET"
  );

  const labelData = beforeYear.map((r) => DateTime.fromISO(r.payment_date).toFormat("LL/dd"));
  const thisYearSales = thisYear.map((r) => Math.round(r.sales_price / 1000000));
  const beforeYearSales = beforeYear.map((r) => Math.round(r.sales_price / 1000000));

  const ctx = document.getElementById("daily-sales-chart").getContext("2d");
  if (dailySalesChart) {
    dailySalesChart.destroy();
  }
  const optionData = { display: true, text: "일별 실판매가 현황" };
  dailySalesChart = new TwoLineChart(ctx, labelData, thisYearSales, beforeYearSales, optionData);
}

async function weeklyChart() {
  const thisYearStartDay = DateTime.now().minus({ weeks: 5 }).startOf("week").toFormat("yyyy-LL-dd");
  const thisYear = await util.fetchData(
    `${util.host}/korea/sales?sumType=day&startDay=${thisYearStartDay}&endDay=${yesterday}`,
    "GET"
  );

  const beforeYearStartDay = DateTime.now().minus({ years: 1, weeks: 5 }).startOf("week").toFormat("yyyy-LL-dd");
  const beforeYearEndDay = DateTime.now().minus({ years: 1 }).plus({ weeks: 4 }).endOf("week").toFormat("yyyy-LL-dd");
  const beforeYear = await util.fetchData(
    `${util.host}/korea/sales?sumType=day&startDay=${beforeYearStartDay}&endDay=${beforeYearEndDay}`,
    "GET"
  );

  const labelData = [...new Set(beforeYear.map((row) => row.weeks))].map((r) => r + "주차");
  const thisYearSalesData = getPartialSum(thisYear, "weeks", "sales_price");
  const thisYearSales = thisYearSalesData.map((data) => util.bmwon(data.sumF));
  const beforeYearSalesData = getPartialSum(beforeYear, "weeks", "sales_price");
  const beforeYearSales = beforeYearSalesData.map((data) => util.bmwon(data.sumF));

  const ctx = document.getElementById("weekly-sales-chart").getContext("2d");
  if (weeklySalesChart) {
    weeklySalesChart.destroy();
  }
  const optionData = { display: true, text: "주별 실판매가 현황", legend: false };
  weeklySalesChart = new TwoLineChart(ctx, labelData, thisYearSales, beforeYearSales, optionData);
}

async function brandSales() {
  const dailySales = await util.fetchData(`${util.host}/korea/brand?startDay=${yesterday}&endDay=${yesterday}`, "GET");
  const weeklySales = await util.fetchData(
    `${util.host}/korea/brand?sumType=day&startDay=${DateTime.now()
      .minus({ days: 7 })
      .toFormat("yyyy-LL-dd")}&endDay=${yesterday}`,
    "GET"
  );
  const monthlySales = await util.fetchData(
    `${util.host}/korea/brand?startDay=${DateTime.now().toFormat("yyyy-LL-01")}&endDay=${yesterday}`,
    "GET"
  );

  const dailySalesData = getPartialSum(dailySales, "profit_cell", "sales_price");
  const monthlySalesData = getPartialSum(monthlySales, "profit_cell", "sales_price");

  let brandSalesData = "";
  for (let i = 0; i < monthlySalesData.length; i++) {
    const daily = dailySalesData.filter((row) => row.keyF === monthlySalesData[i].keyF);
    // const weekly = weeklySales.filter((data) => data.profit_cell == monthlySalesData[i].keyF);
    // const html ="<svg width="110" height="30"><rect x="${5 * i + 2 * i}" y="${max / heightFactor - d / heightFactor}" width="5" height="${d / heightFactor}" style="fill:#f72a2a;"></rect></svg>""
    const max = Math.max.apply(null);
    let data = `<div class="col-md-6 mb-2">
      <div class="card">
        <div class="card-body pt-0 p-3 text-center">
          <p>${monthlySalesData[i].keyF == "PB" ? "에센셜" : monthlySalesData[i].keyF}</p>
          <h4><span class="fs-5 text-secondary">${util.bmwon(
            Number(daily[0] == undefined ? 0 : daily[0].sumF)
          )}백만</span> / ${util.bmwon(monthlySalesData[i].sumF)}백만</h4>
          <hr class="horizontal dark my-3">
        </div>
      </div>
    </div>`;
    brandSalesData = brandSalesData + data;
  }
  document.getElementById("brand-sales").innerHTML = brandSalesData;
}

async function productSales(brandId, dateText) {
  const URL = `${util.host}/korea/product-sales/${brandId}/${dateText}`;
  const data = await util.fetchData(URL, "GET");
  data.length = 6;
  let productHtml = "";
  for (let item of data) {
    let html = `
    <div class="col-md-6 col-xl-4 col-6 mb-2">
      <div class="card card-blog card-plain">
        <div class="position-relative">
          <a class="d-block shadow-xl border-radius-xl">
            <img src="${item.image}" alt="img-blur-shadow" class="img-fluid shadow border-radius-xl">
          </a>
        </div>
        <div class="card-body px-1 pt-2">
          <h5 class="text-sm">${item.brand_name}</h5>
          <h5 class="text-sm">${item.product_name}</h5>
          <p class="mb-4 text-sm">${item.quantity}개 | ${util.chunwon(item.sales_price)}천원</p>
        </div>
      </div>
    </div>`;
    productHtml = productHtml + html;
  }
  document.getElementById("brand-products-data").innerHTML = productHtml;
}

function getPartialSum(apiData, keyFactor, sumFactor) {
  const factor = [...new Set(apiData.map((row) => row[keyFactor]))];
  const partialSums = factor.map((row) => ({
    keyF: row,
    sumF: Math.round(apiData.filter((r) => r[keyFactor] == row).reduce((acc, cur) => acc + Number(cur[sumFactor]), 0)),
  }));
  return partialSums;
}
