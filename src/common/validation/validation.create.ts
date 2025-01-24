//Devuelve true si ya existe el elemento con el mismo nombre en la tabla

export function validationGlobal(entrada, entradita): string | boolean {
  let found = false;
  if (entradita instanceof Array) {
    entradita.forEach((element) => {
      if (element.name == entrada) {
        found = true;
      }
    });
  } else {
    return 'Pretende buscar el elemento en un array, pero no es un array';
  }
  return found;
}
