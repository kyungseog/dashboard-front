import util from "./utility.js";
const DateTime = luxon.DateTime;

const marketing = document.querySelector("#marketing");
marketing.addEventListener("click", async () => {
  marketing.disabled = true;
  marketing.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...`;
  const checkStatus = await util.fetchData(`${util.host}/settings/marketing`, "GET");
  if (checkStatus) {
    marketing.disabled = false;
    marketing.innerText = `Update`;
    const marketingAlert = document.querySelector("#marketing-alert");
    marketingAlert.innerHTML = `
    <div class="alert alert-danger alert-dismissible" role="alert">
      <div>
        ${
          checkStatus.marketing.raw == undefined
            ? "marketing update error: " + checkStatus.marketing
            : "affectedRows: " + checkStatus.marketing.raw.affectedRows
        }
        <br />
        ${
          checkStatus.live.raw == undefined
            ? "live update error: " + checkStatus.live
            : "affectedRows: " + checkStatus.live.raw.affectedRows
        }
      </div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  }
});

const allocateMarketing = document.querySelector("#allocate-expense");
allocateMarketing.addEventListener("click", async () => {
  allocateMarketing.disabled = true;
  allocateMarketing.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...`;
  const checkStatus = await util.fetchData(`${util.host}/settings/allocateExpense`, "GET");
  if (checkStatus) {
    allocateMarketing.disabled = false;
    allocateMarketing.innerText = `Update`;
    const allocateExpenseAlert = document.querySelector("#allocate-expense-alert");
    allocateExpenseAlert.innerHTML = `
    <div class="alert alert-danger alert-dismissible" role="alert">
      <div>
        ${
          checkStatus.marketing.raw == undefined
            ? "marketing allocation error: " + checkStatus.marketing
            : "affectedRows: " + checkStatus.marketing.raw.affectedRows
        }
        <br />
        ${
          checkStatus.logistic.raw == undefined
            ? "logistic allocation error: " + checkStatus.logistic
            : "affectedRows: " + checkStatus.logistic.raw.affectedRows
        }
      </div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  }
});

const cost = document.querySelector("#cost");
cost.addEventListener("click", async () => {
  cost.disabled = true;
  cost.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...`;
  const checkStatus = await util.fetchData(`${util.host}/settings/cost`, "GET");
  if (checkStatus) {
    cost.disabled = false;
    cost.innerText = `Check`;
    const costAlert = document.querySelector("#cost-alert");
    costAlert.innerHTML = `
      <div class="alert alert-danger alert-dismissible" role="alert">
        <div>google sheet update ${checkStatus.statusText}</div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
  }
});

const updateCost = document.querySelector("#update-cost");
updateCost.addEventListener("click", async () => {
  updateCost.disabled = true;
  updateCost.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...`;
  const checkStatus = await util.fetchData(`${util.host}/settings/updateCost`, "GET");
  if (checkStatus) {
    updateCost.disabled = false;
    updateCost.innerText = `Update`;
    const updateCostAlert = document.querySelector("#update-cost-alert");
    updateCostAlert.innerHTML = `
      <div class="alert alert-danger alert-dismissible" role="alert">
        <div>
          ${checkStatus.affectedRows == undefined ? "error" : "affectedRows: " + checkStatus.affectedRows}
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
  }
});

const koreaInfomation = document.querySelector("#korea-infomation");
koreaInfomation.addEventListener("click", async () => {
  koreaInfomation.disabled = true;
  koreaInfomation.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...`;
  const checkStatus = await util.fetchData(`${util.host}/settings/koreaInfomation`, "GET");
  if (checkStatus) {
    koreaInfomation.disabled = false;
    koreaInfomation.innerText = `Update`;
    const koreaInfomationAlert = document.querySelector("#korea-infomation-alert");
    koreaInfomationAlert.innerHTML = `
      <div class="alert alert-danger alert-dismissible" role="alert">
        <div>
          ${
            checkStatus.exchangeRate == undefined
              ? "exchagne rate error"
              : "exchange rate affectedRows: " + checkStatus.exchangeRate.affectedRows
          }
          <br />
          ${
            checkStatus.supplier == undefined
              ? "supplier error"
              : "supplier affectedRows: " + checkStatus.supplier.affectedRows
          }
          <br />
          ${checkStatus.brand == undefined ? "brand error" : "brand  affectedRows: " + checkStatus.brand.affectedRows}
          <br />
          ${
            checkStatus.customer == undefined
              ? "customer error"
              : "customer affectedRows: " + checkStatus.customer.affectedRows
          }
          <br />
          ${checkStatus.stock == undefined ? "stock error" : "stock affectedRows: " + checkStatus.stock.affectedRows}
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
  }
});

const addProductInfomation = document.querySelector("#add-product-infomation");
addProductInfomation.addEventListener("click", async () => {
  addProductInfomation.disabled = true;
  addProductInfomation.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...`;
  const checkStatus = await util.fetchData(`${util.host}/settings/addProductInfomation`, "GET");
  if (checkStatus) {
    addProductInfomation.disabled = false;
    addProductInfomation.innerText = `Update`;
    const addProductInfomationAlert = document.querySelector("#add-product-infomation-alert");
    addProductInfomationAlert.innerHTML = `
      <div class="alert alert-danger alert-dismissible" role="alert">
        <div>
          ${
            checkStatus.raw == undefined
              ? "monthly infomation update error"
              : "affectedRows: " + checkStatus.raw.affectedRows
          }
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
  }
});

const koreaMonthInfomation = document.querySelector("#korea-month-infomation");
koreaMonthInfomation.addEventListener("click", async () => {
  koreaMonthInfomation.disabled = true;
  koreaMonthInfomation.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...`;
  const checkStatus = await util.fetchData(`${util.host}/settings/koreaMonthInfomation`, "GET");
  if (checkStatus) {
    koreaMonthInfomation.disabled = false;
    koreaMonthInfomation.innerText = `Update`;
    const koreaMonthInfomationAlert = document.querySelector("#korea-month-infomation-alert");
    koreaMonthInfomationAlert.innerHTML = `
      <div class="alert alert-danger alert-dismissible" role="alert">
        <div>
          ${
            checkStatus.raw == undefined
              ? "monthly infomation update error"
              : "affectedRows: " + checkStatus.raw.affectedRows
          }
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
  }
});

const koreaDayInfomation = document.querySelector("#korea-day-infomation");
koreaDayInfomation.addEventListener("click", async () => {
  koreaDayInfomation.disabled = true;
  koreaDayInfomation.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...`;
  const checkStatus = await util.fetchData(`${util.host}/settings/koreaDayInfomation`, "GET");
  if (checkStatus) {
    koreaDayInfomation.disabled = false;
    koreaDayInfomation.innerText = `Update`;
    const koreaDayInfomationAlert = document.querySelector("#korea-day-infomation-alert");
    koreaDayInfomationAlert.innerHTML = `
      <div class="alert alert-danger alert-dismissible" role="alert">
        <div>
          ${
            checkStatus.raw == undefined
              ? "daily infomation update error"
              : "affectedRows: " + checkStatus.raw.affectedRows
          }
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
  }
});

const marketingPart = document.querySelector("#marketing-part");
marketingPart.addEventListener("click", async () => {
  marketingPart.disabled = true;
  marketingPart.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...`;
  const checkStatus = await util.fetchData(`${util.host}/settings/marketingPart`, "GET");
  if (checkStatus) {
    marketingPart.disabled = false;
    marketingPart.innerText = `Update`;
    const marketingPartAlert = document.querySelector("#marketing-part-alert");
    marketingPartAlert.innerHTML = `
      <div class="alert alert-danger alert-dismissible" role="alert">
        <div>
          ${checkStatus.updateMarketing}
          <br />
          ${checkStatus.updateLive == undefined ? "error" : "affectedRows: " + checkStatus.updateLive.affectedRows}
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
  }
});
