import React from 'react'
import { connect } from 'react-redux'

import {
  Box,
  Button,
  Checkbox,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogActions,

  Paper,
  Container,
  GridList,
  GridListTile,
  GridListTileBar
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import Compressor from 'compressorjs'

import { formatImageSize } from '../../utils/image'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    position: 'relative'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  inputUpload: {
    display: 'none'
  },
  control: {
    marginTop: theme.spacing(2)
  },
  card: {
    width: '20%',
    minWidth: 240,
    display: 'inline-block',
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  cardHeader: {
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    'white-space': 'noWrap'
  },
  cardMedia: {
    paddingTop: '56.25%'
  }
}))

function ImageKiller (props) {
  const [removeModalVisible, setRemoveModalVisible] = React.useState(false)

  const { loadingStart, loadingEnd, maxSize, quality, addFileList, removeFile, fileList, modifyChecked, modifyConfiguration } = props
  let queue = 0

  function handleFilePickerChange (e) {
    if (e ?.target ?.files ?.length > 0) {
      const files = e.target.files
      loadingStart()
      queue = files.length
      Array.from(files).map(file => {
        const img = {
          key: `${file.lastModified}${file.name}`,
          name: file.name,
          // size: file.size,
          originSize: file.size,
          checked: true,
          blob: file,
          type: file.type
        }

        handleImageCompress(img)
      })
    }
  }

  // 判断图片 决定压缩参数
  function judgeImgSize (imgData) {
    if (imgData.blob.size > maxSize * 1000 * 1000) {
      // 如果超出设置的体积最大值
      const reader = new FileReader()
      const img = new Image()

      const gap = Math.pow(
        (imgData.blob.size - maxSize * 1000 * 1000) / imgData.blob.size,
        2
      )

      reader.readAsDataURL(imgData.blob)
      reader.onload = () => {
        img.src = reader.result
        img.onload = () => {
          const width = img.naturalWidth * (1 - gap)
          const height = img.naturalHeight * (1 - gap)
          handleImageCompress(imgData, { width, height })
        }
      }
    } else {
      handleImageCompress(imgData)
    }
  }

  // 压缩图片
  function handleImageCompress (imgData, options = {}) {
    const { width = 0, height = 0 } = options

    // eslint-disable-next-line
    new Compressor(imgData.blob, {
      quality,
      strict: false,
      width,
      height,
      success: result => {
        imgData.blob = result

        if (result.size > maxSize * 1000 * 1000) {
          judgeImgSize(imgData)
        } else {
          appendToFileList(imgData)
        }
      },
      error: err => {
        console.log(err)
      }
    })
  }

  // 添加到 fileList
  function appendToFileList (imgData) {
    const url = URL.createObjectURL(imgData.blob)
    imgData.size = imgData.blob.size
    imgData.url = url

    queue--
    if (queue === 0) loadingEnd()
    addFileList(imgData)
  }

  // 打包下载已勾选的图片
  function downloadFiles () {
    const zip = new JSZip()
    fileList.forEach(file => {
      if (file.checked) {
        zip.file(file.name, file.blob)
      }
    })

    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, `images${Date.now()}.zip`)
    })
  }

  // 全选图片
  function handleSelectAll () {
    const checked = !fileList[0].checked
    fileList.forEach((file, index) => {
      modifyChecked({ index, checked })
    })
  }

  // 删除已勾选图片
  function removeFiles () {
    console.log(fileList)
    fileList.forEach((file, index) => {
      if (file.checked) {
        URL.revokeObjectURL(file.url)
        removeFile()
      }
    })
    setRemoveModalVisible(false)
  }

  const classes = useStyles()

  return (
    <Container>
      <Paper className={classes.paper}>
        <form>
          <TextField
            className={classes.textField}
            required
            label="体积最大值"
            InputProps={{
              endAdornment: <InputAdornment position="end">MB</InputAdornment>
            }}
            type="number"
            value={maxSize}
            onChange={e =>
              modifyConfiguration({ attr: 'maxSize', value: e.target.value })
            }
          />
          <TextField
            className={classes.textField}
            required
            label="优化系数"
            type="number"
            min={0}
            max={1}
            value={quality}
            onChange={e =>
              modifyConfiguration({ attr: 'quality', value: e.target.value })
            }
          />
        </form>

        <Box className={classes.control}>
          <input
            accept="image/*"
            id="upload-file-input"
            className={classes.inputUpload}
            multiple
            type="file"
            onChange={handleFilePickerChange}
          />
          <label htmlFor="upload-file-input">
            <Button color="primary" component="span">
              上传
            </Button>
          </label>
          <Button color="primary" onClick={downloadFiles} disabled={fileList ?.length === 0}>
            下载
          </Button>
          <Button onClick={handleSelectAll} disabled={fileList ?.length === 0}>全选</Button>
          <Button color="secondary" onClick={() => setRemoveModalVisible(true)} disabled={fileList ?.length === 0}>
            删除
          </Button>
        </Box>
      </Paper>

      {
        fileList ?.length > 0 && (
          <Paper className={classes.paper}>
            <GridList cellHeight={200} className={classes.gridList}>
              {fileList.map((tile, index) => (
                <GridListTile key={tile.url} cols={0.666} rows={1}>
                  <img src={tile.url} alt={tile.name} />
                  <GridListTileBar
                    title={tile.name}
                    subtitle={<span>大小: {formatImageSize(tile.size)} 原大小: {formatImageSize(tile.originSize)}</span>}
                    actionIcon={
                      <Checkbox color="primary" checked={tile.checked} onChange={e => modifyChecked({ checked: e.target.checked, index })} />
                    }
                  />
                </GridListTile>
              ))}
            </GridList>
          </Paper>
        )
      }

      <Dialog
        open={removeModalVisible}
        onClose={() => setRemoveModalVisible(false)}
      >
        <DialogTitle>确认删除已勾选的图片吗？</DialogTitle>
        <DialogActions>
          <Button onClick={() => setRemoveModalVisible(false)}>
            取消
          </Button>
          <Button onClick={removeFiles} color="primary" autoFocus>
            确认
          </Button>
        </DialogActions>
      </Dialog>

    </Container >
  )
}

export default connect(
  state => ({
    ...state.imageKiller
  }),
  dispatch => ({
    addFileList: dispatch.imageKiller.addFileList,
    removeFile: dispatch.imageKiller.removeFile,
    modifyChecked: dispatch.imageKiller.modifyChecked,
    modifyConfiguration: dispatch.imageKiller.modifyConfiguration,

    loadingStart: dispatch.loading.loadingStart,
    loadingEnd: dispatch.loading.loadingEnd
  })
)(ImageKiller)
