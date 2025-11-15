jest.mock('src/modules/users-list/users-list.adaptor', () => ({
  UsersListAdaptor: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { UsersListController } from '../../src/apis/users-list-api/users-list-api.controller';
import { UsersListApiService } from '../../src/apis/users-list-api/users-list-api.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HttpStatus } from '@nestjs/common';

describe('UsersListController', () => {
  let controller: UsersListController;
  let usersListApiService: any;
  let mockLogger: { log: jest.Mock };

  beforeEach(async () => {
    usersListApiService = {
      getAllUsersList: jest.fn(),
      addContentToUserList: jest.fn(),
      removeContentFromUserList: jest.fn(),
    };

    mockLogger = { log: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersListController],
      providers: [
        { provide: WINSTON_MODULE_NEST_PROVIDER, useValue: mockLogger },
        { provide: UsersListApiService, useValue: usersListApiService },
      ],
    }).compile();

    controller = module.get<UsersListController>(UsersListController);
  });

  it('fetchAllUsersList should return NOT_FOUND when empty', async () => {
    const query = { page: 1, limit: 10 } as any;
    usersListApiService.getAllUsersList.mockResolvedValue([]);

    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    const res = { status, send } as any;

    await controller.fetchAllUsersList(query, res);

    expect(usersListApiService.getAllUsersList).toHaveBeenCalledWith(query);
    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(send).toHaveBeenCalledWith({
      status: 'error',
      message: 'No users list found',
    });
  });

  it('fetchAllUsersList should return OK with data', async () => {
    const query = { page: 1, limit: 10 } as any;
    const lists = [{ userId: 'u1', movies: [] }];
    usersListApiService.getAllUsersList.mockResolvedValue(lists);

    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    const res = { status, send } as any;

    await controller.fetchAllUsersList(query, res);

    expect(status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(send).toHaveBeenCalledWith({ status: 'success', data: lists });
  });

  it('addContentToUserList should return ACCEPTED with data', async () => {
    const req = { userId: 'u1', contentId: 'c1', category: 'MOVIE' } as any;
    const result = { userId: 'u1', movies: ['c1'] };
    usersListApiService.addContentToUserList.mockResolvedValue(result);

    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    const res = { status, send } as any;

    await controller.addContentToUserList(req, res);

    expect(usersListApiService.addContentToUserList).toHaveBeenCalledWith(req);
    expect(status).toHaveBeenCalledWith(HttpStatus.ACCEPTED);
    expect(send).toHaveBeenCalledWith({ status: 'success', data: result });
  });

  it('removeContent should return OK with data', async () => {
    const query = { userId: 'u1', contentId: 'c1', category: 'TV_SHOW' } as any;
    const result = { userId: 'u1', tvShows: [] };
    usersListApiService.removeContentFromUserList.mockResolvedValue(result);

    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    const res = { status, send } as any;

    await controller.removeContent(query, res);

    expect(usersListApiService.removeContentFromUserList).toHaveBeenCalledWith(
      query,
    );
    expect(status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(send).toHaveBeenCalledWith({ status: 'success', data: result });
  });
});
