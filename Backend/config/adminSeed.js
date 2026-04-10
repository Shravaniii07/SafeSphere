import User from "../models/User.js";
import bcrypt from "bcryptjs";

const seedAdmin = async () => {
    try {
        const admins = [
            { email: "admin@safesphere.com", name: "SafeSphere Root" },
            { email: "shravanibodare@gmail.com", name: "Shravani Admin" }
        ];
        const adminPassword = "admin123";
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        for (const adminData of admins) {
            // Force create or update to ensure 'admin' role and 'admin123' password
            await User.findOneAndUpdate(
                { email: adminData.email },
                { 
                    $set: { 
                        name: adminData.name,
                        password: hashedPassword,
                        role: "admin",
                        isVerified: true
                    } 
                },
                { upsert: true, new: true }
            );
            console.log(`🚀 Admin Access Forced: ${adminData.email} / ${adminPassword}`);
        }
    } catch (error) {
        console.error("❌ Admin seeding error:", error.message);
    }
};

export default seedAdmin;
