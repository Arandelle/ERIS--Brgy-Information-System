export function capitalizeFirstLetter(string) {
    return string.replace(/\b\w/g, char => char.toUpperCase());
  }