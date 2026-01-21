document.addEventListener('DOMContentLoaded', () => {
    
    const navLinks = document.querySelectorAll('.nav-link');
    const mainContent = document.getElementById('app-content');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    const DEFAULT_MODULE = 'home';
    const MODULES_PATH = 'modules/';

    init();

    function init() {
        loadModule(DEFAULT_MODULE);

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const moduleName = link.getAttribute('data-module');
                updateActiveLink(link);
                loadModule(moduleName);
                if (window.innerWidth <= 768) navList.classList.remove('active');
            });
        });

        mobileBtn.addEventListener('click', () => {
            navList.classList.toggle('active');
        });

        // --- DELEGACIÓN DE EVENTOS GLOBAL (Para contenido dinámico) ---
        // Esto soluciona que los botones no funcionen en Legal y Ruta
        mainContent.addEventListener('click', (e) => {
            
            // 1. Lógica Acordeón LEGAL
            if (e.target.closest('.toggle-btn')) {
                const btn = e.target.closest('.toggle-btn');
                const targetId = btn.getAttribute('data-target');
                const content = document.getElementById(targetId);
                
                if (content) {
                    content.classList.toggle('hidden');
                    const icon = btn.querySelector('i');
                    icon.classList.toggle('fa-chevron-down');
                    icon.classList.toggle('fa-chevron-up');
                }
            }

            // 2. Lógica Pestañas CICLOS (Ruta)
            if (e.target.closest('.malla-tab')) {
                const btn = e.target.closest('.malla-tab');
                const cicloId = btn.getAttribute('data-ciclo');
                
                // Resetear Tabs
                document.querySelectorAll('.malla-tab').forEach(t => t.classList.remove('active'));
                btn.classList.add('active');

                // Ocultar todos los selectores de grado y mallas
                document.querySelectorAll('.ciclo-grades-container').forEach(c => c.style.display = 'none');
                document.querySelectorAll('.malla-content-area').forEach(m => m.classList.remove('active'));

                // Mostrar selector de grado correspondiente
                const targetGrades = document.getElementById(cicloId);
                if (targetGrades) targetGrades.style.display = 'flex'; // Flex para alinear botones
            }

            // 3. Lógica Botones GRADOS (Ruta)
            if (e.target.closest('.grade-btn')) {
                const btn = e.target.closest('.grade-btn');
                const meshId = btn.getAttribute('data-mesh');
                
                // Visual activa botón
                const parent = btn.parentElement;
                parent.querySelectorAll('.grade-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Mostrar la Malla Específica
                document.querySelectorAll('.malla-content-area').forEach(m => m.classList.remove('active'));
                const targetMesh = document.getElementById(meshId);
                if (targetMesh) targetMesh.classList.add('active');
            }

            // 4. Lógica Selector Escenario DEMO
            if (e.target.classList.contains('scenario-btn')) {
                const id = e.target.getAttribute('data-view');
                document.querySelectorAll('.scenario-view').forEach(v => v.style.display = 'none');
                document.getElementById(id).style.display = 'block';
                
                document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
    }

    async function loadModule(moduleName) {
        mainContent.innerHTML = `
            <div class="loader-container">
                <div class="loader-eco"></div>
                <p>Cargando ecosistema ECO...</p>
            </div>
        `;

        try {
            const response = await fetch(`${MODULES_PATH}${moduleName}.html`);
            if (!response.ok) throw new Error('Error de carga');
            const htmlContent = await response.text();
            
            mainContent.style.opacity = '0';
            setTimeout(() => {
                mainContent.innerHTML = htmlContent;
                mainContent.style.opacity = '1';
                window.scrollTo(0, 0);
                
                // Si cargamos la demo, intentar iniciar gráfica
                if(moduleName === 'demo') initChart(); 
            }, 200);
        } catch (error) {
            console.error(error);
        }
    }

    function updateActiveLink(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    function initChart() {
        setTimeout(() => {
            const ctx = document.getElementById('chartG5');
            if (ctx && window.Chart) {
                new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Nunca (11.5%)', 'A veces (29.4%)', 'Muchas veces (33.9%)', 'Siempre (25.2%)'],
                        datasets: [{
                            data: [11.5, 29.4, 33.9, 25.2],
                            backgroundColor: ['#C8102E', '#F3C74E', '#00B5AD', '#17334B'],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'right' } }
                    }
                });
            }
        }, 300);
    }
});
