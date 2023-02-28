import util from "./utility.js"
const DateTime = luxon.DateTime;

(function startFunction() {
  sales();
  brandSales();
  productSales('today');
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

async function brandSales() {
  const URL = `${util.host}/korea/brand-sales`;
  const data = await util.fetchData(URL, "GET");

  const brandsData = document.getElementById("korea-brands-data");

  let brandHtml = '';
  for(let i = 0; i < data[1].length; i++) {
    const salePrice = Math.round(data[1][i].sales_price/1000).toLocaleString('ko-KR');
    const expense = Math.round((Number(data[1][i].expense) + Number(data[1][i].pg_expense))/1000).toLocaleString('ko-KR');
    const marketing = data[0].filter( r => r.brand_id == data[1][i].brand_id );
    const marketingFee = marketing == undefined || marketing == null ? 0 : Math.round(marketing[0].cost / 1000).toLocaleString('ko-KR');
    const calculateMargin = data[1][i].brand_type == 'consignment' ? data[1][i].commission  - data[1][i].expense - data[1][i].pg_expense - marketing[0].cost : data[1][i].sales_price  - data[1][i].expense - data[1][i].pg_expense - marketing[0].cost;
    const margin = Math.round(calculateMargin/1000).toLocaleString('ko-KR');
    let html = `
      <tr>
        <td>
          <div class="d-flex px-2 py-1">
            <div class="d-flex flex-column justify-content-center">
              <h6 class="mb-0 text-sm">${data[1][i].brand_name}</h6>
            </div>
          </div>
        </td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${data[1][i].order_count} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${data[1][i].quantity} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${salePrice} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${expense} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${marketingFee} </span></td>
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
      <tr class="d-flex">
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
