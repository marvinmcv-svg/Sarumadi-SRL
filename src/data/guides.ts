// Buying guides shown on product pages. Most products in the store have no
// description, so these give every page useful, accurate context about the
// kind of product. General guidance only: no specs that belong to one SKU.
// Keys are the exact `sub` values from products.json; departments are the fallback.

export type Guide = { use: string; tips: string[] };

export const subGuides: Record<string, Guide> = {
  "Bandolas - tesadores y grilletes": {
    use: "Sirven para tensar, sujetar y unir cables, cadenas y eslingas en cercos, toldos, cargas y montajes.",
    tips: ["Elige el diámetro según el cable o la cadena que vas a usar.", "Revisa la carga de trabajo indicada en la pieza y no la superes.", "Para exteriores, prefiere acabado galvanizado o zincado contra la corrosión."],
  },
  "Escuadras o pie de amigo": {
    use: "Soportes metálicos para fijar repisas, estantes y muebles a la pared o reforzar uniones en ángulo.",
    tips: ["Usa tarugos adecuados al tipo de pared (ladrillo, hormigón o drywall).", "Coloca al menos dos escuadras por repisa y nivela antes de apretar.", "El largo de la escuadra debe acompañar la profundidad de la repisa."],
  },
  "Abrazaderas reforzadas": {
    use: "Aseguran mangueras y tubos a sus conexiones para evitar fugas en riego, plomería y vehículos.",
    tips: ["Mide el diámetro exterior de la manguera antes de elegir la medida.", "Aprieta lo justo: el exceso puede cortar la manguera."],
  },
  "Cintas aislantes para ductos industrial y señalizacion": {
    use: "Cintas para aislar empalmes eléctricos, sellar ductos, reparar y señalizar zonas de trabajo.",
    tips: ["La cinta aislante de vinilo es para empalmes eléctricos; la cinta para ductos, para sellar y reparar.", "Aplica sobre superficies limpias y secas para una mejor adherencia.", "Para señalizar pisos y zonas de riesgo, usa cinta de color o de advertencia."],
  },
  Limas: {
    use: "Herramientas para desbastar, afinar y dar forma a metal, madera o plástico, y para afilar herramientas.",
    tips: ["La forma (plana, media caña, redonda) depende de la superficie a trabajar.", "El picado bastardo quita material rápido; el picado fino da el acabado.", "Usa siempre la lima con mango para proteger tu mano."],
  },
  "Navajas - cuter y exactos multiusos": {
    use: "Cortan cartón, alfombra, plástico, drywall y materiales delgados con precisión.",
    tips: ["Cambia o parte la hoja cuando pierda filo: una hoja sin filo es más peligrosa.", "Corta siempre alejando la hoja del cuerpo.", "Retrae la hoja después de cada uso."],
  },
  "Prensas forjadas": {
    use: "Sujetan piezas firmemente mientras se encolan, cortan, perforan o sueldan.",
    tips: ["Elige la apertura según el grosor máximo de las piezas.", "Protege la madera con un taco para que la prensa no la marque."],
  },
  "Linternas de aluminio para cabeza": {
    use: "Iluminación manos libres para trabajos en lugares oscuros, mantenimiento, campamento o emergencias.",
    tips: ["Verifica el tipo de pilas o batería que usa.", "Ajusta la cinta antes de empezar para que no se mueva."],
  },
  "Candados de hierro de maxima y alta seguridad": {
    use: "Protegen portones, rejas, depósitos y cajas de herramientas contra la apertura forzada.",
    tips: ["A mayor ancho de cuerpo, más resistencia: elige según lo que vas a proteger.", "Un arco corto deja menos espacio para palancas o cizallas.", "En exteriores, lubrica el mecanismo de vez en cuando."],
  },
  "Candados cuerpo de acero y alta seguridad": {
    use: "Candados de cuerpo de acero para puntos de alta exigencia como portones, contenedores y bodegas.",
    tips: ["Combínalos con una aldaba o porta candado igual de resistente.", "Guarda una llave de repuesto en un lugar seguro."],
  },
  "Candados anti palanca de alta seguridad": {
    use: "Su diseño protege el arco para dificultar el corte y el apalancamiento; ideales para portones y cortinas metálicas.",
    tips: ["Verifica que el porta candado de tu puerta sea compatible con el formato del candado."],
  },
  "Candados de cable para motos y bicicletas": {
    use: "Cables flexibles con cerradura para asegurar motos, bicicletas y equipos a un punto fijo.",
    tips: ["Pasa el cable por el cuadro y una rueda, y amárralo a un punto que no se pueda desmontar."],
  },
  "Jaladores y perillas para muebles": {
    use: "Tiradores y perillas para puertas y cajones de cocina, roperos y muebles.",
    tips: ["Mide la distancia entre centros de los agujeros antes de reemplazar un jalador.", "Revisa que el tornillo alcance el grosor de la puerta del mueble."],
  },
  "Bisagras para puertas - muebles y cajoneria": {
    use: "Permiten abrir y cerrar puertas de casa o de muebles de forma estable.",
    tips: ["Usa al menos dos bisagras por puerta; tres si es alta o pesada.", "Elige el tamaño según el peso y el grosor de la puerta."],
  },
  Flexometros: {
    use: "Cintas métricas para medir en obra, carpintería, plomería y el hogar.",
    tips: ["Un largo de 5 m cubre la mayoría de los trabajos; 8 m o más para obra.", "El gancho de la punta tiene juego a propósito: compensa su grosor en medidas internas y externas.", "Evita que la cinta regrese de golpe para que dure más."],
  },
  "Llaves de paso": {
    use: "Abren o cortan el paso de agua en una instalación para hacer reparaciones sin cortar toda la red.",
    tips: ["Verifica la medida de la rosca de tu cañería (1/2\", 3/4\"…).", "Las llaves de bola cortan el agua con un cuarto de vuelta.", "Usa cinta teflón en las roscas para evitar fugas."],
  },
  "Llaves finales": {
    use: "Grifos de salida de agua para lavanderías, patios, jardines o lavaplatos.",
    tips: ["Confirma la medida de la rosca de salida en la pared.", "Usa cinta teflón al instalar."],
  },
  "Chicotillos flexibles": {
    use: "Conectan la llave de paso con el grifo, el inodoro o el calefón.",
    tips: ["Mide el largo necesario sin tensar el flexible.", "No lo dobles en ángulos cerrados."],
  },
  "Alicates y juegos": {
    use: "Para sujetar, doblar, cortar alambre y apretar piezas en trabajos eléctricos, mecánicos y del hogar.",
    tips: ["Alicate universal para uso general, de punta para espacios reducidos, de corte para alambre.", "Para trabajos eléctricos usa alicates con mango aislado y trabaja sin tensión."],
  },
  "Desarmadores y en juegos": {
    use: "Destornilladores para apretar y aflojar tornillos en muebles, equipos, electricidad y mecánica.",
    tips: ["Usa la punta exacta (plana, Phillips o torx) y la medida correcta para no barrer el tornillo.", "No uses el desarmador como palanca o cincel.", "Un juego cubre la mayoría de los tornillos de la casa y el taller."],
  },
  "Discos abrasivos para corte y desbaste": {
    use: "Discos para amoladora que cortan o desbastan metal, piedra o cerámica según su tipo.",
    tips: ["El disco debe coincidir con el diámetro de tu amoladora y soportar sus RPM.", "Los discos de corte no se usan de costado para desbastar.", "Usa siempre la guarda, lentes y guantes de seguridad."],
  },
  "Brocas de vidrio": {
    use: "Brocas con punta especial para perforar vidrio, cerámica y azulejo sin quebrarlos.",
    tips: ["Taladra a baja velocidad y sin percusión.", "Mantén la zona húmeda con agua para enfriar la broca.", "Pega cinta de papel encima para que la broca no resbale al iniciar."],
  },
  "Clavadoras y engrapadoras": {
    use: "Fijan grapas o clavos en tapicería, cartón, madera, cables y mallas.",
    tips: ["Revisa el tipo y la medida de grapa compatible con tu engrapadora.", "Nunca apuntes la herramienta hacia una persona."],
  },
  "Aceites y aceiteras flexibles": {
    use: "Lubrican y protegen herramientas, cerraduras, bisagras y mecanismos contra el óxido y el desgaste.",
    tips: ["Limpia la pieza antes de lubricar.", "Una aceitera de pico flexible llega a puntos difíciles."],
  },
  "Llaves allen hexagonal y torx": {
    use: "Llaves para tornillos de cabeza hexagonal o torx en muebles, bicicletas, maquinaria y vehículos.",
    tips: ["Usa la medida exacta para no redondear el tornillo.", "Identifica si tu tornillo usa medidas métricas o en pulgadas."],
  },
  "Pistolas para pintar spray y siliconas": {
    use: "Aplican silicona y selladores, o pintura en spray, de forma pareja y controlada.",
    tips: ["Corta la boquilla del cartucho en diagonal según el grosor de cordón que necesitas.", "Limpia la pistola de pintura al terminar cada uso."],
  },
  "Cajas para herramientas": {
    use: "Organizan y transportan herramientas y accesorios para que no se pierdan ni se dañen.",
    tips: ["Elige el tamaño pensando en tu herramienta más larga.", "Las bandejas internas ayudan a separar piezas pequeñas."],
  },
  Carretillas: {
    use: "Transportan arena, cemento, tierra, escombro y materiales en obra y jardín.",
    tips: ["Revisa la capacidad de la tolva según el trabajo.", "Mantén la llanta con la presión correcta."],
  },
  "Cepillos o cardas": {
    use: "Cepillos de alambre para quitar óxido, pintura vieja y suciedad antes de pintar o soldar.",
    tips: ["Usa lentes de seguridad: pueden saltar partículas y alambres."],
  },
  "Lentes - googles de seguridad": {
    use: "Protegen los ojos de partículas, astillas y salpicaduras al cortar, esmerilar, perforar o limpiar.",
    tips: ["Los googles cierran mejor contra polvo y salpicaduras; los lentes son más livianos.", "Para exteriores, elige mica oscura; para interiores, transparente.", "Cámbialos si la mica está rayada y no ves con claridad."],
  },
  "Seguridad industrial": {
    use: "Equipo de protección personal para trabajar con menos riesgo en obra, taller e industria.",
    tips: ["Usa la protección adecuada a cada tarea: ojos, manos, oídos y vías respiratorias."],
  },
  "Articulos de limpieza domestico e industrial": {
    use: "Escobas, cepillos, trapeadores y accesorios para limpiar la casa, el negocio o la industria.",
    tips: ["Separa los utensilios del baño de los de la cocina."],
  },
  "Paneles y ganchos": {
    use: "Paneles y ganchos para colgar y ordenar herramientas en la pared del taller o del negocio.",
    tips: ["Fija el panel con tarugos adecuados al tipo de pared y al peso que vas a colgar."],
  },
};

export const deptGuides: Record<string, Guide> = {
  "herramientas-mecanicas": {
    use: "Herramienta manual, eléctrica y accesorios para el taller, la obra, el vehículo y el hogar.",
    tips: ["Elige la herramienta por el trabajo que harás más seguido.", "Usa lentes y guantes al cortar, perforar o esmerilar.", "Guarda las herramientas limpias y secas para que no se oxiden."],
  },
  carpinteria: {
    use: "Herramientas y accesorios para medir, cortar, ajustar y armar piezas de madera y otros materiales.",
    tips: ["Mide dos veces y corta una.", "Una herramienta con filo trabaja mejor y es más segura que una desafilada."],
  },
  construccion: {
    use: "Herramientas para medir, nivelar, demoler y dar acabado en obra.",
    tips: ["Verifica tus niveles y escuadras de vez en cuando sobre una superficie conocida.", "Limpia el cemento de las herramientas antes de que fragüe."],
  },
  cerrajeria: {
    use: "Candados, cerraduras, bisagras y herrajes para asegurar y equipar puertas, portones y muebles.",
    tips: ["La seguridad depende del punto más débil: candado, aldaba y puerta deben ser igual de firmes.", "Lubrica las cerraduras con grafito o un lubricante seco."],
  },
  "acero-y-fijacion": {
    use: "Piezas de acero y fijación para sujetar, colgar, tensar y reforzar en la casa, la obra o la industria.",
    tips: ["El tarugo y el tornillo deben corresponder al tipo de pared y al peso.", "En exteriores, prefiere acabados galvanizados."],
  },
  plomeria: {
    use: "Grifería, llaves y accesorios para instalaciones de agua en baño, cocina, lavandería y jardín.",
    tips: ["Corta el agua antes de cualquier cambio.", "Confirma la medida de la rosca y usa cinta teflón.", "Para instalaciones de gas, acude a un profesional."],
  },
  electricidad: {
    use: "Accesorios eléctricos, iluminación y conexiones para la casa y el negocio.",
    tips: ["Corta la energía en el tablero antes de instalar o reparar.", "Respeta la potencia máxima de enchufes, extensiones y adaptadores.", "Para instalaciones nuevas o tableros, acude a un electricista."],
  },
  seguridad: {
    use: "Equipo de protección personal: lentes, guantes y accesorios para trabajar con menos riesgo.",
    tips: ["Usa la protección adecuada para cada tarea y cámbiala cuando esté gastada."],
  },
  jardineria: {
    use: "Herramientas y accesorios de riego para cuidar el jardín, el huerto y las áreas verdes.",
    tips: ["Riega temprano o al atardecer para que el agua se aproveche mejor.", "Limpia y seca las herramientas de corte después de usarlas."],
  },
  neumatica: {
    use: "Compresores, pistolas de aire y accesorios para pintar, inflar, limpiar y trabajar con aire comprimido.",
    tips: ["Revisa que la presión del compresor alcance la que pide la herramienta.", "Drena el agua del tanque del compresor con regularidad."],
  },
  limpieza: {
    use: "Artículos para la limpieza del hogar, el negocio y la industria.",
    tips: ["Enjuaga y seca los utensilios después de usarlos para que duren más."],
  },
  "mas-soluciones": {
    use: "Productos prácticos para la casa, el auto, el taller y el día a día.",
    tips: ["¿Dudas sobre para qué sirve? Pregúntale al asistente o escríbenos por WhatsApp."],
  },
};

export const guideFor = (dept: string, sub: string | null): Guide | undefined => (sub && subGuides[sub]) || deptGuides[dept];
