import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import { useSnackbar } from "notistack";

interface ReserveItem {
  court: string;
  date: string; // ISO format e.g. "2025-08-27"
  time: string; // e.g. "10:00 - 11:00"
  court_id: number;
  time_slot_id: number;
}

function ReserveInfoForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedItems: ReserveItem[] = location.state?.items || [];
  const { enqueueSnackbar } = useSnackbar();

  const [adminId, setAdminId] = useState("");
  const [adminName, setAdminName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [icit, setIcit] = useState("");
  const [icitOptions, setIcitOptions] = useState<string[]>([]);

  useEffect(() => {
    // TODO: fetch from backend; ใช้ mock ไปก่อน
    setTimeout(() => {
      setIcitOptions([
        "ICIT คณะเทคโนโลยีอุตสาหกรรม",
        "FIT คณะเทคโนโลยีสารสนเทศ",
        "FTE คณะวิศวกรรมศาสตร์",
        "FIB คณะบริหารธุรกิจ",
        "อื่น ๆ",
      ]);
    }, 500);
  }, []);

  const baseAPIUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async () => {
    if (!adminId || !adminName || !purpose || !icit) {
      enqueueSnackbar("❗ กรุณากรอกข้อมูลให้ครบถ้วน", {
        variant: "warning",
        autoHideDuration: 1500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    try {
      const payload = {
        student_id: adminId,
        student_name: adminName,
        icit: icit,
        bookingStatusId: parseInt(purpose),
        slots: selectedItems.map((x) => ({
          court_id: x.court_id,
          time_slot_id: x.time_slot_id,
          date: dayjs(x.date).format("YYYY-MM-DD"),
        })),
      };

      console.log(payload);

      const res = await axios.post(
        `${baseAPIUrl}/api/admin/reservation-slots`,
        payload
      );

      enqueueSnackbar(
        `✅ ส่งคำขอจองเรียบร้อย:
ชื่อ: ${adminName}
รหัส: ${adminId}
ICIT: ${icit}
สถานะ: ${purpose}
รายการ:
${selectedItems
  .map((x) => `• ${x.court} ${dayjs(x.date).format("DD MMM YYYY")} ${x.time}`)
  .join("\n")}`,
        {
          variant: "success",
          autoHideDuration: 3000,
          style: {
            whiteSpace: "pre-line",
            fontSize: "0.95rem",
          },
        }
      );

      navigate(
        `/extended-sidebar/dashboards/reserve-admin/${selectedItems[0].type_court}`
      );
    } catch (error) {
      console.error("❌ ไม่สามารถส่งคำขอได้", error);
      alert("❌ เกิดข้อผิดพลาดในการส่งคำขอ หรือ ตารางจองไม่ว่างแล้วครับ");
      navigate(
        `/extended-sidebar/dashboards/reserve-admin/${selectedItems[0].type_court}`
      );
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        ✍️ กรอกรายละเอียดการจอง
      </Typography>

      {/* รายการที่เลือก */}
      <Box
        sx={{ my: 2 }}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
      >
        {/* ✅ ฝั่งซ้าย: ข้อความ + Chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            📅 รายการที่เลือกจอง:
          </Typography>
          {selectedItems.map((item, idx) => (
            <Chip
              key={idx}
              label={`${item.court} • ${dayjs(item.date).format(
                "DD MMM YYYY"
              )} • ${item.time}`}
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>

        {/* ✅ ฝั่งขวา: ปุ่มย้อนกลับ */}
        <Button
          variant="contained"
          component={RouterLink}
          to={`/extended-sidebar/dashboards/reserve-admin/${selectedItems[0]?.type_court}`}
          startIcon={<ArrowBackTwoToneIcon />}
          sx={{ mt: { xs: 2, sm: 0 } }} // สำหรับ responsive
        >
          ย้อนกลับ
        </Button>
      </Box>

      <TextField
        label="รหัสนักศึกษา"
        fullWidth
        margin="normal"
        value={adminId}
        onChange={(e) => setAdminId(e.target.value)}
      />
      <TextField
        label="ชื่อนักศึกษา"
        fullWidth
        margin="normal"
        value={adminName}
        onChange={(e) => setAdminName(e.target.value)}
      />
      <TextField
        label="หน่วยงาน / คณะ (ICIT)"
        select
        fullWidth
        margin="normal"
        value={icit}
        onChange={(e) => setIcit(e.target.value)}
      >
        {icitOptions.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="จุดประสงค์ในการจอง"
        fullWidth
        margin="normal"
        select
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
      >
        <MenuItem value="4">ปรับปรุง</MenuItem>
        <MenuItem value="5">ปิดมหาวิทยาลัย</MenuItem>
        <MenuItem value="6">ปิดaaa</MenuItem>
      </TextField>
      {/* เงื่อนไขของสนามที่จอง */}

      <Box sx={{ mt: 3, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          📌 เงื่อนไขการใช้สนาม:
        </Typography>

        {selectedItems.length === 0 && (
          <Typography color="text.secondary">
            ยังไม่มีรายการสนามที่เลือก
          </Typography>
        )}

        {selectedItems.length > 0 && selectedItems[0].court.includes("ยิม") && (
          <Box sx={{ ml: 2 }}>
            <ul>
              {[
                "กรุณาใส่รองเท้ากีฬาเท่านั้น",
                "งดใช้เครื่องเสียงรบกวนผู้อื่น",
                "ห้ามกินอาหารและเครื่องดื่มในสนาม",
              ].map((txt, i) => (
                <li key={`gym-${i}`} style={{ marginBottom: 4 }}>
                  {txt}
                </li>
              ))}
            </ul>
          </Box>
        )}

        {selectedItems.length > 0 &&
          selectedItems[0].court.includes("แบดมินตัน") && (
            <Box sx={{ ml: 2 }}>
              <ul>
                {[
                  "ใช้อุปกรณ์ส่วนตัวเท่านั้น (ไม้/ลูก)",
                  "งดใส่รองเท้าที่พื้นดำหรือมีตะปู",
                  "ห้ามลากเก้าอี้หรืออุปกรณ์บนพื้นสนาม",
                ].map((txt, i) => (
                  <li key={`badminton-${i}`} style={{ marginBottom: 4 }}>
                    {txt}
                  </li>
                ))}
              </ul>
            </Box>
          )}

        {selectedItems.length > 0 &&
          selectedItems[0].court.includes("ฟุตซอล") && (
            <Box sx={{ ml: 2 }}>
              <ul>
                {[
                  "ใช้รองเท้าพื้นเรียบเท่านั้น",
                  "ไม่อนุญาตให้เตะบอลใส่กำแพง",
                  "ห้ามเล่นเกินจำนวนคนที่กำหนด",
                ].map((txt, i) => (
                  <li key={`futsal-${i}`} style={{ marginBottom: 4 }}>
                    {txt}
                  </li>
                ))}
              </ul>
            </Box>
          )}

        {selectedItems.length > 0 &&
          selectedItems[0].court.includes("เทนนิส") && (
            <Box sx={{ ml: 2 }}>
              <ul>
                {[
                  "งดใช้รองเท้าหนาม",
                  "ห้ามเล่นขณะฝนตก",
                  "เคารพสิทธิ์ผู้อื่นและไม่ส่งเสียงดัง",
                ].map((txt, i) => (
                  <li key={`tennis-${i}`} style={{ marginBottom: 4 }}>
                    {txt}
                  </li>
                ))}
              </ul>
            </Box>
          )}

        {selectedItems.length > 0 &&
          selectedItems[0].court.includes("basketball") && (
            <Box sx={{ ml: 2 }}>
              <ul>
                {[
                  "งดใช้รองเท้าหนาม",
                  "ห้ามเล่นขณะฝนตก",
                  "เคารพสิทธิ์ผู้อื่นและไม่ส่งเสียงดัง",
                ].map((txt, i) => (
                  <li key={`basketball-${i}`} style={{ marginBottom: 4 }}>
                    {txt}
                  </li>
                ))}
              </ul>
            </Box>
          )}
      </Box>

      <Box
        sx={{ mt: 3 }}
        display="flex"
        justifyContent="flex"
        gap={2}
        flexWrap="wrap"
      >
        <Button
          variant="outlined"
          color="error"
          component={RouterLink}
          to={`/extended-sidebar/dashboards/reserve-admin/${selectedItems[0]?.type_court}`}
          startIcon={<ArrowBackTwoToneIcon />}
        >
          ยกเลิก(อันไหนดี)
        </Button>

        <Button variant="contained" onClick={handleSubmit}>
          ✅ ยืนยันการส่งคำขอจอง
        </Button>
      </Box>
    </Box>
  );
}

export default ReserveInfoForm;
