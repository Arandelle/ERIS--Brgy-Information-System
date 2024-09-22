export const formatDate = (date) => {
    return new Date(date).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric"
    });
  };

export const formatTime = (date) =>{
  return new Date(date).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).replace(':00', '')
}