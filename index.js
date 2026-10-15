const { Sequelize, DataTypes } = require('sequelize');

// Подключение к SQLite (файл database.sqlite создастся сам)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false, // убираем лишний вывод SQL в консоль
});

// Описываем модель Car
const Car = sequelize.define('Car', {
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
  },
  price: {
    type: DataTypes.FLOAT,
  },
}, {
  tableName: 'cars',
  timestamps: false,
});

async function main() {
  try {
    // Проверка соединения
    await sequelize.authenticate();
    console.log('✅ Подключение к БД установлено');

    // Создаём таблицу (если её нет)
    await sequelize.sync({ force: true });
    console.log('✅ Таблица cars создана');

    // Добавляем машины
    await Car.bulkCreate([
      { brand: 'Toyota', model: 'Camry', year: 2020, price: 25000 },
      { brand: 'BMW',    model: 'X5',    year: 2022, price: 60000 },
      { brand: 'Tesla',  model: 'Model 3', year: 2023, price: 45000 },
    ]);
    console.log('✅ Машины добавлены');

    // Выводим все объекты в консоль
    const cars = await Car.findAll();
    console.log('\n🚗 Список машин:');
    cars.forEach(car => {
      console.log(`- ${car.brand} ${car.model} (${car.year}) — $${car.price}`);
    });

    // Вывод "сырых" объектов (как JSON)
    console.log('\n📦 Полные объекты:');
    console.log(JSON.stringify(cars.map(c => c.toJSON()), null, 2));

  } catch (err) {
    console.error('❌ Ошибка:', err);
  } finally {
    await sequelize.close();
  }
}

main();