import { configureStore } from '@reduxjs/toolkit'

import themeReducer from './theme'
import companiesReducer from './companies'
import userReducer from './user'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    companies: companiesReducer,
    user: userReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
