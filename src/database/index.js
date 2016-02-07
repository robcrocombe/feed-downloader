import Sequelize from 'sequelize';
import config from '../../config/config.json';

export default new Sequelize(config.database.name,
                             config.database.username,
                             config.database.password, {
                               dialect: 'postgres'
                             });
