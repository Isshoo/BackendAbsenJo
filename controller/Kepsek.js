import Kepsek from "../models/KepsekModel.js";
import path from "path";
import fs from "fs";
import argon2 from "argon2";
import { where } from "sequelize";

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
    const { 
      id_kepsek,
     
      NIP,
      nama,
      thnMasuk,
      noHP,
      agama,
      tmptLahir,
      tglLahir,
      status,
      sisaCuti,
      alamat,
      jenis_kelamin, } = req.body;

    let noDaftar;

    if (!id_kepsek || id_kepsek === "") {
      const maxNoDaftar = await Kepsek.max("id_kepsek");

      if (maxNoDaftar === null) {
        noDaftar = "9999";
      } else {
        const nextNoDaftar = (parseInt(maxNoDaftar) + 1)
        
          
        noDaftar = nextNoDaftar;
      }
    } else {
      noDaftar = id_kepsek;
    }
    const Passing = nama.split(" ")[0].toLowerCase() + noDaftar ;
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
            id_kepsek: id_kepsek,
            NIP: NIP,
            nama: nama,
            thnMasuk: thnMasuk,
            noHP: noHP,
            agama: agama,
            tmptLahir: tmptLahir,
            tglLahir : tglLahir,
            status: status,
            sisaCuti: sisaCuti,
            alamat: alamat,
            jenis_kelamin: jenis_kelamin,
            url: url,
            role: "Kepsek",
            file: uniqueFileName,
            username: noDaftar,
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



export const updateKepsek = async (req, res) => {
  try {
    const kepsek = await Kepsek.findOne({
      where: {
        id_kepsek: req.params.id
      }
    });

    if (!kepsek) {
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    }

    

    let uniqueFileName = kepsek.file;
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

      const filepath = `./public/fotoKepsek/${kepsek.file}`;
      fs.unlinkSync(filepath);

      file.mv(`./public/fotoKepsek/${uniqueFileName}`, (err) => {
        if (err) {
          return res.status(500).json({ msg: err.message });
        }
      });
    }

    const url = `${req.protocol}://${req.get("host")}/fotoKepsek/${uniqueFileName}`;

    const {    
      No_Daftar,
      NIP,
      nama,
    
      noHP,
      agama,
      tmptLahir,
      tglLahir,
      status,
      sisaCuti,
      alamat,
      
    } = req.body;

    let noDaftar;

    if (!No_Daftar || No_Daftar === "") {
      const maxNoDaftar = await Kepsek.max("No_daftar");

      if (maxNoDaftar === null) {
        noDaftar = "01";
      } else {
        const nextNoDaftar = (parseInt(maxNoDaftar) + 1)
          .toString()
          .padStart(2, "0");
        noDaftar = nextNoDaftar;
      }
    } else {
      noDaftar = No_Daftar;
    }
    const Passing = nama.split(" ")[0].toLowerCase() + noDaftar ;
    const hashPassword = await argon2.hash(Passing);
    try {
      await kepsek.update({
        NIP: NIP,
        nama: nama,
        noHP: noHP,
        agama: agama,
        tmptLahir: tmptLahir,
            tglLahir : tglLahir,
            status: status,
            sisaCuti: sisaCuti,
        alamat: alamat,
       
        url: url,
        
        password: hashPassword,
      },
   { where : {id_kepsek : req.params.id}
    });
      res.status(200).json({ msg: "Data Kepsek Berhasil Terupdate" });
    } catch (error) {
      res.status(404).json({ msg: "Data Kepsek Gagal Terupdate" });
    }
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