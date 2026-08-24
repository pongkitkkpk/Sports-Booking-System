import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

interface CourtCardProps {
  title: string;
  description?: string;
  imageUrl: string;
  routeSuffix: string;
  id: number;
}

function CourtCard({
  title,
  description,
  imageUrl,
  routeSuffix,
  id,
}: CourtCardProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const baseLayout = location.pathname.split("/")[1];
  const fullRoute = `/${baseLayout}/dashboards/reserve/${routeSuffix}`;

  return (
    <Card
      sx={{
        borderRadius: 3,
        transition: "0.2s ease",
        "&:hover": {
          boxShadow: "0 4px 14px -4px rgba(16, 24, 40, 0.1), 0 2px 4px -2px rgba(16, 24, 40, 0.04)",
          transform: "translateY(-2px)",
          borderColor: "primary.main",
        },
      }}
    >
      <CardActionArea onClick={() => navigate(fullRoute)}>
        <Box
          component="img"
          src={imageUrl}
          alt={title}
          sx={{
            width: "100%",
            height: 180,
            objectFit: "cover",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        />
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {description}
            </Typography>
          )}
          <Typography
            variant="caption"
            color="primary"
            sx={{ fontWeight: "bold" }}
          >
            คลิกเพื่อดูรายละเอียด / จองสนาม
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default CourtCard;
