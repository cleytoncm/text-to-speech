module.exports = (sequelize, DataTypes) => {
    const Comentario = sequelize.define('Comentario', {
        descricao: DataTypes.TEXT,
    }, {
        timestamps: false
    });

    return Comentario;
}