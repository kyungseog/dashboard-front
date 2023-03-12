import util from "./utility.js";
const DateTime = luxon.DateTime;
let partnerSalesChart;

const dateList = document.querySelectorAll(".dropdown-menu .dropdown-item");
const URL = window.location.href;
const partnerId = URL.substring(URL.indexOf("/", URL.indexOf("partner")) + 1);
for (let list of dateList) {
  list.addEventListener("click", () => productSales(partnerId, list.innerText));
}

(function startFunction() {
  const URL = window.location.href;
  const partnerId = URL.substring(URL.indexOf("/", URL.indexOf("partner")) + 1);
  sales(partnerId);
  salesChartData(partnerId);
  yearlySales(partnerId);
  productSales(partnerId, "yesterday");
})();

async function sales(partnerId) {
  const URL = `${util.host}/partners/sales/${partnerId}`;
  const data = await util.fetchData(URL, "GET");

  const brandList = data[1].map((r) => r.brand_name).join(" | ");

  document.getElementById("partner-sales-region").innerText = "정보업데이트";
  document.getElementById("partner-name").innerText = data[0].integration_name;
  document.getElementById("brand-list").innerText = brandList;
  document.getElementById("partner-ceo").innerText = "정보업데이트";
  document.getElementById("partner-registraion-no").innerText = "000-00-00000";
  document.getElementById("partner-start-date").innerText = DateTime.fromISO(
    data[1][0].created_at
  ).toFormat("yyyy-LL");
  document.getElementById("partner-email").innerText = "partner@partner.com";

  const monthlySales = document.getElementById("this-monthly-sales");
  const monthlyRatio = Math.round(
    (data[3].sales_price / data[2].sales_price) * 100
  );

  monthlySales.innerHTML = `
    <h6 class="text-center mb-0">당월 실판가 매출</h6>
    <span class="text-xs">(전년동월) ${util.bmwon(
      data[2].sales_price
    )}백만</span>
    <hr class="horizontal dark my-3">
    <h5 class="mb-0">${util.bmwon(data[3].sales_price)}백만 
      <span class="font-weight-bold text-secondary text-xs">(<i class="fa ${
        monthlyRatio > 100
          ? "fa-arrow-up text-success"
          : "fa-arrow-down text-danger"
      } text-xs"></i>전년비 ${monthlyRatio}%)</span>
    </h5>`;
}

async function yearlySales(partnerId) {
  const URL = `${util.host}/partners/yearly-sales/${partnerId}`;
  const data = await util.fetchData(URL, "GET");

  const yearlySales = document.getElementById("this-yearly-sales");
  const yearlyRatio = Math.round(
    (data[1].sales_price / data[0].sales_price) * 100
  );

  yearlySales.innerHTML = `
    <h6 class="text-center mb-0">누적 실판가 매출</h6>
    <span class="text-xs">(전년동기) ${util.bmwon(
      data[0].sales_price
    )}백만</span>
    <hr class="horizontal dark my-3">
    <h5 class="mb-0">${util.bmwon(data[1].sales_price)}백만 
    <span class="font-weight-bold text-secondary text-xs">(<i class="fa ${
      yearlyRatio > 100
        ? "fa-arrow-up text-success"
        : "fa-arrow-down text-danger"
    } text-xs"></i>전년비 ${yearlyRatio}%)</span>
    </h5>`;
}

async function salesChartData(partnerId) {
  const URL = `${util.host}/partners/chart-sales/${partnerId}`;
  const data = await util.fetchData(URL, "GET");

  const labelData = data[0].map((r) =>
    DateTime.fromISO(r.payment_date).toFormat("LL/dd")
  );
  const thisYearSales = data[0].map((r) => Math.round(r.sales_price / 1000));
  const beforeYearSales = data[1].map((r) => Math.round(r.sales_price / 1000));

  const sumThisYearSales = thisYearSales.reduce((acc, cur) => acc + cur, 0);
  const sumBeforeYearSales = beforeYearSales.reduce((acc, cur) => acc + cur, 0);
  const ratio = (sumThisYearSales / sumBeforeYearSales).toFixed(2);

  const koreaSalesChartSummary = document.getElementById(
    "partner-sales-chart-summary"
  );
  koreaSalesChartSummary.innerHTML = `<i class="fa ${
    ratio > 1 ? "fa-arrow-up text-success" : "fa-arrow-down text-danger"
  }"></i> 
  <span class="font-weight-bold">전년대비 ${ratio * 100}%</span>`;

  salesChart(labelData, thisYearSales, beforeYearSales);
}

async function salesChart(labelData, thisYearSales, beforeYearSales) {
  var ctx2 = document.getElementById("partner-sales-chart").getContext("2d");

  var gradientStroke1 = ctx2.createLinearGradient(0, 230, 0, 50);
  gradientStroke1.addColorStop(1, "rgba(203,12,159,0.2)");
  gradientStroke1.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke1.addColorStop(0, "rgba(203,12,159,0)");

  var gradientStroke2 = ctx2.createLinearGradient(0, 230, 0, 50);
  gradientStroke2.addColorStop(1, "rgba(20,23,39,0.2)");
  gradientStroke2.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke2.addColorStop(0, "rgba(20,23,39,0)");

  if (partnerSalesChart) {
    partnerSalesChart.destroy();
  }

  partnerSalesChart = new Chart(ctx2, {
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

async function productSales(partnerId, dateText) {
  const URL = `${util.host}/partners/product-sales/${partnerId}/${dateText}`;
  const data = await util.fetchData(URL, "GET");

  const itemTitle = document.getElementById("partner-items-title");
  const itemData = document.getElementById("partner-items-data");

  if (dateText == "today") {
    itemTitle.innerHTML = `<span class="text-danger">오늘</span> 베스트 아이템 현황이에요`;
  } else if (dateText == "yesterday") {
    itemTitle.innerHTML = `<span class="text-danger">어제</span> 베스트 아이템 현황이에요`;
  } else if (dateText == "last_7_days") {
    itemTitle.innerHTML = `<span class="text-danger">7일동안</span> 베스트 아이템 현황이에요`;
  } else if (dateText == "last_14_days") {
    itemTitle.innerHTML = `<span class="text-danger">14일동안</span> 베스트 아이템 현황이에요`;
  }

  data.length = 8;
  let itemHtml = "";
  for (let item of data) {
    const itemMargin =
      partnerId == "1"
        ? Number(item.sales_price) - Number(item.cost)
        : Number(item.commission);
    let html = `
    <div class="col-md-4 col-xl-3 col-6 mb-2">
      <div class="card card-blog card-plain">
        <div class="position-relative">
          <a class="d-block shadow-xl border-radius-xl">
            <img src="${
              item.image
            }" alt="img-blur-shadow" class="img-fluid shadow border-radius-xl">
          </a>
        </div>
        <div class="card-body px-1 pb-0">
          <a href="javascript:;"><h5 class="text-sm">${
            item.product_name
          }</h5></a>
          <p class="mb-4 text-sm">판매수량 ${
            item.quantity
          }개<br>실판매가 ${util.chunwon(
      item.sales_price
    )}천원<br>매출이익 ${util.chunwon(itemMargin)}천원</p>
        </div>
      </div>
    </div>`;
    itemHtml = itemHtml + html;
  }
  itemData.innerHTML = itemHtml;
}
