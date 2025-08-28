const Poppler = require("pdf-poppler");
import path from "path";
import fs from "fs";

export async function pdfToImages(pdfPath: string) {
  try {
    console.log("🔍 Cek file di path:", pdfPath);
    if (!fs.existsSync(pdfPath)) {
      console.warn("⚠️ PDF tidak ditemukan:", pdfPath);
      return [];
    }

    const baseName = path.basename(pdfPath, path.extname(pdfPath));
    const outputFolder = path.resolve("public/news/images"); 
    if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder, { recursive: true });

    // Hapus file lama
    fs.readdirSync(outputFolder)
      .filter(f => f.startsWith(baseName))
      .forEach(f => fs.unlinkSync(path.join(outputFolder, f)));

    const options = {
      format: "png",
      out_dir: outputFolder,
      out_prefix: baseName,
      page: null,
      dpi: 300, 
    };

    await Poppler.convert(pdfPath, options);

    const files = fs.readdirSync(outputFolder)
      .filter(f => f.startsWith(baseName))
      .map(f => `/news/images/${f}`);

    console.log("✅ Total halaman ter-convert:", files.length);
    return files;
  } catch (err: any) {
    console.error("❌ Error pdfToImages:", err.message);
    return [];
  }
}
