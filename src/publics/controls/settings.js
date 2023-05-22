import util from "./utility.js";
const DateTime = luxon.DateTime;

const marketing = document.querySelector("#marketing");
marketing.addEventListener("click", async () => {
  const checkStatus = await util.fetchData(`${util.host}/settings/marketing`, "GET");
  document.querySelector(
    "#marketing-message"
  ).innerHTML = `<p>${checkStatus.updateMarketing.affectedRows}</p><p>${checkStatus.updateLive.affectedRows}</p>`;
});

const allocateMarketing = document.querySelector("#allocate-marketing");
allocateMarketing.addEventListener("click", async () => {
  const checkStatus = await util.fetchData(`${util.host}/settings/allocateMarketing`, "GET");
  document.querySelector("#marketing-message").innerHTML = checkStatus;
});

const cost = document.querySelector("#cost");
cost.addEventListener("click", async () => {
  const checkStatus = await util.fetchData(`${util.host}/settings/cost`, "GET");
  document.querySelector("#cost-message").innerHTML = checkStatus;
});

const updateCost = document.querySelector("#update-cost");
updateCost.addEventListener("click", async () => {
  const checkStatus = await util.fetchData(`${util.host}/settings/updateCost`, "GET");
  document.querySelector("#cost-message").innerHTML = checkStatus;
});

const koreaInfomation = document.querySelector("#korea-infomation");
koreaInfomation.addEventListener("click", async () => {
  const checkStatus = await util.fetchData(`${util.host}/settings/koreaInfomation`, "GET");
  document.querySelector("#korea-infomation-message").innerHTML = checkStatus;
});

const koreaMonthInfomation = document.querySelector("#korea-month-infomation");
koreaMonthInfomation.addEventListener("click", async () => {
  const checkStatus = await util.fetchData(`${util.host}/settings/koreaMonthInfomation`, "GET");
  document.querySelector("#korea-infomation-message").innerHTML = checkStatus;
});

const marketingPart = document.querySelector("#marketing-part");
marketingPart.addEventListener("click", async () => {
  const checkStatus = await util.fetchData(`${util.host}/settings/marketingPart`, "GET");
  document.querySelector("#korea-infomation-message").innerHTML = checkStatus;
});
