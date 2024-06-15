export const formatDate = (date) => {
    return new Date(date).toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "2-digit",
      year: "numeric"
    });
  };