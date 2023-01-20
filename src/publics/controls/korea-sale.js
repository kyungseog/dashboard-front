const DateTime = luxon.DateTime;

async function fetchData(URL, method) {
  const response = await fetch(URL, {method: method});
  const data = await response.json()
  return data;
}

(function startFunction() {
  sales();
  brandSales();
  productSales();
})()

async function sales() {
  const URL = `http://localhost:3000/korea/sales?today=${DateTime.now().toFormat('yyyy-LL-dd')}&type=1`;
  const data = await fetchData(URL, "GET");

  const dateType = Number(DateTime.now().day)
  const monthURL = `http://localhost:3000/korea/sales?today=${DateTime.now().toFormat('yyyy-LL-dd')}&type=${dateType - 1}`;
  const monthSalesData = await fetchData(monthURL, "GET");
 
  const monthSales = Math.round(monthSalesData.reduce( (acc, cur) => acc + Number(cur.sales_price), 0 ) / 1000);

  const koreaSales = document.getElementById("korea-sales");
  const koreaOrderCount = document.getElementById("korea-order-count");
  const koreaMonthlySales = document.getElementById("korea-monthly-sales");

  const salesRatio = Math.round(data[1].sales_price / data[0].sales_price * 100) - 100;
  const orderCountRatio = Math.round(data[1].order_count / data[0].order_count * 100) - 100;

  koreaSales.innerHTML = `${Number(Math.round(data[1].sales_price / 1000)).toLocaleString('ko-KR')} 천원
    <span class="${salesRatio > 0 ? 'text-success' : 'text-danger'} text-sm font-weight-bolder">
      ${ salesRatio > 0 ? "+" + salesRatio : salesRatio }%
    </span>`
  koreaOrderCount.innerHTML = `${Number(data[1].order_count).toLocaleString('ko-KR')} 건
    <span class="${orderCountRatio > 0 ? 'text-success' : 'text-danger'} text-sm font-weight-bolder">
      ${ orderCountRatio > 0 ? "+" + orderCountRatio : orderCountRatio }%
    </span>`
  koreaMonthlySales.innerHTML = `${Number(monthSales).toLocaleString('ko-KR')} 천원
  <span class="${orderCountRatio > 0 ? 'text-success' : 'text-danger'} text-sm font-weight-bolder">
    ${ orderCountRatio > 0 ? "+" + orderCountRatio : orderCountRatio }%
  </span>`
  
};

async function brandSales() {
  const URL = `http://localhost:3000/korea/brand-sales?today=${DateTime.now().toFormat('yyyy-LL-dd')}&type=1`;
  const data = await fetchData(URL, "GET");

  const brandsData = document.getElementById("korea-brands-data");

  let brandHtml = '';
  for(let i = 0; i < data.length; i++) {
    const salePrice = Math.round(data[i].sales_price/1000).toLocaleString('ko-KR');
    const cost = Math.round((Number(data[i].cost) + Number(data[i].pg_cost))/1000).toLocaleString('ko-KR');
    const calculateMargin = data[i].sales_price  - data[i].cost - data[i].pg_cost;
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
        <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> ${cost} </span></td>
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
        <span class="text-xs font-weight-bold"> 13% </span>
      </td>
    </tr>`
    productHtml = productHtml + html;
  }
  productsData.innerHTML = productHtml;
}
