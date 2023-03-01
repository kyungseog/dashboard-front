import util from "./utility.js"
const DateTime = luxon.DateTime;

(function startFunction() {
  sales();
  brandSales('yesterday');
  productSales('yesterday');
  marketing();
  users();
  userSaleType();
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
    const expense = Number(data[1][i].mileage) + Number(data[1][i].order_coupon) + Number(data[1][i].product_coupon) + Number(data[1][i].pg_expense);
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
                <a href="javascript:;">${data[1][i].brand_name}<a>
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

  const productsData = document.getElementById("korea-products-data");

  let productHtml = '';
  for(let i = 0; i < data.length; i++) {
    const salePrice = Math.round(data[i].sales_price/1000).toLocaleString('ko-KR');
    const expense = Math.round((Number(data[i].expense) + Number(data[i].pg_expense))/1000).toLocaleString('ko-KR');
    const calculateMargin = data[i].brand_type == 'consignment' ? data[i].commission  - data[i].expense - data[i].pg_expense : data[i].sales_price  - data[i].expense - data[i].pg_expense;
    const margin = Math.round(calculateMargin/1000).toLocaleString('ko-KR');

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
          <span class="text-xs font-weight-bold"> ${data[i].quantity} </span>
        </td>
        <td class="align-middle text-center text-sm col-2">
          <span class="text-xs font-weight-bold"> ${salePrice} </span>
        </td>
        <td class="align-middle text-center text-sm col-2">
          <span class="text-xs font-weight-bold"> ${expense} </span>
        </td>
        <td class="align-middle text-center text-sm col-2">
          <span class="text-xs font-weight-bold"> ${margin} </span>
        </td>
      </tr>`
    productHtml = productHtml + html;
  }
  productsData.innerHTML = productHtml;
};

async function marketing() {
  const URL = `${util.host}/korea/marketing`;
  const data = await util.fetchData(URL, "GET");

  const koreaMarketingFirstLine = document.getElementById("korea-marketing-firstline");
  const koreaMarketingSecondLine = document.getElementById("korea-marketing-secondline");

  let firstLineHtml = '';
  let secondLineHtml = '';
  for(let i = 0; i < data[0].length; i++) {
    const channel = data[0][i].channel;
    const faCode = util.marketingChannel[channel];
    let html = `
      <div class="col-6 mb-xl-0 mb-2">
        <div class="card">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-8">
                <div class="numbers">
                  <p class="text-sm mb-0 text-capitalize font-weight-bold">${channel}</p>
                  <h5 class="font-weight-bolder mb-0">${Math.round(Number(data[0][i].cost / 1000)).toLocaleString('ko-KR')} 천원
                  </h5>
                </div>
              </div>
              <div class="col-4 text-end">
                <div class="icon icon-shape bg-gradient-dark shadow text-center border-radius-md">
                  <i class="fa-brands ${faCode} text-lg opacity-10" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`

    i < 2 ? firstLineHtml += html : secondLineHtml += html;
  }
 
  koreaMarketingFirstLine.innerHTML = firstLineHtml;
  koreaMarketingSecondLine.innerHTML = secondLineHtml;

  const koreaMarketingRatio = document.getElementById("korea-marketing-ratio");

  const totalMarketingFee = data[1].map( r => Number(r.cost) ).reduce( (acc, cur) => acc + cur, 0 );
  const directMaketing = data[1].filter( r => r.brand_id != null ).map( r => Number(r.cost) );
  const directMaketingFee = directMaketing.reduce( (acc, cur) => acc + cur, 0 );
  const indirectMaketingFee = totalMarketingFee - directMaketingFee

  const directMaketingRatio = Math.round(directMaketingFee/totalMarketingFee * 100);
  const indirectMaketingRatio = 100 - directMaketingRatio;
  const ratioHtml =`
    <p class="text-sm ps-0">브랜드 / 무무즈 광고 비중</p>
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
  document.getElementById("korea-first-sale").innerText = `${Number(firstSale[0].user_count).toLocaleString('ko-KR')}명 / ${Math.round(Number(firstSale[0].sales_price) / 1000).toLocaleString('ko-KR')}천원`;

  const secondSale = data[0].filter( r => r.is_first == 'n' );
  document.getElementById("korea-second-sale").innerText = `${Number(secondSale[0].user_count).toLocaleString('ko-KR')}명 / ${Math.round(Number(secondSale[0].sales_price) / 1000).toLocaleString('ko-KR')}천원`;

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