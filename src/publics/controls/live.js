import util from "./utility.js";
const DateTime = luxon.DateTime;
let liveTimeChart;

getLives();

async function getLives() {
  const start_date = DateTime.now().toFormat("yyyy-LL-dd") + " 11:00:00";

  const URL = `${util.host}/live/${start_date}`;
  const data = await util.fetchData(URL, "GET");

  if (data.statusCode === 404) {
    return console.log(res);
  }
  document.getElementById("live-title").innerText = data.live_live_name;

  //Shoplive JS Files
  window.onload = (function (s, h, o, p, l, i, v, e) {
    s["ShoplivePlayer"] = l;
    (s[l] =
      s[l] ||
      function () {
        (s[l].q = s[l].q || []).push(arguments);
      }),
      (i = h.createElement(o)),
      (v = h.getElementsByTagName(o)[0]);
    i.async = 1;
    i.src = p;
    v.parentNode.insertBefore(i, v);
  })(window, document, "script", "https://static.shoplive.cloud/live.js", "mplayer");
  var target = null;
  var idClass = document.getElementsByClassName("xans-member-var-id");
  if (idClass && idClass.length > 0) {
    target = document.getElementsByClassName("xans-member-var-id")[0];
  }
  if (target) {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        var id = mutation.target.textContent;
        var name = document.getElementsByClassName("xans-member-var-name")[0].innerHTML;
        mplayer(
          "init",
          "XNuOemxWb5GD5mTBA2Hl",
          res.live_campaign_key,
          { userId: id, userName: name },
          {
            messageCallback: {
              CLICK_PRODUCT: function (payload) {
                window.open(payload.url, "_blank");
              },
            },
            ui: { optionButton: true },
          }
        );
        mplayer("run", "shoplive_mmz");
      });
    });
    var config = { attributes: true, childList: true, characterData: true };
    observer.observe(target, config);
  } else {
    mplayer("init", "XNuOemxWb5GD5mTBA2Hl", data.live_campaign_key, "", {
      messageCallback: {
        CLICK_PRODUCT: function (payload) {
          window.open(payload.url, "_blank");
        },
      },
      ui: { optionButton: true },
    });
    mplayer("run", "shoplive_mmz");
  }

  let timerId = setTimeout(function tick() {
    const end_date = DateTime.now().toFormat("yyyy-LL-dd HH:mm:ss");
    getSales(data.brand_id, start_date, end_date);
    timerId = setTimeout(tick, 2 * 60 * 1000);
  });

  // if(DateTime.now().toFormat('HH:mm:ss') > '13:00:00') { clearTimeout(timerId) };
}

async function getSales(brand_id, start_date, end_date) {
  const URL = `${util.host}/live/sales?brand_id=${brand_id}&start_datetime=${start_date}&end_datetime=${end_date}`;
  const orderData = await util.fetchData(URL, "GET");

  const intervalSales = await util.fetchData(
    `${util.host}/live/interval-sales?brand_id=${brand_id}&start_datetime=${start_date}&end_datetime=${end_date}`,
    "GET"
  );

  const salePrice = orderData.reduce((acc, cur) => acc + cur.order_sale_price, 0);
  const discountPrice = orderData.reduce((acc, cur) => acc + cur.order_discount_price, 0);

  const orderDataSet = new Set(orderData.map((r) => r.order_id));
  const productDataSet = new Set(orderData.map((r) => r.product_id));
  const orderCount = [...orderDataSet].length;
  const productIds = [...productDataSet];

  const productArray = productIds.map((r) => {
    const data = orderData.filter((order) => order.product_id === r);
    const productQuantity = data.reduce((acc, cur) => acc + cur.order_quantity, 0);
    const productSalePrice = data.reduce((acc, cur) => acc + cur.order_sale_price, 0);
    const productDiscountPrice = data.reduce((acc, cur) => acc + cur.order_discount_price, 0);
    return {
      product_id: r,
      product_name: data[0].product_name,
      product_image: data[0].product_image,
      brand_name: data[0].brand_brand_name,
      quantity: productQuantity,
      sale_price: productSalePrice,
      discount_price: productDiscountPrice,
    };
  });
  productArray.sort((a, b) => {
    if (a.quantity > b.quantity) {
      return -1;
    }
    if (a.quantity < b.quantity) {
      return 1;
    }
    return 0;
  });

  productArray.length = 6;

  const liveOrderCount = document.getElementById("live-order-count");
  const liveSales = document.getElementById("live-sales");
  const productsData = document.getElementById("products_data");

  liveOrderCount.innerHTML = '<span class="fs-5 text-secondary me-3">주문건수</span>' + orderCount + " 건";
  liveSales.innerHTML =
    '<span class="fs-5 text-secondary me-3">실판매가</span>' +
    Math.round((salePrice - discountPrice) / 1000).toLocaleString("ko-KR") +
    " 천원";
  const liveProductHtml = productsHtml(productArray);
  productsData.innerHTML = liveProductHtml;
  liveChart(intervalSales);
}

function productsHtml(productArray) {
  let returnData = "";

  for (let i = 0; i < productArray.length; i++) {
    let html = `<div class="col-xl-2 col-md-4 mb-xl-0 mb-4">
    <div class="card card-blog card-plain">
      <div class="position-relative">
        <a class="d-block shadow-xl border-radius-xl">
          <img src="${productArray[i].product_image}" alt="img-blur-shadow" class="img-fluid shadow border-radius-xl">
        </a>
      </div>
      <div class="card-body px-1 pb-0">
        <p class="mb-2 text-sm">${productArray[i].brand_name}</p>
        <p class="text-sm">${productArray[i].product_name}</p>
        <p class="mt-2 text-sm">
          ${productArray[i].quantity.toLocaleString("ko-KR")}개 | ${Math.round(
      (productArray[i].sale_price - productArray[i].discount_price) / 1000
    ).toLocaleString("ko-KR")}천원
        </p>
      </div>
    </div>
  </div>`;
    returnData = returnData + html;
  }
  return returnData;
}

function liveChart(intervalSales) {
  const sales = intervalSales.map((sale) => sale.sales_price);
  const orders = intervalSales.map((order) => order.order_count);

  const ctx2 = document.getElementById("chart-line").getContext("2d");
  const gradientStroke1 = ctx2.createLinearGradient(0, 230, 0, 50);
  gradientStroke1.addColorStop(1, "rgba(203,12,159,0.2)");
  gradientStroke1.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke1.addColorStop(0, "rgba(203,12,159,0)");

  const gradientStroke2 = ctx2.createLinearGradient(0, 230, 0, 50);
  gradientStroke2.addColorStop(1, "rgba(20,23,39,0.2)");
  gradientStroke2.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke2.addColorStop(0, "rgba(20,23,39,0)");

  if (liveTimeChart) {
    liveTimeChart.destroy();
  }

  liveTimeChart = new Chart(ctx2, {
    type: "bar",
    data: {
      labels: [
        "11:00",
        "11:10",
        "11:20",
        "11:30",
        "11:40",
        "11:50",
        "12:00",
        "12:10",
        "12:20",
        "12:30",
        "12:40",
        "12:50",
      ],
      datasets: [
        {
          label: "실판매",
          tension: 0.4,
          borderWidth: 0,
          pointRadius: 0,
          borderColor: "#cb0c9f",
          borderWidth: 3,
          backgroundColor: gradientStroke1,
          fill: true,
          type: "line",
          data: sales,
          maxBarThickness: 6,
          yAxisID: "y",
        },
        {
          label: "주문수",
          tension: 0.4,
          borderWidth: 0,
          pointRadius: 0,
          borderColor: "#3A416F",
          borderWidth: 3,
          backgroundColor: gradientStroke2,
          fill: true,
          data: orders,
          maxBarThickness: 6,
          yAxisID: "y1",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      scales: {
        y: {
          position: "left",
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
          },
          ticks: {
            display: true,
            padding: 10,
            color: "#b2b9bf",
            font: {
              size: 11,
              family: "Open Sans",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
        y1: {
          position: "right",
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
          },
          ticks: {
            display: true,
            padding: 10,
            color: "#b2b9bf",
            font: {
              size: 11,
              family: "Open Sans",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
            borderDash: [5, 5],
          },
          ticks: {
            display: true,
            color: "#b2b9bf",
            padding: 20,
            font: {
              size: 11,
              family: "Open Sans",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
      },
    },
  });
}
