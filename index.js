require("dotenv").config();
const cron = require("node-cron");
const express = require("express");
const path = require("path");

const getImage = require("./imageGenerator");
const compressImage = require("./reduceImage");
const postToInsta = require("./uploadLocalImage");
const cors = require("cors");

const app = express();
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000; // Set the port
// Get image from DALLE and download it.
async function main(inputString) {
  try {
    // Get image from DALLE and download locally
    await getImage(inputString);
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Schedule the task to run every hour
// cron.schedule("0 * * * *", main);
// Schedule the task to run every 5 minutes
cron.schedule("*/1 * * * *", main);
