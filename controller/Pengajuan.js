import Pengajuan from "../models/PengajuanModel.js";
import path from "path";
import fs from "fs";

export const getPengajuan = async (req, res) => {
  try {
    const response = await Pengajuan.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ msg: "Data Tidak ditemukan" });
  }
};

export const getPengajuanbyGuru = async (req, res) => {
  try {
    const response = await Pengajuan.findAll({
      where: {
        id_guru: req.params.idguru,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ msg: "Data Tidak ditemukan" });
  }
};

export const createPengajuan = async (req, res) => {
  try {
    const { id_guru, keterangan, tanggal, jenis } = req.body;

    if (!req.files || !req.files.file) {
      return res.status(400).json({ msg: "Tidak Ada File Dipilih" });
    }

    const file = req.files.file;
    const fileSize = file.size;
    const ext = path.extname(file.name);
    const allowedTypes = [".png", ".jpg", ".jpeg", ".docx", ".pdf", ".doc"];

    if (!allowedTypes.includes(ext.toLowerCase())) {
      return res.status(422).json({ msg: "Format Tidak Mendukung" });
    }

    if (fileSize > 5000000) {
      return res.status(422).json({ msg: "File Tidak Bisa Lebih Dari 5 MB" });
    }
    const timestamp = new Date().getTime(); // Waktu saat ini sebagai timestamp
    const uniqueFileName = `${timestamp}_${file.md5}${ext}`; // Menggabungkan timestamp dan nama file yang unik
    const url = `${req.protocol}://${req.get(
      "host"
    )}/filePengajuan/${uniqueFileName}`;

    file.mv(`./public/filePengajuan/${uniqueFileName}`, async (err) => {
      if (err) {
        return res.status(500).json({ msg: err.message });
      } else {
        try {
          await Pengajuan.create({
            id_guru: id_guru,
            keterangan: keterangan,
            tanggal: tanggal,
            jenis: jenis,
            url: url,
            file: uniqueFileName,
          });
          res.status(200).json({ msg: "File Berhasil Terupload" });
        } catch (error) {
          res.status(404).json({ msg: "File Gagal Terupload" });
        }
      }
    });
  } catch (error) {
    res.status(404).json({ msg: "Gagal Terupload" });
  }
};