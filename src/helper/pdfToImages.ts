const Poppler = require("pdf-poppler");
import path from "path";
import fs from "fs";
import { getPopplerPath } from "../utils/getPopplerPath";

export async function pdfToImages(pdfPath: string) {
  try {
    console.log("🔍 Cek file di path:", pdfPath);
    if (!fs.existsSync(pdfPath)) {
      console.warn("⚠️ PDF tidak ditemukan:", pdfPath);
      return [];
    }

    // ✅ cek poppler binary ada atau tidak
    const binaryPath = getPopplerPath();
    if (!fs.existsSync(binaryPath)) {
      console.error("❌ Poppler binary tidak ditemukan di:", binaryPath);
      console.error("   Pastikan ada file pdftoppm.exe / pdftoppm di folder poppler/bin/");
      return [];
    }

    const baseName = path.basename(pdfPath, path.extname(pdfPath));
    const outputFolder = path.resolve("public/news/images"); 
    if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder, { recursive: true });

    // Hapus file lama dengan prefix sama
    fs.readdirSync(outputFolder)
      .filter(f => f.startsWith(baseName))
      .forEach(f => fs.unlinkSync(path.join(outputFolder, f)));

    const options = {
      format: "png",
      out_dir: outputFolder,
      out_prefix: baseName,
      page: null,
      dpi: 300,
      binary: binaryPath, // ✅ arahkan ke poppler lokal
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
