import { JSX } from "react/jsx-runtime";

export type Menu = {
  id: number;
  title: string;
  path?: string;
  newTab: boolean;
  submenu?: Menu[];
};

export interface MenuListItem {
  id: number;
  name: string;
  isPublished: boolean;
  isSystem: boolean;
}

// If you plan to fetch details with items later
export interface MenuItem {
  id: number;
  parentId: number | null;
  entityId: number | null;
  name: string;
  customLink: string;
  displayOrder: number;
}

export interface MenuDetails {
  id: number;
  name: string;
  isPublished: boolean;
  items: MenuItem[]; // This is where the data lives
}

// Keep this if you use it for the formatted/nested structure in your UI
export type FormattedMenu = {
  id: number;
  name: string;
  customLink: string;
  parentId: number | null;
  submenu: MenuItem[];
};