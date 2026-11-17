import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { PrismaService } from '../prisma/prisma.service';
import { SendGridService } from '../mail/sendgrid.service';
import { UserRole } from '@prisma/client';

import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ProfileService', () => {
  let service: ProfileService;

  const mockProfile = {
    id: 'profile-uuid-001',
    email: 'manager@loveworld.com',
    firstName: 'System',
    lastName: 'Manager',
    phone: '+1234567890',
    role: UserRole.MANAGER,
    externalAuthId: 'external-auth-manager-001',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    profile: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockSendGridService = {
    sendTeamInviteEmail: jest.fn(),
  };

  beforeEach(async () => {
    mockSendGridService.sendTeamInviteEmail.mockResolvedValue(true);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: SendGridService,
          useValue: mockSendGridService,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProfile', () => {
    it('should successfully create a new profile', async () => {
      mockPrismaService.profile.findUnique.mockResolvedValue(null);
      mockPrismaService.profile.create.mockResolvedValue(mockProfile);

      const dto = {
        email: 'manager@loveworld.com',
        firstName: 'System',
        lastName: 'Manager',
        role: UserRole.MANAGER,
        externalAuthId: 'external-auth-manager-001',
      };

      const result = await service.createProfile(dto);
      expect(result).toEqual(mockProfile);
      expect(mockPrismaService.profile.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      mockPrismaService.profile.findUnique.mockResolvedValue(mockProfile);

      const dto = {
        email: 'manager@loveworld.com',
        firstName: 'System',
        lastName: 'Manager',
        role: UserRole.MANAGER,
      };

      await expect(service.createProfile(dto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findProfileById', () => {
    it('should return profile if found', async () => {
      mockPrismaService.profile.findUnique.mockResolvedValue(mockProfile);

      const result = await service.findProfileById('profile-uuid-001');
      expect(result).toEqual(mockProfile);
    });

    it('should throw NotFoundException if profile does not exist', async () => {
      mockPrismaService.profile.findUnique.mockResolvedValue(null);

      await expect(service.findProfileById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllProfiles', () => {
    it('should return an array of profiles', async () => {
      mockPrismaService.profile.findMany.mockResolvedValue([mockProfile]);

      const result = await service.findAllProfiles();
      expect(result).toEqual([mockProfile]);
    });

    it('filters by active state', async () => {
      mockPrismaService.profile.findMany.mockResolvedValue([]);

      await service.findAllProfiles({ isActive: false });

      expect(mockPrismaService.profile.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isActive: false } }),
      );
    });
  });

  // ADR 0016 — the console must never lock itself out.
  describe('team safeguards', () => {
    const staff = {
      ...mockProfile,
      id: 'profile-staff',
      email: 'staff@loveworld.com',
      role: UserRole.STAFF,
    };

    it('refuses a manager demoting themselves', async () => {
      mockPrismaService.profile.findUnique.mockResolvedValue(mockProfile);

      await expect(
        service.updateProfile(
          mockProfile.id,
          { role: UserRole.STAFF },
          'Manager@Loveworld.com',
        ),
      ).rejects.toThrow(ConflictException);
      expect(mockPrismaService.profile.update).not.toHaveBeenCalled();
    });

    it('refuses a manager deactivating themselves', async () => {
      mockPrismaService.profile.findUnique.mockResolvedValue(mockProfile);

      await expect(
        service.deactivateProfile(mockProfile.id, 'manager@loveworld.com'),
      ).rejects.toThrow(ConflictException);
    });

    it('refuses removing the last active manager', async () => {
      mockPrismaService.profile.findUnique.mockResolvedValue(mockProfile);
      mockPrismaService.profile.count.mockResolvedValue(1);

      await expect(
        service.deactivateProfile(
          mockProfile.id,
          'other.manager@loveworld.com',
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('allows demoting a manager when another active manager remains', async () => {
      mockPrismaService.profile.findUnique.mockResolvedValue(mockProfile);
      mockPrismaService.profile.count.mockResolvedValue(2);
      mockPrismaService.profile.update.mockResolvedValue({
        ...mockProfile,
        role: UserRole.STAFF,
      });

      await expect(
        service.updateProfile(
          mockProfile.id,
          { role: UserRole.STAFF },
          'other.manager@loveworld.com',
        ),
      ).resolves.toMatchObject({ role: UserRole.STAFF });
    });

    it('does not count managers for changes that keep everyone’s access', async () => {
      mockPrismaService.profile.findUnique.mockResolvedValue(staff);
      mockPrismaService.profile.update.mockResolvedValue(staff);

      await service.updateProfile(
        staff.id,
        { firstName: 'Bisi' },
        'manager@loveworld.com',
      );

      expect(mockPrismaService.profile.count).not.toHaveBeenCalled();
    });
  });

  describe('resendInvite', () => {
    it('re-sends the team invite to an active member', async () => {
      mockPrismaService.profile.findUnique.mockResolvedValue({
        ...mockProfile,
        email: 'staff@loveworld.com',
        role: UserRole.STAFF,
      });

      await expect(
        service.resendInvite('profile-staff', 'manager@loveworld.com'),
      ).resolves.toEqual({ sent: true });
      expect(mockSendGridService.sendTeamInviteEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'staff@loveworld.com',
          role: UserRole.STAFF,
        }),
      );
    });

    it('refuses a deactivated account', async () => {
      mockPrismaService.profile.findUnique.mockResolvedValue({
        ...mockProfile,
        isActive: false,
      });

      await expect(
        service.resendInvite('profile-uuid-001', 'manager@loveworld.com'),
      ).rejects.toThrow(ConflictException);
      expect(mockSendGridService.sendTeamInviteEmail).not.toHaveBeenCalled();
    });
  });
});
