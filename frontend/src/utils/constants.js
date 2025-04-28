// src/utils/constants.js
export const ITEM_CATEGORIES = [
  { value: "books", label: "Books & Academic Materials" },
  { value: "electronics", label: "Electronics & Gadgets" },
  { value: "furniture", label: "Furniture" },
  { value: "clothing", label: "Clothing & Accessories" },
  { value: "stationery", label: "Stationery & Supplies" },
  { value: "sports", label: "Sports Equipment" },
  { value: "kitchen", label: "Kitchen & Household" },
  { value: "other", label: "Other Items" },
];

export const ITEM_CONDITIONS = [
  { value: "new", label: "New/Unused" },
  { value: "like_new", label: "Like New" },
  { value: "good", label: "Good Condition" },
  { value: "fair", label: "Fair Condition" },
  { value: "poor", label: "Poor Condition" },
];

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

export const ITEM_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  SOLD: "sold",
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VERIFY: "/auth/verify",
  },
  USERS: {
    BASE: "/users",
    PROFILE: "/users/profile",
    PASSWORD: "/users/:id/password",
    ROLE: "/users/:id/role",
  },
  ITEMS: {
    BASE: "/items",
    APPROVED: "/items/approved",
    USER_ITEMS: "/items/user/:id",
    SEARCH: "/items/search",
    APPROVE: "/items/:id/approve",
    REJECT: "/items/:id/reject",
    STATUS: "/items/:id/status",
  },
  MESSAGES: {
    BASE: "/messages",
    CONVERSATIONS: "/messages/conversations",
    CONVERSATION: "/messages/conversation/:id",
    UNREAD: "/messages/unread/count",
    READ: "/messages/:id/read",
  },
  REPORTS: {
    BASE: "/reports",
    RESOLVE: "/reports/:id/resolve",
  },
};

export const PAGE_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
  EDIT_PROFILE: "/profile/edit",
  ITEM_DETAIL: "/item/:id",
  CREATE_ITEM: "/item/create",
  EDIT_ITEM: "/item/:id/edit",
  MESSAGES: "/messages",
  ADMIN: "/admin",
};

export const ANIMATION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  },
  slideUp: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  },
  slideDown: {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  },
  slideLeft: {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
  },
  slideRight: {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
  },
  scale: {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
  },
};
