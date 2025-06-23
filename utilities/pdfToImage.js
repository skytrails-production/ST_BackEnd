const path = require("path");
const fs = require("fs");
const { Poppler } = require("node-poppler");
const poppler = new Poppler();
const convertPdfToImages = async (pdfBuffer) => {
  const tempDir = path.join(__dirname, "../temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const timestamp = Date.now();
  const pdfPath = path.join(tempDir, `input-${timestamp}.pdf`);
  const outputDir = path.join(tempDir, `images-${timestamp}`);
  fs.mkdirSync(outputDir, { recursive: true });

  // Save the PDF buffer to file
  fs.writeFileSync(pdfPath, pdfBuffer);

  // Conversion
  const options = {
    firstPageToConvert: 1,
    lastPageToConvert: 0, // 0 = convert all pages
    pngFile: true,
    // optional — default output resolution is 150 DPI
    resolutionXYAxis: 150,
    // optional — scale long side to this px (e.g. 1024)
    scalePageTo: 1024,
    antialias: "good",
  };

  try {
    const outputTemplate = path.join(outputDir, "page.png");
    const res = await poppler.pdfToCairo(pdfPath, outputTemplate, options);
    console.log("Poppler output:", res);

    const imagePaths = fs
      .readdirSync(outputDir)
      .filter((f) => f.endsWith(".png"))
      .map((f) => path.join(outputDir, f));

    return { imagePaths, outputDir, tempPdfPath: pdfPath };
  } catch (err) {
    console.error("❌ Error during conversion:", err);
    throw err;
  }
};

module.exports = convertPdfToImages;
