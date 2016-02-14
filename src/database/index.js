import Sequelize from 'sequelize';
import config from '../../config/config.json';
import log from '../log';

function logSQLStatements(sqlStatement) {
  log.info({ sqlStatement }, 'SQL Statement Executed');
}

export default new Sequelize(config.database.name,
                             config.database.username,
                             config.database.password, {
                               host: config.database.host,
                               port: config.database.port,
                               logging: config.database.logSQLStatements ? logSQLStatements : false,
                               dialect: 'postgres'
                             });
