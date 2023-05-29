import util from "./utility.js";
const DateTime = luxon.DateTime;

const marketing = document.querySelector("#marketing");
marketing.addEventListener("click", async () => {
  marketing.disabled = true;
  marketing.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...`;
  const checkStatus = await util.fetchData(`${util.host}/settings/marketing`, "GET");
  console.log(checkStatus);
  if (checkStatus) {
    marketing.disabled = false;
    marketing.innerText = `Update`;
    const marketingModal = document.querySelector("#marketing-alert");
    marketingModal.innerHTML = `
    <div class="alert alert-danger alert-dismissible" role="alert">
    <div>
      ${
        checkStatus.marketing.raw == undefined
          ? "marketing update error: " + checkStatus.marketing
          : "affectedRows: " + checkStatus.marketing.raw.affectedRows
      }
      <br />
      ${
        checkStatus.live == undefined
          ? "live update error: " + checkStatus.live
          : "affectedRows: " + checkStatus.live.length
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
  console.log(checkStatus);
  if (checkStatus) {
    marketing.disabled = false;
    marketing.innerText = `Update`;
    const marketingModal = document.querySelector("#allocate-expense-alert");
    marketingModal.innerHTML = `
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

const cost = document.querySelector("#cost");
cost.addEventListener("click", async () => {
  cost.disabled = true;
  cost.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...`;
  const checkStatus = await util.fetchData(`${util.host}/settings/cost`, "GET");
  if (checkStatus) {
    marketing.disabled = false;
    marketing.innerText = `Update`;
    const marketingModal = document.querySelector("#cost-alert");
    marketingModal.innerHTML = `
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

const updateCost = document.querySelector("#update-cost");
updateCost.addEventListener("click", async () => {
  updateCost.disabled = true;
  updateCost.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...`;
  const checkStatus = await util.fetchData(`${util.host}/settings/updateCost`, "GET");
  if (checkStatus) {
    marketing.disabled = false;
    marketing.innerText = `Update`;
    const marketingModal = document.querySelector("#update-cost-alert");
    marketingModal.innerHTML = `
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

const koreaInfomation = document.querySelector("#korea-infomation");
koreaInfomation.addEventListener("click", async () => {
  koreaInfomation.disabled = true;
  koreaInfomation.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...`;
  const checkStatus = await util.fetchData(`${util.host}/settings/koreaInfomation`, "GET");
  if (checkStatus) {
    marketing.disabled = false;
    marketing.innerText = `Update`;
    const marketingModal = document.querySelector("#korea-infomation-alert");
    marketingModal.innerHTML = `
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

const koreaMonthInfomation = document.querySelector("#korea-month-infomation");
koreaMonthInfomation.addEventListener("click", async () => {
  koreaMonthInfomation.disabled = true;
  koreaMonthInfomation.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...`;
  const checkStatus = await util.fetchData(`${util.host}/settings/koreaMonthInfomation`, "GET");
  if (checkStatus) {
    marketing.disabled = false;
    marketing.innerText = `Update`;
    const marketingModal = document.querySelector("#korea-month-infomation-alert");
    marketingModal.innerHTML = `
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

const koreaDayInfomation = document.querySelector("#korea-day-infomation");
koreaDayInfomation.addEventListener("click", async () => {
  koreaDayInfomation.disabled = true;
  koreaDayInfomation.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...`;
  const checkStatus = await util.fetchData(`${util.host}/settings/koreaDayInfomation`, "GET");
  if (checkStatus) {
    marketing.disabled = false;
    marketing.innerText = `Update`;
    const marketingModal = document.querySelector("#korea-day-infomation-alert");
    marketingModal.innerHTML = `
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

const marketingPart = document.querySelector("#marketing-part");
marketingPart.addEventListener("click", async () => {
  marketingPart.disabled = true;
  marketingPart.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...`;
  const checkStatus = await util.fetchData(`${util.host}/settings/marketingPart`, "GET");
  if (checkStatus) {
    marketing.disabled = false;
    marketing.innerText = `Update`;
    const marketingModal = document.querySelector("#marketing-part-alert");
    marketingModal.innerHTML = `
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
