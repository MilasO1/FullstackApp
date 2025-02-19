import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UserSQL = sequelize.define("User", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },  
    email: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
});

await sequelize.sync();

export default UserSQL;