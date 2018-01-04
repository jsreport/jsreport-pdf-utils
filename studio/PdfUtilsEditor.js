import React, { Component } from 'react'
import Studio from 'jsreport-studio'

export default class DataEditor extends Component {
  static propTypes = {
    entity: React.PropTypes.object.isRequired,
    tab: React.PropTypes.object.isRequired,
    onUpdate: React.PropTypes.func.isRequired
  }

  addOperation (entity) {
    Studio.updateEntity(Object.assign({}, entity, { pdfOperations: [...entity.pdfOperations || [], { type: 'merge' }] }))
  }

  updateOperation (entity, index, update) {
    Studio.updateEntity(Object.assign({}, entity, { pdfOperations: entity.pdfOperations.map((o, i) => i === index ? Object.assign({}, o, update) : o) }))
  }

  removeOperation (entity, index) {
    Studio.updateEntity(Object.assign({}, entity, { pdfOperations: entity.pdfOperations.filter((a, i) => i !== index) }))
  }

  updatePdfUtils (entity, update) {
    console.log(Object.assign({}, entity, { pdfUtils: { ...entity.pdfUtils, ...update } }))
    Studio.updateEntity(Object.assign({}, entity, { pdfUtils: { ...entity.pdfUtils, ...update } }))
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
    const templates = Studio.getAllEntities().filter((e) => e.__entitySet === 'templates')

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
        <select value={operation.type} onChange={(v) => this.updateOperation(entity, index, { type: v.target.value })}>>
          <option value='merge'>merge</option>
          <option value='append'>append</option>
          <option value='prepend'>prepend</option>
        </select>
      </td>
      <td>
        <select value={operation.mergeLayer} onChange={(v) => this.updateOperation(entity, index, { mergeLayer: v.target.value })}>>
          <option value='back'>back</option>
          <option value='front'>front</option>
        </select>
      </td>
      <td style={{textAlign: 'center'}}>
        <input type='checkbox' checked={operation.renderForEveryPage === true} onChange={(v) => this.updateOperation(entity, index, { renderForEveryPage: v.target.checked })} />
      </td>
      <td>
        <button className='button' onClick={() => this.removeOperation(entity, index)}><i className='fa fa-times' /></button>
        {entity.pdfOperations[index - 1] ? <button className='button' onClick={() => this.moveUp(entity, index)}><i className='fa fa-arrow-up' /></button> : ''}
        {entity.pdfOperations[index + 1] ? <button className='button' onClick={() => this.moveDown(entity, index)}><i className='fa fa-arrow-down' /></button> : ''}
      </td>
    </tr>)
  }

  renderOperations (entity) {
    return (<table className=''>
      <thead>
        <tr>
          <th>Template</th>
          <th>Operation</th>
          <th>Layer</th>
          <th>Every page</th>
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

    return (<div className='block custom-editor' style={{overflowX: 'auto'}}>
      <h1><i className='fa fa-file-pdf-o' /> pdf operations
      </h1>
      <div>
        <div className='form-group'>
          <label>Remove the main content back layer</label>
          <input
            type='checkbox' checked={entity.pdfUtils && entity.pdfUtils.removeContentBackLayer === true} onChange={(v) => this.updatePdfUtils(entity, { removeContentBackLayer: v.target.checked })} />
        </div>
      </div>
      <div style={{marginTop: '1rem'}}>
        {this.renderOperations(entity)}
      </div>
      <div style={{marginTop: '1rem'}}>
        <button className='button confirmation' onClick={() => this.addOperation(entity)}>Add operation</button>
      </div>
    </div>)
  }
}
