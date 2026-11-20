import bcrypt from 'bcryptjs';
import { DataTypes, Model } from 'sequelize';

export class UserModel extends Model {
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  static initModel(sequelize) {
    UserModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        fullName: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(60),
          unique: true,
        },
        phoneNumber: {
          type: DataTypes.STRING(15),
        },
        password: {
          type: DataTypes.STRING(150),
        },
        address: {
          type: DataTypes.STRING(200),
        },
        isActived: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        gender: {
          type: DataTypes.STRING(1),
          validate: {
            isIn: [['F', 'M']],
          },
        },
        rolId: {
          type: DataTypes.INTEGER,
          references: {
            model: 'RolesModel',
            key: 'id'
          }
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        hooks: {
          beforeCreate: hashPassword,
          beforeUpdate: hashPassword,
        },
      },
    );

    return UserModel;
  }
}

async function hashPassword(user) {
  if (user.changed('password') && typeof user.password === 'string') {
    user.password = await bcrypt.hash(user.password, 10);
  }
}