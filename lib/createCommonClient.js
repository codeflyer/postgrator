const utils = require('./utils')
const MssqlClient = require('./MssqlClient')
const MssqlV8Client = require('./MssqlV8Client')
const MysqlClient = require('./MysqlClient')
const PostgresClient = require('./PostgresClient')

const DRIVERS = [
  { package: 'pg', min: 6, max: 7 },
  { package: 'mysql', min: 2, max: 2 },
  { package: 'mysql2', min: 1, max: 2 },
  { package: 'mssql', min: 4, max: 6 },
  { package: 'msnodesqlv8', min: 0, max: 0 }
]

module.exports = function createCommonClient(config) {
  const driver = DRIVERS.find(d => d.package === config.driver)

  if (!driver) {
    throw new Error(
      `db driver '${config.driver}' not supported. Must one of: '${DRIVERS.map(
        x => x.package
      ).join("', '")}'`
    )
  }

  utils.supportWarning(driver.package, driver.min, driver.max)

  if (config.driver === 'mysql' || config.driver === 'mysql2') {
    return new MysqlClient(config)
  } else if (config.driver === 'pg') {
    return new PostgresClient(config)
  } else if (config.driver === 'mssql') {
    return new MssqlClient(config)
  } else if (config.driver === 'msnodesqlv8') {
    return new MssqlV8Client(config)
  }
}
