import util from "./utility.js";
const DateTime = luxon.DateTime;

(function startFunction() {
  const URL = window.location.href;
  const squadId = URL.substring(URL.indexOf("/", URL.indexOf("squad-brand")) + 1);
  brandChart(squadId);
})();

async function brandChart(squadId) {
  const thisStartDay = DateTime.now().minus({ weeks: 5 }).startOf("week").toFormat("yyyy-LL-dd");
  const thisEndDay = DateTime.now().minus({ days: 1 }).toFormat("yyyy-LL-dd");
  const beforeStartDay = DateTime.now().minus({ years: 1, weeks: 5 }).startOf("week").toFormat("yyyy-LL-dd");
  const beforeEndDay = DateTime.now().minus({ years: 1, days: 1 }).toFormat("yyyy-LL-dd");

  const squadIdList = {
    consignmentVolume: "consignment",
    consignmentFashion: "consignment",
    consignmentDesign: "consignment",
    buying: "buying",
    strategic: "strategic",
    essential: "essential",
  };

  const thisYear = await util.fetchData(
    `${util.host}/squads/${squadIdList[squadId]}/brands?sumType=week&startDay=${thisStartDay}&endDay=${thisEndDay}`,
    "GET"
  );
  const beforeYear = await util.fetchData(
    `${util.host}/squads/${squadIdList[squadId]}/brands?sumType=week&startDay=${beforeStartDay}&endDay=${beforeEndDay}`,
    "GET"
  );

  let thisDataList = [];
  let beforeDataList = [];
  if (squadId === "consignmentVolume") {
    thisDataList = thisYear.filter((r) => util.volumeBrands.indexOf(r.brand_id) >= 0);
    beforeDataList = beforeYear.filter((r) => util.volumeBrands.indexOf(r.brand_id) >= 0);
  }
  const brands = [...new Set(thisDataList.map((r) => r.brand_name))];
  const labelData = [...new Set(thisDataList.map((r) => r.year_week))];

  let cardHtml = "";
  for (let brand of brands) {
    const brandId = thisDataList.filter((r) => r.brand_name == brand);
    let addHtml = `
      <div class="col-xl-3 col-sm-6 mb-2">
        <div class="card h-100">
          <div class="card-header pb-0">
            <div class="row">
              <div class="col-lg-8 col-8">
                <h6>${brand} 현황</h6>
              </div>
              <div class="col-lg-4 col-4 my-auto text-end">
                <p class="text-sm" id="${brandId[0].brand_id}-ratio"></p>
              </div>
            </div>
          </div>
          <div class="card-body p-3">
            <div class="chart">
              <canvas id="${brandId[0].brand_id}-chart" class="chart-canvas" height="350"></canvas>
            </div>
          </div>        
        </div>
      </div>`;
    cardHtml = cardHtml + addHtml;
  }
  document.getElementById("brands-chart-list").innerHTML = cardHtml;

  for (let brand of brands) {
    let brandChart;
    const thisBrandData = thisDataList.filter((r) => r.brand_name == brand);
    const beforeBrandData = beforeDataList.filter((r) => r.brand_name == brand);
    const thisYearSales = thisBrandData.map((r) => Math.round(Number(r.sales) / 1000));
    console.log(thisYearSales);
    const beforeYearSales =
      beforeBrandData.length == 0 ? [] : beforeBrandData.map((r) => Math.round(Number(r.sales) / 1000));

    // const ratioHtml = `<i class="fa ${ratio > 1 ? "fa-arrow-up text-success" : "fa-arrow-down text-danger"}"></i>
    // <span class="font-weight-bold">전년대비 ${ratio * 100}%</span>`;

    const ctx = document.getElementById(`${thisBrandData[0].brand_id}-chart`).getContext("2d");

    const gradientStroke1 = ctx.createLinearGradient(0, 230, 0, 50);
    gradientStroke1.addColorStop(1, "rgba(203,12,159,0.2)");
    gradientStroke1.addColorStop(0.2, "rgba(72,72,176,0.0)");
    gradientStroke1.addColorStop(0, "rgba(203,12,159,0)");

    const gradientStroke2 = ctx.createLinearGradient(0, 230, 0, 50);
    gradientStroke2.addColorStop(1, "rgba(20,23,39,0.2)");
    gradientStroke2.addColorStop(0.2, "rgba(72,72,176,0.0)");
    gradientStroke2.addColorStop(0, "rgba(20,23,39,0)");

    // if (brandId[0].brand_id) {
    //   brandId[0].brand_id.destroy();
    // }

    brandChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labelData,
        datasets: [
          {
            label: "Y" + DateTime.now().minus({ years: 1 }).toFormat("yyyy"),
            tension: 0.4,
            borderWidth: 0,
            pointRadius: 0,
            borderColor: "#3A416F",
            borderWidth: 3,
            backgroundColor: gradientStroke2,
            fill: true,
            data: beforeYearSales,
            maxBarThickness: 6,
          },
          {
            label: "Y" + DateTime.now().toFormat("yyyy"),
            tension: 0.4,
            borderWidth: 0,
            pointRadius: 0,
            borderColor: "#cb0c9f",
            borderWidth: 3,
            backgroundColor: gradientStroke1,
            fill: true,
            data: thisYearSales,
            maxBarThickness: 6,
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
}
