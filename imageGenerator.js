const OpenAI = require("openai");
const downloadImage = require("./downloadImage");
const path = require("path");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAPI_KEY,
});

async function getImage() {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Random cute dog",
      n: 1,
      response_format: "url",
      style: "vivid",
    });
    const imageUrl = response.data[0].url;
    const savePath = path.join(__dirname, "downloadedImage.jpeg");

    const generatedImage = await downloadImage(imageUrl, savePath)
      .then(() => console.log("Image downloaded successfully"))
      .catch((error) => console.error("Error in image download:", error));
    console.log(generatedImage);

    console.log(response.data[0].url);
    return response.data[0].url;
  } catch (error) {
    console.error("Error in getImage:", error);
    return null;
  }
}

module.exports = getImage;
