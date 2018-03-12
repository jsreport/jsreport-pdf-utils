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

  componentDidMount () {
    this.removeInvalidTemplateReferences()
  }

  componentDidUpdate () {
    this.removeInvalidTemplateReferences()
  }

  openEditor () {
    Studio.openTab({
      key: this.props.entity._id + '_pdfUtils',
      _id: this.props.entity._id,
      editorComponentKey: Constants.PDF_UTILS_TAB_EDITOR,
      titleComponentKey: Constants.PDF_UTILS_TAB_TITLE
    })
  }

  removeInvalidTemplateReferences () {
    const { entity, entities, onChange } = this.props

    if (!entity.pdfOperations) {
      return
    }

    let hasTemplateReferences = false
    let updatedOperations

    updatedOperations = entity.pdfOperations
    hasTemplateReferences = entity.pdfOperations.filter(o => o.templateShortid != null).length > 0

    if (hasTemplateReferences) {
      updatedOperations = entity.pdfOperations.filter((o) => {
        // tolerate operations recently added
        if (o.templateShortid == null) {
          return true
        }

        return Object.keys(entities).filter((k) => entities[k].__entitySet === 'templates' && entities[k].shortid === o.templateShortid).length
      })
    }

    if (hasTemplateReferences && updatedOperations.length !== entity.pdfOperations.length) {
      onChange({ _id: entity._id, pdfOperations: updatedOperations })
    }
  }

  render () {
    return (<div className='properties-section'>
      <div className='form-group'>
        <button onClick={() => this.openEditor()}>Configure</button>
      </div>
    </div>)
  }
}
