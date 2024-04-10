import Kepsek from "../models/KepsekModel.js";
import path from "path";
import fs from "fs";
import argon2 from "argon2";

export const getKepsek = async (req, res) => {
  try {
    const response = await Kepsek.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getKepsekbyId = async (req, res) => {
  try {
    const response = await Kepsek.findOne({
      where: {
        id_kepsek: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createKepsek = async (req, res) => {
  try {
    const { No_daftar, NIP, nama, ttl, alamat, jenis_kelamin } = req.body;

    let noDaftar;

    if (!No_daftar || No_daftar === "") {
      const maxNoDaftar = await Kepsek.max("No_daftar");

      if (maxNoDaftar === null) {
        noDaftar = "001";
      } else {
        const nextNoDaftar = (parseInt(maxNoDaftar) + 1)
          .toString()
          .padStart(3, "0");
        noDaftar = nextNoDaftar;
      }
    } else {
      noDaftar = No_daftar;
    }
    const Passing = nama.split(" ")[0].toLowerCase() + NIP.slice(-3) + noDaftar;
    const hashPassword = await argon2.hash(Passing);

    if (!req.files || !req.files.file) {
      return res.status(400).json({ msg: "Tidak Ada File Dipilih" });
    }

    const file = req.files.file;
    const fileSize = file.size;
    const ext = path.extname(file.name);
    const allowedTypes = [".png", ".jpg", ".jpeg"];

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
    )}/fotoKepsek/${uniqueFileName}`;

    file.mv(`./public/fotoKepsek/${uniqueFileName}`, async (err) => {
      if (err) {
        return res.status(500).json({ msg: err.message });
      } else {
        try {
          await Kepsek.create({
            id_kepsek: NIP,
            NIP: NIP,
            nama: nama,
            ttl: ttl,
            alamat: alamat,
            jenis_kelamin: jenis_kelamin,
            url: url,
            role: "Kepsek",
            file: uniqueFileName,
            username: NIP.slice(-3) + noDaftar,
            password: hashPassword,
          });
          res.status(200).json({ msg: "File Berhasil Terupload" });
        } catch (error) {
          res.status(404).json({ msg: "File Gagal Terupload" });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteKepsek = async (req, res) => {
  try {
    const kepsek = await Kepsek.findOne({
      where: {
        id_kepsek: req.params.id,
      },
    });

    if (!kepsek) {
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    }
    // Hapus data atlet
    await kepsek.destroy();

    // Hapus gambar terkait
    const filepath = `./public/fotoKepsek/${kepsek.file}`;
    fs.unlinkSync(filepath);

    res.status(200).json({ msg: "Data dan gambar terhapus" });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ msg: "Terjadi kesalahan dalam menghapus data" });
  }
};