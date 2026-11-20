import { DataTypes, Model } from 'sequelize';

export class RolesModel extends Model {
  static initModel(sequelize) {
    RolesModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.STRING(150),
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      },
      {
        sequelize,
        modelName: 'Role',
        tableName: 'roles',
      },
    );

    return RolesModel;
  }
}
