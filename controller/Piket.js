import Piket from "../models/PiketModel.js";
import Guru from "../models/GuruModel.js";

// Function to generate unique id for piket
const generateIdPiket = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const createPiket = async (req, res) => {
  try {
    const { id_guru, tanggal, keterangan } = req.body;

    const guru = await Guru.findOne({
      where: {
        id_guru: id_guru
      }
    });

    if (!guru) {
      return res.status(404).json({ msg: "Guru tidak ditemukan" });
    }

    const newPiket = await Piket.create({
      id_piket: generateIdPiket(),
      id_guru: id_guru,
      tanggal: tanggal,
      keterangan: keterangan
    });

    res.status(201).json({ msg: "Jadwal piket berhasil dibuat", data: newPiket });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updatePiket = async (req, res) => {
  try {
    const { id_guru, tanggal, keterangan } = req.body;

    const piket = await Piket.findOne({
      where: {
        id_piket: req.params.id
      }
    });

    if (!piket) {
      return res.status(404).json({ msg: "Jadwal piket tidak ditemukan" });
    }

    await Piket.update({
      id_guru: id_guru,
      tanggal: tanggal,
      keterangan: keterangan
    }, {
      where: {
        id_piket: req.params.id
      }
    });

    res.status(200).json({ msg: "Jadwal piket berhasil diupdate" });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getPiket = async (req, res) => {
  try {
    const allPiket = await Piket.findAll();
    res.status(200).json(allPiket);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getPiketById = async (req, res) => {
  try {
    const piket = await Piket.findOne({
      where: {
        id_piket: req.params.id
      }
    });

    if (!piket) {
      return res.status(404).json({ msg: "Jadwal piket tidak ditemukan" });
    }

    res.status(200).json(piket);

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
