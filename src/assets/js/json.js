async function cargarJSON() {
    try {
        const res = await fetch('/api/proveedor');
        const data = await res.json();

        const contenedor = document.getElementById('jsonContainer');

        // 🔥 Mostrar bonito (formateado)
        contenedor.textContent = JSON.stringify(data, null, 2);

    } catch (error) {
        console.error(error);
        document.getElementById('jsonContainer').textContent = 'Error al cargar datos';
    }
}

// Ejecutar
cargarJSON();