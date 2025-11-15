jest.mock('src/modules/users/users.adaptor', () => ({
  UsersAdaptor: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { UsersApiController } from '../../src/apis/users-api/users-api.controller';
import { UsersApiService } from '../../src/apis/users-api/users-api.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HttpStatus } from '@nestjs/common';

describe('UsersApiController', () => {
  let controller: UsersApiController;
  let usersApiService: Partial<Record<keyof UsersApiService, jest.Mock>> & any;
  let mockLogger: { log: jest.Mock; warn?: jest.Mock };

  beforeEach(async () => {
    usersApiService = {
      addContentToUserList: jest.fn(),
      createUser: jest.fn(),
      getAllActiveUsers: jest.fn(),
    };

    mockLogger = { log: jest.fn(), warn: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersApiController],
      providers: [
        { provide: WINSTON_MODULE_NEST_PROVIDER, useValue: mockLogger },
        { provide: UsersApiService, useValue: usersApiService },
      ],
    }).compile();

    controller = module.get<UsersApiController>(UsersApiController);
  });

  it('addContentToUserList should call service and return message', () => {
    const body = { category: 'MOVIE', userId: 'u1', itemId: 'i1' } as any;

    const result = controller.addContentToUserList(body);

    expect(usersApiService.addContentToUserList).toHaveBeenCalledWith(body);
    expect(result).toEqual({ message: 'Content added to user list' });
    expect(mockLogger.log).toHaveBeenCalled();
  });

  it('addUser should return CREATED when service returns data', async () => {
    const req = { username: 'john', preferences: {} } as any;
    const created = { id: '1', username: 'john' };
    usersApiService.createUser.mockResolvedValue(created);

    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    const res = { status, send } as any;

    const result = await controller.addUser(req, res);

    expect(usersApiService.createUser).toHaveBeenCalledWith(req);
    expect(status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(send).toHaveBeenCalledWith({ status: 'success', data: created });
    expect(result).toBeUndefined();
  });

  it('addUser should return BAD_REQUEST when service returns null', async () => {
    const req = { username: 'existing', preferences: {} } as any;
    usersApiService.createUser.mockResolvedValue(null);

    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    const res = { status, send } as any;

    const result = await controller.addUser(req, res);

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(send).toHaveBeenCalledWith({
      status: 'failed',
      message: 'Failed to create user',
    });
    expect(result).toBeUndefined();
  });

  it('getAllActiveUsers should return NOT_FOUND when no users', async () => {
    const query = { page: 1, limit: 10, fetchInactive: false } as any;
    usersApiService.getAllActiveUsers.mockResolvedValue([]);

    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    const res = { status, send } as any;

    const result = await controller.getAllActiveUsers(query, res);

    expect(usersApiService.getAllActiveUsers).toHaveBeenCalledWith(query);
    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(send).toHaveBeenCalledWith({
      status: 'error',
      message: 'No users found',
    });
    expect(result).toBeUndefined();
  });

  it('getAllActiveUsers should return OK when users exist', async () => {
    const query = { page: 1, limit: 10, fetchInactive: false } as any;
    const users = [{ id: 'u1', username: 'a' }];
    usersApiService.getAllActiveUsers.mockResolvedValue(users);

    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    const res = { status, send } as any;

    const result = await controller.getAllActiveUsers(query, res);

    expect(usersApiService.getAllActiveUsers).toHaveBeenCalledWith(query);
    expect(status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(send).toHaveBeenCalledWith({ status: 'success', data: users });
    expect(result).toBeUndefined();
  });
});
