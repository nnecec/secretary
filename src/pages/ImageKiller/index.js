import React, { Component } from 'react'
import { Pane, Button, FilePicker, TextInputField, ThemeConsumer, Checkbox, Link, Paragraph } from 'evergreen-ui'
import { connect } from 'react-redux'

import { saveAs } from 'file-saver'
import fs from 'fs'
import JSZip from 'jszip'
import Compressor from 'compressorjs'

import { formatImageSize } from '../../utils/image'

@connect(state => ({
  ...state.imageKiller
}), dispatch => ({
  addFileList: dispatch.imageKiller.addFileList,
  removeFile: dispatch.imageKiller.removeFile,
  modifyChecked: dispatch.imageKiller.modifyChecked,
  modifyConfiguration: dispatch.imageKiller.modifyConfiguration,
})
)
export default class Counter extends Component {

  handleFilePickerChange = (files) => {
    files.map(file => {
      this.handleImageCompress(file)
    })
  }

  // 压缩图片
  handleImageCompress = (imgData) => {
    const { maxSize, quality } = this.props

    console.dir(imgData)

    new Compressor(imgData, {
      quality,
      strict: false,
      success: (result) => {
        console.log(result)
        this.appendToFileList(result, imgData)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  // 添加到 fileList
  appendToFileList = (blob, file) => {
    const { addFileList } = this.props
    const imgBlob = blob
    const url = URL.createObjectURL(imgBlob)

    const img = {
      key: `${blob.lastModified}${blob.name}`,
      name: blob.name,
      url,
      size: blob.size,
      originSize: file.size,
      checked: true,
      blob
    }

    addFileList(img)
  }

  // 打包下载已勾选的图片
  downloadFiles = () => {
    const { fileList } = this.props
    const zip = new JSZip()
    fileList.forEach(file => {
      if (file.checked) {
        zip.file(file.name, file.blob)
      }
    })

    zip.generateAsync({ type: 'blob' })
      .then((content) => {
        saveAs(content, 'image.zip')
      })
  }

  // 全选图片
  handleSelectAll = () => {
    const { fileList, modifyChecked } = this.props
    const checked = !fileList[0].checked
    fileList.forEach((file, index) => {
      modifyChecked({ index, checked })
    })
  }

  // 删除已勾选图片
  deleteFiles = () => {
    const { fileList, removeFile } = this.props
    fileList.forEach((file, index) => {
      if (file.checked) {
        URL.revokeObjectURL(file.url)
        removeFile(index)
      }
    })
  }


  render() {
    const { maxSize, quality, fileList, removeFile, modifyChecked, modifyConfiguration } = this.props

    return (
      <Pane>

        <Pane
          padding={16}
          elevation={2}
          marginBottom={16}
        >
          <Pane>
            <FilePicker
              multiple
              accept="image/*"
              width={250}
              marginBottom={16}
              onChange={this.handleFilePickerChange}
            />
          </Pane>
          <Pane
            display="flex">
            <TextInputField
              required
              marginRight={16}
              label="体积最大值"
              description="MB"
              type="number"
              value={maxSize}
              onChange={e => modifyConfiguration({ attr: 'maxSize', value: e.target.value })}
            />
            <TextInputField
              required
              label="图片优化质量"
              description="0<x<1"
              type="number"
              min="0"
              max="1"
              value={quality}
              onChange={e => modifyConfiguration({ attr: 'quality', value: e.target.value })}
            />
          </Pane>
          <Pane>
            <Button appearance="primary" marginRight={8} onClick={this.downloadFiles}>下载</Button>
            <Button marginRight={8} onClick={this.handleSelectAll}>全选</Button>
            <Button appearance="minimal" intent="danger" onClick={this.deleteFiles}>删除</Button>
          </Pane>
        </Pane>

        {
          fileList && fileList.length > 0 &&
          <Pane
            display="flex"
            flexWrap="wrap"
            elevation={2}
            padding={8}
          >
            {
              fileList.map((img, index) => (
                <Checkbox
                  checked={img.checked}
                  onChange={e => modifyChecked({ checked: e.target.checked, index })}
                  label={<Pane
                    key={img.key}
                    width={200}
                    height={120}
                    backgroundImage={`url(${img.url})`}
                    backgroundSize="cover"
                    backgroundPosition="center"
                    margin={8}
                  >
                    <ThemeConsumer>
                      {theme => (
                        <Pane
                          backgroundColor={theme.palette.neutral.light}
                          padding={8}
                          opacity={0.7}>
                          <Paragraph size={300}>
                            大小: {formatImageSize(img.size)}
                          </Paragraph>
                          <Paragraph size={300}>
                            原大小: {formatImageSize(img.originSize)}
                          </Paragraph>
                        </Pane>
                      )}
                    </ThemeConsumer>
                  </Pane>}
                ></Checkbox>
              ))
            }
          </Pane>
        }
      </Pane>
    )
  }
}
