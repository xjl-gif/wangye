import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.ADMIN_PASSWORD ?? "changeme";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    create: {
      email,
      passwordHash,
      name: "管理员",
      role: "admin",
    },
    update: {
      passwordHash,
    },
  });

  const count = await prisma.heritageItem.count();
  if (count === 0) {
    await prisma.heritageItem.create({
      data: {
        title: "示例：苏州刺绣",
        summary:
          "苏绣是中国优秀的民族传统工艺之一，以针法精细、色彩雅致著称。本条目为演示数据，可在后台删除或编辑。",
        category: "传统美术",
        region: "江苏",
        source: "admin",
        status: "published",
      },
    });
  }

  console.log("Seed OK. Admin:", email);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
