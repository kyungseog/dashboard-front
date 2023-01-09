setInterval(() => {
  const DateTime = luxon.DateTime;
  console.log(DateTime.now().toFormat('yyyy-LL-dd HH:mm:ss'));
},1*60*1000);


async function getLives(checkTime) {
  fetch(`http://localhost:3000/live-commerces/${checkTime}`, {
    method: "GET"
  })
  .then((res) => res.json())
  .then((res) => {
    document.getElementById("live-title").innerHTML = `${res.brands_name}<span class="font-weight-bold text-success text-sm">${res.supplier_id}</span>`;

    //Shoplive JS Files
    window.onload = function (s,h,o,p,l,i,v,e) {
          s["ShoplivePlayer"]=l;
          (s[l]=s[l]||function(){(s[l].q=s[l].q||[]).push(arguments);}),
          (i=h.createElement(o)),
          (v=h.getElementsByTagName(o)[0]);
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
                  // 1회 campaign key : c7869f3ad6e2
                  mplayer('init', 'XNuOemxWb5GD5mTBA2Hl', res.campaign_key, {userId: id, userName: name}, {
                      messageCallback: {
                          CLICK_PRODUCT: function(payload) {
                              window.open(payload.url, '_blank');
                          }
                      },
                      ui: {
                          optionButton: true
                      }
                  });
                  mplayer("run", "shoplive_mmz");
              });
          });
          var config = { attributes: true, childList: true, characterData: true };
          observer.observe(target, config);
      } else {
          // 1회 campaign key : c7869f3ad6e2
          mplayer('init', 'XNuOemxWb5GD5mTBA2Hl', res.campaign_key, '', {
              messageCallback: {
                  CLICK_PRODUCT: function(payload) {
                      window.open(payload.url, '_blank');
                  }
              },
              ui: {
                  optionButton: true
              }
          });
          mplayer("run", "shoplive_mmz");
      }
  })
};



function interval() {
  const nowDateTime = DateTime.now().toFormat('yyyy-LL-dd HH:mm:ss');
  getSales();
  setTimeout(interval, (5*60*1000))
}

async function getSales() {
  fetch("http://localhost:3000/live-commerces/sales?brand_id=B0000DFV&start_datetime=2022-10-01 11:00:00&end_datetime=2022-10-01 17:00:00", {
    method: "GET"
  })
  .then((res) => res.json())
  .then((res) => {
    console.log(res)
    
  })
};

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
