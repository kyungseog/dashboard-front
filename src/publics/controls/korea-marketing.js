import util from "./utility.js";
const DateTime = luxon.DateTime;
let roasChart;

const selectList = document.querySelector("#select-list");
const startDayPicker = new Datepicker(document.querySelector("#datepicker1"), { format: "yyyy-mm-dd" });
const endDayPicker = new Datepicker(document.querySelector("#datepicker2"), { format: "yyyy-mm-dd" });
const yesterday = DateTime.now().minus({ days: 1 }).toFormat("yyyy-LL-dd");
const today = DateTime.now().toFormat("yyyy-LL-dd");

(function startFunction() {
  startDayPicker.setDate(yesterday);
  endDayPicker.setDate(yesterday);
  marketing(today);
  marketingByBrand(yesterday, today, "all");
})();

const submit = document.querySelector("#submit");
submit.addEventListener("click", () => {
  const selectedId = selectList.options[selectList.selectedIndex].value;
  const startDay = startDayPicker.getDate("yyyy-mm-dd");
  const endDay = DateTime.fromISO(endDayPicker.getDate("yyyy-mm-dd")).plus({ days: 1 }).toFormat("yyyy-LL-dd");
  marketingByBrand(startDay, endDay, selectedId);
});

async function marketing(today) {
  const startDay = DateTime.now().minus({ month: 5 }).startOf("month").toFormat("yyyy-LL-dd");
  const marketingData = await util.fetchData(
    `${util.host}/korea/marketing/channel?startDay=${startDay}&endDay=${today}`,
    "GET"
  );
  const salesData = await util.fetchData(
    `${util.host}/korea/sales/monthly?startDay=${startDay}&endDay=${today}`,
    "GET"
  );

  const monthList = [...new Set(marketingData.map((r) => DateTime.fromISO(r.created_at).toFormat("yy-LL")))];
  const channelList = [...new Set(marketingData.map((r) => r.channel))];

  let saleByMonth = [];
  let roas = [];
  for (let month of monthList) {
    let saleByChannel = [];
    const monthlyMarketingData = marketingData.filter((r) => DateTime.fromISO(r.created_at).toFormat("yy-LL") == month);
    for (let channel of channelList) {
      saleByChannel.push(
        monthlyMarketingData
          .filter((r) => r.channel == channel)
          .map((r) => Number(r.marketing_fee))
          .reduce((acc, cur) => Number(acc) + Number(cur))
      );
    }
    const monthlySalesData = salesData.filter((r) => DateTime.fromISO(r.payment_date).toFormat("yy-LL") == month);
    const monthlySales = monthlySalesData
      .map((r) => Number(r.sales_price))
      .reduce((acc, cur) => Number(acc) + Number(cur));
    const roasByMonth = Math.round(
      (monthlySales / saleByChannel.reduce((acc, cur) => Number(acc) + Number(cur))) * 100
    );
    const uploadSales = saleByChannel.map((r) => Math.round(r / 1000000));
    saleByMonth.push(uploadSales);
    roas.push(roasByMonth);
  }
  marketingChart(monthList, channelList, saleByMonth, roas);
}

function marketingChart(labels, labelData, feeByChannel, roas) {
  var ctx = document.getElementById("roas-chart").getContext("2d");

  let marketingData = [];
  let backGroundColorList = ["#95BDFF", "#B4E4FF", "#BE6DB7", "#F7C8E0", "#E97777", "#DC8449"];

  let roasData = {
    label: "Blended ROAS",
    tension: 0.4,
    pointRadius: 0,
    borderColor: "#cb0c9f",
    borderWidth: 3,
    fill: false,
    data: roas,
    maxBarThickness: 6,
    yAxisID: "y1",
    type: "line",
    datalabels: {
      color: "black",
      display: true,
      font: {
        size: 13,
        family: "Open Sans",
        style: "normal",
        lineHeight: 2,
      },
    },
  };
  marketingData.push(roasData);

  for (let i = 0; i < labelData.length; i++) {
    let data = {
      label: labelData[i],
      backgroundColor: backGroundColorList[i],
      fill: true,
      yAxisID: "y",
      data: feeByChannel.map((r) => r[i]),
      datalabels: {
        align: "center",
        anchor: "center",
      },
    };
    marketingData.push(data);
  }

  if (roasChart) {
    roasChart.destroy();
  }

  roasChart = new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: "bar",
    data: {
      labels: labels,
      datasets: marketingData,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        datalabels: {
          color: "white",
          display: true,
          font: {
            size: 13,
            family: "Open Sans",
            style: "normal",
            lineHeight: 2,
          },
        },
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
          stacked: true,
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
            display: false,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
          },
          ticks: {
            display: false,
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
          stacked: true,
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

async function marketingByBrand(startDay, endDay, selectedId) {
  const marketingData = await util.fetchData(
    `${util.host}/korea/marketing/brand?startDay=${startDay}&endDay=${endDay}`,
    "GET"
  );
  const salesData = await util.fetchData(`${util.host}/korea/brand?startDay=${startDay}&endDay=${endDay}`, "GET");
  console.log(salesData.brandSales);

  const roasData = document.getElementById("brand-roas-data");
  let roasHtml = "";
  for (let el of salesData.brandSales) {
    const marketing_d = data[0].filter((r) => r.brand_id == el.brand_id);
    const marketingFee_d =
      marketing_d[0] == undefined || marketing_d[0] == null ? 0 : Number(marketing_d[0].direct_marketing_fee);
    const marketing_i = data[3].filter((r) => r.brand_id == el.brand_id);
    const marketingFee_i =
      marketing_i[0] == undefined || marketing_i[0] == null ? 0 : Number(marketing_i[0].indirect_marketing_fee);
    const marketing_live = data[4].filter((r) => r.brand_id == el.brand_id);
    const marketingFee_live =
      marketing_live[0] == undefined || marketing_live[0] == null ? 0 : Number(marketing_live[0].live_fee);
    let html = `
      <tr>
        <td>
          <div class="d-flex px-2 py-1">
            <div class="d-flex flex-column justify-content-center">
              <h6 class="mb-0 text-sm">
                <a href="/korea/brand/${el.brand_id}">${el.brand_name}<a>
              </h6>
            </div>
          </div>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${el.sales_price} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${el.sales_price} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${util.chunwon(el.sales_price)} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${util.chunwon(expense + logisticFee)} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${util.chunwon(
            marketingFee_d + marketingFee_i + marketingFee_live
          )} </span>
        </td>
      </tr>`;
    roasHtml = roasHtml + html;
  }
  roasData.innerHTML = roasHtml;
}
