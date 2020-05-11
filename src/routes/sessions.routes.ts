import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';
const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;
  const authService = new AuthenticateUserService();

  const { user, token} = await authService.execute({ email, password });
  delete user.password;

  return response.send({ user, token });
});

export default sessionsRouter;
