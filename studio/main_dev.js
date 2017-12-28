import TemplatePdfUtilsProperties from './TemplatePdfUtilsProperties.js'
import Studio from 'jsreport-studio'

Studio.addPropertiesComponent(TemplatePdfUtilsProperties.title, TemplatePdfUtilsProperties, (entity) => entity.__entitySet === 'templates')
