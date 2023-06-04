import util from "../utility.js";
const DateTime = luxon.DateTime;

let daySalesChart;
let weekSalesChart;

const today = DateTime.now().toFormat("yyyy-LL-dd");
const yesterday = DateTime.now().minus({ days: 1 }).toFormat("yyyy-LL-dd");

(function startFunction() {
  dailySalesChart();
  weeklySalesChart();
  poorItems();
  categorySales();
  productSales();
  userSaleType();
})();

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
  const ratio = Math.round(sumThisYearSales / sumBeforeYearSales);

  const labelData = beforeYear.map((r) => DateTime.fromISO(r.payment_date).toFormat("LL/dd"));
  const thisYearSales = thisYear.map((r) => Math.round(Number(r.sales) / 1000));
  const beforeYearSales = beforeYear.map((r) => Math.round(Number(r.sales) / 1000));

  const weeklySalesChartSummary = document.getElementById("daily-sales-chart-summary");
  weeklySalesChartSummary.innerHTML = `<i class="fa ${
    ratio > 1 ? "fa-arrow-up text-success" : "fa-arrow-down text-danger"
  }"></i> 
  <span class="font-weight-bold">전년대비 ${ratio * 100}%</span>`;

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
  const ratio = Math.round(sumThisYearSales / sumBeforeYearSales);

  const labelData = thisYear.map((r) => r.year_week.substring(2) + "주");
  const thisYearSales = thisYear.map((r) => Math.round(Number(r.sales) / 1000));
  const beforeYearSales = beforeYear.map((r) => Math.round(Number(r.sales) / 1000));

  const weeklySalesChartSummary = document.getElementById("weekly-sales-chart-summary");
  weeklySalesChartSummary.innerHTML = `<i class="fa ${
    ratio > 1 ? "fa-arrow-up text-success" : "fa-arrow-down text-danger"
  }"></i> 
  <span class="font-weight-bold">전년대비 ${ratio * 100}%</span>`;

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
  const salesData = await util.fetchData(`${util.host}/korea/brand?startDay=${yesterday}&endDay=${yesterday}`, "GET");
  const marketingData = await util.fetchData(
    `${util.host}/korea/brand/marketing?startDay=${yesterday}&endDay=${yesterday}`,
    "GET"
  );
  const logisticData = await util.fetchData(
    `${util.host}/korea/logistic/brand?startDay=${yesterday}&endDay=${yesterday}`,
    "GET"
  );
  salesData.length = 8;
  let brandHtml = "";
  for (let el of salesData) {
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
    const marginRate = Math.round((calculateMargin / el.sales_price) * 100);

    let huddleMarginRate = "";
    if (el.brand_squad == "위탁SQ") {
      huddleMarginRate = marginRate < 5 ? "text-danger" : "text-success";
    } else if (el.brand_squad == "전략카테고리SQ") {
      huddleMarginRate = marginRate < 6 ? "text-danger" : "text-success";
    } else if (el.brand_squad == "매입SQ") {
      huddleMarginRate = marginRate < 12 ? "text-danger" : "text-success";
    } else {
      huddleMarginRate = marginRate < 22 ? "text-danger" : "text-success";
    }
    let html = `
      <tr>
        <td>
          <div class="d-flex px-2 py-1">
            <div class="d-flex flex-column justify-content-center">
              <h6 class="mb-0 text-sm">
                <a href="/brand/${el.brand_id}">${el.brand_name}<a>
              </h6>
            </div>
          </div>
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
  document.getElementById("korea-brands-data").innerHTML = brandHtml;
}

async function categorySales() {
  const salesData = await util.fetchData(`${util.host}/korea/brand?startDay=${yesterday}&endDay=${yesterday}`, "GET");
  const marketingData = await util.fetchData(
    `${util.host}/korea/brand/marketing?startDay=${yesterday}&endDay=${yesterday}`,
    "GET"
  );
  const logisticData = await util.fetchData(
    `${util.host}/korea/logistic/brand?startDay=${yesterday}&endDay=${yesterday}`,
    "GET"
  );
  salesData.length = 8;
  let brandHtml = "";
  for (let el of salesData) {
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
    const marginRate = Math.round((calculateMargin / el.sales_price) * 100);

    let huddleMarginRate = "";
    if (el.brand_squad == "위탁SQ") {
      huddleMarginRate = marginRate < 5 ? "text-danger" : "text-success";
    } else if (el.brand_squad == "전략카테고리SQ") {
      huddleMarginRate = marginRate < 6 ? "text-danger" : "text-success";
    } else if (el.brand_squad == "매입SQ") {
      huddleMarginRate = marginRate < 12 ? "text-danger" : "text-success";
    } else {
      huddleMarginRate = marginRate < 22 ? "text-danger" : "text-success";
    }
    let html = `
      <tr>
        <td>
          <div class="d-flex px-2 py-1">
            <div class="d-flex flex-column justify-content-center">
              <h6 class="mb-0 text-sm">
                <a href="/brand/${el.brand_id}">${el.brand_name}<a>
              </h6>
            </div>
          </div>
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
  document.getElementById("korea-brands-data").innerHTML = brandHtml;
}

async function productSales() {
  const URL = `${util.host}/mmz-essential/product/${brandId}/${dateText}`;
  const data = await util.fetchData(URL, "GET");
  data.length = 6;
  let kidsProductHtml = "";
  let babyProductHtml = "";
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
          <h5 class="text-sm">${item.product_name}</h5>
          <p class="mb-4 text-sm">판매수량 ${item.quantity}개<br>실판매가 ${util.chunwon(item.sales_price)}천원</p>
        </div>
      </div>
    </div>`;
    kidsProductHtml = kidsProductHtml + html;
  }
  document.getElementById("kids-products-data").innerHTML = "<h6>Kids</h6>" + kidsProductHtml;
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
          <h5 class="text-sm">${item.product_name}</h5>
          <p class="mb-4 text-sm">판매수량 ${item.quantity}개<br>실판매가 ${util.chunwon(item.sales_price)}천원</p>
        </div>
      </div>
    </div>`;
    babyProductHtml = babyProductHtml + html;
  }
  document.getElementById("baby-products-data").innerHTML = "<h6>Baby</h6>" + babyProductHtml;
}

async function userSaleType() {
  const URL = `${util.host}/korea/user-sale-type`;
  const data = await util.fetchData(URL, "GET");

  const firstSale = data[0].filter((r) => r.is_first == "y");
  document.getElementById("first-order-count").innerText = `${Number(firstSale[0].user_count).toLocaleString(
    "ko-KR"
  )} 명`;
  document.getElementById("first-order-sales").innerText = `${util.bmwon(Number(firstSale[0].sales_price))} 백만원`;
  document.getElementById("first-average-sales").innerText = `${Math.round(
    Number(firstSale[0].sales_price) / Number(firstSale[0].user_count)
  ).toLocaleString("ko-kr")} 원`;
  document.getElementById("first-average-quantity").innerText = `${(
    Number(firstSale[0].quantity) / Number(firstSale[0].user_count)
  ).toFixed(2)} pcs`;

  const secondSale = data[0].filter((r) => r.is_first == "n");
  document.getElementById("second-order-count").innerText = `${Number(secondSale[0].user_count).toLocaleString(
    "ko-KR"
  )} 명`;
  document.getElementById("second-order-sales").innerText = `${util.bmwon(Number(secondSale[0].sales_price))} 백만원`;
  document.getElementById("second-average-sales").innerText = `${Math.round(
    Number(secondSale[0].sales_price) / Number(secondSale[0].user_count)
  ).toLocaleString("ko-kr")} 원`;
  document.getElementById("second-average-quantity").innerText = `${(
    Number(secondSale[0].quantity) / Number(secondSale[0].user_count)
  ).toFixed(2)} pcs`;

  const firstSaleBrand = data[1].filter((r) => r.is_first == "y");
  const sortFirstSaleBrand = firstSaleBrand.sort((a, b) => b.sales_price - a.sales_price);
  sortFirstSaleBrand.length = 5;
  let firstSaleBrandHtml = "";
  for (let i = 0; i < sortFirstSaleBrand.length; i++) {
    const countUser = Number(sortFirstSaleBrand[i].user_count).toLocaleString("ko-KR");
    const quantity = Number(sortFirstSaleBrand[i].quantity).toLocaleString("ko-KR");
    const salePrice = util.chunwon(Number(sortFirstSaleBrand[i].sales_price));
    let html = `
      <tr>
        <td class="align-middle text-center">
          <h6 class="mb-0 text-xs">${sortFirstSaleBrand[i].brand_name}</h6>
        </td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${countUser} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${quantity} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${salePrice} </span></td>
      </tr>`;
    firstSaleBrandHtml = firstSaleBrandHtml + html;
  }
  document.getElementById("korea-user-first-sale").innerHTML = firstSaleBrandHtml;

  const secondSaleBrand = data[1].filter((r) => r.is_first == "n");
  const sortSecondSaleBrand = secondSaleBrand.sort((a, b) => b.sales_price - a.sales_price);
  sortSecondSaleBrand.length = 5;
  let secondSaleBrandHtml = "";
  for (let i = 0; i < sortSecondSaleBrand.length; i++) {
    const countUser = Number(sortSecondSaleBrand[i].user_count).toLocaleString("ko-KR");
    const quantity = Number(sortSecondSaleBrand[i].quantity).toLocaleString("ko-KR");
    const salePrice = Math.round(Number(sortSecondSaleBrand[i].sales_price) / 1000).toLocaleString("ko-KR");
    let html = `
      <tr>
        <td class="align-middle text-center">
          <h6 class="mb-0 text-xs">${sortSecondSaleBrand[i].brand_name}</h6>
        </td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${countUser} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${quantity} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${salePrice} </span></td>
      </tr>`;
    secondSaleBrandHtml = secondSaleBrandHtml + html;
  }
  document.getElementById("korea-user-second-sale").innerHTML = secondSaleBrandHtml;
}
