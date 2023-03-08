import util from "./utility.js"
const DateTime = luxon.DateTime;

const dateList = document.querySelectorAll('.dropdown-menu .dropdown-item');
for (let list of dateList) {
  list.addEventListener("click", () => partnerSales(list.innerText));
};

(function startFunction() {
  partnerSales('yesterday');
})()

async function partnerSales(dateText) {
  
  const URL = `${util.host}/korea/partner-sales/${dateText}`;
  const data = await util.fetchData(URL, "GET");

  const partnersData = document.getElementById("korea-partners-data");
  const title = document.getElementById("title");

  if (dateText == 'today') {
    title.innerHTML = `전체 파트너사 <span class="text-danger">오늘</span> 현황이에요`
  } else if (dateText == 'yesterday') {
    title.innerHTML = `전체 파트너사 <span class="text-danger">어제</span> 현황이에요`
  } else if (dateText == 'last_7_days') {
    title.innerHTML = `전체 파트너사 <span class="text-danger">7일동안</span> 현황이에요`
  } else if (dateText == 'last_14_days') {
    title.innerHTML = `전체 파트너사 <span class="text-danger">14일동안</span> 현황이에요`
  };

  let partnerHtml = '';
  for(let i = 0; i < data[1].length; i++) {
    const expense = Number(data[1][i].mileage) + Number(data[1][i].order_coupon) + Number(data[1][i].product_coupon) + Number(data[1][i].pg_expense);
    const marketing = data[0].filter( r => r.supplier_id == data[1][i].supplier_id );
    const marketingFee = marketing[0] == undefined || marketing[0] == null ? 0 : Number(marketing[0].cost);
    const calculateMargin = data[1][i].commission - expense - marketingFee;
    const margin = Math.round(calculateMargin / 1000).toLocaleString('ko-KR');
    let html = `
      <tr ${calculateMargin >= 0 ? '' : 'class="table-danger"'}>
        <td class="text-center">
          <h6 class="mb-0 text-sm"><a href="/korea/partner/${data[1][i].supplier_id}">${data[1][i].supplier_name}<a></h6>
        </td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${data[1][i].order_count} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${data[1][i].quantity} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(data[1][i].sales_price / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[1][i].commission) / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[1][i].product_coupon) / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[1][i].order_coupon) / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[1][i].mileage) / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[1][i].pg_expense) / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(marketingFee / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="${calculateMargin >= 0 ? 'text-success' : 'text-danger'} text-xs font-weight-bold"> ${margin} (${Math.round(calculateMargin / data[1][i].sales_price * 100)}%)</span></td>
      </tr>`
    partnerHtml = partnerHtml + html;
  }
  partnersData.innerHTML = partnerHtml;
};