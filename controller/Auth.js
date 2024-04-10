import Admin from "../models/AdminModel.js";
import Guru from "../models/GuruModel.js"
import Kepsek from "../models/KepsekModel.js";
import argon2 from "argon2"



export const Login = async (req, res) => {
  try {
    let user = null;

    const admin = await Admin.findOne({
      where: {
        username: req.body.username,
      },
    });

    const guru = await Guru.findOne({
      
      where: {
        username: req.body.username,
      },
    });

    const kepsek = await Kepsek.findOne({
      where : {
        username : req.body.username,
      }
    });


    if (admin || guru || kepsek) {
      user = admin || guru || kepsek;
      const match = await argon2.verify(user.password, req.body.password);
      if (!match) {
        return res.status(400).json({ msg: "Password salah" });
      }
    } else {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    if (user && user.status === "Tidak Aktif") {
      return res.status(403).json({ msg: "Akun Anda sudah tidak aktif" });
    }
    const idUser = user.id_admin || user.id_guru || user.id_kepsek;
    // Berhasil login
    req.session.userId = idUser;
    const { username, role } = user;
    const nama = user.nama;
    const id = user.id_guru || user.id_admin || user.id_kepsek ;
    res.status(200).json({ id, nama, username, role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Terjadi kesalahan dalam proses login" });
  }
};



export const Me = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ msg: "Mohon login ke akun Anda" });
    }

    let user = null;

    const admin = await Admin.findOne({
      where: {
        id_admin: req.session.userId,
      },
    });

    const guru = await Guru.findOne({
      where: {
        id_guru: req.session.userId,
      },
    });

    const kepsek = await Kepsek.findOne({
      where: {
        id_kepsek: req.session.userId,
      },
    });

    if (admin) {
      user = admin;
    } else if (guru) {
      user = guru;
    } else if (kepsek) {
      user = kepsek;
    } 

    if (user) {
      res.status(200).json(user);
    } else {
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    }
  } catch (error) {
    console.error("Terjadi Kesalahan:", error);
    res.status(500).json({
      msg: "Terjadi kesalahan",
    });
  }
};


export const Logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Tidak dapat logout" });
    res.status(200).json({ msg: "logout telah berhasil" });
  });
};