require("dotenv").config();

const express = require("express");
const getImage = require("./imageGenerator");
const { IgApiClient } = require("instagram-private-api");
const fs = require("fs").promises; // Add this line

const postToInsta = async () => {
  try {
    const ig = new IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    const url = await getImage().then((data) => data);

    // Replace the URL fetching with local file reading
    const imageBuffer = await fs.readFile("./compressedImage.jpeg");

    await ig.publish.photo({
      file: imageBuffer,
      caption: "Wow, what a nice pic!",
    });

    // After successful upload, delete the images
    await fs.unlink("./downloadedImage.jpeg");
    await fs.unlink("./compressedImage.jpeg");
    console.log("Temporary files deleted successfully.");
  } catch (error) {
    console.log(error);
  }
};

module.exports = postToInsta;
