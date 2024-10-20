export function capitalizeFirstLetter(string) {
    return string.replace(/\b\w/, char => char.toUpperCase());
  }