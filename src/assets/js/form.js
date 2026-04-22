window.initForm = function () {

    const form = document.getElementById('game-form');
    const tableBody = document.getElementById('game-table-body');
    const gameId = document.getElementById('game-id');

    if (!form || !tableBody) return;

    // 🔹 LISTAR
    const fetchGames = async () => {
        const res = await fetch('/api/videojuegos');
        const data = await res.json();

        tableBody.innerHTML = data.map(game => `
            <tr>
                <td>${game.nombre}</td>
                <td>${game.genero}</td>
                <td>${game.anio}</td>
                <td>
                    <button onclick="editGame(${game.id}, '${game.nombre}', '${game.genero}', ${game.anio})">Editar</button>
                    <button onclick="deleteGame(${game.id})">Eliminar</button>
                </td>
            </tr>
        `).join('');
    };

    // 🔥 EDITAR (CARGAR EN FORMULARIO)
    window.editGame = (id, nombre, genero, anio) => {
        gameId.value = id;
        document.getElementById('name').value = nombre;
        document.getElementById('genero').value = genero;
        document.getElementById('anio').value = anio;

        document.getElementById('btn-submit').textContent = "Actualizar";
    };

    // 🔹 SUBMIT (CREAR / ACTUALIZAR)
    form.onsubmit = async (e) => {
        e.preventDefault();

        const id = gameId.value;

        const body = {
            nombre: document.getElementById('name').value,
            genero: document.getElementById('genero').value,
            anio: document.getElementById('anio').value
        };

        await fetch(
            id ? `/api/videojuegos/${id}` : '/api/videojuegos',
            {
                method: id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            }
        );

        form.reset();
        gameId.value = '';
        document.getElementById('btn-submit').textContent = "Guardar Registro";

        fetchGames();
    };

    // 🔹 DELETE
    window.deleteGame = async (id) => {
        await fetch(`/api/videojuegos/${id}`, { method: 'DELETE' });
        fetchGames();
    };

    fetchGames();
};