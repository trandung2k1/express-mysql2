const mysql = require('mysql2/promise');

class Database {
    constructor() {
        if (!Database.instance) {
            this.init();
            Database.instance = this;
        }
        return Database.instance;
    }

    async init() {
        this.connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '123456789',
            database: 'nodejs',
            keepAliveInitialDelay: 10000,
            enableKeepAlive: true,
            multipleStatements: false,
        });
    }

    async query(sql, params) {
        if (!this.connection) {
            await this.init();
        }
        return this.connection.execute(sql, params);
    }

    async close() {
        if (this.connection) {
            await this.connection.end();
        }
    }
    async getConnection() {
        if (!this.connection) {
            await this.init();
            return this.connection;
        }
        return this.connection;
    }
}

const instance = new Database();
module.exports = instance;
