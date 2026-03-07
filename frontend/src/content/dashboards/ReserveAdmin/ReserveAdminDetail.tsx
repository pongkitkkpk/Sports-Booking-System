import { useParams } from "react-router-dom";
import { courtData } from "./courtData";
import ReserveForm from "./components/ReserveForm";
import ReserveGymForm from "./components/ReserveGymForm";
import { Coronavirus } from "@mui/icons-material";

function ReserveDetail() {
  const { courtType } = useParams<{ courtType: string }>();
  const court = courtData[courtType ?? ""];

  if (!court) {
    return <h2>❌ ไม่พบสนามที่คุณเลือก</h2>;
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
