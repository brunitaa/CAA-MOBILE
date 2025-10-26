/**
 * Convierte BigInt a string si es necesario
 * (aunque en RN normalmente no recibes BigInt de Prisma directo)
 * @param {any} obj
 * @returns {any}
 */
export function serializeBigInt(obj) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

/**
 * Adjunta URL completa a un pictograma individual
 * @param {object} pictogram
 * @param {string} host
 * @returns {object}
 */
export const attachFullImageUrl = (
  pictogram,
  host = "http://10.0.2.2:4000"
) => {
  if (!pictogram) return null;
  const newPicto = { ...pictogram };
  if (pictogram.image) {
    newPicto.imageUrl = `${host}/uploads/images/${pictogram.image}`;
  } else {
    newPicto.imageUrl = null;
  }
  return newPicto;
};

/**
 * Adjunta URL completa a un array de pictogramas
 * @param {array} pictograms
 * @param {string} host
 * @returns {array}
 */
export const attachFullImageUrlArray = (pictograms, host) =>
  pictograms.map((p) => attachFullImageUrl(p, host));
