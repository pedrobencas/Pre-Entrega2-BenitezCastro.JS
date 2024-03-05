Uso de JSON y Storage:
Se utilizó JSON para almacenar y recuperar datos del formulario y del estado del modo (diurno/nocturno) en el localStorage.
Se almacenaron los datos del formulario en el localStorage utilizando JSON.stringify() y se recuperaron utilizando JSON.parse() para garantizar la persistencia de los datos entre sesiones del usuario.
Se utilizó el localStorage para almacenar el estado del modo (diurno/nocturno) y recuperarlo al cargar la página.

Modificación del DOM:
Se realizaron modificaciones en el DOM para reflejar el estado del modo (diurno/nocturno) al cargar la página.
Se actualizaron los elementos HTML, como el texto del botón de alternar modo, según el estado del modo almacenado en el localStorage.
Se generaron y mostraron dinámicamente las tablas de amortización y otros elementos HTML con los resultados del procesamiento del simulador.

Detección de eventos de usuario:
Se implementaron eventos de usuario, como clics en botones y envíos de formularios, para activar funciones correspondientes, como alternar el modo diurno/nocturno y realizar el cálculo del préstamo.
Se utilizaron eventos de usuario para detectar interacciones del usuario, como clics en botones, y para realizar acciones específicas, como mostrar u ocultar la tabla de amortización.
