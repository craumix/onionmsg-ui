export function rndColorFromString(text: string): string {
  return HSBtoRGBHex(stringHash(text) % 361, 75, 75);
}

function stringHash(text: string): number {
  var hash = 0,
    i,
    chr;
  if (text.length === 0) return hash;
  for (i = 0; i < text.length; i++) {
    chr = text.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }

  if (hash < 0) hash *= -1;

  return hash;
}

//H: [0, 360], S: [0, 100], B: [0, 100].
function HSBtoRGBHex(h: number, s: number, b: number): string {
  s /= 100;
  b /= 100;
  const k = (n: number) => (n + h / 60) % 6;
  const f = (n: number) =>
    b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return rgbToHex(255 * f(1), 255 * f(3), 255 * f(5));
}

function rgbToHex(r: number, g: number, b: number) {
  let toHex = (num: number) => {
    let hex = Math.floor(num).toString(16);
    if (hex.length < 2) hex = "0" + hex;
    return hex;
  };
  return "#" + (toHex(r) + toHex(b) + toHex(g)).toUpperCase();
}
