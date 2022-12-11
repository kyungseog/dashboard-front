"use strict";

let roombutton = document.querySelector('#roombutton');
let roomTable = document.querySelector('#room')

roombutton.addEventListener('click', roomsStatus);

async function room() {
  fetch("http://localhost:3000/room", {
    method: "GET"
  })
  .then((res) => {
    console.log(res);
  })
}

//회의실별 예약 현황
async function roomsStatus() {
  let roomData = `
    <tr>
      <td>
        <div class="d-flex px-2">
          <div class="my-auto">
            <h6 class="mb-0 text-align-center text-sm">A</h6>
          </div>
        </div>
      </td>
      <td colspan="4">
        <div class="card">
          <div class="card-body p-2">
            <div class="row">
              <div class="numbers">
                <p class="text-sm mb-0 text-capitalize font-weight-bold">09:00-10:00</p>
                <h5 class="font-weight-bolder mb-0">경영관리 회의</h5>
                <p class="text-success text-sm mb-0 font-weight-bolder">김민성</p>
              </div>
            </div>
          </div>
        </div>
      </td>
      <td></td>
  </tr>`;
  roomTable.innerHTML = roomData; 
};