export const getTimeDifference = (timestamp) =>{

  if (!timestamp || isNaN(new Date(timestamp).getTime())) {
    return "Invalid date";
  }
  
  const now = new Date();
  const addedTime = new Date(timestamp)

  const diffInSeconds = Math.floor((now - addedTime) / 1000) // Difference in seconds
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = now.getMonth() -addedTime.getMonth() + 12 * (now.getFullYear() - addedTime.getFullYear());
  const diffInYears = now.getFullYear() - addedTime.getFullYear();

  if (diffInSeconds < 60 ) return `Just now`; // if value of seconds is greater than 59 this will bypass
  if (diffInMinutes === 1) return `1m`; // Exactly 1 minute
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInHours === 1) return `1h`;
  if (diffInHours < 24) return `${diffInHours}h`
  if (diffInDays === 0) return `Today`;
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays}d`;
  if (diffInWeeks === 1) return `1w ago`;
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
  if (diffInMonths === 1) return `Last month`;
  if (diffInMonths < 12 ) return `${diffInMonths}m`
  if (diffInMonths >= 12)  return `${diffInYears}y`

  return `Invalid`
}