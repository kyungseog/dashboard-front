import util from "./utility.js"
const DateTime = luxon.DateTime;

(function startFunction() {
  brandSales('yesterday');
})()

async function brandSales(dateText) {
  const URL = `${util.host}/korea/brand-sales/${dateText}`;
  const data = await util.fetchData(URL, "GET");

  const brandsData = document.getElementById("korea-brands-data");

  let brandHtml = '';
  for(let i = 0; i < data[1].length; i++) {
    const expense = Number(data[1][i].cost) + Number(data[1][i].mileage) + Number(data[1][i].order_coupon) + Number(data[1][i].product_coupon) + Number(data[1][i].pg_expense);
    const marketing = data[0].filter( r => r.brand_id == data[1][i].brand_id );
    const marketingFee = marketing[0] == undefined || marketing[0] == null ? 0 : Number(marketing[0].cost);
    const calculateMargin = data[1][i].brand_type == 'consignment' ? data[1][i].commission - expense - marketingFee : data[1][i].sales_price - expense - marketingFee;
    const margin = Math.round(calculateMargin / 1000).toLocaleString('ko-KR');
    let html = `
      <tr ${calculateMargin >= 0 ? '' : 'class="table-danger"'}>
        <td class="text-center">
          <h6 class="mb-0 text-sm"><a href="/korea/brand/${data[1][i].brand_id}">${data[1][i].brand_name}<a></h6>
        </td>
        <td class="align-middle text-center">
          <span class="text-xs font-weight-bold"><a href="javascript:;"> ${data[1][i].supplier_name} </a></span>
        </td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${data[1][i].order_count} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${data[1][i].quantity} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(data[1][i].sales_price / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[1][i].commission) / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[1][i].cost) / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[1][i].product_coupon) / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[1][i].order_coupon) / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(Number(data[1][i].mileage) / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="text-xs font-weight-bold"> ${Math.round(marketingFee / 1000).toLocaleString('ko-KR')} </span></td>
        <td class="align-middle text-center"><span class="${calculateMargin >= 0 ? 'text-success' : 'text-danger'} text-xs font-weight-bold"> ${margin} </span></td>
      </tr>`
    brandHtml = brandHtml + html;
  }
  brandsData.innerHTML = brandHtml;
};