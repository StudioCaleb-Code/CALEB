// 🔹 LISTAR
window.fetchproveedors = async () => {

    const tableBody = document.getElementById('proveedor-table-body');
    if (!tableBody) return;

    const res = await fetch('/api/proveedor');
    const data = await res.json();
    tableBody.innerHTML = data.map(p => `
    <tr>
        <td data-label="ID">${p.id_proveedor}</td>
        <td data-label="Nombre">${p.nombre}</td>
        <td data-label="Descripción">${p.descripcion}</td>
        <td data-label="Acciones" class="td-btn">
            <button class="btn-modal editar" onclick="editproveedor(${p.id_proveedor}, '${p.nombre}', '${p.descripcion}')">
                <i class="bi bi-highlighter"></i>
            </button>
            <button class="btn-modal borrar" onclick="deleteproveedor(${p.id_proveedor})">
                <i class="bi bi-eraser"></i>
            </button>
        </td>
    </tr>
    `).join('');
};

// 🔥 ABRIR MODAL
const abrirModal = (html) => {

    const modal = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');

    if (!modal || !modalContent) {
        console.error("❌ Modal no encontrado");
        return;
    }

    modalContent.innerHTML = html;
    modal.classList.add('active');

    setTimeout(() => {
        window.initForm?.();
    }, 0);
};

// 🔥 CERRAR MODAL
window.closeModal = () => {
    const modal = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');

    if (!modal) return;

    modal.classList.remove('active');
    modalContent.innerHTML = '';
};

// 🔥 CLICK FUERA DEL MODAL
document.addEventListener('click', (e) => {
    const modal = document.getElementById('modal-overlay');

    if (!modal) return;

    if (e.target.id === 'modal-overlay') {
        window.closeModal();
    }
});

// 🔥 CREAR
window.abrirForm = () => {
    fetch('/form')
        .then(res => res.text())
        .then(html => abrirModal(html));
};

// 🔥 EDITAR
window.editproveedor = (id, nombre, descripcion) => {

    fetch('/form')
        .then(res => res.text())
        .then(html => {
            abrirModal(html);

            setTimeout(() => {
                document.getElementById('proveedor-id').value = id;
                document.getElementById('name').value = nombre;
                document.getElementById('descripcion').value = descripcion;

                document.getElementById('btn-submit').textContent = "Actualizar";
            }, 50);
        });
};

// 🔹 DELETE
window.deleteproveedor = async (id) => {
    if (!confirm("¿Eliminar proveedor?")) return;

    await fetch(`/api/proveedor/${id}`, { method: 'DELETE' });
    fetchproveedors();
};

// 🔥 INIT
window.initListado = () => {
    fetchproveedors();
};