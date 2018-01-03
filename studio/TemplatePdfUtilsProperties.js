import React, { Component } from 'react'
import Studio from 'jsreport-studio'
import * as Constants from './constants.js'

export default class Properties extends Component {
  static title (entity, entities) {
    if (!entity.pdfOperations || entity.pdfOperations.length === 0) {
      return 'pdf utils'
    }

    const getTemplate = (shortid) => Studio.getEntityByShortid(shortid, false) || { name: '' }
    return 'pdf utils: ' + entity.pdfOperations.map(o => getTemplate(o.templateShortid).name).join(', ')
  }

  openEditor () {
    Studio.openTab({
      key: this.props.entity._id + '_pdfUtils',
      _id: this.props.entity._id,
      editorComponentKey: Constants.PDF_UTILS_TAB_EDITOR,
      titleComponentKey: Constants.PDF_UTILS_TAB_TITLE
    })
  }

  render () {
    return (<div className='properties-section'>
      <div className='form-group'>
        <button onClick={() => this.openEditor()}>Configure</button>
      </div>
    </div>)
  }
}
