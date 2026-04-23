document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.querySelector(".menu-toggle");
    const sidebar = document.querySelector(".sidebar");
    const menuLinks = document.querySelectorAll(".menu-link");
    const mainContainer = document.querySelector(".main");

    // --- FUNCIONES ---
    const abrirMenu = () => {
        sidebar.classList.add("active");
        document.body.classList.add("menu-open");
    };

    const cerrarMenu = () => {
        sidebar.classList.remove("active");
        document.body.classList.remove("menu-open");
    };

    // --- 1. TOGGLE SIDEBAR ---
    menuToggle?.addEventListener("click", (e) => {
        e.stopPropagation();

        if (sidebar.classList.contains("active")) {
            cerrarMenu();
        } else {
            abrirMenu();
        }
    });

    // --- 2. CERRAR AL HACER CLICK AFUERA ---
    document.addEventListener("click", (e) => {
        if (
            sidebar.classList.contains("active") &&
            !sidebar.contains(e.target) &&
            !menuToggle.contains(e.target)
        ) {
            cerrarMenu();
        }
    });

    // --- 3. CARGAR VISTAS (SPA) ---
    const cargarVista = async (url) => {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("No se pudo cargar la vista");
            }

            const html = await response.text();

            mainContainer.innerHTML = html;

            // 🔥 re-ejecutar scripts dinámicos
            setTimeout(() => {
                window.initForm?.();
                window.initListado?.();
            }, 0);

        } catch (error) {
            console.error("Error al cargar vista:", error);
        }
    };

    // --- 4. RESTAURAR VISTA ---
    const currentActive = localStorage.getItem("menuSeleccionado");

    if (currentActive) {
        menuLinks.forEach(link => {
            if (link.getAttribute("href") === currentActive) {
                link.classList.add("active");

                // 🔥 SETTING ahora carga listado
                if (currentActive === '/form') {
                    cargarVista('/listado');
                } else {
                    cargarVista(currentActive);
                }
            }
        });
    }

    // --- 5. CLICK MENÚ ---
    menuLinks.forEach(link => {
        link.addEventListener("click", function (e) {

            const href = this.getAttribute("href");

            e.preventDefault();

            localStorage.setItem("menuSeleccionado", href);

            menuLinks.forEach(l => l.classList.remove("active"));
            this.classList.add("active");

            // 🔥 SETTING → listado
            if (href === '/form') {
                cargarVista('/listado');
            } else {
                cargarVista(href);
            }

            // 🔥 cerrar menú en móvil SIEMPRE
            if (window.innerWidth <= 768) {
                cerrarMenu();
            }
        });
    });

});