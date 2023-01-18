const DateTime = luxon.DateTime;

const brandsData = document.getElementById("dashboard_brands_data");
const itemsData = document.getElementById("dashboard_items_data");

(async function sales() {
  fetch("http://localhost:3000/korea/sales?today=2023-01-18&type=1", {
    method: "GET"
  })
  .then((res) => res.json())
  .then((res) => {
    const koreaSales = document.getElementById("korea-sales");
    const koreaOrderCount = document.getElementById("korea-order-count");

    koreaSales.innerHTML = `${Number(res.sales_price).toLocaleString('ko-KR')} 원
      <span class="text-success text-sm font-weight-bolder">
        +55%
      </span>`
    koreaOrderCount.innerHTML = `${Number(res.order_count).toLocaleString('ko-KR')} 건
    <span class="text-success text-sm font-weight-bolder">
      +5%
    </span>`
  })
})();

const brandHtml = `
  <tr>
    <td>
      <div class="d-flex px-2 py-1">
        <div class="d-flex flex-column justify-content-center">
          <h6 class="mb-0 text-sm">무무즈에센셜</h6>
        </div>
      </div>
    </td>
    <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> 2,500 </span></td>
    <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> 1,500 </span></td>
    <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> 14,000 </span></td>
    <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> 18,000 </span></td>
    <td class="align-middle text-center text-sm"><span class="text-danger text-xs font-weight-bold"> -4,000 </span></td>
  </tr>`

const itemHtml = `
  <tr>
    <td>
      <div class="d-flex px-2 py-1">
        <div>
          <img src="https://moomootr4389.cdn-nhncommerce.com/data/goods/22/10/43/1000012656/1000012656_main_092.webp" class="avatar avatar-sm me-3" alt="xd">
        </div>
        <div class="d-flex flex-column justify-content-center">
          <h6 class="mb-0 text-sm">제품명 블라블라</h6>
        </div>
      </div>
    </td>
    <td>
      <span class="text-xs font-weight-bold"> 무무즈 에센셜 </span>
    </td>
    <td class="align-middle text-center text-sm">
      <span class="text-xs font-weight-bold"> 15 </span>
    </td>
    <td class="align-middle text-center text-sm">
      <span class="text-xs font-weight-bold"> 1,000 </span>
    </td>
    <td class="align-middle text-center text-sm">
      <span class="text-xs font-weight-bold"> 13% </span>
    </td>
  </tr>`

brandsData.innerHTML = brandHtml + brandHtml + brandHtml + brandHtml + brandHtml + brandHtml;
itemsData.innerHTML = itemHtml + itemHtml + itemHtml + itemHtml + itemHtml + itemHtml;