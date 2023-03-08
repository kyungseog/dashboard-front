import util from "./utility.js"
const DateTime = luxon.DateTime;

const dateList = document.querySelectorAll('.dropdown-menu .dropdown-item');
for (let list of dateList) {
  list.addEventListener("click", () => brandSales(list.innerText));
};

(function startFunction() {
  brandSales('yesterday');
})()

async function brandSales(dateText) {
  
  const URL = `${util.host}/korea/brand-sales/${dateText}`;
  const data = await util.fetchData(URL, "GET");

  const brandsData = document.getElementById("korea-brands-data");
  const title = document.getElementById("title");

  if (dateText == 'today') {
    title.innerHTML = `전체 브랜드 <span class="text-danger">오늘</span> 현황이에요`
  } else if (dateText == 'yesterday') {
    title.innerHTML = `전체 브랜드 <span class="text-danger">어제</span> 현황이에요`
  } else if (dateText == 'last_7_days') {
    title.innerHTML = `전체 브랜드 <span class="text-danger">7일동안</span> 현황이에요`
  } else if (dateText == 'last_14_days') {
    title.innerHTML = `전체 브랜드 <span class="text-danger">14일동안</span> 현황이에요`
  };

  let brandHtml = '';
  for(let i = 0; i < data[1].length; i++) {
    const expense = Number(data[1][i].cost) + Number(data[1][i].mileage) + Number(data[1][i].order_coupon) + Number(data[1][i].product_coupon) + Number(data[1][i].pg_expense);
    const marketing = data[0].filter( r => r.brand_id == data[1][i].brand_id );
    const marketingFee = marketing[0] == undefined || marketing[0] == null ? 0 : Number(marketing[0].cost);
    const logisticFee = data[1][i].order_count * 4800 * 0.7;
    const calculateMargin = data[1][i].brand_type == 'consignment' ? data[1][i].commission - expense - marketingFee : data[1][i].sales_price - expense - marketingFee - logisticFee;
    const margin = Math.round(calculateMargin / 1000).toLocaleString('ko-KR');
    let html = `
      <tr ${calculateMargin >= 0 ? '' : 'class="table-danger"'}>
        <td class="text-center">
          <h6 class="mb-0 text-sm"><a href="/korea/brand/${data[1][i].brand_id}">${data[1][i].brand_name}<a></h6>
        </td>
        <td class="align-middle text-center">
          <span class="text-xs font-weight-bold"><a href="/korea/partner/${data[1][i].supplier_id}"> ${data[1][i].supplier_name} </a></span>
        </td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${data[1][i].order_count} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${data[1][i].quantity} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(data[1][i].sales_price / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[1][i].commission) / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[1][i].cost) / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[1][i].product_coupon) / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[1][i].order_coupon) / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round((Number(data[1][i].mileage) + Number(data[1][i].pg_expense)) / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(marketingFee / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${data[1][i].brand_type == 'consignment' ? 0 : Math.round(logisticFee / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="${calculateMargin >= 0 ? 'text-success' : 'text-danger'} text-xs font-weight-bold"> ${margin} (${Math.round(calculateMargin / data[1][i].sales_price * 100)}%)</span></td>
      </tr>`
    brandHtml = brandHtml + html;
  }
  brandsData.innerHTML = brandHtml;
};