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

const today = DateTime.now().toFormat("yyyy-LL-dd");
const yesterday = DateTime.now().minus({ days: 1 }).toFormat("yyyy-LL-dd");
const beforeYesterday = DateTime.now().minus({ days: 2 }).toFormat("yyyy-LL-dd");

(function startFunction() {
  headlines();
  salesChart();
  weatherChart();
  brandSales();
  squadChart();
  marketing();
  productSales("moomooz", "yesterday");
  userSaleType();
  partnerSales("yesterday");
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
  document.getElementById("korea-sales").innerHTML = `${util.chunwon(todaySalesData.sales_price)} 천원`;
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
  document.getElementById("korea-total-user").innerHTML = `${Number(totalUserData.count_users).toLocaleString(
    "ko-KR"
  )} 명`;
}

async function salesChart() {
  const thisYear = await util.fetchData(
    `${util.host}/korea/sales?sumType=day&startDay=${DateTime.now()
      .minus({ days: 13 })
      .toFormat("yyyy-LL-dd")}&endDay=${yesterday}`,
    "GET"
  );
  const beforeYear = await util.fetchData(
    `${util.host}/korea/sales?sumType=day&startDay=${DateTime.now()
      .minus({ years: 1, days: 13 })
      .toFormat("yyyy-LL-dd")}&endDay=${DateTime.now().minus({ years: 1 }).plus({ days: 8 }).toFormat("yyyy-LL-dd")}`,
    "GET"
  );

  const labelData = beforeYear.map((r) => DateTime.fromISO(r.payment_date).toFormat("LL/dd"));
  const thisYearSales = thisYear.map((r) => Math.round(r.sales_price / 1000));
  const beforeYearSales = beforeYear.map((r) => Math.round(r.sales_price / 1000));
  const sumThisYearSales = thisYearSales.reduce((acc, cur) => acc + cur, 0);
  const sumBeforeYearSales = beforeYearSales.slice(0, 13).reduce((acc, cur) => acc + cur, 0);
  const ratio = (sumThisYearSales / sumBeforeYearSales).toFixed(2);

  const koreaSalesChartSummary = document.getElementById("korea-sales-chart-summary");
  koreaSalesChartSummary.innerHTML = `<i class="fa ${
    ratio > 1 ? "fa-arrow-up text-success" : "fa-arrow-down text-danger"
  }"></i> 
  <span class="font-weight-bold">전년대비 ${ratio * 100}%</span>`;

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
    type: "line",
    data: {
      labels: labelData,
      datasets: [
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

  const brandNames = [
    "volume-brand",
    "fashion-brand",
    "design-brand",
    "strategic-brand",
    "buying-brand",
    "essential-brand",
  ];
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
  for (let i = 0; i < brandNames.length; i++) {
    document.getElementById(brandNames[i]).innerHTML = `
    <h6 class="text-center mb-0">${util.bmwon(Number(salesNames[i]))}백만(전일비 ${rationNames[i]}%)</h6>
    <span class="text-xs">(공헌이익) ${util.bmwon(marginNames[i])}백만</span>
    <hr class="horizontal dark my-3">`;
  }
}

async function squadChart() {
  const data = await util.fetchData(`${util.host}/squads/sales`, "GET");
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
        Number(directMarketingArray[0] == undefined ? 0 : directMarketingArray[0].cost) +
        Number(indirectMarketingArray[0] == undefined ? 0 : indirectMarketingArray[0].indirect_marketing_fee) +
        Number(liveMarketingArray[0] == undefined ? 0 : liveMarketingArray[0].live_fee);

      const logisticFee =
        logisticArray[0] == undefined
          ? 0
          : squad == "consignment" || squad == "strategic"
          ? 0
          : Number(logisticArray[0].logistic_fee);

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

  const optionsData = {
    responsive: true,
    plugins: {
      datalabels: {
        color: "white",
        display: true,
        font: {
          size: 15,
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
          data: salesObj.consignment,
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
          data: marginObj.consignment,
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
          data: salesObj.strategic,
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
          data: marginObj.strategic,
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
          data: salesObj.buying,
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
          data: marginObj.buying,
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
          data: salesObj.essential,
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
          data: marginObj.essential,
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

async function weatherChart() {
  const thisYear = await util.fetchData(
    `${util.host}/weather/seoul?startDay=${today}&endDay=${DateTime.now().plus({ days: 6 }).toFormat("yyyy-LL-dd")}`,
    "GET"
  );
  const beforeYear = await util.fetchData(
    `${util.host}/weather/seoul?startDay=${DateTime.now()
      .minus({ years: 1 })
      .toFormat("yyyy-LL-dd")}&endDay=${DateTime.now().minus({ years: 1 }).plus({ days: 6 }).toFormat("yyyy-LL-dd")}`,
    "GET"
  );

  const thisYearTemp = thisYear.map((r) => [r.Weather_temperature_min, r.Weather_temperature_max]);
  const beforeYearTemp = beforeYear.map((r) => [r.Weather_temperature_min, r.Weather_temperature_max]);

  const labelData = thisYear.map((r) => DateTime.fromISO(r.Weather_date).toFormat("LL/dd"));

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
            suggestedMin: -10,
            suggestedMax: 40,
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

async function marketing() {
  const yesterdaySales = await util.fetchData(
    `${util.host}/korea/sales?startDay=${yesterday}&endDay=${yesterday}`,
    "GET"
  );
  const yesterdayMarketing = await util.fetchData(
    `${util.host}/korea/marketing/channel?startDay=${yesterday}&endDay=${yesterday}`,
    "GET"
  );
  const yesterdayMarketingFee = yesterdayMarketing
    .filter((r) => r.channel != "live")
    .map((r) => Number(r.marketing_fee))
    .reduce((acc, cur) => acc + cur, 0);
  const yesterdayRoas = Math.round((Number(yesterdaySales.sales_price) / yesterdayMarketingFee) * 100);
  document.getElementById("yesterday-roas").innerHTML = `
    <h6 class="text-center mb-0">Blended ROAS (어제)</h6>
    <span class="text-xs">(실판가매출) ${util.bmwon(
      Number(yesterdaySales.sales_price)
    )}백만 <br> (총광고비) ${util.bmwon(yesterdayMarketingFee)}백만</span>
    <hr class="horizontal dark my-3">
    <h5 class="mb-0">${yesterdayRoas}%</h5>`;

  const yearlySales = await util.fetchData(
    `${util.host}/korea/sales?startDay=${DateTime.now().startOf("year").toFormat("yyyy-LL-dd")}&endDay=${yesterday}`,
    "GET"
  );
  const yearlyMarketing = await util.fetchData(
    `${util.host}/korea/marketing/channel?startDay=${DateTime.now()
      .startOf("year")
      .toFormat("yyyy-LL-dd")}&endDay=${yesterday}`,
    "GET"
  );

  const marketingChannel = yearlyMarketing.filter((r) => r.channel != "live");
  const marketingFee = marketingChannel.reduce((prev, cur) => prev + Number(cur.marketing_fee), 0);

  const yearlyRoas = Math.round((Number(yearlySales.sales_price) / marketingFee) * 100);
  document.getElementById("this-yearly-roas").innerHTML = `
    <h6 class="text-center mb-0">Blended ROAS (금년)</h6>
    <span class="text-xs">(실판가매출) ${util.bmwon(yearlySales.sales_price)}백만 <br> (총광고비) ${util.bmwon(
    Number(marketingFee)
  )}백만 </span>
    <hr class="horizontal dark my-3">
    <h5 class="mb-0">${yearlyRoas}%</h5>`;

  const monthlyMarketingData = await util.fetchData(
    `${util.host}/korea/marketing/channel?startDay=${DateTime.now()
      .startOf("month")
      .toFormat("yyyy-LL-dd")}&endDay=${yesterday}`,
    "GET"
  );
  const monthlyMarketing = monthlyMarketingData
    .filter((r) => r.channel != "live")
    .map((r) => Number(r.marketing_fee))
    .reduce((acc, cur) => acc + cur, 0);
  const monthlyIndirectMarketing = await util.fetchData(
    `${util.host}/korea/marketing/indirect?startDay=${DateTime.now()
      .startOf("month")
      .toFormat("yyyy-LL-dd")}&endDay=${yesterday}`,
    "GET"
  );
  const ratio = Math.round((monthlyIndirectMarketing.indirect_marketing_fee / monthlyMarketing) * 100);
  const indirectMaketingRatio = ratio % 5 == 0 ? ratio : ratio + (5 - (ratio % 5));
  const directMaketingRatio = 100 - indirectMaketingRatio;
  const ratioHtml = `
    <div class="col-6 ps-0">
      <div class="d-flex mb-2">
        <div class="icon icon-shape icon-xxs shadow border-radius-sm bg-gradient-dark text-center me-2 d-flex align-items-center justify-content-center">
          <svg width="10px" height="10px" viewBox="0 0 43 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          </svg>
        </div>
        <p class="text-xs mb-0 font-weight-bold">브랜드 광고비</p>
      </div>
      <h4 class="font-weight-bolder">${util.chunwon(
        monthlyMarketing - Number(monthlyIndirectMarketing.indirect_marketing_fee)
      )} 천원</h4>
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
      <h4 class="font-weight-bolder">${util.chunwon(Number(monthlyIndirectMarketing.indirect_marketing_fee))} 천원</h4>
      <div class="progress w-75">
        <div class="progress-bar bg-dark w-${indirectMaketingRatio}" role="progressbar" aria-valuenow="${indirectMaketingRatio}" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>`;

  document.getElementById("korea-marketing-ratio").innerHTML = ratioHtml;

  const byChannel = await util.fetchData(
    `${util.host}/korea/marketing/channel?startDay=${DateTime.now()
      .startOf("month")
      .toFormat("yyyy-LL-dd")}&endDay=${yesterday}`,
    "GET"
  );

  for (let list of byChannel) {
    if (list.channel == "meta") {
      document.getElementById("korea-marketing-meta").innerText = `${util.chunwon(Number(list.marketing_fee))} 천원`;
    } else if (list.channel == "naver") {
      document.getElementById("korea-marketing-naver").innerText = `${util.chunwon(Number(list.marketing_fee))} 천원`;
    } else if (list.channel == "kakao") {
      document.getElementById("korea-marketing-kakao").innerText = `${util.chunwon(Number(list.marketing_fee))} 천원`;
    } else if (list.channel == "google") {
      document.getElementById("korea-marketing-google").innerText = `${util.chunwon(Number(list.marketing_fee))} 천원`;
    } else if (list.channel == "live") {
      document.getElementById("korea-marketing-live").innerText = `${util.chunwon(Number(list.marketing_fee))} 천원`;
    } else {
      document.getElementById("korea-marketing-others").innerText = `${util.chunwon(Number(list.marketing_fee))} 천원`;
    }
  }
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
          <p class="mb-4 text-sm">판매수량 ${item.quantity}개<br>실판매가 ${util.chunwon(item.sales_price)}천원</p>
        </div>
      </div>
    </div>`;
    productHtml = productHtml + html;
  }
  document.getElementById("brand-products-data").innerHTML = productHtml;
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
        <td class="align-middle text-center">
          <h6 class="mb-0 text-xs">
            <a href="/korea/partner/${data[1][i].supplier_id}">${data[1][i].supplier_name}<a>
          </h6>
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
