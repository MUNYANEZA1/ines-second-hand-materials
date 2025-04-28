// src/utils/formatters.js
export const formatDate = (dateString) => {
  const date = new Date(dateString);

  // If the date is today, just show time
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // If the date is within the last week, show day name and time
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (date > lastWeek) {
    return `${date.toLocaleDateString([], {
      weekday: "short",
    })} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }

  // Otherwise show full date
  return date.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return "";

  // Format for Rwanda phone numbers (typically +250xxxxxxxxx)
  if (phoneNumber.startsWith("+250")) {
    const digits = phoneNumber.substring(4);
    return `+250 ${digits.substring(0, 2)} ${digits.substring(
      2,
      5
    )} ${digits.substring(5)}`;
  }

  // If doesn't match expected format, return as is
  return phoneNumber;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return "??";

  let initials = "";
  if (firstName) initials += firstName[0].toUpperCase();
  if (lastName) initials += lastName[0].toUpperCase();

  return initials;
};

// Renamed from getRelativeTime to formatDateRelative to match the import in ConversationList.jsx
export const formatDateRelative = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffMonth / 12);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 30) return `${diffDay}d ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return `${diffYear}y ago`;
};

// Add the formatTime function that was missing but imported in Conversation.jsx
export const formatTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
