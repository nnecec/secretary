import React, { useState, useEffect } from 'react'
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'

const BLOCK_TYPES = [
  { label: 'H1', value: 'header-one' },
  { label: 'H2', value: 'header-two' },
  { label: 'H3', value: 'header-three' },
  { label: 'H4', value: 'header-four' },
  { label: 'H5', value: 'header-five' },
  { label: 'H6', value: 'header-six' },
  { label: 'Blockquote', value: 'blockquote' },
  { label: 'UL', value: 'unordered-list-item' },
  { label: 'OL', value: 'ordered-list-item' },
  { label: 'Code Block', value: 'code-block' }
]
export function BlockStyleControls (props) {
  const { editorState, onToggle } = props
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

  function handleChange (event, value) {
    onToggle(value)
  }

  return (
    <ToggleButtonGroup value={blockType} exclusive onChange={handleChange}>
      {BLOCK_TYPES.map((type) =>
        <ToggleButton key={type.label} value={type.value}>
          {type.label}
        </ToggleButton>
      )}
    </ToggleButtonGroup>
  )
}
var INLINE_STYLES = [
  { label: 'Bold', value: 'BOLD' },
  { label: 'Italic', value: 'ITALIC' },
  { label: 'Underline', value: 'UNDERLINE' },
  { label: 'Monospace', value: 'CODE' }
]
export function InlineStyleControls (props) {
  const { editorState, onToggle } = props
  const currentStyle = editorState.getCurrentInlineStyle()

  function handleChange (e, values) {
    e.preventDefault()
    onToggle(e.currentTarget.value)
  }

  return (
    <ToggleButtonGroup value={currentStyle.toArray()} onChange={handleChange}>
      {INLINE_STYLES.map((type) =>
        <ToggleButton key={type.value} value={type.value}>
          {type.label}
        </ToggleButton>
      )}
    </ToggleButtonGroup>
  )
}
