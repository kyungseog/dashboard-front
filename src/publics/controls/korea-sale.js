import util from "./utility.js"
const DateTime = luxon.DateTime;

let koreaSalesChart;
let koreaWeatherChart;
let consignmentChart;
let strategicChart;
let buyingChart;
let essentialChart;

(function startFunction() {
  sales();
  salesChartData();
  brandSales('yesterday');
  productSales('yesterday');
  partnerSales('yesterday');
  marketing();
  users();
  userSaleType();
  weatherChartData();
  sqaudData()
})()

async function sales() {
  const URL = `${util.host}/korea/sales`;
  const data = await util.fetchData(URL, "GET");

  const koreaOrderCount = document.getElementById("korea-order-count");
  const koreaSales = document.getElementById("korea-sales");
  const koreaMonthlySales = document.getElementById("korea-monthly-sales");

  koreaOrderCount.innerHTML = `${Number(data[0][0].order_count).toLocaleString('ko-KR')} 건`
  koreaSales.innerHTML = `${Number(Math.round(data[0][0].sales_price / 1000)).toLocaleString('ko-KR')} 천원`
  koreaMonthlySales.innerHTML = `${Number(Math.round(data[1].sales_price / 1000000)).toLocaleString('ko-KR')} 백만원`
};

async function brandSales(dateText) {
  const URL = `${util.host}/korea/brand-sales/${dateText}`;
  const data = await util.fetchData(URL, "GET");
  data[1].length = 6;

  const brandsData = document.getElementById("korea-brands-data");

  let brandHtml = '';
  for(let i = 0; i < data[1].length; i++) {
    const expense = Number(data[1][i].cost) + Number(data[1][i].mileage) + Number(data[1][i].order_coupon) + Number(data[1][i].product_coupon) + Number(data[1][i].pg_expense);
    const marketing = data[0].filter( r => r.brand_id == data[1][i].brand_id );
    const marketingFee = marketing[0] == undefined || marketing[0] == null ? 0 : Number(marketing[0].cost);
    const calculateMargin = data[1][i].brand_type == 'consignment' ? data[1][i].commission - expense - marketingFee : data[1][i].sales_price - expense - marketingFee;
    const margin = Math.round(calculateMargin / 1000).toLocaleString('ko-KR');
    let html = `
      <tr>
        <td>
          <div class="d-flex px-2 py-1">
            <div class="d-flex flex-column justify-content-center">
              <h6 class="mb-0 text-sm">
                <a href="/korea/brand/${data[1][i].brand_id}">${data[1][i].brand_name}<a>
              </h6>
            </div>
          </div>
        </td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${data[1][i].order_count} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${data[1][i].quantity} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${Math.round(data[1][i].sales_price / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${Math.round(expense / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${Math.round(marketingFee / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center text-sm"><span class="${calculateMargin >= 0 ? 'text-success' : 'text-danger'} text-xs font-weight-bold"> ${margin} </span></td>
      </tr>`
    brandHtml = brandHtml + html;
  }
  brandsData.innerHTML = brandHtml;
};

async function productSales(dateText) {
  const URL = `${util.host}/korea/product-sales/${dateText}`;
  const data = await util.fetchData(URL, "GET");
  data.length = 7;

  const productsData = document.getElementById("korea-products-data");

  let productHtml = '';
  for(let i = 0; i < data.length; i++) {
    const salePrice = Math.round(data[i].sales_price / 1000).toLocaleString('ko-KR');
    const expense = Number(data[i].cost) + Number(data[i].mileage) + Number(data[i].order_coupon) + Number(data[i].product_coupon) + Number(data[i].pg_expense);
    const calculateMargin = data[i].brand_type == 'consignment' ? data[i].commission  - expense : data[i].sales_price  - expense;
    const margin = Math.round(calculateMargin / 1000).toLocaleString('ko-KR');

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
          <span class="text-xs font-weight-bold"> ${Number(data[i].quantity).toLocaleString('ko-KR')} </span>
        </td>
        <td class="align-middle text-center text-sm col-2">
          <span class="text-xs font-weight-bold"> ${salePrice} </span>
        </td>
        <td class="align-middle text-center text-sm col-2">
          <span class="text-xs font-weight-bold"> ${Math.round(expense / 1000).toLocaleString('ko-KR')} </span>
        </td>
        <td class="align-middle text-center text-sm col-2">
          <span class="${calculateMargin >= 0 ? 'text-success' : 'text-danger'} text-xs font-weight-bold"> ${margin} </span>
        </td>
      </tr>`
    productHtml = productHtml + html;
  }
  productsData.innerHTML = productHtml;
};

async function partnerSales(dateText) {
  const URL = `${util.host}/korea/partner-sales/${dateText}`;
  const data = await util.fetchData(URL, "GET");
  data[1].length = 9;

  const partnersData = document.getElementById("korea-partners-data");

  let partnerHtml = '';
  for(let i = 0; i < data[1].length; i++) {
    const expense = Number(data[1][i].cost) + Number(data[1][i].mileage) + Number(data[1][i].order_coupon) + Number(data[1][i].product_coupon) + Number(data[1][i].pg_expense);
    const marketing = data[0].filter( r => r.supplier_id == data[1][i].supplier_id );
    const marketingFee = marketing[0] == undefined || marketing[0] == null ? 0 : Number(marketing[0].cost);
    const calculateMargin = data[1][i].supplier_id == '1' ? data[1][i].sales_price - expense - marketingFee : data[1][i].commission - expense - marketingFee ;
    const margin = Math.round(calculateMargin / 1000).toLocaleString('ko-KR');
    let html = `
      <tr>
        <td>
          <div class="d-flex px-2 py-1">
            <div class="d-flex flex-column justify-content-center">
              <h6 class="mb-0 text-sm">
                <a href="/korea/brand/${data[1][i].supplier_name}">${data[1][i].supplier_name}<a>
              </h6>
            </div>
          </div>
        </td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${(data[1][i].order_count).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${(data[1][i].quantity).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${Math.round(data[1][i].sales_price / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${Math.round(expense / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${Math.round(marketingFee / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center text-sm"><span class="${calculateMargin >= 0 ? 'text-success' : 'text-danger'} text-xs font-weight-bold"> ${margin} </span></td>
      </tr>`
    partnerHtml = partnerHtml + html;
  }
  partnersData.innerHTML = partnerHtml;
};

async function marketing() {
  const URL = `${util.host}/korea/marketing`;
  const data = await util.fetchData(URL, "GET");

  const koreaMarketingMeta = document.getElementById("korea-marketing-meta");
  const koreaMarketingNaver = document.getElementById("korea-marketing-naver");
  const koreaMarketingKakao = document.getElementById("korea-marketing-kakao");
  const koreaMarketingGoogle = document.getElementById("korea-marketing-google");

  for(let i = 0; i < data[0].length; i++) {
    const channel = data[0][i].channel;
    if(channel == 'meta') {
      koreaMarketingMeta.innerText = `${Math.round(Number(data[0][i].cost / 1000)).toLocaleString('ko-KR')} 천원`
    } else if(channel == 'naver') {
      koreaMarketingNaver.innerText = `${Math.round(Number(data[0][i].cost / 1000)).toLocaleString('ko-KR')} 천원`
    } else if(channel == 'kakao') {
      koreaMarketingKakao.innerText = `${Math.round(Number(data[0][i].cost / 1000)).toLocaleString('ko-KR')} 천원`
    } else if(channel == 'google') {
      koreaMarketingGoogle.innerText = `${Math.round(Number(data[0][i].cost / 1000)).toLocaleString('ko-KR')} 천원`
    } 
  }

  const koreaMarketingRatio = document.getElementById("korea-marketing-ratio");

  const totalMarketingFee = data[1].map( r => Number(r.cost) ).reduce( (acc, cur) => acc + cur, 0 );
  const directMaketing = data[1].filter( r => r.brand_id != null ).map( r => Number(r.cost) );
  const directMaketingFee = directMaketing.reduce( (acc, cur) => acc + cur, 0 );
  const indirectMaketingFee = totalMarketingFee - directMaketingFee

  const directMaketingRatio = Math.round(directMaketingFee/totalMarketingFee * 100);
  const indirectMaketingRatio = 100 - directMaketingRatio;
  const ratioHtml =`
    <div class="col-6 ps-0">
      <div class="d-flex mb-2">
        <div class="icon icon-shape icon-xxs shadow border-radius-sm bg-gradient-dark text-center me-2 d-flex align-items-center justify-content-center">
          <svg width="10px" height="10px" viewBox="0 0 43 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          </svg>
        </div>
        <p class="text-xs mb-0 font-weight-bold">브랜드 광고비</p>
      </div>
      <h4 class="font-weight-bolder">${Math.round(Number(directMaketingFee/1000)).toLocaleString('ko-KR')} 천원</h4>
      <div class="progress w-75">
        <div class="progress-bar bg-dark w-${Number(directMaketingRatio)}" role="progressbar" aria-valuenow="${Number(directMaketingRatio)}" aria-valuemin="0" aria-valuemax="100"></div>
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
      <h4 class="font-weight-bolder">${Math.round(Number(indirectMaketingFee/1000)).toLocaleString('ko-KR')} 천원</h4>
      <div class="progress w-75">
        <div class="progress-bar bg-dark w-${Number(indirectMaketingRatio)}" role="progressbar" aria-valuenow="${Number(indirectMaketingRatio)}" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>`

  koreaMarketingRatio.innerHTML = ratioHtml;
};

async function users() {
  const URL = `${util.host}/korea/users`;
  const data = await util.fetchData(URL, "GET");

  const koreaNewUsers = document.getElementById("korea-new-user");
  const koreaMonthlyNewUsers = document.getElementById("korea-monthly-user");
  const koreaTotalUsers = document.getElementById("korea-total-user");

  koreaNewUsers.innerHTML = `${Number(data[0].target_date_users).toLocaleString('ko-KR')} 명`
  koreaMonthlyNewUsers.innerHTML = `${Number(data[1].monthly_users).toLocaleString('ko-KR')} 명`
  koreaTotalUsers.innerHTML = `${Number(data[2].total_users).toLocaleString('ko-KR')} 명`
};

async function userSaleType() {
  const URL = `${util.host}/korea/user-sale-type`;
  const data = await util.fetchData(URL, "GET");
  
  const firstSale = data[0].filter( r => r.is_first == 'y' );
  document.getElementById("korea-first-sale").innerText = `${Number(firstSale[0].user_count).toLocaleString('ko-KR')}명 / ${Math.round(Number(firstSale[0].sales_price) / 1000000).toLocaleString('ko-KR')}백만원`;

  const secondSale = data[0].filter( r => r.is_first == 'n' );
  document.getElementById("korea-second-sale").innerText = `${Number(secondSale[0].user_count).toLocaleString('ko-KR')}명 / ${Math.round(Number(secondSale[0].sales_price) / 1000000).toLocaleString('ko-KR')}백만원`;

  const firstSaleBrand = data[1].filter( r => r.is_first == 'y' );
  const sortFirstSaleBrand = firstSaleBrand.sort( (a, b) => b.sales_price - a.sales_price );
  sortFirstSaleBrand.length = 6;
  let firstSaleBrandHtml = '';
  for(let i = 0; i < sortFirstSaleBrand.length; i++) {
    const countUser = Number(sortFirstSaleBrand[i].user_count).toLocaleString('ko-KR');
    const salePrice = Math.round(Number(sortFirstSaleBrand[i].sales_price) / 1000).toLocaleString('ko-KR');
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
      </tr>`
      firstSaleBrandHtml = firstSaleBrandHtml + html;
  }
  document.getElementById("korea-user-first-sale").innerHTML = firstSaleBrandHtml;

  const secondSaleBrand = data[1].filter( r => r.is_first == 'n' );
  const sortSecondSaleBrand = secondSaleBrand.sort( (a, b) => b.sales_price - a.sales_price );
  sortSecondSaleBrand.length = 6;
  let secondSaleBrandHtml = '';
  for(let i = 0; i < sortSecondSaleBrand.length; i++) {
    const countUser = Number(sortSecondSaleBrand[i].user_count).toLocaleString('ko-KR');
    const salePrice = Math.round(Number(sortSecondSaleBrand[i].sales_price) / 1000).toLocaleString('ko-KR');
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
      </tr>`
      secondSaleBrandHtml = secondSaleBrandHtml + html;
  }
  document.getElementById("korea-user-second-sale").innerHTML = secondSaleBrandHtml;
};

async function salesChartData() {
  const URL = `${util.host}/korea/chart-sales`;
  const data = await util.fetchData(URL, "GET");

  const labelData = data[0].map( r => DateTime.fromISO(r.payment_date).toFormat('LL/dd') );
  const thisYearSales = data[0].map( r => Math.round(r.sales_price/1000) );
  const beforeYearSales = data[1].map( r => Math.round(r.sales_price/1000) );

  const sumThisYearSales = thisYearSales.reduce( (acc, cur) => acc + cur, 0 );
  const sumBeforeYearSales = beforeYearSales.reduce( (acc, cur) => acc + cur, 0 );
  const ratio = (sumThisYearSales / sumBeforeYearSales).toFixed(2);

  const koreaSalesChartSummary = document.getElementById("korea-sales-chart-summary");
  koreaSalesChartSummary.innerHTML = `<i class="fa ${ratio > 1 ? 'fa-arrow-up text-success' : 'fa-arrow-down text-danger'}"></i> 
  <span class="font-weight-bold">전년대비 ${ratio * 100}%</span>`;
  
  salesChart( labelData, thisYearSales, beforeYearSales );
};

async function salesChart( labelData, thisYearSales, beforeYearSales ) {
  var ctx2 = document.getElementById("korea-sales-chart").getContext("2d");

  var gradientStroke1 = ctx2.createLinearGradient(0, 230, 0, 50);
  gradientStroke1.addColorStop(1, 'rgba(203,12,159,0.2)');
  gradientStroke1.addColorStop(0.2, 'rgba(72,72,176,0.0)');
  gradientStroke1.addColorStop(0, 'rgba(203,12,159,0)'); 

  var gradientStroke2 = ctx2.createLinearGradient(0, 230, 0, 50);
  gradientStroke2.addColorStop(1, 'rgba(20,23,39,0.2)');
  gradientStroke2.addColorStop(0.2, 'rgba(72,72,176,0.0)');
  gradientStroke2.addColorStop(0, 'rgba(20,23,39,0)');

  if(koreaSalesChart) { koreaSalesChart.destroy() };

  koreaSalesChart = new Chart(ctx2, {
    type: "line",
    data: {
      labels: labelData,
      datasets: [{
          label: "Y" + DateTime.now().toFormat('yyyy'),
          tension: 0.4,
          borderWidth: 0,
          pointRadius: 0,
          borderColor: "#cb0c9f",
          borderWidth: 3,
          backgroundColor: gradientStroke1,
          fill: true,
          data: thisYearSales,
          maxBarThickness: 6

        },
        {
          label: "Y" + DateTime.now().minus({ years: 1 }).toFormat('yyyy'),
          tension: 0.4,
          borderWidth: 0,
          pointRadius: 0,
          borderColor: "#3A416F",
          borderWidth: 3,
          backgroundColor: gradientStroke2,
          fill: true,
          data: beforeYearSales,
          maxBarThickness: 6
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
        }
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
      scales: {
        y: {
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5]
          },
          ticks: {
            display: true,
            padding: 10,
            color: '#b2b9bf',
            font: {
              size: 11,
              family: "Open Sans",
              style: 'normal',
              lineHeight: 2
            },
          }
        },
        x: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
            borderDash: [5, 5]
          },
          ticks: {
            display: true,
            color: '#b2b9bf',
            padding: 20,
            font: {
              size: 11,
              family: "Open Sans",
              style: 'normal',
              lineHeight: 2
            },
          }
        },
      },
    },
  });
};

async function weatherChartData() {
  const URL = `${util.host}/weather/seoul`;
  const data = await util.fetchData(URL, "GET");

  const thisYearTemp = data[0].map( r => [r.Weather_temperature_min, r.Weather_temperature_max] );
  const beforeYearTemp = data[1].map( r => [r.Weather_temperature_min, r.Weather_temperature_max] );

  const labelData = data[0].map( r => DateTime.fromISO(r.Weather_date).toFormat('LL/dd') );

  weatherChart( thisYearTemp, beforeYearTemp, labelData );
};

async function weatherChart( thisYearTemp, beforeYearTemp, labelData ) {
  const ctx = document.getElementById("korea-weather-chart").getContext("2d");
  const colorCode = ["#696969","#696969","#696969","#696969","#696969","#696969","#696969"];

  if(koreaWeatherChart) { koreaWeatherChart.destroy() };

  koreaWeatherChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labelData,
      datasets: [
        {
          label: "Y" + DateTime.now().minus({ years: 1 }).toFormat('yyyy'),
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 4,
          borderSkipped: false,
          backgroundColor: "#696969",
          data: beforeYearTemp,
          maxBarThickness: 6
        },
        {
          label: "Y" + DateTime.now().toFormat('yyyy'),
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 4,
          borderSkipped: false,
          backgroundColor: "#fff",
          data: thisYearTemp,
          maxBarThickness: 6
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
        }
      },
      interaction: {
        intersect: false,
        mode: 'index',
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
              style: 'normal',
              lineHeight: 2
            },
            color: "#fff"
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false
          },
          ticks: {
            display: true,
            color: colorCode,
          },
        },
      },
    },
  });
};

async function sqaudData() {
  const URL = `${util.host}/korea/squad-sales`;
  const data = await util.fetchData(URL, "GET");

  const squadIdList = data[0].map ( r => r.budget_squad_id );

  let budgetObj = {};
  let actualObj = {};
  for(let squad of squadIdList) {
    const budgetDataArray = data[0].filter( r => r.budget_squad_id == squad);
    const budgetSales = Math.round(budgetDataArray[0].budget_sale_sales / 1000000)
    const budgetMargin = Math.round(budgetDataArray[0].budget_margin / 1000000);
    budgetObj[squad] = [budgetSales, budgetMargin];

    const actualDataArray = data[1].filter( r => r.squad_id == squad);
    let actualSales = 0;
    let actualMargin = 0;
    if(actualDataArray.length != 0) {
      actualSales = Math.round(Number(actualDataArray[0].sales_price) / 1000000);
      const cost =  Number(actualDataArray[0].cost);
      const expense = Number(actualDataArray[0].mileage) + Number(actualDataArray[0].order_coupon) + Number(actualDataArray[0].product_coupon) + Number(actualDataArray[0].pg_expense);
      const marketingArray = data[2].filter( r => r.squad_id == squad );
      const marketingFee = Number(marketingArray[0].cost);
      let margin = 0;
      if(squad == 'consignment' || squad == 'strategic') {
        margin = actualDataArray[0].commission - expense - marketingFee;
      } else {
        margin = actualDataArray[0].sales_price - cost - expense - marketingFee;
      }
      actualMargin = Math.round(margin / 1000000);
    }
    actualObj[squad] = [actualSales, actualMargin];
  };
  squadChart(budgetObj, actualObj);
};

async function squadChart(budget, actual) {
  const scalesData = {
    y: {
      grid: {
        drawBorder: false,
        display: true,
        drawOnChartArea: true,
        drawTicks: false,
        borderDash: [5, 5]
      },
      ticks: {
        display: true,
        padding: 10,
        color: '#b2b9bf',
        font: {
          size: 10,
          family: "Open Sans",
          style: 'normal',
          lineHeight: 2
        },
      }
    },
    x: {
      grid: {
        drawBorder: false,
        display: false,
        drawOnChartArea: false,
        drawTicks: false,
        borderDash: [5, 5]
      },
      ticks: {
        display: true,
        color: '#b2b9bf',
        padding: 10,
        font: {
          size: 10,
          family: "Open Sans",
          style: 'normal',
          lineHeight: 2
        },
      }
    },
  }

  const consignmentctx = document.getElementById("consignment-squad-chart").getContext("2d");
  if(consignmentChart) { consignmentChart.destroy() };

  consignmentChart = new Chart(consignmentctx, {
    type: "bar",
    data: {
      labels: ["실판가매출","공헌이익"],
      datasets: [
        {
          label: "예산",
          data: budget.consignment,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: "#DBA39A",
        },
        {
          label: "추정",
          data: actual.consignment,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: "#F5EBE0",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          color: '#b2b9bf',
          align: 'top',
        },
      },
      scales: scalesData
    },
  });

  const strategicctx = document.getElementById("strategic-squad-chart").getContext("2d");
  if(strategicChart) { strategicChart.destroy() };

  strategicChart = new Chart(strategicctx, {
    type: "bar",
    data: {
      labels: ["실판가매출","공헌이익"],
      datasets: [
        {
          label: "예산",
          data: budget.strategic,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: "#DBA39A",
        },
        {
          label: "추정",
          data: actual.strategic,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: "#F5EBE0",
          
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          color: '#b2b9bf',
          align: 'top',
        },
      },
      scales: scalesData
    },
  });

  const buyingctx = document.getElementById("buying-squad-chart").getContext("2d");
  if(buyingChart) { buyingChart.destroy() };

  buyingChart = new Chart(buyingctx, {
    type: "bar",
    data: {
      labels: ["실판가매출","공헌이익"],
      datasets: [
        {
          label: "예산",
          data: budget.buying,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: "#DBA39A",
        },
        {
          label: "추정",
          data: actual.buying,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: "#F5EBE0",
          
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          color: '#b2b9bf',
          align: 'top',
        },
      },
      scales: scalesData
    },
  });

  const essentialctx = document.getElementById("essential-squad-chart").getContext("2d");
  if(essentialChart) { essentialChart.destroy() };

  essentialChart = new Chart(essentialctx, {
    type: "bar",
    data: {
      labels: ["실판가매출","공헌이익"],
      datasets: [
        {
          label: "예산",
          data: budget.essential,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: "#DBA39A",
        },
        {
          label: "추정",
          data: actual.essential,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: "#F5EBE0",
          
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          color: '#b2b9bf',
          align: 'top',
        },
      },
      scales: scalesData
    },
  });
};
