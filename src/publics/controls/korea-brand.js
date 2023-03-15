import util from "./utility.js";
const DateTime = luxon.DateTime;

(function startFunction() {
  brandSales("yesterday");
})();

const mdSelectList = document.querySelector("#md-list");
mdSelectList.addEventListener("change", () => console.log(mdSelectList.options[mdSelectList.selectedIndex].value));

const submit = document.querySelector("#submit");
submit.addEventListener("click", () => console.log("실행"));

const startDayPicker = document.querySelector("#datepicker1");
const endDayPicker = document.querySelector("#datepicker2");
const startDay = new Datepicker(startDayPicker, { format: "yyyy-mm-dd" });
const endDay = new Datepicker(endDayPicker, { format: "yyyy-mm-dd" });

async function brandSales(dateText) {
  const URL = `${util.host}/korea/brand-sales/${dateText}`;
  const data = await util.fetchData(URL, "GET");

  const brandsData = document.getElementById("korea-brands-data");
  const title = document.getElementById("title");

  if (dateText == "today") {
    title.innerHTML = `전체 브랜드 <span class="text-danger">오늘</span> 현황이에요`;
  } else if (dateText == "yesterday") {
    title.innerHTML = `전체 브랜드 <span class="text-danger">어제</span> 현황이에요`;
  } else if (dateText == "last_7_days") {
    title.innerHTML = `전체 브랜드 <span class="text-danger">7일동안</span> 현황이에요`;
  } else if (dateText == "last_14_days") {
    title.innerHTML = `전체 브랜드 <span class="text-danger">14일동안</span> 현황이에요`;
  }

  let brandHtml = "";
  for (let i = 0; i < data[1].length; i++) {
    const couponFee =
      data[1][i].brand_type == "consignment"
        ? Number(data[1][i].product_coupon)
        : Number(data[1][i].order_coupon) + Number(data[1][i].product_coupon);
    const expense = Number(data[1][i].cost) + Number(data[1][i].mileage) + couponFee + Number(data[1][i].pg_expense);
    const marketing = data[0].filter((r) => r.brand_id == data[1][i].brand_id);
    const marketingFee = marketing[0] == undefined || marketing[0] == null ? 0 : Number(marketing[0].cost);
    const logisticFee = data[1][i].order_count * 4800 * 0.7;
    const calculateMargin =
      data[1][i].brand_type == "consignment"
        ? data[1][i].commission - expense - marketingFee
        : data[1][i].sales_price - expense - marketingFee - logisticFee;
    let html = `
      <tr class="pb-0 ${calculateMargin >= 0 ? "" : "table-danger"}">
        <td class="text-center" width="10%">
          <h6 class="mb-0 text-sm"><a href="/korea/brand/${data[1][i].brand_id}">${data[1][i].brand_name}<a></h6>
        </td>
        <td class="align-middle text-center" width="11%">
          <span class="text-xs font-weight-bold"><a href="/korea/partner/${data[1][i].supplier_id}"> ${
      data[1][i].supplier_name
    } </a></span>
        </td>
        <td class="align-middle text-center" width="7%"><span class="text-xs font-weight-bold"> ${
          data[1][i].order_count
        } </span></td>
        <td class="align-middle text-center" width="7%"><span class="text-xs font-weight-bold"> ${
          data[1][i].quantity
        } </span></td>
        <td class="align-middle text-center" width="7%"><span class="text-xs font-weight-bold"> ${Math.round(
          data[1][i].sales_price / 1000
        ).toLocaleString("ko-KR")} </span></td>
        <td class="align-middle text-center" width="7%"><span class="text-xs font-weight-bold"> ${
          data[1][i].brand_type == "consignment" ? util.chunwon(Number(data[1][i].commission)) : "-"
        } </span></td>
        <td class="align-middle text-center" width="7%"><span class="text-xs font-weight-bold"> ${
          data[1][i].brand_type == "consignment" ? "-" : util.chunwon(Number(data[1][i].cost))
        } </span></td>
        <td class="align-middle text-center" width="7%">
          <span class="text-xs font-weight-bold"> ${util.chunwon(couponFee)} </span>
        </td>
        <td class="align-middle text-center" width="7%">
          <span class="text-xs font-weight-bold"> ${util.chunwon(Number(data[1][i].mileage))} </span>
        </td>
        <td class="align-middle text-center" width="7%"><span class="text-xs font-weight-bold"> ${Math.round(
          Number(data[1][i].pg_expense) / 1000
        ).toLocaleString("ko-KR")} </span></td>
        <td class="align-middle text-center" width="7%"><span class="text-xs font-weight-bold"> ${Math.round(
          marketingFee / 1000
        ).toLocaleString("ko-KR")} </span></td>
        <td class="align-middle text-center" width="7%"><span class="text-xs font-weight-bold"> ${
          data[1][i].brand_type == "consignment" ? 0 : Math.round(logisticFee / 1000).toLocaleString("ko-KR")
        } </span></td>
        <td class="align-middle text-center" width="9%"><span class="${
          calculateMargin >= 0 ? "text-success" : "text-danger"
        } text-xs font-weight-bold"> ${util.chunwon(calculateMargin)} (${Math.round(
      (calculateMargin / data[1][i].sales_price) * 100
    )}%)</span></td>
      </tr>`;
    brandHtml = brandHtml + html;
  }
  brandsData.innerHTML = brandHtml;
}
