const Note = require('../models/note');

const getAllNotes = async (_req, res) => {
  try {
    const notes = await Note.findAll({
      order: [['tanggal_dibuat', 'DESC']],
    });

    return res.status(200).json({
      message: 'Daftar catatan berhasil diambil',
      data: notes,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal mengambil catatan',
      error: error.message,
    });
  }
};

const createNote = async (req, res) => {
  try {
    const { judul, isi } = req.body;

    if (!judul || !isi) {
      return res.status(400).json({
        message: 'Field judul dan isi wajib diisi',
      });
    }

    const newNote = await Note.create({ judul, isi });

    return res.status(201).json({
      message: 'Catatan berhasil dibuat',
      data: newNote,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal membuat catatan',
      error: error.message,
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, isi } = req.body;

    const note = await Note.findByPk(id);
    if (!note) {
      return res.status(404).json({
        message: 'Catatan tidak ditemukan',
      });
    }

    if (!judul || !isi) {
      return res.status(400).json({
        message: 'Field judul dan isi wajib diisi',
      });
    }

    await note.update({ judul, isi });

    return res.status(200).json({
      message: 'Catatan berhasil diperbarui',
      data: note,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal memperbarui catatan',
      error: error.message,
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findByPk(id);
    if (!note) {
      return res.status(404).json({
        message: 'Catatan tidak ditemukan',
      });
    }

    await note.destroy();

    return res.status(200).json({
      message: 'Catatan berhasil dihapus',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal menghapus catatan',
      error: error.message,
    });
  }
};

module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
};