const noteForm = document.getElementById('noteForm');
const noteIdInput = document.getElementById('noteId');
const judulInput = document.getElementById('judul');
const isiInput = document.getElementById('isi');
const submitButton = document.getElementById('submitButton');
const cancelEditButton = document.getElementById('cancelEdit');
const notesList = document.getElementById('notesList');
const statusText = document.getElementById('status');
const refreshButton = document.getElementById('refreshButton');

const API_URL = '/api/notes';

const setStatus = (message, isError = false) => {
  statusText.textContent = message;
  statusText.style.color = isError ? '#c44536' : '#6d665e';
};

const resetForm = () => {
  noteForm.reset();
  noteIdInput.value = '';
  submitButton.textContent = 'Simpan Catatan';
  cancelEditButton.classList.add('hidden');
};

const formatDate = (dateValue) => {
  const date = new Date(dateValue);
  return date.toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const renderNotes = (notes) => {
  if (!notes.length) {
    notesList.innerHTML = '<div class="empty">Belum ada catatan.</div>';
    return;
  }

  notesList.innerHTML = notes
    .map(
      (note) => `
        <article class="note-item">
          <h3>${note.judul}</h3>
          <p>${note.isi}</p>
          <div class="note-meta">Dibuat: ${formatDate(note.tanggal_dibuat)}</div>
          <div class="note-actions">
            <button type="button" data-action="edit" data-id="${note.id}">Edit</button>
            <button type="button" class="danger" data-action="delete" data-id="${note.id}">Hapus</button>
          </div>
        </article>
      `
    )
    .join('');
};

const fetchNotes = async () => {
  try {
    setStatus('Memuat catatan...');
    const response = await fetch(API_URL);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Gagal memuat catatan');
    }

    renderNotes(result.data || []);
    setStatus('Catatan berhasil dimuat');
  } catch (error) {
    setStatus(error.message, true);
  }
};

const saveNote = async (payload, noteId) => {
  const isEdit = Boolean(noteId);
  const url = isEdit ? `${API_URL}/${noteId}` : API_URL;
  const method = isEdit ? 'PUT' : 'POST';

  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Gagal menyimpan catatan');
  }

  return result;
};

noteForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    judul: judulInput.value.trim(),
    isi: isiInput.value.trim(),
  };
  const noteId = noteIdInput.value;

  if (!payload.judul || !payload.isi) {
    setStatus('Judul dan isi tidak boleh kosong', true);
    return;
  }

  try {
    await saveNote(payload, noteId);
    setStatus(noteId ? 'Catatan berhasil diperbarui' : 'Catatan berhasil ditambahkan');
    resetForm();
    await fetchNotes();
  } catch (error) {
    setStatus(error.message, true);
  }
});

notesList.addEventListener('click', async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const action = target.dataset.action;
  const id = target.dataset.id;
  if (!action || !id) {
    return;
  }

  if (action === 'edit') {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      const note = (result.data || []).find((item) => String(item.id) === id);

      if (!note) {
        setStatus('Catatan tidak ditemukan', true);
        return;
      }

      noteIdInput.value = note.id;
      judulInput.value = note.judul;
      isiInput.value = note.isi;
      submitButton.textContent = 'Update Catatan';
      cancelEditButton.classList.remove('hidden');
      judulInput.focus();
      setStatus(`Mode edit catatan #${note.id}`);
    } catch (error) {
      setStatus('Gagal membuka mode edit', true);
    }
  }

  if (action === 'delete') {
    const confirmed = window.confirm('Yakin ingin menghapus catatan ini?');
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Gagal menghapus catatan');
      }

      setStatus('Catatan berhasil dihapus');
      if (noteIdInput.value === id) {
        resetForm();
      }
      await fetchNotes();
    } catch (error) {
      setStatus(error.message, true);
    }
  }
});

cancelEditButton.addEventListener('click', () => {
  resetForm();
  setStatus('Mode edit dibatalkan');
});

refreshButton.addEventListener('click', fetchNotes);

fetchNotes();