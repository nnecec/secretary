import React, { useState, useRef, useEffect } from 'react'

import { Container, Paper, Button, Icon, IconButton } from '@material-ui/core'
import { FormatBold, FormatItalic, FormatUnderlined, Code } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import { isKeyHotkey } from 'is-hotkey'
import initialValue from './value.json'

import { BlockStyleControls, InlineStyleControls } from './editorBar'

const useStyles = makeStyles(theme => ({
  paper: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(1)
  }
}))

/**
 * Define the default node type.
 *
 * @type {String}
 */

const DEFAULT_NODE = 'paragraph'

const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')

export default function RichTextExample () {
  const [value, setValue] = useState(Value.fromJSON(initialValue))
  const editor = useRef()
  const classes = useStyles()

  function hasMark (type) {
    return value.activeMarks.some(mark => mark.type === type)
  }

  function hasBlock (type) {
    return value.blocks.some(node => node.type === type)
  }

  function renderMarkButton (type, icon) {
    const isActive = hasMark(type)

    return (
      <IconButton className={classes.button} size="small" active={isActive} onMouseDown={event => onClickMark(event, type)}>
        {icon}
      </IconButton>
    )
  }

  function renderBlockButton (type, icon) {
    let isActive = hasBlock(type)

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const { document, blocks } = value

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key)
        isActive = hasBlock('list-item') && parent && parent.type === type
      }
    }

    return (
      <Button
        active={isActive}
        onMouseDown={event => onClickBlock(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    )
  }

  function renderBlock (props, editor, next) {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>
      case 'list-item':
        return <li {...attributes}>{children}</li>
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
      default:
        return next()
    }
  }

  function renderMark (props, editor, next) {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'code':
        return <code {...attributes}>{children}</code>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'underlined':
        return <u {...attributes}>{children}</u>
      default:
        return next()
    }
  }

  function onKeyDown (event, editor, next) {
    let mark

    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined'
    } else if (isCodeHotkey(event)) {
      mark = 'code'
    } else {
      return next()
    }

    event.preventDefault()
    editor.current.toggleMark(mark)
  }

  function onClickMark (event, type) {
    event.preventDefault()
    editor.current.toggleMark(type)
  }

  function onClickBlock (event, type) {
    event.preventDefault()

    const { editor } = this
    const { value } = editor
    const { document } = value

    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = hasBlock(type)
      const isList = hasBlock('list-item')

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type)
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = hasBlock('list-item')
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type)
      })

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        editor
          .unwrapBlock(
            type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type)
      } else {
        editor.setBlocks('list-item').wrapBlock(type)
      }
    }
  }
  return (
    <Container>
      <Paper className={classes.paper}>
        {renderMarkButton('bold', <FormatBold />)}
        {renderMarkButton('italic', <FormatItalic />)}
        {renderMarkButton('underlined', <FormatUnderlined />)}
        {renderMarkButton('code', <Code />)}
        {renderBlockButton('heading-one', 'looks_one')}
        {renderBlockButton('heading-two', 'looks_two')}
        {renderBlockButton('block-quote', 'format_quote')}
        {renderBlockButton('numbered-list', 'format_list_numbered')}
        {renderBlockButton('bulleted-list', 'format_list_bulleted')}
      </Paper>
      <Paper className={classes.paper}>
        <Editor
          spellCheck
          autoFocus
          placeholder="Enter some rich text..."
          ref={editor}
          value={value}
          onChange={({ value }) => setValue(value)}
          onKeyDown={onKeyDown}
          renderBlock={renderBlock}
          renderMark={renderMark}
        />
      </Paper>

    </Container>
  )
}
