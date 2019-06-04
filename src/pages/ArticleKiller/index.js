import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'

import { Container, Paper, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Editor, EditorState, RichUtils, getDefaultKeyBinding } from 'draft-js'

import { BlockStyleControls, InlineStyleControls } from './editorBar'

const useStyles = makeStyles(theme => ({
  paper: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(2)
  }
}))

export default function ArticleEditor (props) {
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty()
  )
  const editor = useRef(null)

  useEffect(() => {
    focusEditor()
  }, [])

  function focusEditor () {
    editor.current.focus()
  }

  function handleKeyCommand (command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      setEditorState(newState)
      return true
    }
    return false
  }
  function mapKeyToEditorCommand (e) {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        editorState,
        2
      )
      if (newEditorState !== editorState) {
        setEditorState(newEditorState)
      }
      return
    }
    return getDefaultKeyBinding(e)
  }
  function toggleBlockType (blockType) {
    setEditorState(
      RichUtils.toggleBlockType(
        editorState,
        blockType
      )
    )
  }
  function toggleInlineStyle (inlineStyle) {
    setEditorState(
      RichUtils.toggleInlineStyle(
        editorState,
        inlineStyle
      )
    )
  }

  // const styleMap = {
  //   CODE: {
  //     backgroundColor: 'rgba(0, 0, 0, 0.05)',
  //     fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
  //     fontSize: 16,
  //     padding: 2
  //   }
  // }

  function getBlockStyle (block) {
    switch (block.getType()) {
      case 'blockquote': return 'RichEditor-blockquote'
      default: return null
    }
  }

  const classes = useStyles()

  return (
    <Container>
      <Paper className={classes.paper}>
        <BlockStyleControls
          editorState={editorState}
          onToggle={toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={toggleInlineStyle}
        />
      </Paper>
      <Paper className={classes.paper}>
        <div onClick={focusEditor}>
          <Editor
            blockStyleFn={getBlockStyle}
            // customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={mapKeyToEditorCommand}
            onChange={setEditorState}
            ref={editor}
            spellCheck={true}
          />
        </div>
      </Paper>
    </Container>
  )
}
