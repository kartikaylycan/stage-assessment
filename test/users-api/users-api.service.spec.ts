jest.mock('src/modules/users/users.adaptor', () => ({
  UsersAdaptor: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { UsersApiService } from '../../src/apis/users-api/users-api.service';
import { UsersAdaptor } from '../../src/modules/users/users.adaptor';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

describe('UsersApiService', () => {
  let service: UsersApiService;
  let usersAdaptor: any;
  let mockLogger: { log: jest.Mock; warn: jest.Mock };

  beforeEach(async () => {
    usersAdaptor = {
      getAllActiveUsers: jest.fn(),
      searchUsersByUsername: jest.fn(),
      saveUserDetails: jest.fn(),
    };

    mockLogger = { log: jest.fn(), warn: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersApiService,
        { provide: WINSTON_MODULE_NEST_PROVIDER, useValue: mockLogger },
        { provide: UsersAdaptor, useValue: usersAdaptor },
      ],
    }).compile();

    service = module.get<UsersApiService>(UsersApiService);
  });

  it('getAllActiveUsers should call adaptor with correct params', () => {
    const query = { page: 2, limit: 5, fetchInactive: true } as any;

    service.getAllActiveUsers(query);

    expect(usersAdaptor.getAllActiveUsers).toHaveBeenCalledWith(2, 5, true);
  });

  it('createUser should return null when username exists', async () => {
    const req = { username: 'bob', preferences: {} } as any;
    usersAdaptor.searchUsersByUsername.mockResolvedValue({
      id: 'x',
      username: 'bob',
    });

    const res = await service.createUser(req);

    expect(usersAdaptor.searchUsersByUsername).toHaveBeenCalledWith('bob');
    expect(mockLogger.warn).toHaveBeenCalled();
    expect(res).toBeNull();
  });

  it('createUser should save and return data when username is new', async () => {
    const req = {
      username: 'alice',
      preferences: { favoriteGenres: [] },
    } as any;
    usersAdaptor.searchUsersByUsername.mockResolvedValue(null);
    usersAdaptor.saveUserDetails.mockResolvedValue({
      id: 'u1',
      username: 'alice',
    });

    const res = await service.createUser(req);

    expect(usersAdaptor.searchUsersByUsername).toHaveBeenCalledWith('alice');
    expect(usersAdaptor.saveUserDetails).toHaveBeenCalledWith(
      req.preferences,
      req.username,
    );
    expect(res).toEqual({ id: 'u1', username: 'alice' });
  });
});
