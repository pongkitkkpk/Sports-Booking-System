import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { courtData } from "./courtData";
import ReserveForm from "./components/ReserveForm";
import ReserveGymForm from "./components/ReserveGymForm";

function ReserveDetail() {
  const { courtType } = useParams<{ courtType: string }>();
  const court = courtData[courtType ?? ""];

  if (!court) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h2" sx={{ mb: 1 }}>
          ❌
        </Typography>
        <Typography variant="h4" gutterBottom>
          ไม่พบสนามที่คุณเลือก
        </Typography>
        <Typography color="text.secondary">
          กรุณาย้อนกลับไปเลือกสนามอีกครั้ง
        </Typography>
      </Box>
    );
  }

  // if (courtType === "gym") {
  //   return <ReserveGymForm courtType="gym" courtInfo={court} />;
  // }

  return (
    <ReserveForm
      courtType={courtType!}
      courtInfo={court}
      courtCount={court.capacity}
    />
  );
}

export default ReserveDetail;
