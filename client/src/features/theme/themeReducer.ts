import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface ThemeState {
  theme: "light" | "dark";
}

// Define the initial state using that type
const initialState: ThemeState = {
  theme: "light",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      if (state.theme === "dark") {
        state.theme = "light";
      } else {
        state.theme = "dark";
      }
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
