const fs = require("fs");
const Jimp = require("jimp");

// Convert image to array of normalized pixel values
const imageWidth = 50;
const imageHeight = 50;

const CLASSES = ["Dog", "Cat"];

const trainingData = [];
const toPixelData = async function (imgPath) {
  const pixeldata = [];
  console.log(imgPath);
  const image = await Jimp.read(imgPath);
  await image
    .resize(imageWidth, imageHeight)
    .greyscale()
    .invert()
    .scan(0, 0, imageWidth, imageHeight, (x, y, idx) => {
      let v = image.bitmap.data[idx + 0];
      pixeldata.push(v / 255);
    });

  return pixeldata;
};

async function prepareImages() {
  for (const className of CLASSES) {
    const path = `${__dirname}/../images/${className}`;
    const classIndex = CLASSES.indexOf(className);

    const images = fs.readdirSync(path);

    for (const image of images) {
      const imageInPixel = await toPixelData(`${path}/${image}`);
      trainingData.push([imageInPixel, classIndex]);
    }
  }
  console.log(trainingData);
}

prepareImages();
