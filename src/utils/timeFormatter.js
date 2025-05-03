export function getFormat24H(time) {
  // Memeriksa apakah waktu valid
  if (!time) return 'Invalid Time'; // Fallback jika waktu kosong

  // Jika waktu memiliki format HH:mm:ss, kita hanya akan mengambil HH:mm
  const timeParts = time.split(':');
  
  if (timeParts.length === 3) {
    // Mengambil bagian jam dan menit, dan mengabaikan detik
    return `${timeParts[0]}:${timeParts[1]}`;
  }

  return 'Invalid Time'; // Jika format tidak sesuai
}
