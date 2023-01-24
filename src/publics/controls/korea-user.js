import util from "./utility.js"
const DateTime = luxon.DateTime;

(function startFunction() {
  users();
  inactiveUsers();
})()

async function users() {
  const URL = `${util.host}/korea/users?today=${DateTime.now().toFormat('yyyy-LL-dd')}`;
  const data = await util.fetchData(URL, "GET");

  const koreaNewUsers = document.getElementById("korea-new-user");
  const koreaMonthlyNewUsers = document.getElementById("korea-monthly-user");

  const newUsersRatio = Math.round(data.today / data.yesterday * 100) - 100;
  const monthlyNewUsersRatio = Math.round(data.thisMonth / data.beforeMonth * 100) - 100;

  koreaNewUsers.innerHTML = `${Number(data.today).toLocaleString('ko-KR')} 명
    <span class="${newUsersRatio > 0 ? 'text-success' : 'text-danger'} text-sm font-weight-bolder">
      ${ newUsersRatio > 0 ? "+" + newUsersRatio : newUsersRatio }%
    </span>`
  koreaMonthlyNewUsers.innerHTML = `${Number(data.thisMonth).toLocaleString('ko-KR')} 명
    <span class="${monthlyNewUsersRatio > 0 ? 'text-success' : 'text-danger'} text-sm font-weight-bolder">
      ${ monthlyNewUsersRatio > 0 ? "+" + monthlyNewUsersRatio : monthlyNewUsersRatio }%
    </span>`
};

async function inactiveUsers() {
  const URL = `${util.host}/korea/inactive-users?today=${DateTime.now().toFormat('yyyy-LL-dd')}`;
  const data = await util.fetchData(URL, "GET");

  const koreaInactiveUsers = document.getElementById("korea-inactive-user");

  const inactiveUsersRatio = Math.round(data.inactiveUsers / data.totalUsers * 100) - 100;

  koreaInactiveUsers.innerHTML = `${Number(data.inactiveUsers).toLocaleString('ko-KR')} 명 / ${Number(data.totalUsers).toLocaleString('ko-KR')} 명
    <span class="${inactiveUsersRatio > 0 ? 'text-success' : 'text-danger'} text-sm font-weight-bolder">
      ${ inactiveUsersRatio > 0 ? "+" + inactiveUsersRatio : inactiveUsersRatio }%
    </span>`
};