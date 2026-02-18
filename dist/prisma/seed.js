"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const email = process.env.ADMIN_EMAIL;
    const name = process.env.ADMIN_NAME ?? 'Admin';
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) {
        throw new Error('Defina ADMIN_EMAIL e ADMIN_PASSWORD na .env para criar a conta admin no seed. Ex.: ADMIN_EMAIL=admin@exemplo.com ADMIN_PASSWORD=suaSenhaSegura ADMIN_NAME="Admin"');
    }
    const existing = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
    });
    if (existing) {
        if (existing.role === 'admin') {
            console.log('Admin já existe:', email);
            return;
        }
        await prisma.user.update({
            where: { id: existing.id },
            data: { role: 'admin' },
        });
        console.log('Usuário existente promovido a admin:', email);
        return;
    }
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    await prisma.user.create({
        data: {
            email: email.toLowerCase(),
            name: name.trim(),
            passwordHash,
            role: 'admin',
        },
    });
    console.log('Conta admin criada:', email);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map