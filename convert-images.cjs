const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// carpetas donde están las imágenes
const folders = [
  "public/images/modelos",
  "public/images/proyectos",
  "public/images"
];

// extensiones que queremos convertir
const validExtensions = [".png", ".jpg", ".jpeg"];

async function convertImages(folder) {

  const files = fs.readdirSync(folder);

  for (const file of files) {

    const ext = path.extname(file).toLowerCase();

    if (!validExtensions.includes(ext)) continue;

    const inputPath = path.join(folder, file);
    const outputPath = path.join(
      folder,
      path.basename(file, ext) + ".webp"
    );

    try {

      await sharp(inputPath)
        .webp({ quality: 85 })
        .toFile(outputPath);

      console.log("Convertido:", outputPath);

    } catch (error) {

      console.log("Error con:", inputPath);

    }
  }
}

// ejecutar conversión
folders.forEach(folder => {
  if (fs.existsSync(folder)) {
    convertImages(folder);
  }
});
