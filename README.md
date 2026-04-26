Reglas del Juego y Lógica Reglas del Juego y Lógica de Victoria
El juego funciona bajo un sistema de gestión de recursos y un contador de progreso:

Interacciones de Cuidado: Cada vez que alimentas, juegas o limpias a tu mascota, el sistema registra una "interacción buena".

Contador de Victoria: Internamente, el código lleva la cuenta de estas acciones mediante la variable careCounter.

Condición de Éxito: Al alcanzar las 20 interacciones, el juego se detiene automáticamente y despliega un letrero de victoria que dice: "¡Has cuidado bien al perro!".

Estado de Supervivencia: Para ganar, debes ser rápido; si el hambre o la energía llegan a 0, la salud bajará cada 2 segundos. Si la salud llega a 0 antes de las 20 interacciones, aparecerá el letrero de "Game Over" en lugar del de victoria.

Reinicio: En ambos casos (victoria o derrota), aparecerá un botón para Volver a Jugar, el cual restaura todas las estadísticas y reinicia el contador a cero.
