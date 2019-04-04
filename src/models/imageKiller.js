export default {
  state: {
    maxSize: 5,
    quality: 0.8,
    fileList: []
  },
  reducers: {
    addFileList (state, payload) {
      state.fileList.push(payload)
      return state
    },
    removeFile (state, payload) {

    }
  }
}
