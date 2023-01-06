// (async function getSales() {
//   fetch("http://localhost:3000/live-commerces/sales?brand_id=B0000DFV&start_datetime=2022-10-01 11:00:00&end_datetime=2022-10-01 17:00:00", {
//     method: "GET"
//   })
//   .then((res) => res.json())
//   .then((res) => {
//     console.log(res)
    
//   })
// })();

const productsData = document.getElementById("products_data");

function ProductHtml(img,brand,product,quantity,sales,margin) {
  return `<div class="col-xl-2 col-md-4 mb-xl-0 mb-4">
  <div class="card card-blog card-plain">
    <div class="position-relative">
      <a class="d-block shadow-xl border-radius-xl">
        <img src=${img}" alt="img-blur-shadow" class="img-fluid shadow border-radius-xl">
      </a>
    </div>
    <div class="card-body px-1 pb-0">
      <p class="text-gradient text-dark mb-2 text-sm">${brand}</p>
      <a href="javascript:;">
        <h7>${product}</h7>
      </a>
      <p class="mt-2 text-sm">판매수량 ${quantity}개<br>실판매가 ${sales}천원<br>공헌이익 ${margin}천원</p>
    </div>
  </div>
</div>`}

productsData.innerHTML = productHtml + productHtml + productHtml + productHtml + productHtml + productHtml;
