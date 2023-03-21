import util from "./utility.js";
const DateTime = luxon.DateTime;

let koreaSalesChart;
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
  marketing();
  sales();
  salesChartData();
  brandSales();
  productSales("moomooz", "yesterday");
  partnerSales("yesterday");
  users();
  userSaleType();
  weatherChartData();
  sqaudData();
})();

async function sales() {
  const URL = `${util.host}/korea/sales`;
  const data = await util.fetchData(URL, "GET");

  document.getElementById("korea-order-count").innerHTML = `${Number(data[0][0].order_count).toLocaleString(
    "ko-KR"
  )} 건`;
  document.getElementById("korea-sales").innerHTML = `${util.chunwon(data[0][0].sales_price)} 천원`;
  document.getElementById("korea-monthly-sales").innerHTML = `${util.bmwon(data[1].sales_price)} 백만원`;
}

async function brandSales() {
  const startDay = DateTime.now().minus({ days: 1 }).toFormat("yyyy-LL-dd");
  const endDay = DateTime.now().toFormat("yyyy-LL-dd");
  const URL = `${util.host}/korea/brand-sales?startDay=${startDay}&endDay=${endDay}`;
  const data = await util.fetchData(URL, "GET");

  const totalSales = data[1].map((r) => Number(r.sales_price)).reduce((acc, cur) => acc + cur, 0);
  const totalMarketingFee = data[0].map((r) => Number(r.direct_marketing_fee)).reduce((acc, cur) => acc + cur, 0);
  const blendedRoas = Math.round((totalSales / totalMarketingFee) * 100);

  document.getElementById("yesterday-roas").innerHTML = `
    <h6 class="text-center mb-0">Blended ROAS (어제)</h6>
    <span class="text-xs">(실판가매출) ${util.bmwon(totalSales)}백만 <br> (총광고비) ${util.bmwon(
    totalMarketingFee
  )}백만</span>
    <hr class="horizontal dark my-3">
    <h5 class="mb-0">${blendedRoas}%</h5>`;

  data[1].length = 5;
  const brandsData = document.getElementById("korea-brands-data");

  let brandHtml = "";
  for (let el of data[1]) {
    const couponFee =
      el.brand_type == "consignment" ? Number(el.product_coupon) : Number(el.order_coupon) + Number(el.product_coupon);
    const expense = Number(el.cost) + Number(el.mileage) + couponFee + Number(el.pg_expense);

    const marketing_d = data[0].filter((r) => r.brand_id == el.brand_id);
    const marketingFee_d =
      marketing_d[0] == undefined || marketing_d[0] == null ? 0 : Number(marketing_d[0].direct_marketing_fee);
    const marketing_i = data[3].filter((r) => r.brand_id == el.brand_id);
    const marketingFee_i =
      marketing_i[0] == undefined || marketing_i[0] == null ? 0 : Number(marketing_i[0].indirect_marketing_fee);
    const marketing_live = data[4].filter((r) => r.brand_id == el.brand_id);
    const marketingFee_live =
      marketing_live[0] == undefined || marketing_live[0] == null ? 0 : Number(marketing_live[0].live_fee);

    const logistic = data[2].filter((r) => r.brand_id == el.brand_id);
    const logisticFee = logistic[0] == undefined || logistic[0] == null ? 0 : Number(logistic[0].logistic_fee);

    const calculateMargin =
      el.brand_type == "consignment"
        ? el.commission - expense - marketingFee_d - marketingFee_i - marketingFee_live
        : el.sales_price - expense - marketingFee_d - marketingFee_i - marketingFee_live - logisticFee;
    let html = `
      <tr>
        <td>
          <div class="d-flex px-2 py-1">
            <div class="d-flex flex-column justify-content-center">
              <h6 class="mb-0 text-sm">
                <a href="/korea/brand/${el.brand_id}">${el.brand_name}<a>
              </h6>
            </div>
          </div>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${el.order_count} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${el.quantity} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${util.chunwon(el.sales_price)} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${util.chunwon(expense + logisticFee)} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${util.chunwon(
            marketingFee_d + marketingFee_i + marketingFee_live
          )} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="${
            calculateMargin >= 0 ? "text-success" : "text-danger"
          } text-xs font-weight-bold"> ${util.chunwon(calculateMargin)} </span>
       </td>
      </tr>`;
    brandHtml = brandHtml + html;
  }
  brandsData.innerHTML = brandHtml;
}

async function productSales(brandId, dateText) {
  const URL = `${util.host}/korea/product-sales/${brandId}/${dateText}`;
  const data = await util.fetchData(URL, "GET");
  data.length = 7;

  const productsData = document.getElementById("korea-products-data");

  let productHtml = "";
  for (let i = 0; i < data.length; i++) {
    const salePrice = Math.round(data[i].sales_price / 1000).toLocaleString("ko-KR");
    const expense =
      Number(data[i].cost) +
      Number(data[i].mileage) +
      Number(data[i].order_coupon) +
      Number(data[i].product_coupon) +
      Number(data[i].pg_expense);
    const calculateMargin =
      data[i].brand_type == "consignment" ? data[i].commission - expense : data[i].sales_price - expense;
    const margin = Math.round(calculateMargin / 1000).toLocaleString("ko-KR");

    let html = `
      <tr>
        <td class="col-4">
          <div class="d-flex px-2 py-1">
            <div><img src="${data[i].image}" class="avatar avatar-sm me-3" alt="xd"></div>
            <div class="d-flex flex-column justify-content-center text-truncate">
              <h6 class="mb-0 text-sm">${data[i].product_name}</h6>
            </div>
          </div>
        </td>
        <td class="align-middle text-center text-sm col-2">
          <span class="text-xs font-weight-bold"> ${data[i].brand_name} </span>
        </td>
        <td class="align-middle text-center text-sm col-2">
          <span class="text-xs font-weight-bold"> ${Number(data[i].quantity).toLocaleString("ko-KR")} </span>
        </td>
        <td class="align-middle text-center text-sm col-2">
          <span class="text-xs font-weight-bold"> ${salePrice} </span>
        </td>
        <td class="align-middle text-center text-sm col-2">
          <span class="text-xs font-weight-bold"> ${Math.round(expense / 1000).toLocaleString("ko-KR")} </span>
        </td>
        <td class="align-middle text-center text-sm col-2">
          <span class="${
            calculateMargin >= 0 ? "text-success" : "text-danger"
          } text-xs font-weight-bold"> ${margin} </span>
        </td>
      </tr>`;
    productHtml = productHtml + html;
  }
  productsData.innerHTML = productHtml;
}

async function partnerSales(dateText) {
  const URL = `${util.host}/korea/partner-sales/${dateText}`;
  const data = await util.fetchData(URL, "GET");
  data[1].length = 8;

  const partnersData = document.getElementById("korea-partners-data");

  let partnerHtml = "";
  for (let i = 0; i < data[1].length; i++) {
    const expense =
      Number(data[1][i].cost) +
      Number(data[1][i].mileage) +
      Number(data[1][i].order_coupon) +
      Number(data[1][i].product_coupon) +
      Number(data[1][i].pg_expense);
    const marketing = data[0].filter((r) => r.supplier_id == data[1][i].supplier_id);
    const marketingFee = marketing[0] == undefined || marketing[0] == null ? 0 : Number(marketing[0].cost);
    const calculateMargin =
      data[1][i].supplier_id == "1"
        ? data[1][i].sales_price - expense - marketingFee
        : data[1][i].commission - expense - marketingFee;
    const margin = Math.round(calculateMargin / 1000).toLocaleString("ko-KR");
    let html = `
      <tr>
        <td>
          <div class="d-flex px-2 py-1">
            <div class="d-flex flex-column justify-content-center">
              <h6 class="mb-0 text-sm">
                <a href="/korea/partner/${data[1][i].supplier_id}">${data[1][i].supplier_name}<a>
              </h6>
            </div>
          </div>
        </td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${data[1][
          i
        ].order_count.toLocaleString("ko-KR")} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${data[1][
          i
        ].quantity.toLocaleString("ko-KR")} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${Math.round(
          data[1][i].sales_price / 1000
        ).toLocaleString("ko-KR")} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${Math.round(
          expense / 1000
        ).toLocaleString("ko-KR")} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${Math.round(
          marketingFee / 1000
        ).toLocaleString("ko-KR")} </span></td>
        <td class="align-middle text-center text-sm"><span class="${
          calculateMargin >= 0 ? "text-success" : "text-danger"
        } text-xs font-weight-bold"> ${margin} </span></td>
      </tr>`;
    partnerHtml = partnerHtml + html;
  }
  partnersData.innerHTML = partnerHtml;
}

async function marketing() {
  const URL = `${util.host}/korea/marketing`;
  const data = await util.fetchData(URL, "GET");

  for (let i = 0; i < data[0].length; i++) {
    const channel = data[0][i].channel;
    if (channel == "meta") {
      document.getElementById("korea-marketing-meta").innerText = `${util.chunwon(data[0][i].cost)} 천원`;
    } else if (channel == "naver") {
      document.getElementById("korea-marketing-naver").innerText = `${util.chunwon(data[0][i].cost)} 천원`;
    } else if (channel == "kakao") {
      document.getElementById("korea-marketing-kakao").innerText = `${util.chunwon(data[0][i].cost)} 천원`;
    } else if (channel == "google") {
      document.getElementById("korea-marketing-google").innerText = `${util.chunwon(data[0][i].cost)} 천원`;
    }
  }

  const blendedRoas = Math.round((data[3].sales_price / data[2].cost) * 100);
  document.getElementById("this-yearly-roas").innerHTML = `
    <h6 class="text-center mb-0">Blended ROAS (금년)</h6>
    <span class="text-xs">(실판가매출) ${util.bmwon(data[3].sales_price)}백만 <br> (총광고비) ${util.bmwon(
    data[2].cost
  )}백만 </span>
    <hr class="horizontal dark my-3">
    <h5 class="mb-0">${blendedRoas}%</h5>`;

  const totalMarketingFee = data[1].map((r) => Number(r.cost)).reduce((acc, cur) => acc + cur, 0);
  const directMaketingFee = data[1]
    .filter((r) => r.brand_id != null)
    .map((r) => Number(r.cost))
    .reduce((acc, cur) => acc + cur, 0);
  const indirectMaketingFee = totalMarketingFee - directMaketingFee;

  const ratio = Math.round((directMaketingFee / totalMarketingFee) * 100);
  const directMaketingRatio = ratio % 5 == 0 ? ratio : ratio + (5 - (ratio % 5));
  const indirectMaketingRatio = 100 - directMaketingRatio;
  const ratioHtml = `
    <div class="col-6 ps-0">
      <div class="d-flex mb-2">
        <div class="icon icon-shape icon-xxs shadow border-radius-sm bg-gradient-dark text-center me-2 d-flex align-items-center justify-content-center">
          <svg width="10px" height="10px" viewBox="0 0 43 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          </svg>
        </div>
        <p class="text-xs mb-0 font-weight-bold">브랜드 광고비</p>
      </div>
      <h4 class="font-weight-bolder">${util.chunwon(directMaketingFee)} 천원</h4>
      <div class="progress w-75">
        <div class="progress-bar bg-dark w-${directMaketingRatio}" role="progressbar" aria-valuenow="${directMaketingRatio}" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
    <div class="col-6 ps-0">
      <div class="d-flex mb-2">
        <div class="icon icon-shape icon-xxs shadow border-radius-sm bg-gradient-primary text-center me-2 d-flex align-items-center justify-content-center">
          <svg width="10px" height="10px" viewBox="0 0 43 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          </svg>
        </div>
        <p class="text-xs mb-0 font-weight-bold">무무즈 광고비</p>
      </div>
      <h4 class="font-weight-bolder">${util.chunwon(indirectMaketingFee)} 천원</h4>
      <div class="progress w-75">
        <div class="progress-bar bg-dark w-${indirectMaketingRatio}" role="progressbar" aria-valuenow="${indirectMaketingRatio}" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>`;

  document.getElementById("korea-marketing-ratio").innerHTML = ratioHtml;
}

async function users() {
  const URL = `${util.host}/korea/users`;
  const data = await util.fetchData(URL, "GET");

  const koreaNewUsers = document.getElementById("korea-new-user");
  const koreaMonthlyNewUsers = document.getElementById("korea-monthly-user");
  const koreaTotalUsers = document.getElementById("korea-total-user");

  koreaNewUsers.innerHTML = `${Number(data[0].target_date_users).toLocaleString("ko-KR")} 명`;
  koreaMonthlyNewUsers.innerHTML = `${Number(data[1].monthly_users).toLocaleString("ko-KR")} 명`;
  koreaTotalUsers.innerHTML = `${Number(data[2].total_users).toLocaleString("ko-KR")} 명`;
}

async function userSaleType() {
  const URL = `${util.host}/korea/user-sale-type`;
  const data = await util.fetchData(URL, "GET");

  const firstSale = data[0].filter((r) => r.is_first == "y");
  document.getElementById("korea-first-sale").innerText = `${Number(firstSale[0].user_count).toLocaleString(
    "ko-KR"
  )}명 / ${Math.round(Number(firstSale[0].sales_price) / 1000000).toLocaleString("ko-KR")}백만원`;

  const secondSale = data[0].filter((r) => r.is_first == "n");
  document.getElementById("korea-second-sale").innerText = `${Number(secondSale[0].user_count).toLocaleString(
    "ko-KR"
  )}명 / ${Math.round(Number(secondSale[0].sales_price) / 1000000).toLocaleString("ko-KR")}백만원`;

  const firstSaleBrand = data[1].filter((r) => r.is_first == "y");
  const sortFirstSaleBrand = firstSaleBrand.sort((a, b) => b.sales_price - a.sales_price);
  sortFirstSaleBrand.length = 6;
  let firstSaleBrandHtml = "";
  for (let i = 0; i < sortFirstSaleBrand.length; i++) {
    const countUser = Number(sortFirstSaleBrand[i].user_count).toLocaleString("ko-KR");
    const salePrice = Math.round(Number(sortFirstSaleBrand[i].sales_price) / 1000).toLocaleString("ko-KR");
    let html = `
      <tr>
        <td>
          <div class="d-flex px-2 py-1">
            <div class="d-flex flex-column justify-content-center">
              <h6 class="mb-0 text-sm">${sortFirstSaleBrand[i].brand_name}</h6>
            </div>
          </div>
        </td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${countUser} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${salePrice} </span></td>
      </tr>`;
    firstSaleBrandHtml = firstSaleBrandHtml + html;
  }
  document.getElementById("korea-user-first-sale").innerHTML = firstSaleBrandHtml;

  const secondSaleBrand = data[1].filter((r) => r.is_first == "n");
  const sortSecondSaleBrand = secondSaleBrand.sort((a, b) => b.sales_price - a.sales_price);
  sortSecondSaleBrand.length = 6;
  let secondSaleBrandHtml = "";
  for (let i = 0; i < sortSecondSaleBrand.length; i++) {
    const countUser = Number(sortSecondSaleBrand[i].user_count).toLocaleString("ko-KR");
    const salePrice = Math.round(Number(sortSecondSaleBrand[i].sales_price) / 1000).toLocaleString("ko-KR");
    let html = `
      <tr>
        <td>
          <div class="d-flex px-2 py-1">
            <div class="d-flex flex-column justify-content-center">
              <h6 class="mb-0 text-sm">${sortSecondSaleBrand[i].brand_name}</h6>
            </div>
          </div>
        </td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${countUser} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${salePrice} </span></td>
      </tr>`;
    secondSaleBrandHtml = secondSaleBrandHtml + html;
  }
  document.getElementById("korea-user-second-sale").innerHTML = secondSaleBrandHtml;
}

async function salesChartData() {
  const URL = `${util.host}/korea/chart-sales`;
  const data = await util.fetchData(URL, "GET");

  const labelData = data[0].map((r) => DateTime.fromISO(r.payment_date).toFormat("LL/dd"));
  const thisYearSales = data[0].map((r) => Math.round(r.sales_price / 1000));
  const beforeYearSales = data[1].map((r) => Math.round(r.sales_price / 1000));

  const sumThisYearSales = thisYearSales.reduce((acc, cur) => acc + cur, 0);
  const sumBeforeYearSales = beforeYearSales.reduce((acc, cur) => acc + cur, 0);
  const ratio = (sumThisYearSales / sumBeforeYearSales).toFixed(2);

  const koreaSalesChartSummary = document.getElementById("korea-sales-chart-summary");
  koreaSalesChartSummary.innerHTML = `<i class="fa ${
    ratio > 1 ? "fa-arrow-up text-success" : "fa-arrow-down text-danger"
  }"></i> 
  <span class="font-weight-bold">전년대비 ${ratio * 100}%</span>`;

  salesChart(labelData, thisYearSales, beforeYearSales);
}

async function salesChart(labelData, thisYearSales, beforeYearSales) {
  var ctx2 = document.getElementById("korea-sales-chart").getContext("2d");

  var gradientStroke1 = ctx2.createLinearGradient(0, 230, 0, 50);
  gradientStroke1.addColorStop(1, "rgba(203,12,159,0.2)");
  gradientStroke1.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke1.addColorStop(0, "rgba(203,12,159,0)");

  var gradientStroke2 = ctx2.createLinearGradient(0, 230, 0, 50);
  gradientStroke2.addColorStop(1, "rgba(20,23,39,0.2)");
  gradientStroke2.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke2.addColorStop(0, "rgba(20,23,39,0)");

  if (koreaSalesChart) {
    koreaSalesChart.destroy();
  }

  koreaSalesChart = new Chart(ctx2, {
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

async function weatherChartData() {
  const URL = `${util.host}/weather/seoul`;
  const data = await util.fetchData(URL, "GET");

  const thisYearTemp = data[0].map((r) => [r.Weather_temperature_min, r.Weather_temperature_max]);
  const beforeYearTemp = data[1].map((r) => [r.Weather_temperature_min, r.Weather_temperature_max]);

  const labelData = data[0].map((r) => DateTime.fromISO(r.Weather_date).toFormat("LL/dd"));

  weatherChart(thisYearTemp, beforeYearTemp, labelData);
}

async function weatherChart(thisYearTemp, beforeYearTemp, labelData) {
  const ctx = document.getElementById("korea-weather-chart").getContext("2d");
  const colorCode = ["#696969", "#696969", "#696969", "#696969", "#696969", "#696969", "#696969"];

  if (koreaWeatherChart) {
    koreaWeatherChart.destroy();
  }

  koreaWeatherChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labelData,
      datasets: [
        {
          label: "Y" + DateTime.now().minus({ years: 1 }).toFormat("yyyy"),
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 4,
          borderSkipped: false,
          backgroundColor: "#696969",
          data: beforeYearTemp,
          maxBarThickness: 6,
        },
        {
          label: "Y" + DateTime.now().toFormat("yyyy"),
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 4,
          borderSkipped: false,
          backgroundColor: "#fff",
          data: thisYearTemp,
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
              style: "normal",
              lineHeight: 2,
            },
            color: "#fff",
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
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

async function sqaudData() {
  const URL = `${util.host}/korea/squad-sales`;
  const data = await util.fetchData(URL, "GET");

  const squadIdList = data[0].map((r) => r.budget_squad_id);

  let salesObj = {};
  let marginObj = {};
  for (let squad of squadIdList) {
    const budgetDataArray = data[0].filter((r) => r.budget_squad_id == squad);
    const budgetSales = Math.round(budgetDataArray[0].budget_sale_sales / 1000000);
    const budgetMargin = Math.round(budgetDataArray[0].budget_margin / 1000000);

    let actualSales = 0;
    let actualMargin = 0;
    const actualDataArray = data[1].filter((r) => r.squad_id == squad);
    const directMarketingArray = data[2].filter((r) => r.squad_id == squad);
    const indirectMarketingArray = data[3].filter((r) => r.squad_id == squad);
    const liveMarketingArray = data[4].filter((r) => r.squad_id == squad);
    const logisticArray = data[5].filter((r) => r.squad_id == squad);

    if (actualDataArray.length != 0) {
      actualSales = Math.round(Number(actualDataArray[0].sales_price) / 1000000);
      const cost = Number(actualDataArray[0].cost);
      const couponFee =
        squad == "consignment" || squad == "strategic"
          ? Number(actualDataArray[0].order_coupon)
          : Number(actualDataArray[0].order_coupon) + Number(actualDataArray[0].product_coupon);
      const expense = couponFee + Number(actualDataArray[0].mileage) + Number(actualDataArray[0].pg_expense);
      const marketingFee =
        Number(directMarketingArray[0].cost) +
        Number(indirectMarketingArray[0].indirect_marketing_fee) +
        Number(liveMarketingArray[0].live_fee);
      const logisticFee = squad == "consignment" || squad == "strategic" ? 0 : Number(logisticArray[0].logistic_fee);

      let margin = 0;
      if (squad == "consignment" || squad == "strategic") {
        margin = actualDataArray[0].commission - expense - marketingFee;
      } else {
        margin = actualDataArray[0].sales_price - cost - expense - marketingFee - logisticFee;
      }
      actualMargin = Math.round(margin / 1000000);
    }
    salesObj[squad] = [budgetSales, actualSales];
    marginObj[squad] = [budgetMargin, actualMargin];
  }
  squadChart(salesObj, marginObj);
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
