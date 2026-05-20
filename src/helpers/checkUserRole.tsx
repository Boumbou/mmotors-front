export default function checkIsStaff(user: any): boolean {
    if (!user || !user.roles) {
        return false;
    }
    return user.roles.includes("Staff") || user.roles.includes("Admin");
}