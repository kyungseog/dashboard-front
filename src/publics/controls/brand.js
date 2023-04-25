import util from "./utility.js";
const DateTime = luxon.DateTime;
let brandSalesChart;

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
  salesChartData(brandId);
})();

const submit = document.querySelector("#submit");
submit.addEventListener("click", () => {
  const startDay = startDayPicker.getDate("yyyy-mm-dd");
  const endDay = endDayPicker.getDate("yyyy-mm-dd");
  brandSales(brandId, startDay, endDay);
  bestProducts(brandId, startDay, endDay);
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
  document.getElementById("more-infomation").innerHTML = `
    <a class="text-body text-sm font-weight-bold mb-0 icon-move-right mt-auto" href="/korea/product/${brandId}">
      More Infomation
      <i class="fas fa-arrow-right text-sm ms-1" aria-hidden="true"></i>
    </a>`;
  const brandsData = document.getElementById("korea-brands-data");

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

  let brandHtml = `
    <tr ${calculateMargin >= 0 ? "" : 'class="table-danger"'}>
      <td class="align-middle text-center">
        <span class="text-xs font-weight-bold">
          <a href="/korea/partner/${sales[0].supplier_id}"> ${sales[0].supplier_name} </a>
        </span>
      </td>
      <td class="align-middle text-center">
        <span class="text-xs font-weight-bold"> ${Number(sales[0].order_count).toLocaleString("ko-kr")} </span>
      </td>
      <td class="align-middle text-center">
        <span class="text-xs font-weight-bold"> ${Number(sales[0].quantity).toLocaleString("ko-kr")} </span>
      </td>
      <td class="align-middle text-center">
        <span class="text-xs font-weight-bold"> ${util.chunwon(Number(sales[0].sales_price))} </span>
      </td>
      <td class="align-middle text-center">
        <span class="text-xs font-weight-bold"> ${
          sales[0].brand_type != "consignment" ? "-" : util.chunwon(Number(sales[0].commission))
        } </span>
      </td>
      <td class="align-middle text-center">
        <span class="text-xs font-weight-bold"> ${
          sales[0].brand_type == "consignment" ? "-" : util.chunwon(Number(sales[0].cost))
        } </span>
      </td>
      <td class="align-middle text-center">
        <span class="text-xs font-weight-bold"> ${util.chunwon(couponFee)} </span>
      </td>
      <td class="align-middle text-center">
        <span class="text-xs font-weight-bold"> ${util.chunwon(
          Number(sales[0].mileage) + Number(sales[0].pg_expense)
        )} </span></td>
      <td class="align-middle text-center">
        <span class="text-xs font-weight-bold"> ${util.chunwon(directMarketingFee)} </span>
      </td>
      <td class="align-middle text-center">
        <span class="text-xs font-weight-bold"> ${util.chunwon(indirectMarketingFee)} </span>
      </td>
      <td class="align-middle text-center">
      <span class="text-xs font-weight-bold"> ${
        sales[0].brand_type == "consignment" ? "-" : util.chunwon(logisticFee)
      } </span>
    </td>
      <td class="align-middle text-center">
        <span class="${huddleMarginRate} text-xs font-weight-bold"> 
        ${util.chunwon(calculateMargin)} (${marginRate}%)
        </span>
      </td>
    </tr>`;
  brandsData.innerHTML = brandHtml;
}

async function bestProducts(brandId, startDay, endDay) {
  const productsData = await util.fetchData(`${util.host}/korea/product?startDay=${startDay}&endDay=${endDay}`, "GET");
  const products = productsData.filter((r) => r.brand_id == brandId);
  const itemData = document.getElementById("brand-items-data");

  products.length = 6;
  let itemHtml = "";
  for (let product of products) {
    let html = `
    <div class="col-md-3 col-xl-2 col-6 mb-2">
      <div class="card card-blog card-plain">
        <div class="position-relative">
          <a class="d-block shadow-xl border-radius-xl">
            <img src="${product.image}" alt="img-blur-shadow" class="img-fluid shadow border-radius-xl">
          </a>
        </div>
        <div class="card-body px-1 pb-0 mt-4">
          <h5 class="text-sm">${product.product_name}</h5>
          <p class="mb-4 text-sm">판매수량 ${product.quantity}개<br>실판매가 ${util.chunwon(
      product.sales_price
    )}천원</p>
        </div>
      </div>
    </div>`;
    itemHtml = itemHtml + html;
  }
  itemData.innerHTML = itemHtml;
}

async function salesChartData(brandId) {
  const URL = `${util.host}/korea/brand-chart-sales/${brandId}`;
  const data = await util.fetchData(URL, "GET");

  const labelData = data[0].map((r) => DateTime.fromISO(r.payment_date).toFormat("LL/dd"));
  const thisYearSales = data[0].map((r) => Math.round(r.sales_price / 1000));
  const beforeYearSales = data[1].map((r) => Math.round(r.sales_price / 1000));

  const sumThisYearSales = thisYearSales.reduce((acc, cur) => acc + cur, 0);
  const sumBeforeYearSales = beforeYearSales.reduce((acc, cur) => acc + cur, 0);
  const ratio = Math.round((sumThisYearSales / sumBeforeYearSales) * 100);

  const koreaSalesChartSummary = document.getElementById("brand-sales-chart-summary");
  koreaSalesChartSummary.innerHTML = `<i class="fa ${
    ratio >= 100 ? "fa-arrow-up text-success" : "fa-arrow-down text-danger"
  }"></i> 
  <span class="font-weight-bold">전년대비 ${ratio}%</span>`;

  salesChart(labelData, thisYearSales, beforeYearSales);
}

async function salesChart(labelData, thisYearSales, beforeYearSales) {
  var ctx2 = document.getElementById("brand-sales-chart").getContext("2d");

  var gradientStroke1 = ctx2.createLinearGradient(0, 230, 0, 50);
  gradientStroke1.addColorStop(1, "rgba(203,12,159,0.2)");
  gradientStroke1.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke1.addColorStop(0, "rgba(203,12,159,0)");

  var gradientStroke2 = ctx2.createLinearGradient(0, 230, 0, 50);
  gradientStroke2.addColorStop(1, "rgba(20,23,39,0.2)");
  gradientStroke2.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke2.addColorStop(0, "rgba(20,23,39,0)");

  if (brandSalesChart) {
    brandSalesChart.destroy();
  }

  brandSalesChart = new Chart(ctx2, {
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
