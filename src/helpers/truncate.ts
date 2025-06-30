export const truncate = (text: string, maxLength: number = 10): string => {
  if (text.length <= maxLength) {
    return text;
  }
  // maxlength - 3 pour laisser de la place pour les "..."
  return text.slice(0, maxLength - 3) + '...';
}