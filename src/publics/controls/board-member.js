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

//임직원 현황
async function showMembers() {
  let memeberHtml = `
    <div class="col-xl-2 col-md-6 mb-xl-0 mb-4">
      <div class="card card-blog card-plain">
        <div class="position-relative">
          <a class="d-block shadow-xl border-radius-xl">
            <img src="../assets/img/member-images/harin.jpg" alt="img-blur-shadow" class="img-fluid shadow border-radius-xl" style="height:15vw; width:100%; object-fit: cover;">
          </a>
        </div>
        <div class="card-body px-1 pb-0">
          <p class="text-gradient text-dark mb-2 text-sm">P&CPart PartLeader</p>
          <h5>김하린</h5>
          <p class="mb-4 text-sm">
            김하린은 안현초등학교 학생입니다
          </p>
        </div>
      </div>
    </div>`;
  roomTable.innerHTML = roomData; 
};