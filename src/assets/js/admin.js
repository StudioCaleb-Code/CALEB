document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.querySelector(".menu-toggle");
    const sidebar = document.querySelector(".sidebar");
    const menuLinks = document.querySelectorAll(".menu-link");
    const mainContainer = document.querySelector(".main");

    // --- 1. SIDEBAR ---
    menuToggle?.addEventListener("click", () => {
        sidebar.classList.toggle("active");
    });

    // --- 2. CARGAR VISTAS (SPA) ---
    const cargarVista = async (url) => {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("No se pudo cargar la vista");
            }

            const html = await response.text();

            mainContainer.innerHTML = html;

            // 🔥 Re-ejecutar scripts dinámicos
            setTimeout(() => {
                window.initForm?.();
            }, 0);

        } catch (error) {
            console.error("Error al cargar vista:", error);
        }
    };

    // --- 3. RESTAURAR VISTA ---
    const currentActive = localStorage.getItem("menuSeleccionado");

    if (currentActive && currentActive !== '/json') {
        menuLinks.forEach(link => {
            if (link.getAttribute("href") === currentActive) {
                link.classList.add("active");
                cargarVista(currentActive);
            }
        });
    }

    // --- 4. CLICK MENÚ ---
    menuLinks.forEach(link => {
        link.addEventListener("click", function (e) {

            const href = this.getAttribute("href");

            // 🔥 CASO JSON (IMPORTANTE)
            if (href === '/json') {
                e.preventDefault();

                localStorage.setItem("menuSeleccionado", href);

                // 👉 abre JSON REAL (no SPA)
                window.location.href = '/api/videojuegos';

                return;
            }

            e.preventDefault();

            localStorage.setItem("menuSeleccionado", href);

            menuLinks.forEach(l => l.classList.remove("active"));
            this.classList.add("active");

            cargarVista(href);

            if (window.innerWidth <= 768) {
                sidebar.classList.remove("active");
            }
        });
    });

});