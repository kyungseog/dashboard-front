'use strict'

const productsData = document.getElementById("products_data");

const productHtml = `<div class="col-xl-2 col-md-4 mb-xl-0 mb-4">
<div class="card card-blog card-plain">
  <div class="position-relative">
    <a class="d-block shadow-xl border-radius-xl">
      <img src="https://moomootr4389.cdn-nhncommerce.com/data/goods/22/10/43/1000012656/1000012656_main_092.webp" alt="img-blur-shadow" class="img-fluid shadow border-radius-xl">
    </a>
  </div>
  <div class="card-body px-1 pb-0">
    <p class="text-gradient text-dark mb-2 text-sm">무무즈에센셜</p>
    <a href="javascript:;">
      <h7>
        상품명 블라블라
      </h7>
    </a>
    <p class="mt-2 text-sm">
      판매수량 50개<br>실판매가 2백만원<br>공헌이익 -2백만원
    </p>
  </div>
</div>
</div>`

productsData.innerHTML = productHtml + productHtml + productHtml + productHtml + productHtml + productHtml;
