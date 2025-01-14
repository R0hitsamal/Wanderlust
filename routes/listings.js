const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const {isLoggedin, isOwner} = require("../middleware/middleware.js");
const {
  index,
  newGet,
  newPost,
  details,
  editGet,
  editPost,
  deleteListing,
} = require("../controller/listings.js");

const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage : storage});

// Listing
router.get("/", wrapAsync(index));

// new
router.get("/new", isLoggedin, wrapAsync(newGet));
router.post("/", isLoggedin, upload.single("image"), wrapAsync(newPost));

//  upload.single("image"), (req, res) => {
//   res.send(req.file);
// }

// Details
router.get("/:id", wrapAsync(details));

// update
router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(editGet));
router.patch("/:id",isLoggedin,isOwner,upload.single("image"), wrapAsync(editPost));

// Delete
router.delete("/:id", isLoggedin, isOwner, wrapAsync(deleteListing));

module.exports = router;
