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
  const monthlyUserData = await util.fetchData(
    `${util.host}/korea/users?startDay=${DateTime.now().startOf("month").toFormat("yyyy-LL-dd")}&endDay=${today}`,
    "GET"
  );
  const totalUserData = await util.fetchData(`${util.host}/korea/users?startDay=2020-02-01&endDay=${today}`, "GET");
  document.getElementById("korea-new-user").innerHTML = `${Number(yesterdayUserData.count_users).toLocaleString(
    "ko-KR"
  )} 명`;
  document.getElementById("korea-monthly-user").innerHTML = `${Number(monthlyUserData.count_users).toLocaleString(
    "ko-KR"
  )} 명`;
  document.getElementById("korea-total-user").innerHTML = `${util
    .chunwon(totalUserData.count_users)
    .toLocaleString("ko-KR")} 천명`;
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
  const thisYearSales = thisYear.map((r) => Math.round(r.sales_price / 1000));
  const beforeYearSales = beforeYear.map((r) => Math.round(r.sales_price / 1000));

  const ctx = document.getElementById("daily-sales-chart").getContext("2d");
  if (dailySalesChart) {
    dailySalesChart.destroy();
  }
  const optionData = { display: true, text: "일별 실판매가 현황" };
  dailySalesChart = new TwoLineChart(ctx, labelData, thisYearSales, beforeYearSales, optionData);
}

async function weeklyChart() {
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
  const thisYearSales = thisYear.map((r) => Math.round(r.sales_price / 1000));
  const beforeYearSales = beforeYear.map((r) => Math.round(r.sales_price / 1000));

  const ctx = document.getElementById("weekly-sales-chart").getContext("2d");
  if (weeklySalesChart) {
    weeklySalesChart.destroy();
  }
  const optionData = { display: true, text: "주별 실판매가 현황", legend: false };
  weeklySalesChart = new TwoLineChart(ctx, labelData, thisYearSales, beforeYearSales, optionData);
}

async function brandSales() {
  const salesData = await util.fetchData(`${util.host}/korea/brand?startDay=${yesterday}&endDay=${yesterday}`, "GET");
  const beforeSalesData = await util.fetchData(
    `${util.host}/korea/brand?startDay=${beforeYesterday}&endDay=${beforeYesterday}`,
    "GET"
  );
  const marketingData = await util.fetchData(
    `${util.host}/korea/brand/marketing?startDay=${yesterday}&endDay=${yesterday}`,
    "GET"
  );
  const logisticData = await util.fetchData(
    `${util.host}/korea/logistic/brand?startDay=${yesterday}&endDay=${yesterday}`,
    "GET"
  );

  let volumeBrandSales = 0;
  let volumeBrandBeforeSales = 0;
  let volumeBrandMargin = 0;
  let fashionBrandSales = 0;
  let fashionBrandBeforeSales = 0;
  let fashionBrandMargin = 0;
  let designBrandSales = 0;
  let designBrandBeforeSales = 0;
  let designBrandMargin = 0;
  let strategicBrandSales = 0;
  let strategicBrandBeforeSales = 0;
  let strategicBrandMargin = 0;
  let buyingBrandSales = 0;
  let buyingBrandBeforeSales = 0;
  let buyingBrandMargin = 0;
  let essentialBrandSales = 0;
  let essentialBrandBeforeSales = 0;
  let essentialBrandMargin = 0;

  for (let el of salesData) {
    const filteredData = beforeSalesData.filter((r) => r.brand_id == el.brand_id);
    const couponFee =
      el.brand_type == "consignment" ? Number(el.order_coupon) : Number(el.order_coupon) + Number(el.product_coupon);
    const expense = Number(el.cost) + Number(el.mileage) + couponFee + Number(el.pg_expense);

    const directList = marketingData.direct.filter((r) => r.brand_id == el.brand_id);
    const directMarketing =
      directList[0] == undefined || directList[0] == null ? 0 : Number(directList[0].direct_marketing_fee);

    const indirectList = marketingData.indirect.filter((r) => r.brand_id == el.brand_id);
    const indirectMarketing =
      indirectList[0] == undefined || indirectList[0] == null ? 0 : Number(indirectList[0].indirect_marketing_fee);

    const logisticList = logisticData.filter((r) => r.brand_id == el.brand_id);
    const logistic = logisticList[0] == undefined || logisticList[0] == null ? 0 : Number(logisticList[0].logistic_fee);

    const calculateMargin =
      el.brand_type == "consignment"
        ? el.commission - expense - directMarketing - indirectMarketing
        : el.sales_price - expense - directMarketing - indirectMarketing - logistic;

    if (util.volumeBrands.indexOf(el.brand_id) >= 0) {
      volumeBrandSales = volumeBrandSales + Number(el.sales_price);
      volumeBrandMargin = volumeBrandMargin + calculateMargin;
      volumeBrandBeforeSales =
        volumeBrandBeforeSales + Number(filteredData[0] == undefined ? 0 : filteredData[0].sales_price);
    } else if (el.brand_squad == "위탁SQ") {
      if (util.fashionMds.indexOf(el.md_id) >= 0) {
        fashionBrandSales = fashionBrandSales + Number(el.sales_price);
        fashionBrandMargin = fashionBrandMargin + calculateMargin;
        fashionBrandBeforeSales =
          fashionBrandBeforeSales + Number(filteredData[0] == undefined ? 0 : filteredData[0].sales_price);
      } else {
        designBrandSales = designBrandSales + Number(el.sales_price);
        designBrandMargin = designBrandMargin + calculateMargin;
        designBrandBeforeSales =
          designBrandBeforeSales + Number(filteredData[0] == undefined ? 0 : filteredData[0].sales_price);
      }
    } else if (el.brand_squad == "전략카테고리SQ") {
      strategicBrandSales = strategicBrandSales + Number(el.sales_price);
      strategicBrandMargin = strategicBrandMargin + calculateMargin;
      strategicBrandBeforeSales =
        strategicBrandBeforeSales + Number(filteredData[0] == undefined ? 0 : filteredData[0].sales_price);
    } else if (el.brand_squad == "매입SQ") {
      buyingBrandSales = buyingBrandSales + Number(el.sales_price);
      buyingBrandMargin = buyingBrandMargin + calculateMargin;
      buyingBrandBeforeSales =
        buyingBrandBeforeSales + Number(filteredData[0] == undefined ? 0 : filteredData[0].sales_price);
    } else {
      essentialBrandSales = essentialBrandSales + Number(el.sales_price);
      essentialBrandMargin = essentialBrandMargin + calculateMargin;
      essentialBrandBeforeSales =
        essentialBrandBeforeSales + Number(filteredData[0] == undefined ? 0 : filteredData[0].sales_price);
    }
  }

  const brandNames = ["전략", "매스", "HYPE", "내셔널/수입", "용품", "매입", "에센셜", "미지정"];
  const salesNames = [
    volumeBrandSales,
    fashionBrandSales,
    designBrandSales,
    strategicBrandSales,
    buyingBrandSales,
    essentialBrandSales,
  ];
  const marginNames = [
    volumeBrandMargin,
    fashionBrandMargin,
    designBrandMargin,
    strategicBrandMargin,
    buyingBrandMargin,
    essentialBrandMargin,
  ];
  const rationNames = [
    Math.round((volumeBrandSales / volumeBrandBeforeSales) * 100),
    Math.round((fashionBrandSales / fashionBrandBeforeSales) * 100),
    Math.round((designBrandSales / designBrandBeforeSales) * 100),
    Math.round((strategicBrandSales / strategicBrandBeforeSales) * 100),
    Math.round((buyingBrandSales / buyingBrandBeforeSales) * 100),
    Math.round((essentialBrandSales / essentialBrandBeforeSales) * 100),
  ];

  let brandSalesData = "";
  for (let i = 0; i < brandNames.length; i++) {
    let data = `<div class="col-md-6 mb-2">
      <div class="card">
        <div class="card-body pt-0 p-3 text-center">
          <p>${brandNames[i]}</p>
          <h4><span class="text-sm">${util.bmwon(Number(salesNames[i]))}백만</span> / ${util.bmwon(
      Number(salesNames[i])
    )}백만</h4>
          <hr class="horizontal dark my-3">
          <span class="text-xs">(공헌이익) ${util.bmwon(marginNames[i])}백만</span>
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
