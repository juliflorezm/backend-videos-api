const express = require("express");
const {
  postVideo,
  getVideoData,
  displayVideo,
  setLikeVideo,
  findVideosByLabelDesc,
  findVideoByKeyword,
} = require("../controllers/video.controller");
const router = express.Router();

router.post("/video", postVideo);

router.get("/video", getVideoData);

router.get("/video/display", displayVideo);

router.patch("/video/like", setLikeVideo);

router.get("/videos/by_label", findVideosByLabelDesc);

router.get("/videos/by_keyword", findVideoByKeyword);

module.exports = router;
