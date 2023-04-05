import util from "./utility.js";
const DateTime = luxon.DateTime;

const mdSelectList = document.querySelector("#md-list");
const startDayPicker = new Datepicker(document.querySelector("#datepicker1"), { format: "yyyy-mm-dd" });
const endDayPicker = new Datepicker(document.querySelector("#datepicker2"), { format: "yyyy-mm-dd" });
const yesterday = DateTime.now().minus({ days: 1 }).toFormat("yyyy-LL-dd");
const today = DateTime.now().toFormat("yyyy-LL-dd");

startFunction();

function startFunction() {
  startDayPicker.setDate(yesterday);
  endDayPicker.setDate(yesterday);
  brandSales(yesterday, today, "all");
}

const submit = document.querySelector("#submit");
submit.addEventListener("click", () => {
  const mdId = mdSelectList.options[mdSelectList.selectedIndex].value;
  const startDay = startDayPicker.getDate("yyyy-mm-dd");
  const endDay = DateTime.fromISO(endDayPicker.getDate("yyyy-mm-dd")).plus({ days: 1 }).toFormat("yyyy-LL-dd");
  brandSales(startDay, endDay, mdId);
});

const commonTD = (elem) => `<td class="align-middle text-center" width="7%">
<span class="text-xs font-weight-bold"> ${elem} </span></td>`;

async function brandSales(startDay, endDay, mdId) {
  const URL = `${util.host}/korea/brand-sales?startDay=${startDay}&endDay=${endDay}`;
  const data = await util.fetchData(URL, "GET");
  const filteredData = mdId == "all" ? data[1] : data[1].filter((r) => r.md_id == mdId);

  let totalQuantity = 0;
  let totalSales = 0;
  let totalCommission = 0;
  let totalCost = 0;
  let totalCoupon = 0;
  let totalExpense = 0;
  let totalDirectMarketing = 0;
  let totalIndirectMarketing = 0;
  let totalLogistic = 0;
  let totalMargin = 0;

  let brandHtml = "";
  for (let el of filteredData) {
    const couponFee =
      el.brand_type == "consignment" ? Number(el.order_coupon) : Number(el.order_coupon) + Number(el.product_coupon);
    const expense = Number(el.cost) + Number(el.mileage) + couponFee + Number(el.pg_expense);

    const marketing_d = data[0].filter((r) => r.brand_id == el.brand_id);
    const marketingFee_d =
      marketing_d[0] == undefined || marketing_d[0] == null ? 0 : Number(marketing_d[0].direct_marketing_fee);
    const marketing_i = data[3].filter((r) => r.brand_id == el.brand_id);
    const marketingFee_i =
      marketing_i[0] == undefined || marketing_i[0] == null ? 0 : Number(marketing_i[0].indirect_marketing_fee);
    const marketing_live = data[4].filter((r) => r.brand_id == el.brand_id);
    const marketingFee_live =
      marketing_live[0] == undefined || marketing_live[0] == null ? 0 : Number(marketing_live[0].live_fee);

    const logistic = data[2].filter((r) => r.brand_id == el.brand_id);
    const logisticFee = logistic[0] == undefined || logistic[0] == null ? 0 : Number(logistic[0].logistic_fee);

    const calculateMargin =
      el.brand_type == "consignment"
        ? el.commission - expense - marketingFee_d - marketingFee_i - marketingFee_live
        : el.sales_price - expense - marketingFee_d - marketingFee_i - marketingFee_live - logisticFee;
    const marginRate = Math.round((calculateMargin / el.sales_price) * 100);

    let huddleMarginRate = "";
    if (el.brand_squad == "위탁SQ") {
      huddleMarginRate = marginRate < 4 ? "text-danger" : "text-success";
    } else if (el.brand_squad == "전략카테고리SQ") {
      huddleMarginRate = marginRate < 5 ? "text-danger" : "text-success";
    } else if (el.brand_squad == "매입SQ") {
      huddleMarginRate = marginRate < 11 ? "text-danger" : "text-success";
    } else {
      huddleMarginRate = marginRate < 21 ? "text-danger" : "text-success";
    }

    let html = `
      <tr class="pb-0 ${calculateMargin >= 0 ? "" : "table-danger"}">
        <td class="text-center" width="10%">
          <h6 class="mb-0 text-sm">
            <a href="/brand/${el.brand_id}">${el.brand_name}<a>
          </h6>
        </td>
        <td class="align-middle text-center" width="11%">
          <span class="text-xs font-weight-bold">
          <a href="/korea/partner/${el.supplier_id}"> ${el.supplier_name} </a></span>
        </td>
        ${commonTD(Number(el.order_count).toLocaleString("ko-kr"))}
        ${commonTD(Number(el.quantity).toLocaleString("ko-kr"))}
        ${commonTD(util.chunwon(el.sales_price))}
        ${commonTD(el.brand_type == "consignment" ? util.chunwon(Number(el.commission)) : "-")}
        ${commonTD(el.brand_type == "consignment" ? "-" : util.chunwon(Number(el.cost)))}
        ${commonTD(util.chunwon(couponFee))}
        ${commonTD(util.chunwon(Number(el.mileage) + Number(el.pg_expense)))}
        ${commonTD(util.chunwon(Number(marketingFee_d) + Number(marketingFee_live)))}
        ${commonTD(util.chunwon(marketingFee_i))}
        ${commonTD(el.brand_type == "consignment" ? "-" : util.chunwon(logisticFee))}
        <td class="align-middle text-center" width="9%">
          <span class="${huddleMarginRate} text-xs font-weight-bold"> 
          ${util.chunwon(calculateMargin)} (${marginRate}%)</span>
        </td>
      </tr>`;
    brandHtml = brandHtml + html;
    totalQuantity += Number(el.quantity);
    totalSales += Number(el.sales_price);
    totalCommission += Number(el.commission);
    totalCost += Number(el.cost);
    totalCoupon += couponFee;
    totalExpense += Number(el.mileage) + Number(el.pg_expense);
    totalDirectMarketing += marketingFee_d + marketingFee_live;
    totalIndirectMarketing += marketingFee_i;
    totalLogistic += logisticFee;
    totalMargin += calculateMargin;
  }
  document.querySelector("#title").innerHTML =
    '<span class="text-primary font-weight-bold">' +
    mdSelectList.options[mdSelectList.selectedIndex].innerText +
    "</span> 담당 브랜드별 현황이에요";

  const totalMarginRate = Math.round((totalMargin / totalSales) * 100);
  let sumHtml = `
      <tr class="table-active pb-0">
        <td class="text-center" colspan="3" width="28%">
          <h6 class="mb-0 text-sm">합계</h6>
        </td>
        ${commonTD(totalQuantity.toLocaleString("ko-kr"))}
        ${commonTD(util.chunwon(totalSales))}
        ${commonTD(util.chunwon(totalCommission))}
        ${commonTD(util.chunwon(totalCost))}
        ${commonTD(util.chunwon(totalCoupon))}
        ${commonTD(util.chunwon(totalExpense))}
        ${commonTD(util.chunwon(totalDirectMarketing))}
        ${commonTD(util.chunwon(totalIndirectMarketing))}
        ${commonTD(util.chunwon(totalLogistic))}
        <td class="align-middle text-center" width="9%">
          <span class="text-success text-xs font-weight-bold"> 
          ${util.chunwon(totalMargin)} (${totalMarginRate}%)</span>
        </td>
      </tr>`;
  document.getElementById("korea-brands-sum-data").innerHTML = sumHtml;
  document.getElementById("korea-brands-data").innerHTML = brandHtml;
}
