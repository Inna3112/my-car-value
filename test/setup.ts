import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test')); //це для того щоб чистити чи видаляти бд в тест середовищі,
    //щоб кожен тест починався з чистого стану і проходили завжди з одними й тими тестовими даними
  } catch (err) {}
});
