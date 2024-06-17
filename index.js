const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");

const drawBoundingBox = (imgWidth, imgHeight, data, context) => {
  const colors = [
    "blue",
    "green",
    "indigo",
    "red",
    "darkorange",
    "magenta",
    "brown",
  ];
  const { predictions } = data;
  predictions.forEach((prediction) => {
    const {
      x,
      y,
      width,
      height,
      class: label,
      class_id,
      confidence,
    } = prediction;
    const topLeftX = x - width / 2;
    const topLeftY = y - height / 2;
    context.strokeStyle = colors[class_id];
    context.lineWidth = (Math.sqrt(imgWidth * imgHeight) / 250) * 2;
    context.strokeRect(topLeftX, topLeftY, width, height);

    const textHeight = (Math.sqrt(imgWidth * imgHeight) / 200) * 2;

    // Calculate text positioning
    const textPadding = (Math.sqrt(imgWidth * imgHeight) / 300) * 10; // Adjust padding as needed
    const textX = topLeftX; // Position text at top-left with padding
    const textY = topLeftY + textPadding; // Position text below top edge with padding

    // Draw text background (consider adjusting based on text dimensions)
    context.fillStyle = colors[class_id];
    context.fillRect(textX, topLeftY, width, textHeight + textPadding); // Draw blue background rectangle

    // Draw class and confidence text
    context.fillStyle = "white";
    const fontSize = (Math.sqrt(imgWidth * imgHeight) / 300) * 11;
    context.font = `${fontSize}px Arial`; // Adjust font size and style as needed
    context.fillText(
      `${label} ${(confidence * 100).toFixed(1)}%`,
      textX,
      textY
    );
  });
};

const getPredictionData = async (via, path) => {
  try {
    if (via === "local") {
      const image = fs.readFileSync(path, {
        encoding: "base64",
      });

      const res = await axios({
        method: "POST",
        url: "https://detect.roboflow.com/bad-forage-v2/1",
        params: {
          api_key: "oQlte7b2JXcLhVMtf196",
        },
        data: image,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = await res.data;
      console.log(data);
      return data;
    } else {
      const res = await axios({
        method: "POST",
        url: "https://detect.roboflow.com/bad-forage-v2/1",
        params: {
          api_key: "oQlte7b2JXcLhVMtf196",
          image: path,
        },
      });

      const data = await res.data;
      console.log(data);
      return data;
    }
  } catch (error) {
    console.error(error.message);
  }
};

const detectPlants = async (via, path) => {
  try {
    const data = await getPredictionData(via, path);

    // Create canvas and load image
    const imgWidth = data.image.width;
    const imgHeight = data.image.height;
    const canvas = createCanvas(imgHeight, imgHeight);
    const context = canvas.getContext("2d");
    const imageData = await loadImage(path);
    context.drawImage(imageData, 0, 0);

    // Draw bounding box(es)
    drawBoundingBox(imgWidth, imgHeight, data, context);

    // Save the image with bounding box
    const buffer = canvas.toBuffer("image/jpeg");
    fs.writeFileSync("./output/output.jpg", buffer);

    console.log("Image with bounding box saved successfully!");
  } catch (error) {
    console.error(error.message);
  }
};

detectPlants(
  "url",
  "https://krishnanursery.in/4655-large_default/variegated-tapioca-plant.jpg"
);
