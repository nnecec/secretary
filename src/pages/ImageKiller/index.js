import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  Box,
  Grid,
  Button,
  Checkbox,
  TextField,
  InputAdornment,
  Paper,
  Card,
  CardHeader,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Container
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { saveAs } from 'file-saver'
import fs from 'fs'
import JSZip from 'jszip'
import Compressor from 'compressorjs'

import { formatImageSize } from '../../utils/image'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2)
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
  //
  function handleFilePickerChange (e) {
    console.log(e.target.files)
    const files = e.target.files
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

  // 判断图片 决定压缩参数
  function judgeImgSize (imgData) {
    const { maxSize } = props

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
    const { quality, maxSize } = props

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
    const { addFileList } = props
    const url = URL.createObjectURL(imgData.blob)
    imgData.size = imgData.blob.size
    imgData.url = url

    addFileList(imgData)
  }

  // 打包下载已勾选的图片
  function downloadFiles () {
    const { fileList } = props
    const zip = new JSZip()
    fileList.forEach(file => {
      if (file.checked) {
        zip.file(file.name, file.blob)
      }
    })

    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, 'image.zip')
    })
  }

  // 全选图片
  function handleSelectAll () {
    const { fileList, modifyChecked } = props
    const checked = !fileList[0].checked
    fileList.forEach((file, index) => {
      modifyChecked({ index, checked })
    })
  }

  // 删除已勾选图片
  function deleteFiles () {
    const { fileList, removeFile } = props
    fileList.forEach((file, index) => {
      if (file.checked) {
        URL.revokeObjectURL(file.url)
        removeFile(index)
      }
    })
  }

  const {
    maxSize,
    quality,
    fileList,
    removeFile,
    modifyChecked,
    modifyConfiguration
  } = props
  const classes = useStyles()
  console.log(fileList)
  return (
    <Container>
      <Paper className={classes.paper}>
        <form>
          <TextField
            className={classes.textField}
            required
            label="体积最大值"
            InputProps={{
              endAdornment: <InputAdornment position="edn">MB</InputAdornment>
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
            label="图片优化质量"
            InputProps={{
              endAdornment: <InputAdornment position="edn">%</InputAdornment>
            }}
            type="number"
            min="0"
            max="1"
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
          <Button color="primary" onClick={downloadFiles}>
            下载
          </Button>
          <Button onClick={handleSelectAll}>全选</Button>
          <Button color="secondary" onClick={deleteFiles}>
            删除
          </Button>
        </Box>
      </Paper>

      {fileList && fileList.length > 0 && (
        <Paper className={classes.paper}>
          {fileList.map((img, index) => (
            <Card className={classes.card}>

              <CardMedia
                className={classes.cardMedia}
                image={img.url}
                title={img.name}
              />
              <CardContent>
                <Typography variant="body2" component="p">
                  大小: {formatImageSize(img.size)}
                  <br />
                  原大小: {formatImageSize(img.originSize)}
                </Typography>
              </CardContent>
              <CardActions>
                <Checkbox color="primary" checked={img.checked} onChange={e => modifyChecked({ checked: e.target.checked, index })} />
              </CardActions>
            </Card>
          ))}
        </Paper>
      )}
    </Container>
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
    modifyConfiguration: dispatch.imageKiller.modifyConfiguration
  })
)(ImageKiller)
