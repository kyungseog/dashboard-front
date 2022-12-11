"use strict"

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render('sign-in')
})

router.get("/sign-up", (req, res) => {
  res.render('sign-up')
})

router.get("/dashboard", (req, res) => {
  res.render('dashboard')
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

module.exports = router;