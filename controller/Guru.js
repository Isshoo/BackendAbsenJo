import Guru from "../models/GuruModel.js";
import path from "path";
import fs from "fs";
import argon2 from "argon2";


export const getGuru = async (req, res) => {
  try {
    const response = await Guru.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getGuruById = async (req, res) => {
  try {
    const response = await Guru.findOne({
      where: {
        id_guru: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createGuru = async (req, res) => {
  try {
    const {
      No_Daftar,
      NIP,
      nama,
      thnMasuk,
      noHP,
      agama,
      ttl,
      alamat,
      jenis_kelamin,
      
    } = req.body;

    let noDaftar;

    if (!No_Daftar || No_Daftar === "") {
      const maxNoDaftar = await Guru.max("No_daftar");

      if (maxNoDaftar === null) {
        noDaftar = "001";
      } else {
        const nextNoDaftar = (parseInt(maxNoDaftar) + 1)
          .toString()
          .padStart(3, "0");
        noDaftar = nextNoDaftar;
      }
    } else {
      noDaftar = No_Daftar;
    }
    const Passing =  noDaftar + nama.split(" ")[0].toLowerCase();
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
    const url = `${req.protocol}://${req.get("host")}/fotoGuru/${uniqueFileName}`;

    file.mv(`./public/fotoGuru/${uniqueFileName}`, async (err) => {
      if (err) {
        return res.status(500).json({ msg: err.message });
      } else {
        try {
          await Guru.create({
            id_guru : No_Daftar,
            NIP: NIP,
            nama: nama,
            thnMasuk: thnMasuk,
            noHP: noHP,
            agama: agama,
            ttl: ttl,
            alamat: alamat,
            jenis_kelamin: jenis_kelamin,
            url: url,
            role : "Guru",
            file: uniqueFileName,
            username: nama.split(" ")[0].toLowerCase() + noDaftar,
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

export const updateGuru = async (req, res) => {
  try {
    const guru = await Guru.findOne({
      where: {
        id_guru: req.params.id
      }
    });

    if (!guru) {
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    }

    let uniqueFileName = guru.file;
    if (req.files && req.files.file) {
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

      const timestamp = new Date().getTime();
      uniqueFileName = `${timestamp}_${file.md5}${ext}`;

      const filepath = `./public/fotoGuru/${guru.file}`;
      fs.unlinkSync(filepath);

      file.mv(`./public/fotoGuru/${uniqueFileName}`, (err) => {
        if (err) {
          return res.status(500).json({ msg: err.message });
        }
      });
    }

    const url = `${req.protocol}://${req.get("host")}/fotoGuru/${uniqueFileName}`;

    const {
      NIP,
      nama,
      noHP,
      agama,
      ttl,
      alamat,
      jenis_kelamin,
      password
    } = req.body;

    const Passing = guru.id_guru + nama.split(" ")[0].toLowerCase();
    const hashPassword = await argon2.hash(Passing);

    try {
      await guru.update({
        NIP: NIP,
        nama: nama,
        noHP: noHP,
        agama: agama,
        ttl: ttl,
        alamat: alamat,
        jenis_kelamin: jenis_kelamin,
        url: url,
        file: uniqueFileName,
        password: hashPassword
      });
      res.status(200).json({ msg: "Data Guru Berhasil Terupdate" });
    } catch (error) {
      res.status(404).json({ msg: "Data Guru Gagal Terupdate" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};






export const deleteGuru = async (req, res) => {
  try {
    const guru = await Guru.findOne({
      where: {
        id_guru: req.params.id,
      },
    });

    if (!guru) {
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    }
    // Hapus data guru
    await guru.destroy();

    // Hapus gambar terkait
    const filepath = `./public/fotoGuru/${guru.file}`;
    fs.unlinkSync(filepath);

    res.status(200).json({ msg: "Data dan gambar terhapus" });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ msg: "Terjadi kesalahan dalam menghapus data" });
  }
};