"use strict"

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render('sign-in')
})

router.get("/sign-in", (req, res) => {
  res.render('sign-in')
})

// router.get("/sign-up", (req, res) => {
//   res.render('sign-up')
// })

router.get("/korea", (req, res) => {
  res.render('korea')
})

router.get("/korea/brand", (req, res) => {
  res.render('korea-brand')
})

router.get("/korea/brand/:id", (req, res) => {
  res.render('korea-brand-detail')
})

router.get("/korea/marketing", (req, res) => {
  res.render('korea-marketing')
})

router.get("/korea/partner", (req, res) => {
  res.render('partner')
})

router.get("/korea/partner/:id", (req, res) => {
  res.render('partner-detail')
})

router.get("/korea/product/:id", (req, res) => {
  res.render('korea-product')
})

router.get("/korea/user", (req, res) => {
  res.render('korea-user')
})

router.get("/japan", (req, res) => {
  res.render('japan')
})

router.get("/live", (req, res) => {
  res.render('live')
})

router.get("/board", (req, res) => {
  res.render('board')
})

router.get("/tables", (req, res) => {
  res.render('tables')
})

router.get("/squad/:id", (req, res) => {
  res.render('squad')
})

module.exports = router;