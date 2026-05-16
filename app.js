document.addEventListener('DOMContentLoaded', () => {
    // Envolvemos la URL original en un proxy HTTPS seguro
    //const API_URL = 'https://api.codetabs.com/v1/proxy?quest=http://52.171.58.51:8080/api/cartelera';

    // Ahora consumiremos el archivo que vivirá junto a tu página web
    const API_URL = './cartelera.json';
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