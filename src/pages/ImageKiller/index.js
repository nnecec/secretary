import React, { Component } from 'react'
import { Pane, Button, FilePicker, Text, Strong, Small, TextInput, Heading, FormField, TextInputField, ThemeConsumer, Checkbox, Link, Paragraph } from 'evergreen-ui'
import fs from 'fs'
import Compressor from 'compressorjs'
import { connect } from 'react-redux'


import { formatImageSize } from '../../utils/image'

@connect(state => ({
  ...state.imageKiller
}), dispatch => ({
  addFileList: dispatch.imageKiller.addFileList,
  removeFile: dispatch.imageKiller.removeFile,
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

    new Compressor(imgData, {
      quality,
      strict: false,
      success: (result) => {
        console.log(result)
        this.handleImageDownload(result, imgData)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  handleImageDownload = (blob, file) => {
    const { addFileList } = this.props
    const imgBlob = blob
    const url = URL.createObjectURL(imgBlob)

    const img = {
      key: `${blob.lastModified}${blob.name}`,
      name: blob.name,
      url,
      size: blob.size,
      originSize: file.size,
    }

    addFileList(img)


    // const link = document.createElement('a')
    // link.href = objectURL
    // link.download = file.name
    // link.click()
    // URL.revokeObjectURL(objectURL)
  }


  render() {
    const { maxSize, quality, fileList, removeFile } = this.props

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
              onChange={this.handleFilePickerChange}
            />
          </Pane>
          <Pane
            display="flex">
            <TextInputField
              padding={8}
              required
              label="体积最大值"
              description="MB"
              type="number"
              value={maxSize}
              onChange={e => this.setState({ maxSize: e.target.value })}
            />
            <TextInputField
              padding={8}
              required
              label="图片优化质量"
              description="0<x<1"
              type="number"
              min="0"
              max="1"
              value={quality}
              onChange={e => this.setState({ quality: e.target.value })}
            />
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
              fileList.map(img => (<Pane
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

                      opacity={0.8}>
                      <Paragraph size={300}>
                        大小: {formatImageSize(img.size)}
                      </Paragraph>
                      <Paragraph size={300}>
                        原大小: {formatImageSize(img.originSize)}
                        <Text float="right" size={300}>
                          <Link href={img.url} download={img.name}>下载</Link>
                          <Link onClick={() => removeFile(img)}>下载</Link>
                        </Text>

                      </Paragraph>
                    </Pane>
                  )}
                </ThemeConsumer>
              </Pane>))
            }
          </Pane>
        }
      </Pane>
    )
  }
}
