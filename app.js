document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://52.171.58.51:8080/api/cartelera';
    const contenedorPeliculas = document.getElementById('contenedor-peliculas');
    const selectUbicacion = document.getElementById('filtro-ubicacion');
    
    // Almacenamos los datos originales aquí para filtrar sin volver a llamar a la API
    let todasLasPeliculas = []; 

    async function cargarCartelera() {
        try {
            const respuesta = await fetch(API_URL);
            
            if (!respuesta.ok) {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }

            // Guardamos los datos en nuestra variable global
            todasLasPeliculas = await respuesta.json();
            
            // Procesamos la información
            generarFiltros(todasLasPeliculas);
            renderizarPeliculas(todasLasPeliculas);

        } catch (error) {
            console.error('Error al cargar la cartelera:', error);
            contenedorPeliculas.innerHTML = `
                <div class="loading">
                    <p>Ocurrió un error al cargar las películas.</p>
                </div>
            `;
        }
    }

    // Nueva función: Extraer ubicaciones y llenar el menú desplegable
    // Nueva función: Extraer ubicaciones y llenar el menú desplegable
    function generarFiltros(peliculas) {
        // 1. Limpiamos cualquier opción previa que tuviera el select en el HTML
        selectUbicacion.innerHTML = '';

        // 2. Creamos y agregamos la opción de "Todas" por defecto al inicio
        const opcionTodas = document.createElement('option');
        opcionTodas.value = 'todas';
        opcionTodas.textContent = '📍 Todas las ubicaciones';
        selectUbicacion.appendChild(opcionTodas);

        // 3. Utilizamos un Set para evitar ciudades duplicadas
        const ubicacionesUnicas = new Set();

        peliculas.forEach(pelicula => {
            if (pelicula.Ubication) {
                const ubiNormalizada = pelicula.Ubication.trim().toUpperCase();
                ubicacionesUnicas.add(ubiNormalizada);
            }
        });

        // 4. Convertimos el Set a Array, lo ordenamos y creamos las demás opciones
        Array.from(ubicacionesUnicas).sort().forEach(ubicacion => {
            const opcionHTML = document.createElement('option');
            opcionHTML.value = ubicacion;
            opcionHTML.textContent = ubicacion;
            selectUbicacion.appendChild(opcionHTML);
        });
    }

    // Evento que escucha cada vez que el usuario cambia la opción en el select
    selectUbicacion.addEventListener('change', (evento) => {
        const ubicacionSeleccionada = evento.target.value;

        if (ubicacionSeleccionada === 'todas') {
            renderizarPeliculas(todasLasPeliculas); // Mostramos todas
        } else {
            // Filtramos el arreglo original
            const peliculasFiltradas = todasLasPeliculas.filter(pelicula => {
                if (!pelicula.Ubication) return false;
                return pelicula.Ubication.trim().toUpperCase() === ubicacionSeleccionada;
            });
            renderizarPeliculas(peliculasFiltradas); // Mostramos solo las filtradas
        }
    });

    function renderizarPeliculas(peliculas) {
        contenedorPeliculas.innerHTML = '';

        if (peliculas.length === 0) {
            contenedorPeliculas.innerHTML = '<p class="loading">No hay películas disponibles en esta ubicación.</p>';
            return;
        }

        peliculas.forEach(pelicula => {
            const titulo = pelicula.Title || 'Título no disponible';
            const imagenUrl = pelicula.Poster || 'https://via.placeholder.com/200x300?text=Sin+Poster';
            const tipo = pelicula.Type || 'Sin clasificación';
            const anio = pelicula.Year || 'N/A';
            const ubicacion = pelicula.Ubication ? pelicula.Ubication.trim().toUpperCase() : 'NO ESPECIFICADA';

            const cardHTML = `
                <article class="movie-card">
                    <img src="${imagenUrl}" alt="Poster de ${titulo}" loading="lazy">
                    <div class="movie-info">
                        <h3 class="movie-title" title="${titulo}">${titulo}</h3>
                        <p class="movie-tags">${tipo} • ${anio}</p>
                        <p style="font-size: 13px; color: #3b82f6; margin-bottom: 12px; font-weight: 500;">
                            📍 ${ubicacion}
                        </p>
                        <button class="btn-comprar">Comprar Boletos</button>
                    </div>
                </article>
            `;

            contenedorPeliculas.innerHTML += cardHTML;
        });
    }

    cargarCartelera();
});