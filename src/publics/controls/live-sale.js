'use strict'

const salesData = document.getElementById("sales_data");
const productsData = document.getElementById("products_data");

const salesHtml = `<div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
<div class="card">
  <div class="card-body p-3">
    <div class="row">
      <div class="col-8">
        <div class="numbers">
          <p class="text-sm mb-0 text-capitalize font-weight-bold">Today's Money</p>
          <h5 class="font-weight-bolder mb-0">
            $53,000
            <span class="text-success text-sm font-weight-bolder">+55%</span>
          </h5>
        </div>
      </div>
      <div class="col-4 text-end">
        <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
          <i class="ni ni-money-coins text-lg opacity-10" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  </div>
</div>
</div>`

const productHtml = `<div class="col-xl-3 col-md-6 mb-xl-0 mb-4">
<div class="card card-blog card-plain">
  <div class="position-relative">
    <a class="d-block shadow-xl border-radius-xl">
      <img src="../assets/img/home-decor-1.jpg" alt="img-blur-shadow" class="img-fluid shadow border-radius-xl" style="height:15vw; width:100%; object-fit: cover;">
    </a>
  </div>
  <div class="card-body px-1 pb-0">
    <p class="text-gradient text-dark mb-2 text-sm">Product #1</p>
    <a href="javascript:;">
      <h5>
        Modern
      </h5>
    </a>
    <p class="mb-4 text-sm">
      As Uber works through a huge amount of internal management turmoil.
    </p>
    <div class="d-flex align-items-center justify-content-between">
      <button type="button" class="btn btn-outline-primary btn-sm mb-0">View Option</button>
    </div>
  </div>
</div>
</div>`

salesData.innerHTML = salesHtml;
productsData.innerHTML = productHtml;