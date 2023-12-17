import configProd from './prod.js'
import configDev from './dev.js'
// import configDev from './prod.js'

export var config

if (process.env.NODE_ENV === 'production') {
    config = configProd
} else {
    config = configDev
}
config.isGuestMode = true
