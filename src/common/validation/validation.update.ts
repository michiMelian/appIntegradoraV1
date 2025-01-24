//Devuelve true si ya existe el elemento con el mismo nombre en la tabla, ademas del que viene para actualizarse

export function validationUpdate(
  viejo: { name: string; id: number },
  arreglo: Array<{ name: string; id: number }>,
  nuevo: any,
): string | boolean {
  // Validar que el arreglo sea un array
  if (!Array.isArray(arreglo)) {
    return 'Pretende buscar el elemento en un array, pero no es un array';
  }

  // Buscar si existe un elemento con el mismo nombre pero diferente id
  const found = arreglo.some((element) => {
    return element.name === nuevo.name && element.id !== viejo.id;
  });

  return found; // Retorna true o false
}
