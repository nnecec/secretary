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
      state.fileList = state.fileList.filter(file => !file.checked)
      return state
    },
    modifyChecked (state, payload) {
      const { index, checked } = payload
      state.fileList[index].checked = checked
      return state
    },
    modifyConfiguration (state, payload) {
      const { attr, value } = payload
      state[attr] = value
    }
  }
}
