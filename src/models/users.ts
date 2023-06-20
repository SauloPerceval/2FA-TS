import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import { sequelize } from '../app'

const saltRounds = 10

class User extends Model {
    declare private password: string
    declare readonly otpSecret: string

    checkPassword(password: string) {
       return bcrypt.compare(password, this.password);
    };

    checkOtpToken(token: string) {
        return authenticator.check(token, this.otpSecret);
    }

    generateOtpToken() {
        return authenticator.generate(this.otpSecret);
    }

    
}

User.init({
    id: {type: DataTypes.INTEGER, primaryKey: true},
    username: {type: DataTypes.INTEGER, unique: true, allowNull: false},
    password: {
        type: DataTypes.STRING,
        set(value: string) {
            this.setDataValue('password', bcrypt.hashSync(value, saltRounds))
        },
    },
    otpSecret: {
        type: DataTypes.STRING
    }
}, {
    sequelize
})

async function userCreator(username: string, password: string): Promise<User> {
    return await User.create({username: username, password: password, otpSecret: authenticator.generateSecret()});
}

async function findUser(username: string): Promise<User|null> {
    return await User.findOne({ where: {username: username}});
}

export {
    userCreator,
    findUser
}
