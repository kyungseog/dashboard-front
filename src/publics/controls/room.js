"use strict";

//회의실별 예약 현황
(async function roomsStatus() {
  fetch("/roomsStatus", {
    method: "GET"
  })
  .then((res) => res.json())
  .then((res) => { 
    let roomTable = document.querySelector('#room');
    let roomData = `
      <tr>
        <td>
          <div class="d-flex px-2">
            <div>
              <img src="../assets/img/small-logos/logo-spotify.svg" class="avatar avatar-sm rounded-circle me-2" alt="spotify">
            </div>
            <div class="my-auto">
              <h6 class="mb-0 text-sm">A</h6>
            </div>
          </div>
        </td>
        <td>
          <div class="card">
            <div class="card-body p-3">
              <div class="row">
                <div class="numbers">
                  <p class="text-sm mb-0 text-capitalize font-weight-bold">09:00-10:00</p>
                  <h5 class="font-weight-bolder mb-0">경영관리 회의
                    <span class="text-success text-sm font-weight-bolder">김민성</span>
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </td>
        <td>
          <div class="card">
            <div class="card-body p-3">
              <div class="row">
                <div class="numbers">
                  <p class="text-sm mb-0 text-capitalize font-weight-bold">09:00-10:00</p>
                  <h5 class="font-weight-bolder mb-0">경영관리 회의
                    <span class="text-success text-sm font-weight-bolder">김민성</span>
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </td>
        <td>
        <div class="card">
          <div class="card-body p-3">
            <div class="row">
              <div class="numbers">
                <p class="text-sm mb-0 text-capitalize font-weight-bold">09:00-10:00</p>
                <h5 class="font-weight-bolder mb-0">경영관리 회의
                  <span class="text-success text-sm font-weight-bolder">김민성</span>
                </h5>
              </div>
            </div>
          </div>
        </div>
      </td>
      <td>
      <div class="card">
        <div class="card-body p-3">
          <div class="row">
            <div class="numbers">
              <p class="text-sm mb-0 text-capitalize font-weight-bold">09:00-10:00</p>
              <h5 class="font-weight-bolder mb-0">경영관리 회의
                <span class="text-success text-sm font-weight-bolder">김민성</span>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </td>
    <td>
      <div class="card">
        <div class="card-body p-3">
          <div class="row">
            <div class="numbers">
              <p class="text-sm mb-0 text-capitalize font-weight-bold">09:00-10:00</p>
              <h5 class="font-weight-bolder mb-0">경영관리 회의
                <span class="text-success text-sm font-weight-bolder">김민성</span>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </td>
    </tr>`;
    roomTable.innerHTML = roomData;
   }); 
})();

/* <div class="my-auto text-center">
// <h6 class="mb-0 text-sm">경영관리 회의</h6>
// <p class="mb-0 font-weight-light text-xs">김민성</p>
// <p class="mb-0 font-weight-light text-xs">9:00-10:00</p>
// </div> */