export const loading = {
  state: false,
  reducers: {
    loadingStart: (state, payload) => {
      state = true
    },
    loadingEnd: (state, payload) => {
      state = false
    }
  }
}
