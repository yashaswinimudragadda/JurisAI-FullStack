// src/hooks/useTheme.js
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContextObject'; // Point to the new object file

export const useTheme = () => {
  return useContext(ThemeContext);
};