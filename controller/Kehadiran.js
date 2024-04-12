import Kehadiran from "../models/KehadiranModel.js";

function parseAndFormatDateString(dateString) {
  const parsedDate = new Date(dateString);
  const year = parsedDate.getFullYear();
  const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
  const day = parsedDate.getDate().toString().padStart(2, "0");
  const hours = parsedDate.getHours().toString().padStart(2, "0");
  const minutes = parsedDate.getMinutes().toString().padStart(2, "0");
  const seconds = parsedDate.getSeconds().toString().padStart(2, "0");

  return `${day}${month}${year}${hours}${minutes}${seconds}`;
}

export const getKehadiranGuru = async (req, res) => {
  try {
    const response = await Kehadiran.findAll({
      where: {
        id_guru: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ msg: "Data tidak ditemukan" });
  }
};

export const getDataHadirBaru = async (req, res) => {
  try {
    const latestKehadiran = await Kehadiran.findOne({
      where: {
        id_guru: req.params.id,
        keluar: "-", // Data keluar masih "-"
      },
      order: [["createdAt", "DESC"]],
    });

    // Jika data keluar sudah bernilai angka, maka tidak ada data yang ditemukan
    if (!latestKehadiran) {
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    }

    res.status(200).json(latestKehadiran);
  } catch (error) {
    res.status(404).json({ msg: "Data tidak ditemukan" });
  }
};

export const createKehadiran = async (req, res) => {
  const { id_guru } = req.body;
  const timestamp = new Date();
  try {
    await Kehadiran.create({
      id_kehadiran: parseAndFormatDateString(timestamp) + id_guru,
      id_guru: id_guru,
      masuk: parseAndFormatDateString(timestamp),
      keluar: "-",
    });
    res.status(200).json({ msg: "Kehadiran Ditambahkan" });
  } catch (error) {
    res.status(404).json({ msg: "Gagal" });
  }
};

export const updateKehadiran = async (req, res) => {
  const timestamp = new Date();
  const kehadiran = await Kehadiran.findOne({
    where: {
      id_kehadiran: req.params.id,
    },
  });
  if (!kehadiran) {
    return res.status(404).json({ msg: "Kehadiran tidak ditemukan" });
  }
  try {
    await Kehadiran.update(
      {
        keluar: parseAndFormatDateString(timestamp),
      },
      {
        where: {
          id_kehadiran: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "Waktu keluar berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ msg: "Gagal memperbarui waktu keluar" });
  }
};