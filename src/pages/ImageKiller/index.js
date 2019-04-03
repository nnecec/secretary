import React, { Component } from 'react'
import { Pane, Button, FilePicker, TextInput, Heading, FormField, TextInputField } from 'evergreen-ui'
import fs from 'fs'
import Compressor from 'compressorjs'
import { url } from 'inspector';
// const sharp = require('sharp')
export default class Counter extends Component {

  constructor(props) {
    super(props)
    this.state = {
      maxSize: 5,
      maxWidth: undefined,
      maxHeight: undefined,
      quality: 0.8,
      imgList: []
    }
  }

  handleFilePickerChange = (files) => {
    files.map(file => {
      console.log(file)
      this.handleImageCompress(file)
    })
  }

  // 压缩图片
  handleImageCompress = (imgData) => {
    const { maxSize, quality } = this.state

    new Compressor(imgData, {
      maxWidth: 4096,
      quality,
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
    const imgBlob = blob
    const objectURL = URL.createObjectURL(imgBlob)

    this.setState((state, props) => {
      state.imgList.push(objectURL)
      return {
        imgList: state.imgList
      }
    })


    // const link = document.createElement('a')
    // link.href = objectURL
    // link.download = file.name
    // link.click()
    // URL.revokeObjectURL(objectURL)
  }


  render() {
    const { maxSize, maxWidth, maxHeight, quality, imgList } = this.state

    return (
      <Pane elevation={2} padding={16}>

        <Pane flex={1} alignItems="center" display="flex">
          <FilePicker
            multiple
            accept="image/*"
            width={250}
            onChange={this.handleFilePickerChange}
          />
        </Pane>


        <Pane>
          <FormField>
            <TextInputField
              isInvalid={false}
              required
              label="体积最大值"
              type="number"
              value={maxSize}
              onChange={e => this.setState({ maxSize: e.target.value })}
            />
          </FormField>
          <FormField>
            <TextInputField
              label="宽度最大值"
              type="number"
              value={maxWidth}
              onChange={e => this.setState({ maxWidth: e.target.value })}
            />
          </FormField>
          <FormField>
            <TextInputField
              label="高度最大值"
              type="number"
              value={maxHeight}
              onChange={e => this.setState({ maxHeight: e.target.value })}
            />
          </FormField>
          <FormField>
            <TextInputField
              isInvalid={false}
              required
              label="图片优化质量"
              type="number"
              min="0"
              max="1"
              value={quality}
              onChange={e => this.setState({ maxHeight: e.target.value })}
            />
          </FormField>
        </Pane>

        <Pane
          display="flex"
          flexWrap="wrap"
        >
          {
            imgList.map(img => (<Pane
              elevation={2}
              height={120}
              flexGrow={1}
              backgroundImage={`url(${img})`}
              backgroundSize="cover"
              backgroundPosition="center"
            >
            </Pane>))
          }

        </Pane>
      </Pane>
    )
  }
}
