const DateTime = luxon.DateTime;

(async function getLives() {
  const today = DateTime.now();
  const start_date = today.toFormat('yyyy-LL-dd') + " 11:00:00";
  fetch(`http://localhost:3000/live-commerces/${start_date}`, {
    method: "GET"
  })
  .then((res) => res.json())
  .then((res) => {
    document.getElementById("live-title").innerHTML = `${res.brand_name}<span class="font-weight-bold text-success text-sm">${res.live_supplier_id}</span>`;
    //Shoplive JS Files
    window.onload = function (s,h,o,p,l,i,v,e) {
      s["ShoplivePlayer"]=l;
      (s[l]=s[l]||function(){(s[l].q=s[l].q||[]).push(arguments);}), (i=h.createElement(o)), (v=h.getElementsByTagName(o)[0]);
      i.async=1;
      i.src=p;
      v.parentNode.insertBefore(i,v);
    }(window,document,'script','https://static.shoplive.cloud/live.js', 'mplayer');
      var target = null;
      var idClass = document.getElementsByClassName('xans-member-var-id');
      if (idClass && idClass.length > 0) {
        target = document.getElementsByClassName('xans-member-var-id')[0];
      }
      if (target) {
        var observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            var id = mutation.target.textContent;
            var name = document.getElementsByClassName('xans-member-var-name')[0].innerHTML;
            mplayer('init', 'XNuOemxWb5GD5mTBA2Hl', res.live_campaign_key, {userId: id, userName: name}, {
              messageCallback: {
                CLICK_PRODUCT: function(payload) { window.open(payload.url, '_blank'); }
              },
              ui: { optionButton: true }
            });
            mplayer("run", "shoplive_mmz");
          });
        });
        var config = { attributes: true, childList: true, characterData: true };
        observer.observe(target, config);
      } else {
        mplayer('init', 'XNuOemxWb5GD5mTBA2Hl', res.live_campaign_key, '', {
          messageCallback: {
            CLICK_PRODUCT: function(payload) { window.open(payload.url, '_blank'); }
          },
          ui: { optionButton: true }
        });
        mplayer("run", "shoplive_mmz");
      }
    interval(res.brand_id, start_date);
  })
})();

function interval(brand_id, start_date) {
  const end_date = DateTime.now().toFormat('yyyy-LL-dd HH:mm:ss');
  getSales(brand_id, start_date, end_date);
  setTimeout(interval(brand_id, start_date), (5*60*1000))
}

async function getSales(brand_id, start_date, end_date) {
  fetch(`http://localhost:3000/live-commerces/sales?brand_id=${brand_id}&start_datetime=${start_date}:00&end_datetime=${end_date}`, {
    method: "GET"
  })
  .then((res) => res.json())
  .then((res) => {
    console.log(res);
    // const productsData = document.getElementById("products_data");
    // function ProductHtml(img,brand,product,quantity,sales,margin) {
    //   return `<div class="col-xl-2 col-md-4 mb-xl-0 mb-4">
    //   <div class="card card-blog card-plain">
    //     <div class="position-relative">
    //       <a class="d-block shadow-xl border-radius-xl">
    //         <img src=${img}" alt="img-blur-shadow" class="img-fluid shadow border-radius-xl">
    //       </a>
    //     </div>
    //     <div class="card-body px-1 pb-0">
    //       <p class="text-gradient text-dark mb-2 text-sm">${brand}</p>
    //       <a href="javascript:;">
    //         <h7>${product}</h7>
    //       </a>
    //       <p class="mt-2 text-sm">판매수량 ${quantity}개<br>실판매가 ${sales}천원<br>공헌이익 ${margin}천원</p>
    //     </div>
    //   </div>
    // </div>`}

    // productsData.innerHTML = productHtml + productHtml + productHtml + productHtml + productHtml + productHtml;



  })
};

