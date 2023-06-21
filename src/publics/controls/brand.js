import util from "./utility.js";
import { TwoLineChart, TwoBlueBarChart, TwoBrownBarChart } from "./graph.js";
const DateTime = luxon.DateTime;

let salesChartWeekly;
let salesChartMonthly;
let marginChartMonthly;

const startDayPicker = new Datepicker(document.querySelector("#datepicker1"), { format: "yyyy-mm-dd" });
const endDayPicker = new Datepicker(document.querySelector("#datepicker2"), { format: "yyyy-mm-dd" });
const URL = window.location.href;
const brandId = URL.substring(URL.indexOf("/", URL.indexOf("brand")) + 1);

const yesterday = DateTime.now().minus({ days: 1 }).toFormat("yyyy-LL-dd");

(function startFunction() {
  startDayPicker.setDate(yesterday);
  endDayPicker.setDate(yesterday);
  const URL = window.location.href;
  const brandId = URL.substring(URL.indexOf("/", URL.indexOf("brand")) + 1);
  brandSales(brandId, yesterday, yesterday);
  bestProducts(brandId, yesterday, yesterday);
  weeklySalesChartData(brandId);
  monthlyChart(brandId);
})();

const submit = document.querySelector("#submit");
submit.addEventListener("click", () => {
  const startDay = startDayPicker.getDate("yyyy-mm-dd");
  const endDay = endDayPicker.getDate("yyyy-mm-dd");
  brandSales(brandId, startDay, endDay);
  bestProducts(brandId, startDay, endDay);
});

const checkBox = document.querySelector("#flexSwitchCheckChecked");
checkBox.addEventListener("change", (e) => {
  if (e.target.checked) {
    monthlyCumulatedChart(brandId);
  } else {
    monthlyChart(brandId);
  }
});

async function brandSales(brandId, startDay, endDay) {
  const salesData = await util.fetchData(`${util.host}/korea/brand?startDay=${startDay}&endDay=${endDay}`, "GET");
  const marketingData = await util.fetchData(
    `${util.host}/korea/brand/marketing?startDay=${startDay}&endDay=${endDay}`,
    "GET"
  );
  const logisticData = await util.fetchData(
    `${util.host}/korea/logistic/brand?startDay=${startDay}&endDay=${endDay}`,
    "GET"
  );

  const sales = salesData.filter((r) => r.brand_id == brandId);
  const directMarketing = marketingData.direct.filter((r) => r.brand_id == brandId);
  const indirectMarketing = marketingData.indirect.filter((r) => r.brand_id == brandId);
  const logistic = logisticData.filter((r) => r.brand_id == brandId);

  document.getElementById(
    "title"
  ).innerHTML = `<span class="text-primary font-weight-bold">${sales[0].brand_name}</span> 현황이에요`;
  const dataLine1 = document.getElementById("korea-brands-data-first-line");
  const dataLine2 = document.getElementById("korea-brands-data-second-line");
  const dataLine3 = document.getElementById("korea-brands-data-third-line");

  const couponFee =
    sales[0].brand_type == "consignment"
      ? Number(sales[0].order_coupon)
      : Number(sales[0].order_coupon) + Number(sales[0].product_coupon);
  const expense = Number(sales[0].cost) + Number(sales[0].mileage) + couponFee + Number(sales[0].pg_expense);

  const directMarketingFee = directMarketing[0] == null ? 0 : Number(directMarketing[0].direct_marketing_fee);
  const indirectMarketingFee = indirectMarketing[0] == null ? 0 : Number(indirectMarketing[0].indirect_marketing_fee);
  const logisticFee = logistic[0] == null ? 0 : Number(logistic[0].logistic_fee);

  const calculateMargin =
    sales[0].brand_type == "consignment"
      ? sales[0].commission - expense - directMarketingFee - indirectMarketingFee
      : sales[0].sales_price - expense - directMarketingFee - indirectMarketingFee - logisticFee;

  const marginRate = Math.round((calculateMargin / sales[0].sales_price) * 100);

  let huddleMarginRate = "";
  if (sales[0].brand_squad == "위탁SQ") {
    huddleMarginRate = marginRate < 4 ? "text-danger" : "text-success";
  } else if (sales[0].brand_squad == "전략카테고리SQ") {
    huddleMarginRate = marginRate < 5 ? "text-danger" : "text-success";
  } else if (sales[0].brand_squad == "매입SQ") {
    huddleMarginRate = marginRate < 11 ? "text-danger" : "text-success";
  } else {
    huddleMarginRate = marginRate < 21 ? "text-danger" : "text-success";
  }

  let data1Html = `
    <tr ${calculateMargin >= 0 ? "" : 'class="table-danger"'}>
      <td class="align-middle text-center">
        <span class="text-sm font-weight-bold">
          <a href="/korea/partner/${sales[0].supplier_id}"> ${sales[0].supplier_name} </a>
        </span>
      </td>
      <td class="align-middle text-center">
        <span class="text-sm font-weight-bold"> ${Number(sales[0].order_count).toLocaleString("ko-kr")} </span>
      </td>
      <td class="align-middle text-center">
        <span class="text-sm font-weight-bold"> ${Number(sales[0].quantity).toLocaleString("ko-kr")} </span>
      </td>
      <td class="align-middle text-center">
        <span class="text-sm font-weight-bold"> ${util.chunwon(Number(sales[0].sales_price))} </span>
      </td>
    </tr>`;
  dataLine1.innerHTML = data1Html;

  let data2Html = `
    <tr ${calculateMargin >= 0 ? "" : 'class="table-danger"'}>
      <td class="align-middle text-center">
        <span class="text-sm font-weight-bold"> ${
          sales[0].brand_type != "consignment" ? "-" : util.chunwon(Number(sales[0].commission))
        } </span>
      </td>
      <td class="align-middle text-center">
        <span class="text-sm font-weight-bold"> ${
          sales[0].brand_type == "consignment" ? "-" : util.chunwon(Number(sales[0].cost))
        } </span>
      </td>
      <td class="align-middle text-center">
        <span class="text-sm font-weight-bold"> ${util.chunwon(couponFee)} </span>
      </td>
      <td class="align-middle text-center">
        <span class="text-sm font-weight-bold"> ${util.chunwon(
          Number(sales[0].mileage) + Number(sales[0].pg_expense)
        )} </span></td>
    </tr>`;
  dataLine2.innerHTML = data2Html;

  let data3Html = `
    <tr ${calculateMargin >= 0 ? "" : 'class="table-danger"'}>
      <td class="align-middle text-center">
        <span class="text-sm font-weight-bold"> ${util.chunwon(directMarketingFee)} </span>
      </td>
      <td class="align-middle text-center">
        <span class="text-sm font-weight-bold"> ${util.chunwon(indirectMarketingFee)} </span>
      </td>
      <td class="align-middle text-center">
      <span class="text-sm font-weight-bold"> ${
        sales[0].brand_type == "consignment" ? "-" : util.chunwon(logisticFee)
      } </span>
      </td>
      <td class="align-middle text-center">
        <span class="${huddleMarginRate} text-sm font-weight-bold"> 
        ${util.chunwon(calculateMargin)} (${marginRate}%)
        </span>
      </td>
    </tr>`;
  dataLine3.innerHTML = data3Html;
}

async function bestProducts(brandId, startDay, endDay) {
  const productsData = await util.fetchData(`${util.host}/korea/product?startDay=${startDay}&endDay=${endDay}`, "GET");
  const products = productsData.filter((r) => r.brand_id == brandId);
  const itemData = document.getElementById("brand-items-data");

  products.length = 6;
  let itemHtml = "";
  for (let product of products) {
    let html = `
    <div class="col-md-4 col-xl-2 col-6">
      <div class="card card-blog card-plain">
        <div class="position-relative">
          <a class="d-block shadow-xl border-radius-xl">
            <img src="${product.image}" alt="img-blur-shadow" class="img-fluid shadow border-radius-xl">
          </a>
        </div>
        <div class="card-body px-1 pb-0">
          <h5 class="text-sm">${product.product_name}</h5>
          <p class="text-sm">수량 ${Number(product.quantity).toLocaleString("ko-kr")}개
            <br>실판가 ${util.chunwon(product.sales_price)}천원</p>
        </div>
      </div>
    </div>`;
    itemHtml = itemHtml + html;
  }
  itemData.innerHTML = itemHtml;
}

async function weeklySalesChartData(brandId) {
  const thisStartDay = DateTime.now().minus({ days: 14 }).toFormat("yyyy-LL-dd");
  const thisEndDay = DateTime.now().minus({ days: 1 }).toFormat("yyyy-LL-dd");
  const beforeStartDay = DateTime.now().minus({ years: 1 }).minus({ days: 14 }).toFormat("yyyy-LL-dd");
  const beforeEndDay = DateTime.now().minus({ years: 1 }).minus({ days: 1 }).toFormat("yyyy-LL-dd");
  const thisYearData = await util.fetchData(
    `${util.host}/korea/brand/${brandId}?sumType=day&startDay=${thisStartDay}&endDay=${thisEndDay}`,
    "GET"
  );
  const beforeYearData = await util.fetchData(
    `${util.host}/korea/brand/${brandId}?sumType=day&startDay=${beforeStartDay}&endDay=${beforeEndDay}`,
    "GET"
  );

  const labelData = thisYearData.map((r) => DateTime.fromISO(r.payment_date).toFormat("L/d"));
  const thisYearSales = thisYearData.map((r) => Math.round(r.sales_price / 1000));
  const beforeYearSales = beforeYearData.map((r) => Math.round(r.sales_price / 1000));

  const sumThisYearSales = thisYearSales.reduce((acc, cur) => acc + cur, 0);
  const sumBeforeYearSales = beforeYearSales.reduce((acc, cur) => acc + cur, 0);
  const ratio = Math.round((sumThisYearSales / sumBeforeYearSales) * 100);

  const koreaSalesChartSummary = document.getElementById("brand-sales-chart-summary");
  koreaSalesChartSummary.innerHTML = `<i class="fa ${
    ratio >= 100 ? "fa-arrow-up text-success" : "fa-arrow-down text-danger"
  }"></i> 
  <span class="font-weight-bold">전년대비 ${ratio}%</span>`;

  const ctx = document.getElementById("weekly-sales-chart").getContext("2d");
  if (salesChartWeekly) {
    salesChartWeekly.destroy();
  }
  salesChartWeekly = new TwoLineChart(ctx, labelData, thisYearSales, beforeYearSales);
}

async function monthlyChart(brandId) {
  const thisYearStartDay = DateTime.now().toFormat("yyyy-01-01");
  const beforeYearStartDay = DateTime.now().minus({ years: 1 }).toFormat("yyyy-01-01");
  const thisYearEndDay = DateTime.now().minus({ days: 1 }).toFormat("yyyy-LL-dd");
  const beforeYearEndDay = DateTime.now().minus({ years: 1 }).minus({ days: 1 }).toFormat("yyyy-LL-dd");

  const thisYearData = await util.fetchData(
    `${util.host}/korea/brand/month?startDay=${thisYearStartDay}&endDay=${thisYearEndDay}&brandId=${brandId}`,
    "GET"
  );
  const beforeYearData = await util.fetchData(
    `${util.host}/korea/brand/month?startDay=${beforeYearStartDay}&endDay=${beforeYearEndDay}&brandId=${brandId}`,
    "GET"
  );

  const labels = thisYearData.map((r) => r.brand_payment_month + "월");
  const thisYearSales = thisYearData.map((r) => util.bmwon(r.brand_sales));
  const beforeYearSales = beforeYearData.map((r) => util.bmwon(r.brand_sales));
  const thisYearMargin = thisYearData.map((r) => util.bmwon(r.brand_contribution_margin));
  const beforeYearMargin = beforeYearData.map((r) => util.bmwon(r.brand_contribution_margin));

  const salesCtx = document.getElementById("monthly-sales-chart").getContext("2d");
  if (salesChartMonthly) salesChartMonthly.destroy();
  salesChartMonthly = new TwoBlueBarChart(salesCtx, labels, beforeYearSales, thisYearSales, true, "실판매가");

  const marginCtx = document.getElementById("monthly-margin-chart").getContext("2d");
  if (marginChartMonthly) marginChartMonthly.destroy();
  marginChartMonthly = new TwoBrownBarChart(marginCtx, labels, thisYearMargin, beforeYearMargin, true, "공헌이익");
}

async function monthlyCumulatedChart(brandId) {
  const thisYearStartDay = DateTime.now().toFormat("yyyy-01-01");
  const beforeYearStartDay = DateTime.now().minus({ years: 1 }).toFormat("yyyy-01-01");
  const thisYearEndDay = DateTime.now().minus({ days: 1 }).toFormat("yyyy-LL-dd");
  const beforeYearEndDay = DateTime.now().minus({ years: 1 }).minus({ days: 1 }).toFormat("yyyy-LL-dd");

  const thisYear = await getCumulatedData(thisYearStartDay, thisYearEndDay, brandId);
  const beforeYear = await getCumulatedData(beforeYearStartDay, beforeYearEndDay, brandId);

  const salesCtx = document.getElementById("monthly-sales-chart").getContext("2d");
  if (salesChartMonthly) salesChartMonthly.destroy();
  salesChartMonthly = new TwoBlueBarChart(
    salesCtx,
    thisYear.labels,
    beforeYear.sales,
    thisYear.sales,
    true,
    "실판매가"
  );

  const marginCtx = document.getElementById("monthly-margin-chart").getContext("2d");
  if (marginChartMonthly) marginChartMonthly.destroy();
  marginChartMonthly = new TwoBrownBarChart(
    marginCtx,
    thisYear.labels,
    beforeYear.margins,
    thisYear.margins,
    true,
    "공헌이익"
  );
}

async function getCumulatedData(startDay, endDay, brandId) {
  const data = await util.fetchData(
    `${util.host}/korea/brand/month?startDay=${startDay}&endDay=${endDay}&brandId=${brandId}`,
    "GET"
  );

  const labels = data.map((r) => r.brand_payment_month + "월");
  const sales = [];
  data
    .map((r) => r.brand_sales)
    .reduce((cur, acc) => {
      sales.push(Math.round((cur + acc) / 1000000));
      return cur + acc;
    }, 0);

  const margins = [];
  data
    .map((r) => r.brand_contribution_margin)
    .reduce((cur, acc) => {
      margins.push(Math.round((cur + acc) / 1000000));
      return cur + acc;
    }, 0);

  return {
    labels,
    sales,
    margins,
  };
}
