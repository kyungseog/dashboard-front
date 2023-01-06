const brandsData = document.getElementById("profile_brands_data");
const itemsData = document.getElementById("profile_items_data");

const brandHtml = `
  <tr>
    <td>
      <div class="d-flex px-2 py-1">
        <div class="d-flex flex-column justify-content-center"><h6 class="mb-0 text-sm">무무즈에센셜</h6></div>
      </div>
    </td>
    <td><span class="text-xs font-weight-bold"> 2,500 </span></td>
    <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> 1,500 </span></td>
    <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> 14,000 </span></td>
    <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold"> 18,000 </span></td>
    <td class="align-middle text-center text-sm"><span class="text-danger text-xs font-weight-bold"> -4,000 </span></td>
  </tr>`

const itemHtml = `<div class="col-xl-2 col-md-4 mb-xl-0 mb-4">
<div class="card card-blog card-plain">
  <div class="position-relative">
    <a class="d-block shadow-xl border-radius-xl">
      <img src="https://moomootr4389.cdn-nhncommerce.com/data/goods/22/10/43/1000012656/1000012656_main_092.webp" alt="img-blur-shadow" class="img-fluid shadow border-radius-xl">
    </a>
  </div>
  <div class="card-body px-1 pb-0">
    <p class="text-gradient text-dark mb-2 text-sm">무무즈에센셜</p>
    <a href="javascript:;">
      <h5>
        상품명 블라블라
      </h5>
    </a>
    <p class="mb-4 text-sm">
      판매수량 50개<br>실판매가 2백만원<br>공헌이익 -2백만원
    </p>
  </div>
</div>
</div>`

brandsData.innerHTML = brandHtml + brandHtml + brandHtml + brandHtml+ brandHtml+brandHtml;
itemsData.innerHTML = itemHtml + itemHtml + itemHtml + itemHtml+ itemHtml + itemHtml;