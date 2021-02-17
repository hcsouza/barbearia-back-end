import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUserRepository: FakeUserRepository;
let listProvidersService: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProvidersService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProvidersService = new ListProvidersService(
      fakeUserRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUserRepository.create({
      name: 'Neji',
      email: 'hyuga.neji@konoha.com',
      password: 'byakugan',
    });

    const user2 = await fakeUserRepository.create({
      name: 'Rock lee',
      email: 'rock.lee@konoha.com',
      password: 'taijutsu',
    });

    const loggedUser = await fakeUserRepository.create({
      name: 'Shikamaru Nara',
      email: 'nara.shikamaru@konoha.com',
      password: 'kagemane',
    });

    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
