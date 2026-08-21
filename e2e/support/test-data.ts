export const API_BASE = 'http://127.0.0.1:8082/api/v2';

// Grupo real validado manualmente con alumnos Diana Lazo y Brayan Ferreira
export const TEST_GROUP = {
  categoria: 'Recreativo',
  curso: 'ping pong',
  anio: 2026,
  iterable: 1,
};

// Categoría creada y destruida automáticamente en test 03
export const TEST_CATEGORIA = 'CategoriaPlaywrightE2E';

// Datos base del instructor de prueba.
// `correo` se genera dinámicamente con Date.now() en el spec para que cada ejecución
// de CI use un correo único — evita 409 por correo ya registrado en runs anteriores.
export const TEST_INSTRUCTOR_BASE = {
  nombre: 'Instructor Playwright E2E',
  tipoId: 'CC',
  id: '9999999901',
  sexo: 'M',
  alumnoCodigo: 'PLW001',
};
