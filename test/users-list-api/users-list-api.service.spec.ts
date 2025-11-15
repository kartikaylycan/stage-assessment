jest.mock('src/modules/users-list/users-list.adaptor', () => ({
  UsersListAdaptor: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { UsersListApiService } from '../../src/apis/users-list-api/users-list-api.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UsersListAdaptor } from 'src/modules/users-list/users-list.adaptor';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

describe('UsersListApiService', () => {
  let service: UsersListApiService;
  let usersListAdaptor: any;
  let mockLogger: { log: jest.Mock };

  beforeEach(async () => {
    usersListAdaptor = {
      getAllUsersList: jest.fn(),
      searchAndAddConentInUserList: jest.fn(),
      searchUserListByUserId: jest.fn(),
      removeContentFromUserList: jest.fn(),
    };

    mockLogger = { log: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersListApiService,
        { provide: WINSTON_MODULE_NEST_PROVIDER, useValue: mockLogger },
        { provide: UsersListAdaptor, useValue: usersListAdaptor },
      ],
    }).compile();

    service = module.get<UsersListApiService>(UsersListApiService);
  });

  it('getAllUsersList should call adaptor with page and limit', () => {
    const query = { page: 2, limit: 5 } as any;

    service.getAllUsersList(query);

    expect(usersListAdaptor.getAllUsersList).toHaveBeenCalledWith(2, 5);
  });

  it('addContentToUserList should throw BadRequestException when content exists', async () => {
    const req = { userId: 'u1', contentId: 'c1', category: 'MOVIE' } as any;
    usersListAdaptor.searchAndAddConentInUserList.mockResolvedValue({
      matchedCount: 0,
      upsertedCount: 0,
    });

    await expect(service.addContentToUserList(req)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('addContentToUserList should return user list when content added', async () => {
    const req = { userId: 'u1', contentId: 'c1', category: 'MOVIE' } as any;
    const userList = { userId: 'u1', movies: ['c1'] };
    usersListAdaptor.searchAndAddConentInUserList.mockResolvedValue({
      matchedCount: 1,
      upsertedCount: 0,
    });
    usersListAdaptor.searchUserListByUserId.mockResolvedValue(userList);

    const res = await service.addContentToUserList(req);

    expect(res).toEqual(userList);
  });

  it('addContentToUserList should throw BadRequestException on duplicate key error', async () => {
    const req = { userId: 'u1', contentId: 'c1', category: 'MOVIE' } as any;
    const err = new Error('Duplicate key');
    (err as any).code = 11000;
    usersListAdaptor.searchAndAddConentInUserList.mockRejectedValue(err);

    await expect(service.addContentToUserList(req)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('removeContentFromUserList should throw BadRequestException when user list not found', async () => {
    const query = { userId: 'u1', contentId: 'c1', category: 'MOVIE' } as any;
    usersListAdaptor.searchUserListByUserId.mockResolvedValue(null);

    await expect(service.removeContentFromUserList(query)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('removeContentFromUserList should throw BadRequestException when content not found', async () => {
    const query = { userId: 'u1', contentId: 'c1', category: 'MOVIE' } as any;
    usersListAdaptor.searchUserListByUserId.mockResolvedValue({
      userId: 'u1',
      movies: [],
    });
    usersListAdaptor.removeContentFromUserList.mockResolvedValue(null);

    await expect(service.removeContentFromUserList(query)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('removeContentFromUserList should return success', async () => {
    const query = { userId: 'u1', contentId: 'c1', category: 'MOVIE' } as any;
    usersListAdaptor.searchUserListByUserId.mockResolvedValue({
      userId: 'u1',
      movies: ['c1'],
    });
    usersListAdaptor.removeContentFromUserList.mockResolvedValue(true);

    const res = await service.removeContentFromUserList(query);

    expect(res).toBeUndefined();
  });
});
