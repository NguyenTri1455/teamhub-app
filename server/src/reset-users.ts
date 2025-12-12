import { AppDataSource } from "./data-source";
import { User } from "./entities/User";

AppDataSource.initialize().then(async () => {
    console.log("Resetting Users...");
    const userRepo = AppDataSource.getRepository(User);

    try {
        await userRepo.clear();
        console.log("All users deleted.");
    } catch (e) {
        console.log("Could not clear users table (might be empty or constraints):", e);
        const users = await userRepo.find();
        await userRepo.remove(users);
        console.log("All users removed via remove().");
    }

    // Create Admin
    const admin = new User();
    admin.username = "admin";
    admin.password = "123456"; // Plain text
    admin.role = "admin";
    admin.name = "System Admin";
    await userRepo.save(admin);
    console.log("Admin User Re-created: admin / 123456");

    process.exit(0);
}).catch(error => {
    console.log(error);
    process.exit(1);
});
