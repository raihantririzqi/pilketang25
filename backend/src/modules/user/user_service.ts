import { PrismaClient } from "../../generated/prisma/client";
import { UserRole } from "../../shared/types/custom_types";
import { UpdateRoleBody } from "./user_type";

export class UserService {
  public constructor(private readonly prisma: PrismaClient) {}

  public get_all_users = async () =>
    await this.prisma.user.findMany();

  public get_user_by_id = async (id: string) =>
    await this.prisma.user.findUnique({ where: { id } });

  public update_role = async (id: string, role: UserRole) =>
    await this.prisma.user.update({
      where: { id },
      data: { role },
    });

  public delete_user = async (id: string) =>
    await this.prisma.user.delete({ where: { id } });
}
