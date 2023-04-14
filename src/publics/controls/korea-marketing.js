import util from "./utility.js";
const DateTime = luxon.DateTime;
let roasChart;

const selectList = document.querySelector("#select-list");
const startDayPicker = new Datepicker(document.querySelector("#datepicker1"), { format: "yyyy-mm-dd" });
const endDayPicker = new Datepicker(document.querySelector("#datepicker2"), { format: "yyyy-mm-dd" });
const yesterday = DateTime.now().minus({ days: 1 }).toFormat("yyyy-LL-dd");

(function startFunction() {
  startDayPicker.setDate(yesterday);
  endDayPicker.setDate(yesterday);
  monthlyRoas();
  marketingByBrand(yesterday, yesterday, "all");
})();

const submit = document.querySelector("#submit");
submit.addEventListener("click", () => {
  const selectedId = selectList.options[selectList.selectedIndex].value;
  const startDay = startDayPicker.getDate("yyyy-mm-dd");
  const endDay = endDayPicker.getDate("yyyy-mm-dd");
  marketingByBrand(startDay, endDay, selectedId);
});

async function monthlyRoas() {
  const startDay = DateTime.now().minus({ month: 5 }).startOf("month").toFormat("yyyy-LL-dd");
  const marketingData = await util.fetchData(
    `${util.host}/korea/marketing/channel?sumType=day&startDay=${startDay}&endDay=${yesterday}`,
    "GET"
  );
  const salesData = await util.fetchData(
    `${util.host}/korea/sales?sumType=day&startDay=${startDay}&endDay=${yesterday}`,
    "GET"
  );

  const monthList = [
    ...new Set(
      marketingData.filter((r) => r.channel != "live").map((r) => DateTime.fromISO(r.created_at).toFormat("yy-LL"))
    ),
  ];
  const channelList = [...new Set(marketingData.filter((r) => r.channel != "live").map((r) => r.channel))];

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
          .reduce((acc, cur) => Number(acc) + Number(cur), 0)
      );
    }
    const monthlySalesData = salesData.filter((r) => DateTime.fromISO(r.payment_date).toFormat("yy-LL") == month);
    const monthlySales = monthlySalesData
      .map((r) => Number(r.sales_price))
      .reduce((acc, cur) => Number(acc) + Number(cur), 0);
    const roasByMonth = Math.round(
      (monthlySales / saleByChannel.reduce((acc, cur) => Number(acc) + Number(cur))) * 100
    );
    const uploadSales = saleByChannel.map((r) => Math.round(r / 1000000));
    saleByMonth.push(uploadSales);
    roas.push(roasByMonth);
  }
  blendedRoasChart(monthList, channelList, saleByMonth, roas);
}

function blendedRoasChart(labels, labelData, feeByChannel, roas) {
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
  const salesOriginData = await util.fetchData(`${util.host}/korea/brand?startDay=${startDay}&endDay=${endDay}`, "GET");
  let salesData;
  if (selectedId == "all") {
    salesData = salesOriginData;
  } else if (selectedId == "consignment") {
    salesData = salesOriginData.filter((r) => r.brand_type == "consignment");
  } else if (selectedId == "consignmentSquad") {
    salesData = salesOriginData.filter((r) => r.brand_squad == "위탁SQ");
  } else if (selectedId == "starategicSquad") {
    salesData = salesOriginData.filter((r) => r.brand_squad == "전략카테고리SQ");
  } else if (selectedId == "buyingSquad") {
    salesData = salesOriginData.filter((r) => r.brand_type == "purchase");
  } else {
    salesData = salesOriginData.filter((r) => r.brand_type == "production");
  }

  const marketingData = await util.fetchData(
    `${util.host}/korea/marketing/brand-channel?startDay=${startDay}&endDay=${endDay}`,
    "GET"
  );

  const marketingDataByBrand = await util.fetchData(
    `${util.host}/korea/marketing/brand?startDay=${startDay}&endDay=${endDay}`,
    "GET"
  );

  let totalMarketing = 0;
  let totalMeta = 0;
  let totalNaver = 0;
  let totalKakao = 0;
  let totalGoogle = 0;
  let totalIndirect = 0;

  let roasHtml = "";
  for (let el of salesData) {
    const filteredData = marketingData.filter((r) => r.brand_id == el.brand_id);

    const meta = filteredData
      .filter((r) => r.channel == "meta")
      .map((r) => Number(r.marketing_fee))
      .reduce((acc, cur) => acc + cur, 0);
    totalMeta += meta;

    const naver = filteredData
      .filter((r) => r.channel == "naver")
      .map((r) => Number(r.marketing_fee))
      .reduce((acc, cur) => acc + cur, 0);
    totalNaver += naver;

    const kakao = filteredData
      .filter((r) => r.channel == "kakao")
      .map((r) => Number(r.marketing_fee))
      .reduce((acc, cur) => acc + cur, 0);
    totalKakao += kakao;

    const google = filteredData
      .filter((r) => r.channel == "google")
      .map((r) => Number(r.marketing_fee))
      .reduce((acc, cur) => acc + cur, 0);
    totalGoogle += google;

    const indirect = marketingDataByBrand.indirect
      .filter((r) => r.brand_id == el.brand_id)
      .map((r) => Number(r.indirect_marketing_fee))
      .reduce((acc, cur) => acc + cur, 0);
    totalIndirect += indirect;

    const marketingFee = meta + naver + kakao + google + indirect;
    totalMarketing += marketingFee;

    const roas = Math.round((Number(el.sales_price) / marketingFee) * 100);

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
          <span class="text-xs font-weight-bold"> ${roas.toLocaleString("ko-kr")} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${util.chunwon(Number(el.sales_price))} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${util.chunwon(marketingFee)} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${util.chunwon(meta)} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${util.chunwon(naver)} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${util.chunwon(kakao)} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${util.chunwon(google)} </span>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="text-xs font-weight-bold"> ${util.chunwon(indirect)} </span>
        </td>
      </tr>`;
    roasHtml = roasHtml + html;
  }

  const totalSales = salesData.map((r) => Number(r.sales_price)).reduce((acc, cur) => acc + cur, 0);
  const totalRoas = (totalSales / totalMarketing).toFixed(2) * 100;
  let sumHtml = `
  <tr class="table-active">
    <td>
      <div class="d-flex px-2 py-1">
        <div class="d-flex flex-column justify-content-center">
          <h6 class="mb-0 text-sm">합계</h6>
        </div>
      </div>
    </td>
    <td class="align-middle text-center text-sm">
      <span class="text-xs font-weight-bold"> ${totalRoas.toLocaleString("ko-kr")} </span>
    </td>
    <td class="align-middle text-center text-sm">
      <span class="text-xs font-weight-bold"> ${util.chunwon(totalSales)} </span>
    </td>
    <td class="align-middle text-center text-sm">
      <span class="text-xs font-weight-bold"> ${util.chunwon(totalMarketing)} </span>
    </td>
    <td class="align-middle text-center text-sm">
      <span class="text-xs font-weight-bold"> ${util.chunwon(totalMeta)} </span>
    </td>
    <td class="align-middle text-center text-sm">
      <span class="text-xs font-weight-bold"> ${util.chunwon(totalNaver)} </span>
    </td>
    <td class="align-middle text-center text-sm">
      <span class="text-xs font-weight-bold"> ${util.chunwon(totalKakao)} </span>
    </td>
    <td class="align-middle text-center text-sm">
      <span class="text-xs font-weight-bold"> ${util.chunwon(totalGoogle)} </span>
    </td>
    <td class="align-middle text-center text-sm">
      <span class="text-xs font-weight-bold"> ${util.chunwon(totalIndirect)} </span>
    </td>
  </tr>`;

  document.getElementById("brand-roas-data").innerHTML = sumHtml + roasHtml;
}
