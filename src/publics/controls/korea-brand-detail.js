import util from "./utility.js"
const DateTime = luxon.DateTime;
let brandSalesChart;

const dateList = document.querySelectorAll('.dropdown-menu .dropdown-item');
const URL = window.location.href;
const brandId = (URL.substring(URL.indexOf('/',URL.indexOf('brand'))+1));
for (let list of dateList) {
  list.addEventListener("click", () => brandSales(brandId, list.innerText));
};

(function startFunction() {
  const URL = window.location.href;
  const brandId = (URL.substring(URL.indexOf('/',URL.indexOf('brand'))+1));
  brandSales(brandId, 'yesterday');
  salesChartData(brandId);
})()

async function brandSales(brandId, dateText) {
  const URL = `${util.host}/korea/brand-sales-detail/${brandId}/${dateText}`;
  const data = await util.fetchData(URL, "GET");

  document.getElementById("more-infomation").innerHTML = `
    <a class="text-body text-sm font-weight-bold mb-0 icon-move-right mt-auto" href="/korea/product/${brandId}">
      More Infomation
      <i class="fas fa-arrow-right text-sm ms-1" aria-hidden="true"></i>
    </a>`;
  const brandsData = document.getElementById("korea-brands-data");
  const itemData = document.getElementById("brand-items-data");
  const title = document.getElementById("title");
  const itemTitle = document.getElementById("brand-item-title");

  if (dateText == 'today') {
    title.innerHTML = `${data[1].brand_name} <span class="text-danger">오늘</span> 현황이에요`
    itemTitle.innerHTML = `<span class="text-danger">오늘</span> 베스트 아이템 현황이에요`
  } else if (dateText == 'yesterday') {
    title.innerHTML = `${data[1].brand_name} <span class="text-danger">어제</span> 현황이에요`
    itemTitle.innerHTML = `<span class="text-danger">어제</span> 베스트 아이템 현황이에요`
  } else if (dateText == 'last_7_days') {
    title.innerHTML = `${data[1].brand_name} <span class="text-danger">7일동안</span> 현황이에요`
    itemTitle.innerHTML = `<span class="text-danger">7일동안</span> 베스트 아이템 현황이에요`
  } else if (dateText == 'last_14_days') {
    title.innerHTML = `${data[1].brand_name} <span class="text-danger">14일동안</span> 현황이에요`
    itemTitle.innerHTML = `<span class="text-danger">14일동안</span> 베스트 아이템 현황이에요`
  };

  const productCoupon = data[1].brand_type == 'consignment' ? 0 : Number(data[1].product_coupon);
  const expense = Number(data[1].cost) + Number(data[1].mileage) + Number(data[1].order_coupon) + Number(data[1].pg_expense) + productCoupon;
  const marketingFee = data[0].cost == undefined || data[0].cost == null ? 0 : Number(data[0].cost);
  const logisticFee = data[1].order_count * 4800 * 0.7;
  const calculateMargin = data[1].brand_type == 'consignment' ? data[1].commission - expense - marketingFee : data[1].sales_price - expense - marketingFee - logisticFee;
  const margin = Math.round(calculateMargin / 1000).toLocaleString('ko-KR');
  let brandHtml = `
    <tr ${calculateMargin >= 0 ? '' : 'class="table-danger"'}>
      <td class="align-middle text-center">
        <span class="text-xs font-weight-bold"><a href="/korea/partner/${data[1].supplier_id}"> ${data[1].supplier_name} </a></span>
      </td>
      <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${data[1].order_count} </span></td>
      <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${data[1].quantity} </span></td>
      <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(data[1].sales_price / 1000).toLocaleString('ko-KR')} </span></td>
      <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[1].commission) / 1000).toLocaleString('ko-KR')} </span></td>
      <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[1].cost) / 1000).toLocaleString('ko-KR')} </span></td>
      <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round((Number(data[1].order_coupon) + productCoupon) / 1000).toLocaleString('ko-KR')} </span></td>
      <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[1].mileage) / 1000).toLocaleString('ko-KR')} </span></td>
      <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[1].pg_expense) / 1000).toLocaleString('ko-KR')} </span></td>
      <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(marketingFee / 1000).toLocaleString('ko-KR')} </span></td>
      <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${data[1].brand_type == 'consignment' ? 0 : Math.round(logisticFee / 1000).toLocaleString('ko-KR')} </span></td>
      <td class="align-middle text-center"><span class="${calculateMargin >= 0 ? 'text-success' : 'text-danger'} text-xs font-weight-bold"> ${margin} (${Math.round(calculateMargin / data[1].sales_price * 100)}%)</span></td>
    </tr>`
  brandsData.innerHTML = brandHtml;

  data[2].length = 6;
  let itemHtml = '';
  for (let item of data[2]) {
    const itemProductCoupon = data[1].brand_type == 'consignment' ? 0 : Number(item.product_coupon);
    const itemExpense = Number(item.cost) + Number(item.mileage) + Number(item.order_coupon) + Number(item.pg_expense) + itemProductCoupon;
    const itemLogisticFee = Number(item.order_count) * 4800 * 0.7;
    const itemMargin = data[1].brand_type == 'consignment' ? Number(item.commission) - itemExpense : Number(item.sales_price) - itemExpense - itemLogisticFee;
    let html = `
    <div class="col-md-3 col-xl-2 col-6 mb-2">
      <div class="card card-blog card-plain">
        <div class="position-relative">
          <a class="d-block shadow-xl border-radius-xl">
            <img src="${item.image}" alt="img-blur-shadow" class="img-fluid shadow border-radius-xl">
          </a>
        </div>
        <div class="card-body px-1 pb-0">
          <a href="javascript:;"><h5 class="text-sm">${item.product_name}</h5></a>
          <p class="mb-4 text-sm">판매수량 ${item.quantity}개<br>실판매가 ${util.chunwon(item.sales_price)}천원<br>공헌이익 ${util.chunwon(itemMargin)}천원</p>
        </div>
      </div>
    </div>`
    itemHtml = itemHtml + html;
  }
  itemData.innerHTML = itemHtml;
};

async function salesChartData(brandId) {
  const URL = `${util.host}/korea/brand-chart-sales/${brandId}`;
  const data = await util.fetchData(URL, "GET");

  const labelData = data[0].map( r => DateTime.fromISO(r.payment_date).toFormat('LL/dd') );
  const thisYearSales = data[0].map( r => Math.round(r.sales_price/1000) );
  const beforeYearSales = data[1].map( r => Math.round(r.sales_price/1000) );

  const sumThisYearSales = thisYearSales.reduce( (acc, cur) => acc + cur, 0 );
  const sumBeforeYearSales = beforeYearSales.reduce( (acc, cur) => acc + cur, 0 );
  const ratio = (sumThisYearSales / sumBeforeYearSales).toFixed(2);

  const koreaSalesChartSummary = document.getElementById("brand-sales-chart-summary");
  koreaSalesChartSummary.innerHTML = `<i class="fa ${ratio > 1 ? 'fa-arrow-up text-success' : 'fa-arrow-down text-danger'}"></i> 
  <span class="font-weight-bold">전년대비 ${ratio * 100}%</span>`;
  
  salesChart( labelData, thisYearSales, beforeYearSales );
};

async function salesChart( labelData, thisYearSales, beforeYearSales ) {
  var ctx2 = document.getElementById("brand-sales-chart").getContext("2d");

  var gradientStroke1 = ctx2.createLinearGradient(0, 230, 0, 50);
  gradientStroke1.addColorStop(1, 'rgba(203,12,159,0.2)');
  gradientStroke1.addColorStop(0.2, 'rgba(72,72,176,0.0)');
  gradientStroke1.addColorStop(0, 'rgba(203,12,159,0)'); 

  var gradientStroke2 = ctx2.createLinearGradient(0, 230, 0, 50);
  gradientStroke2.addColorStop(1, 'rgba(20,23,39,0.2)');
  gradientStroke2.addColorStop(0.2, 'rgba(72,72,176,0.0)');
  gradientStroke2.addColorStop(0, 'rgba(20,23,39,0)');

  if(brandSalesChart) { brandSalesChart.destroy() };

  brandSalesChart = new Chart(ctx2, {
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