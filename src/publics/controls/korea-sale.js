import { utility } from "./utility";

const DateTime = luxon.DateTime;

async function fetchData(URL, method) {
  const response = await fetch(URL, {method: method});
  const data = await response.json()
  return data;
}

(function startFunction() {
  sales();
  brandSales();
})()

async function sales() {
  const URL = `http://localhost:3000/korea/sales?today=${DateTime.now().toFormat('yyyy-LL-dd')}&type=1`;
  const data = await fetchData(URL, "GET");

  const koreaSales = document.getElementById("korea-sales");
  const koreaOrderCount = document.getElementById("korea-order-count");

  koreaSales.innerHTML = `${Number(data.sales_price).toLocaleString('ko-KR')} 원
    <span class="text-success text-sm font-weight-bolder">
      +55%
    </span>`
  koreaOrderCount.innerHTML = `${Number(data.order_count).toLocaleString('ko-KR')} 건
  <span class="text-success text-sm font-weight-bolder">
    +5%
  </span>`
};

async function brandSales() {
  const URL = `http://localhost:3000/korea/brand-sales?today=${DateTime.now().toFormat('yyyy-LL-dd')}&type=1`;
  const data = await fetchData(URL, "GET");

  const brandsData = document.getElementById("korea-brands-data");

  let brandHtml = '';
  for(let i = 0; i < data.length; i++) {
    const salePrice = Math.round(data[i].sales_price/1000).toLocaleString('ko-KR');
    const calculateMargin = data[i].sales_price;
    const margin = Math.round(calculateMargin/1000).toLocaleString('ko-KR');

    let html = `
      <tr>
        <td>
          <div class="d-flex px-2 py-1">
            <div class="d-flex flex-column justify-content-center">
              <h6 class="mb-0 text-sm">${data[i].brand_name}</h6>
            </div>
          </div>
        </td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${data[i].order_count} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${data[i].quantity} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${salePrice} </span></td>
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> 000 </span></td>
        <td class="align-middle text-center text-sm"><span class="${calculateMargin >= 0 ? 'text-success' : 'text-danger'} text-xs font-weight-bold"> ${margin} </span></td>
      </tr>`
    brandHtml = brandHtml + html;
  }
  brandsData.innerHTML = brandHtml;
};

async function productSales() {
  const URL = `http://localhost:3000/korea/product-sales?today=${DateTime.now().toFormat('yyyy-LL-dd')}&type=1`;
  const data = await fetchData(URL, "GET");

  const productsData = document.getElementById("korea-products-data");

  let productHtml = '';
  for(let i = 0; i < data.length; i++) {
    const salePrice = Math.round(data[i].sales_price/1000).toLocaleString('ko-KR');
    const calculateMargin = data[i].sales_price;
    const margin = Math.round(calculateMargin/1000).toLocaleString('ko-KR');

    let html = `
      <tr>
      <td>
        <div class="d-flex px-2 py-1">
          <div><img src="${data[i].image}" class="avatar avatar-sm me-3" alt="xd"></div>
          <div class="d-flex flex-column justify-content-center"><h6 class="mb-0 text-sm">${data[i].product_name}</h6></div>
        </div>
      </td>
      <td>
        <span class="text-xs font-weight-bold"> ${data[i].brand_name} </span>
      </td>
      <td class="align-middle text-center text-sm">
        <span class="text-xs font-weight-bold"> ${data[i].quantity} </span>
      </td>
      <td class="align-middle text-center text-sm">
        <span class="text-xs font-weight-bold"> ${salePrice} </span>
      </td>
      <td class="align-middle text-center text-sm">
        <span class="text-xs font-weight-bold"> 13% </span>
      </td>
    </tr>`
    productHtml = productHtml + html;
  }
  productsData.innerHTML = productHtml;
}
