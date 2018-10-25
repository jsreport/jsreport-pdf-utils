import React, { Component } from 'react'
import Studio from 'jsreport-studio'
import styles from './style.scss'

export default class PdfUtilsEditor extends Component {
  addOperation (entity) {
    Studio.updateEntity(Object.assign({}, entity, { pdfOperations: [...entity.pdfOperations || [], { type: 'merge' }] }))
  }

  updateOperation (entity, index, update) {
    Studio.updateEntity(Object.assign({}, entity, { pdfOperations: entity.pdfOperations.map((o, i) => i === index ? Object.assign({}, o, update) : o) }))
  }

  removeOperation (entity, index) {
    Studio.updateEntity(Object.assign({}, entity, { pdfOperations: entity.pdfOperations.filter((a, i) => i !== index) }))
  }

  moveDown (entity, index) {
    const pdfOperations = [...entity.pdfOperations]
    const tmp = pdfOperations[index + 1]
    pdfOperations[index + 1] = pdfOperations[index]
    pdfOperations[index] = tmp
    Studio.updateEntity(Object.assign({}, entity, { pdfOperations: pdfOperations }))
  }

  moveUp (entity, index) {
    const pdfOperations = [...entity.pdfOperations]
    const tmp = pdfOperations[index - 1]
    pdfOperations[index - 1] = pdfOperations[index]
    pdfOperations[index] = tmp
    Studio.updateEntity(Object.assign({}, entity, { pdfOperations: pdfOperations }))
  }

  renderOperation (entity, operation, index) {
    const templates = Studio.getAllEntities()
      .filter((e) => e.__entitySet === 'templates' && e.shortid !== entity.shortid && e.recipe.includes('pdf'))

    return (<tr key={index}>
      <td>
        <select
          value={operation.templateShortid || 'empty'}
          onChange={(v) => this.updateOperation(entity, index, { templateShortid: v.target.value })}>
          <option key='empty' value='empty'>- not selected -</option>
          {templates.map((e) => <option key={e.shortid} value={e.shortid}>{e.name}</option>)}
        </select>
      </td>
      <td>
        <select
          value={operation.type}
          onChange={(v) => this.updateOperation(entity, index, { type: v.target.value })}>>
          <option value='merge'>merge</option>
          <option value='append'>append</option>
          <option value='prepend'>prepend</option>
        </select>
      </td>
      <td>
        <input type='checkbox' disabled={operation.type !== 'merge'} checked={operation.mergeToFront === true} onChange={(v) => this.updateOperation(entity, index, { mergeToFront: v.target.checked })} />
      </td>
      <td>
        <input type='checkbox' disabled={operation.type !== 'merge'} checked={operation.renderForEveryPage === true} onChange={(v) => this.updateOperation(entity, index, { renderForEveryPage: v.target.checked })} />
      </td>
      <td>
        <button className='button' style={{ backgroundColor: '#c6c6c6' }} onClick={() => this.removeOperation(entity, index)}><i className='fa fa-times' /></button>
      </td>
      <td>
        {entity.pdfOperations[index - 1] ? <button className='button' style={{ backgroundColor: '#c6c6c6' }} onClick={() => this.moveUp(entity, index)}><i className='fa fa-arrow-up' /></button> : ''}
      </td>
      <td>
        {entity.pdfOperations[index + 1] ? <button className='button' style={{ backgroundColor: '#c6c6c6' }} onClick={() => this.moveDown(entity, index)}><i className='fa fa-arrow-down' /></button> : ''}
      </td>
    </tr>)
  }

  renderOperations (entity) {
    return (<table className={styles.operationTable}>
      <thead>
        <tr>
          <th>Template</th>
          <th>Operation</th>
          <th>Merge to front</th>
          <th>Render for every page</th>
          <th />
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        {(entity.pdfOperations || []).map((o, i) => this.renderOperation(entity, o, i))}
      </tbody>
    </table>)
  }

  render () {
    const { entity } = this.props

    return (<div className='block custom-editor' style={{ overflowX: 'auto' }}>
      <h1><i className='fa fa-file-pdf-o' /> pdf operations
      </h1>
      <p style={{ marginTop: '1rem' }}>
        Use merge/append operations to add dynamic headers or concatenate multiple pdf reports into one.
        See more docs and examples <a href='https://jsreport.net/learn/pdf-utils'>here</a>.
      </p>
      <div style={{ marginTop: '1rem' }}>
        {this.renderOperations(entity)}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button className='button confirmation' onClick={() => this.addOperation(entity)}>Add operation</button>
      </div>
    </div>)
  }
}

PdfUtilsEditor.propTypes = {
  entity: React.PropTypes.object.isRequired,
  tab: React.PropTypes.object.isRequired,
  onUpdate: React.PropTypes.func.isRequired
}
