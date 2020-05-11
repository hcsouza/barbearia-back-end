import { Router } from 'express';
import multer from 'multer';

import uploadConfig      from '../config/upload';
import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const { name, password, email } = request.body;
  const userService = new CreateUserService();

  const user = await userService.execute({ name , email, password });
  delete user.password;
  return response.send(user);
});

usersRouter.patch('/avatar',
                  ensureAuthenticated,
                  upload.single('avatar'),
                  async (request, response) => {

    const avatarService = new UpdateUserAvatarService();
    const user = await avatarService.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    })
    delete user.password;
    return response.json(user);
});

export default usersRouter;
