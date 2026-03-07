import {
  CardHeader,
  Divider,
  Card,
  LinearProgress,
  List,
  ListItem,
  Box,
  Typography,
  styled,
} from "@mui/material";

import { useTranslation } from "react-i18next";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SportsVolleyballIcon from "@mui/icons-material/SportsVolleyball";
import SportsMartialArtsIcon from "@mui/icons-material/SportsMartialArts";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SportsMmaIcon from "@mui/icons-material/SportsMma";
import { useEffect, useState } from "react";
import axios from "axios";

const LinearProgressWrapper = styled(LinearProgress)(
  ({ theme }) => `
    flex-grow: 1;
    margin-right: ${theme.spacing(1)};
`
);

const ListItemWrapper = styled(ListItem)(`
  border-radius: 0;
`);

const courtMeta = {
  badminton: {
    icon: <SportsTennisIcon color="primary" />,
    label: "แบดมินตัน",
    progressColor: "primary",
  },
  futsal: {
    icon: <SportsSoccerIcon color="success" />,
    label: "ฟุตซอล",
    progressColor: "success",
  },
  volleyball: {
    icon: <SportsVolleyballIcon color="warning" />,
    label: "วอลเลย์บอล",
    progressColor: "warning",
  },
  judo: {
    icon: <SportsMartialArtsIcon color="error" />,
    label: "ยูโด",
    progressColor: "error",
  },
  gym: {
    icon: <FitnessCenterIcon color="secondary" />,
    label: "ยิมออกกำลังกาย",
    progressColor: "secondary",
  },
  basketball: {
    icon: <SportsSoccerIcon color="info" />,
    label: "บาสเกตบอล",
    progressColor: "info",
  },
  boxing: {
    icon: <SportsMmaIcon color="error" />,
    label: "มวย",
    progressColor: "error",
  },
  tennis: {
    icon: <SportsTennisIcon color="secondary" />,
    label: "เทนนิส",
    progressColor: "secondary",
  },
  football: {
    icon: <SportsSoccerIcon color="success" />,
    label: "ฟุตบอล",
    progressColor: "success",
  },
};

function SessionsByTime() {
  const { t }: { t: any } = useTranslation();
  const [data, setData] = useState<
    Record<string, { available: number; total: number }>
  >({});
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetch = async () => {
      try {
        const [generalRes, gymRes] = await Promise.all([
          axios.get(`${baseUrl}/api/reservation-slots/available-next-hour`),
          axios.get(`${baseUrl}/api/reservation-slots/gym-available-next-hour`),
        ]);

        const combinedData = {
          ...generalRes.data,
          ...gymRes.data,
        };

        setData(combinedData);
      } catch (err) {
        console.error("Error fetching availability:", err);
      }
    };

    fetch();
  }, []);

  return (
    <Card>
      <CardHeader
        title={t("ความหนาแน่นของสนามที่ว่างในชั่วโมงถัดไป")}
        subheader={t("(จำนวนสนาม ยกเว้นยิมที่คิดเป็นจำนวนคน)")}
      />
      <Divider />
      <List
        disablePadding
        component="nav"
        sx={{
          svg: {
            width: 28,
            mr: 1,
          },
        }}
      >
        {Object.entries(data).map(([type, { available, total }]) => {
          const meta = courtMeta[type as keyof typeof courtMeta];
          if (!meta) return null;
          const percent = (available / total) * 100;

          return (
            <div key={type}>
              <ListItemWrapper sx={{ py: 3.15 }}>
                {meta.icon}
                <Typography
                  variant="h5"
                  color="text.primary"
                  noWrap
                  sx={{ minWidth: 120 }}
                >
                  {meta.label}
                </Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  flexWrap="wrap"
                  sx={{ ml: 1, flexGrow: 1 }}
                >
                  <LinearProgressWrapper
                    value={percent}
                    color={meta.progressColor as any}
                    variant="determinate"
                  />
                  <Typography variant="h5" color="text.primary" sx={{ ml: 1 }}>
                    ว่าง {available}/{total} {type === "gym" ? "คน" : "สนาม"}
                  </Typography>
                </Box>
              </ListItemWrapper>
              <Divider />
            </div>
          );
        })}
      </List>
    </Card>
  );
}

export default SessionsByTime;
