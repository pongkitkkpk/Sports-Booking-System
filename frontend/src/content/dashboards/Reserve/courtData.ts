export const courtData: Record<
  string,
  {
    name: string;
    imageUrl: string;
    description: string;
    capacity: number;
    unit: "สนาม" | "คน";
    id: number;
  }
> = {
  badminton: {
    name: "สนามแบดมินตัน",
    imageUrl:
      "https://images.pexels.com/photos/2202685/pexels-photo-2202685.jpeg",
    description: "สนามแบดมินตัน ชั้น 7 อาคาร 40 ปี มีทั้งหมด 4 สนาม",
    capacity: 4,
    unit: "สนาม",
    id: 1, // id แรกของแบด
  },

  volleyball: {
    name: "สนามวอลเลย์บอล",
    imageUrl:
      "https://images.pexels.com/photos/6203560/pexels-photo-6203560.jpeg",
    description: "สนามวอลเลย์บอลพื้นไม้มาตรฐาน ชั้น 7 อาคาร 40 ปี",
    capacity: 1,
    unit: "สนาม",
    id: 5,
  },
  basketball: {
    name: "สนามบาสเกตบอล",
    imageUrl:
      "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg",
    description: "สนามบาสเกตบอลพื้นยาง ชั้น 3 อาคาร 40 ปี",
    capacity: 1,
    unit: "สนาม",
    id: 6,
  },
  futsal: {
    name: "สนามฟุตซอล",
    imageUrl:
      "https://images.pexels.com/photos/3846652/pexels-photo-3846652.jpeg",
    description:
      "สนามฟุตซอลในร่ม ชั้น 3 และชั้น 12 อาคาร 40 ปี เปิดบริการ 08:00 - 21:00 น.",
    capacity: 2,
    unit: "สนาม",
    id: 7, // id แรกของฟุตซอล
  },

  boxing: {
    name: "สนามมวย",
    imageUrl:
      "https://images.pexels.com/photos/8611244/pexels-photo-8611244.jpeg",
    description: "เวทีมวยมาตรฐานสำหรับฝึกซ้อม ชั้น 12 อาคาร 40 ปี",
    capacity: 1,
    unit: "สนาม",
    id: 9,
  },
  judo: {
    name: "สนามยูโด",
    imageUrl:
      "https://images.pexels.com/photos/6253172/pexels-photo-6253172.jpeg",
    description: "ลานยูโดพื้น tatami ชั้น 12 อาคาร 40 ปี",
    capacity: 1,
    unit: "สนาม",
    id: 10,
  },

  tennis: {
    name: "สนามเทนนิส",
    imageUrl:
      "https://images.pexels.com/photos/5740519/pexels-photo-5740519.jpeg",
    description: "สนามเทนนิสกลางแจ้ง ชั้น 12 อาคาร 40 ปี",
    capacity: 1,
    unit: "สนาม",
    id: 11,
  },
  football: {
    name: "สนามฟุตบอลลอยฟ้า",
    imageUrl:
      "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg",
    description: "สนามฟุตบอลพื้นหญ้าเทียม บนลานอาคารสนามกีฬา",
    capacity: 1,
    unit: "สนาม",
    id: 12,
  },
  gym: {
    name: "ยิมออกกำลังกาย",
    imageUrl:
      "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&fit=crop&w=800&q=60",
    description: "ยิมออกกำลังกายพร้อมอุปกรณ์ อยู่ที่สนามบอลลอยฟ้า",
    capacity: 1,
    unit: "สนาม",
    id: 13,
  },
};
