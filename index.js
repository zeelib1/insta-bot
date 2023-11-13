require("dotenv").config();
// const cron = require("node-cron");
const express = require("express");
const path = require("path");

const getImage = require("./imageGenerator");
const compressImage = require("./reduceImage");
const postToInsta = require("./uploadLocalImage");

const app = express();
const port = process.env.PORT || 3000; // Set the port
// Get image from DALLE and download it.
async function main() {
  try {
    // Get image from DALLE and download locally
    await getImage();
    // Reduce image size usage
    await compressImage("./downloadedImage.jpeg", "./compressedImage.jpeg");
    // Post to Instagram
    await postToInsta();
  } catch (error) {
    console.error(error);
  }
}
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "/public")));
// Define a route
app.get("/post-image", async (req, res) => {
  const result = await main();
  res.send(result);
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "path_to_your_html_file.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Schedule the task to run every 30 seconds
// cron.schedule("*/100 * * * * *", main);
