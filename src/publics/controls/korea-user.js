import util from "./utility.js"

(function startFunction() {
  users();
})()

async function users() {
  const URL = `${util.host}/korea/users`;
  const data = await util.fetchData(URL, "GET");

  const koreaNewUsers = document.getElementById("korea-new-user");
  const koreaMonthlyNewUsers = document.getElementById("korea-monthly-user");
  const koreaTotalUsers = document.getElementById("korea-total-user");

  koreaNewUsers.innerHTML = `${Number(data[0].target_date_users).toLocaleString('ko-KR')} 명`
  koreaMonthlyNewUsers.innerHTML = `${Number(data[1].monthly_users).toLocaleString('ko-KR')} 명`
  koreaTotalUsers.innerHTML = `${Number(data[2].total_users).toLocaleString('ko-KR')} 명`
};