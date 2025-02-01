export const fecha = (fechadv: string) => {
  fechadv = new Date().toISOString().split('T')[0];
  return fechadv;
};
