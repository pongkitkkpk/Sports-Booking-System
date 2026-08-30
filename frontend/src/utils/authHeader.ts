// fetch() ไม่ใช้ axios.defaults ดังนั้นหน้าไหนที่ยิง fetch() ตรง ๆ ไปยัง endpoint
// ที่ backend บังคับ login (เช่น /api/admin/reservation-slots/*) ต้องแนบ header นี้เอง
export const authHeader = (): Record<string, string> => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
