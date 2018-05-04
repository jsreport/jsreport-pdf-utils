import Studio from 'jsreport-studio'
import TemplatePdfUtilsProperties from './TemplatePdfUtilsProperties.js'
import PdfUtilsTitle from './PdfUtilsTitle.js'
import PdfUtilsEditor from './PdfUtilsEditor.js'
import * as Constants from './constants.js'

Studio.addPropertiesComponent(TemplatePdfUtilsProperties.title, TemplatePdfUtilsProperties,
  (entity) => entity.__entitySet === 'templates' && entity.recipe.includes('pdf'))

Studio.addEditorComponent(Constants.PDF_UTILS_TAB_EDITOR, PdfUtilsEditor)
Studio.addTabTitleComponent(Constants.PDF_UTILS_TAB_TITLE, PdfUtilsTitle)
