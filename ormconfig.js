// module.export = {
//   type: 'sqlite',
//   database: 'db.sqlite',
//   entities:
//     process.env.NODE_ENV === 'development'
//       ? ['**/*.entity.js']
//       : ['**/*.entity.ts'],
//   synchronize: false,
// };
var dbConfig = {
  synchronize: false,
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'],
      migrationsRun: true,
    });
    break;
  case 'production':
    Object.assign(dbConfig, {
      type: 'postgres', //щоб postgres працювало треба в проекті додати пакет npm install pg
      url: process.env.DATABASE_URL, //heroku
      migrationsRun: true,
      entities: ['**/*.entity.js'],
      ssl: {
        rejectUnauthorized: false,
      }, //heroku
    });
    break;
  default:
    throw new Error('unknown environment');
}

module.exports = dbConfig;

//MIGRATIONS COMMANDS

//npm run typeorm migration:generate -- -n MigrationName -schema -o     //-o прапор для того щоб файли міграції генерувалися у js

//npm run typeorm migration:run
//Шукає всі міграційні файли (зазвичай у migrations/*.ts або migrations/*.js)
// Визначає, які з них ще не були виконані
// Виконує їх у правильному порядку
// Застосовує зміни до бази даних (створення таблиць, зміна колонок, індексів тощо)
// Записує у спеціальну таблицю migrations інформацію про застосовані міграції
// ✔ Навіщо це потрібно?
// Щоб синхронізувати структуру бази даних з вашим кодом (entity) і змінами, які ви робите в проєкті.
