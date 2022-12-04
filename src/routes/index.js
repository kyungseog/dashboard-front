"use strict"

const express = require("express");
const router = express.Router();

const Rooms = require("../models/Rooms");

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

router.get("/room", (req, res) => {
  res.render('room')
})

router.get("/tables", (req, res) => {
  res.render('tables')
})

router.get("/roomsStatus", async (req, res) => {
  const rooms = new Rooms();
  console.log(rooms)
  const response = await rooms.roomsStatus();
  return res.json(response);
})

module.exports = router;