import util from "./utility.js"
const DateTime = luxon.DateTime;

const dateList = document.querySelectorAll('.dropdown-menu .dropdown-item');
for (let list of dateList) {
  list.addEventListener("click", () => productSales(list.innerText));
};

(function startFunction() {
  productSales('yesterday');
})()

async function productSales(dateText) {
  
  const URL = `${util.host}/korea/product-sales/${dateText}`;
  const data = await util.fetchData(URL, "GET");
  data.length = 50;

  const productsData = document.getElementById("korea-products-data");
  const title = document.getElementById("title");

  if (dateText == 'today') {
    title.innerHTML = `Top50 제품 <span class="text-danger">오늘</span> 현황이에요`
  } else if (dateText == 'yesterday') {
    title.innerHTML = `Top50 제품 <span class="text-danger">어제</span> 현황이에요`
  } else if (dateText == 'last_7_days') {
    title.innerHTML = `Top50 제품 <span class="text-danger">7일동안</span> 현황이에요`
  } else if (dateText == 'last_14_days') {
    title.innerHTML = `Top50 제품 <span class="text-danger">14일동안</span> 현황이에요`
  };

  let productHtml = '';
  for(let i = 0; i < data.length; i++) {
    const expense = Number(data[i].cost) + Number(data[i].mileage) + Number(data[i].order_coupon) + Number(data[i].product_coupon) + Number(data[i].pg_expense);
    const calculateMargin = data[i].brand_type == 'consignment' ? data[i].commission - expense: data[i].sales_price - expense;
    const margin = Math.round(calculateMargin / 1000).toLocaleString('ko-KR');
    const productName = data[i].product_name;
    let html = `
      <tr ${calculateMargin >= 0 ? '' : 'class="table-danger"'}>
        <td class="text-center">
        <div class="d-flex px-2 py-1">
          <div><img src="${data[i].image}" class="avatar avatar-sm me-3" alt="xd"></div>
          <div class="d-flex flex-column justify-content-center text-truncate">
            <h6 class="mb-0 text-sm">${productName.length > 25 ? productName.substring(0, 24) + "..." : productName}</h6>
          </div>
        </div>
        </td>
        <td class="align-middle text-center">
          <span class="text-xs font-weight-bold"><a href="/korea/partner/${data[i].brand_id}"> ${data[i].brand_name} </a></span>
        </td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${data[i].quantity} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(data[i].sales_price / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[i].commission) / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[i].cost) / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[i].product_coupon) / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[i].order_coupon) / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[i].mileage) / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[i].pg_expense) / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="${calculateMargin >= 0 ? 'text-success' : 'text-danger'} text-xs font-weight-bold"> ${margin} (${Math.round(calculateMargin / data[i].sales_price * 100)}%) </span></td>
      </tr>`
      productHtml = productHtml + html;
  }
  productsData.innerHTML = productHtml;
};