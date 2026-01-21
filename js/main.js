/* ==========================================================================
   ARCHIVO: js/main.js
   DESCRIPCIÓN: Controlador principal de navegación (SPA)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- REFERENCIAS DOM ---
    const navLinks = document.querySelectorAll('.nav-link');
    const mainContent = document.getElementById('app-content');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');

    // --- CONFIGURACIÓN ---
    const DEFAULT_MODULE = 'home';
    const MODULES_PATH = 'modules/';

    // --- INICIALIZACIÓN ---
    init();

    function init() {
        // 1. Cargar módulo inicial (Home)
        loadModule(DEFAULT_MODULE);

        // 2. Event Listeners para navegación
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Evitar recarga de página
                const moduleName = link.getAttribute('data-module');
                
                // Actualizar clase activa en menú
                updateActiveLink(link);
                
                // Cargar contenido
                loadModule(moduleName);

                // Cerrar menú móvil si está abierto
                if (window.innerWidth <= 768) {
                    navList.classList.remove('active');
                }
            });
        });

        // 3. Menú Móvil
        mobileBtn.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
    }

    /**
     * Carga dinámica de módulos HTML
     * @param {string} moduleName - Nombre del archivo sin extensión
     */
    async function loadModule(moduleName) {
        // Mostrar Loader
        mainContent.innerHTML = `
            <div class="loader-container">
                <div class="loader-eco"></div>
                <p>Cargando contenido...</p>
            </div>
        `;

        try {
            // Fetch del archivo HTML
            const response = await fetch(`${MODULES_PATH}${moduleName}.html`);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: No se encontró el módulo`);
            }

            const htmlContent = await response.text();

            // Inyectar HTML (Efecto Fade-in)
            mainContent.style.opacity = '0';
            
            setTimeout(() => {
                mainContent.innerHTML = htmlContent;
                mainContent.style.opacity = '1';
                
                // Reinicializar scripts si el módulo tiene lógica específica (ej. Pestañas)
                // En este caso simple, los scripts inline funcionan al inyectarse, 
                // pero si usáramos frameworks, aquí reinicializaríamos componentes.
                window.scrollTo(0, 0); // Volver arriba
            }, 200);

        } catch (error) {
            console.error('Error cargando módulo:', error);
            mainContent.innerHTML = `
                <div class="content-container text-center">
                    <h3><i class="fa-solid fa-triangle-exclamation"></i> Error de Carga</h3>
                    <p>No pudimos cargar la sección solicitada. Por favor intenta de nuevo.</p>
                    <button class="btn" onclick="location.reload()">Recargar Página</button>
                </div>
            `;
        }
    }

    /**
     * Actualiza el estado visual del menú
     */
    function updateActiveLink(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

});
