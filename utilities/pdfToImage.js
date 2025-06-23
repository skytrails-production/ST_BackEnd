const path = require("path");
const fs = require("fs");
const PdfConverter = require("pdf-poppler");

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
    format: "png",
    out_dir: outputDir,
    out_prefix: "page",
    scale: 1024,
  };

  try {
    await PdfConverter.convert(pdfPath, options);

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
        