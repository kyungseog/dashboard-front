import util from "./utility.js"
const DateTime = luxon.DateTime;

(function startFunction() {

})()

async function marketing() {
  const URL = `${util.host}/korea/marketing?year=${DateTime.now().toFormat('yyyy')}&month=${DateTime.now().toFormat('LL')}`;
  const data = await util.fetchData(URL, "GET");

  const koreaMarketingFirstLine = document.getElementById("korea-marketing-firstline");
  const koreaMarketingSecondLine = document.getElementById("korea-marketing-secondline");

  const newUsersRatio = Math.round(data.today / data.yesterday * 100) - 100;
  const monthlyNewUsersRatio = Math.round(data.thisMonth / data.beforeMonth * 100) - 100;

  let firstLineHtml = '';
  let secondLineHtml = '';
  for(let i = 0; i < data.length; i++) {
    const faCode = findFaCode(data[i].channel);
    let html = `
      <div class="col-6 mb-xl-0 mb-2">
        <div class="card">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-8">
                <div class="numbers">
                  <p class="text-sm mb-0 text-capitalize font-weight-bold">${data[i].channel}</p>
                  <h5 class="font-weight-bolder mb-0">${data[i].channel}
                    <span class="text-success text-sm font-weight-bolder">+55%</span>
                  </h5>
                </div>
              </div>
              <div class="col-4 text-end">
                <div class="icon icon-shape bg-gradient-dark shadow text-center border-radius-md">
                  <i class="fa-brands ${faCode} text-lg opacity-10" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`

    i < 2 ? firstLineHtml += html : secondLineHtml += html;
  }
 
  koreaMarketingFirstLine.innerHTML = firstLineHtml;
  koreaMarketingSecondLine.innerHTML = secondLineHtml;

  const koreaMarketingRatio = document.getElementById("korea-marketing-ratio");

  let html =`
  <p class="text-sm ps-0">직접 / 공통 비중</p>
    <div class="col-6 ps-0">
      <div class="d-flex mb-2">
        <div class="icon icon-shape icon-xxs shadow border-radius-sm bg-gradient-dark text-center me-2 d-flex align-items-center justify-content-center">
          <svg width="10px" height="10px" viewBox="0 0 43 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          </svg>
        </div>
        <p class="text-xs mb-0 font-weight-bold">직접광고비</p>
      </div>
      <h4 class="font-weight-bolder">435천원</h4>
      <div class="progress w-75">
        <div class="progress-bar bg-dark w-30" role="progressbar" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
    <div class="col-6 ps-0">
      <div class="d-flex mb-2">
        <div class="icon icon-shape icon-xxs shadow border-radius-sm bg-gradient-primary text-center me-2 d-flex align-items-center justify-content-center">
          <svg width="10px" height="10px" viewBox="0 0 43 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          </svg>
        </div>
        <p class="text-xs mb-0 font-weight-bold">공통광고비</p>
      </div>
      <h4 class="font-weight-bolder">435천원</h4>
      <div class="progress w-75">
        <div class="progress-bar bg-dark w-50" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>`
};

function findFaCode(code) {
  
}