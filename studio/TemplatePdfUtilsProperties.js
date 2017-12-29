import React, { Component } from 'react'

export default class Properties extends Component {
  static selectTemplates (entities) {
    return Object.keys(entities).filter((k) => entities[k].__entitySet === 'templates').map((k) => entities[k])
  }

  static title (entity, entities) {
    if (!entity.pdfUtils || !entity.pdfUtils.headerTemplateShortid) {
      return 'pdf utils'
    }

    const foundItems = Properties.selectTemplates(entities).filter((e) => entity.pdfUtils.headerTemplateShortid === e.shortid)

    if (!foundItems.length) {
      return 'pdf utils'
    }

    return 'pdf utils: ' + foundItems[0].name
  }

  render () {
    const { entity, entities, onChange } = this.props
    const templateItems = Properties.selectTemplates(entities
    )
    const change = (change) => onChange({ ...entity, pdfUtils: { ...entity.pdfUtils, ...change } })

    return (
      <div className='properties-section'>
        <div className='form-group'>
          <label>header template</label>
          <select
            value={entity.pdfUtils ? entity.pdfUtils.headerTemplateShortid : ''}
            onChange={(v) => change({headerTemplateShortid: v.target.value !== 'empty' ? v.target.value : null})}>
            <option key='empty' value='empty'>- not selected -</option>
            {templateItems.map((e) => <option key={e.shortid} value={e.shortid}>{e.name}</option>)}
          </select>
        </div>
        <div className='form-group'><label>header box</label>
          <input
            type='text' placeholder='0 200mm 217mm 297mm' value={entity.pdfUtils ? entity.pdfUtils.headerBox : ''}
            onChange={(v) => change({headerBox: v.target.value})} />
        </div>
        <div className='form-group'><label>header rotation</label>
          <input
            type='text' placeholder='1 0 0 1 0 0 cm' value={entity.pdfUtils ? entity.pdfUtils.headerRotation : ''}
            onChange={(v) => change({headerRotation: v.target.value})} />
        </div>
        <div className='form-group'>
          <label>footer template</label>
          <select
            value={entity.pdfUtils ? entity.pdfUtils.footerTemplateShortid : ''}
            onChange={(v) => change({footerTemplateShortid: v.target.value !== 'empty' ? v.target.value : null})}>
            <option key='empty' value='empty'>- not selected -</option>
            {templateItems.map((e) => <option key={e.shortid} value={e.shortid}>{e.name}</option>)}
          </select>
        </div>
        <div className='form-group'><label>footer box</label>
          <input
            type='text' placeholder='0 200mm 217mm 297mm' value={entity.pdfUtils ? entity.pdfUtils.footerBox : ''}
            onChange={(v) => change({footerBox: v.target.value})} />
        </div>
      </div>
    )
  }
}
