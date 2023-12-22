import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const themeSlice = createSlice({
  name: 'theme',
  initialState: 'system', // dark light
  reducers: {
    updateTheme: (state, action: PayloadAction<string>) => {
      return action.payload
    },
  },
})

export const { updateTheme } = themeSlice.actions
export default themeSlice.reducer
