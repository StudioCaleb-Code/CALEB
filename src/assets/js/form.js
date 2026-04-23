window.initForm = function () {

    const form = document.getElementById('proveedor-form');
    const proveedorId = document.getElementById('proveedor-id');

    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();

        const id = proveedorId.value;

        const body = {
            nombre: document.getElementById('name').value,
            descripcion: document.getElementById('descripcion').value,
        };

        await fetch(
            id ? `/api/proveedor/${id}` : '/api/proveedor',
            {
                method: id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            }
        );

        form.reset();

        // 🔥 cerrar modal
        window.closeModal?.();

        // 🔥 refrescar tabla
        window.fetchproveedors?.();
    };
};