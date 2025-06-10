
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: "short",
    day: "2-digit",
    year: "numeric"
  });
};

// New function for date with time
export const formatDateWithTime = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // 12-hour format (set to false for 24-hour format)
  });
};

 export const formatDateWithTimeAndWeek = (ts) =>
  new Date(ts).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });


export const formatTime = (date) =>{
  return new Date(date).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).replace(':00', '')
}