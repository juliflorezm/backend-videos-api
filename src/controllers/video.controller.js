const multer = require("multer");
const { Readable } = require("stream");
const { GridFSBucket, ObjectId } = require("mongodb");
const db = require("../db/mongoose");
const Video = require("../models/video");
const Label = require("../models/label");

const setStorage = () => multer.memoryStorage();

const setUpload = () => {
  return multer({
    storage: setStorage(),
    fileFilter(request, file, cb) {
      const length = parseInt(request.headers["content-length"]);
      if (
        !file.originalname.match(/\.(mp4|mkv|mov|wmv|avi|avchd|flv|f4v|swf)$/)
      ) {
        cb(new Error("Solo se archivos de video"));
      }

      if (length > 60000000) {
        cb(
          new Error(
            "El video es muy grande, vuelva a intentarlo con uno de menor peso"
          )
        );
      }
      cb(undefined, true);
    },
  });
};

const getBucket = () =>
  new GridFSBucket(db, {
    bucketName: "videws",
  });

const postVideo = async (req, res) => {
  const upload = setUpload();

  upload.single("video")(req, res, async (error) => {
    if (error) {
      return res.status(200).send({ variant: "error", message: error.message });
    }
    const errorMessage = validateValues(req.body);
    if (errorMessage) {
      return res.status(400).send({ variant: "error", message: errorMessage });
    }
    const uploadStream = uploadVideo(req.file);

    const id = uploadStream.id;
    req.body.video_id = id;

    const saved = await saveVideo(req.body);

    uploadStream.on("error", (err) => {
      return res.status(500).send({ variant: "error", message: err.message });
    });

    uploadStream.on("finish", () => {
      return res.status(201).send({ variant: "success", video: saved });
    });
  });
};

const validateValues = (body) => {
  if (!body["title"]) {
    return "El titulo del video es requerido";
  }
  if (!body["author"]) {
    return "El autor es requerido";
  }
  if (!body["label_id"]) {
    return "La que etiqueta del video es requerida";
  }
  return undefined;
};

const uploadVideo = (file) => {
  const readableVideoStream = new Readable();
  readableVideoStream.push(file.buffer);
  readableVideoStream.push(null);

  const bucket = getBucket();

  const fileName = file.fieldname + "-" + Date.now();

  let uploadStream = bucket.openUploadStream(fileName);

  readableVideoStream.pipe(uploadStream);

  return uploadStream;
};

const saveVideo = async (body) => {
  const newVideo = new Video(body);
  try {
    return await newVideo.save();
  } catch (e) {
    res.status(400).send(e);
  }
};

const displayVideo = (req, res) => {
  let video_id = req.query.video_id;

  if (!video_id) {
    return res
      .status(400)
      .send({ variant: "error", message: "El ID del video es requerido" });
  }

  try {
    video_id = new ObjectId(video_id);
  } catch (e) {
    return res
      .status(400)
      .send({ variant: "error", message: "El ID del video es invalido" });
  }

  res.set("content-type", "video/mp4");
  res.set("accept-ranges", "bytes");

  const bucket = getBucket();

  const downloadStream = bucket.openDownloadStream(video_id);

  downloadStream.on("data", (chunk) => {
    res.write(chunk);
  });

  downloadStream.on("error", () => {
    res.send({ variant: "error", message: "Error al mostrar el video" });
  });

  downloadStream.on("end", () => {
    res.end();
  });
};

const getVideoData = async (req, res) => {
  let video_id = req.query.video_id;

  if (!video_id) {
    return res
      .status(400)
      .send({ variant: "error", message: "El ID del video es requerido" });
  }

  try {
    video_id = new ObjectId(video_id);
  } catch (e) {
    return res
      .status(400)
      .send({ variant: "error", message: "El ID del video es invalido" });
  }

  try {
    const found = await Video.findOne({ video_id });
    if (!found) {
      return res
        .status(404)
        .send({ variant: "error", message: "El video no existe" });
    }
    res.send({ variant: "success", video: found });
  } catch (err) {
    return res.status(500).send({ variant: "error", message: err.message });
  }
};

const findVideoByKeyword = async (req, res) => {
  let keyword = req.query.keyword;

  if (!keyword) {
    return res
      .status(400)
      .send({ variant: "error", message: "Se requiere la búsqueda" });
  }

  const regex = /(?!)(\W|$)/;

  var r = new RegExp(regex, "g");

  try {
    const videos = await Video.find({
      title: { $regex: keyword.replace(r, "regex"), $options: "i" },
    });

    res.send({ variant: "success", videos });
  } catch (err) {
    return res.status(500).send({ variant: "error", message: err.message });
  }
};

const setLikeVideo = async (req, res) => {
  let video_id = req.query.video_id;

  if (!video_id) {
    return res
      .status(400)
      .send({ variant: "error", message: "El ID del video es requerido" });
  }

  try {
    video_id = new ObjectId(video_id);
  } catch (e) {
    return res
      .status(400)
      .send({ variant: "error", message: "El ID del video es invalido" });
  }

  try {
    const found = await Video.findOne({ video_id });
    if (!found) {
      return res
        .status(404)
        .send({ variant: "error", message: "El video no existe" });
    }

    let like = JSON.parse(req.query.like);

    found.likes = validateLike(like, found.likes);
    found.save();

    res.send({ variant: "success", likes: found.likes });
  } catch (err) {
    return res.status(400).send({ variant: "error", message: err.message });
  }
};

const findVideosByLabelDesc = async (req, res) => {
  let label_id = req.query.label_id;
  if (!label_id) {
    return res
      .status(400)
      .send({ variant: "error", message: "El ID de la etiqueta es requerido" });
  }

  try {
    label_id = new ObjectId(label_id);
  } catch (e) {
    return res
      .status(400)
      .send({ variant: "error", message: "El ID de la etiqueta es invalido" });
  }

  try {
    const label = await Label.findOne({ _id: label_id });
    if (!label) {
      return res
        .status(400)
        .send({ variant: "error", message: "Etiqueta no encontrada" });
    }
    if (label["name"] === "General") {
      const all = await Video.find().sort({ createdAt: -1 });
      return res.send({ variant: "success", label, videos: all });
    }

    const query = await Video.find({ label_id }).sort({ createdAt: -1 });
    res.send({ variant: "success", label, videos: query });
  } catch (err) {
    return res.status(500).send({ variant: "error", message: err.message });
  }
};

const validateLike = (like, videoLikes) => {
  if (like === true) {
    return videoLikes + 1;
  }
  if (like === false && videoLikes === 0) {
    return videoLikes;
  }
  if (like === false && videoLikes > 0) {
    return videoLikes - 1;
  }
};
module.exports = {
  postVideo,
  displayVideo,
  getVideoData,
  setLikeVideo,
  findVideosByLabelDesc,
  findVideoByKeyword,
};
