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

router.get("/profile", (req, res) => {
  res.render('profile')
})

router.get("/billing", (req, res) => {
  res.render('billing')
})

module.exports = router;