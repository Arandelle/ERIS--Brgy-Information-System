export const getTimeDifference = (timestamp) =>{
  const now = new Date();
  const addedTime = new Date(timestamp)

  const diffInSeconds = Math.floor((now - addedTime) / 1000) // Difference in seconds
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = now.getMonth() -addedTime.getMonth() + 12 * (now.getFullYear() - addedTime.getFullYear());
  const diffInYears = now.getFullYear() - addedTime.getFullYear();

  if (diffInSeconds < 60 ) return `just now`; // if value of seconds is greater than 59 this will bypass
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInHours < 24) return `${diffInHours} hours ago`
  if (diffInDays === 1) return "yesterday"
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInWeeks === 1) return `last week`
  if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`
  if (diffInMonths === 1) return `last month`;
  if (diffInMonths < 12 ) return `${diffInMonths} months ago`

  return `${diffInYears} years ago`
}