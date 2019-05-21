export const loading = {
  state: false,
  reducers: {
    loadingStart: (state, payload) => {
      state = true
      return state
    },
    loadingEnd: (state, payload) => {
      state = false
      return state
    }
  }
}
