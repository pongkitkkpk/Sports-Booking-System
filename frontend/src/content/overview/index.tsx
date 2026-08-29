import { useMemo } from 'react';
import {
  Box,
  Card,
  Container,
  Button,
  Grid,
  Typography,
  ThemeProvider,
  useTheme,
  styled
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { createKmutnbTheme } from '../../theme/kmutnbTheme';
import { courtData } from '../dashboards/Reserve/courtData';

const HeaderWrapper = styled(Card)(
  ({ theme }) => `
    width: 100%;
    display: flex;
    align-items: center;
    height: ${theme.spacing(10)};
`
);

const BrandMark = styled(Box)(
  ({ theme }) => `
    width: 40px;
    height: 40px;
    border-radius: ${theme.shape.borderRadius}px;
    display: grid;
    place-items: center;
    font-size: 1.3rem;
    margin-right: ${theme.spacing(1.5)};
    background: linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light});
`
);

const HeroSection = styled(Box)(
  ({ theme }) => `
    padding: ${theme.spacing(10, 2, 8)};
    text-align: center;
`
);

const STEPS = [
  { icon: '1️⃣', title: 'เลือกสนาม', desc: 'เลือกประเภทสนามกีฬาที่ต้องการใช้บริการ' },
  { icon: '2️⃣', title: 'เลือกวันและเวลา', desc: 'เลือกวันที่และช่วงเวลาที่สนามว่าง' },
  { icon: '3️⃣', title: 'กรอกข้อมูล', desc: 'กรอกรหัสนักศึกษาและวัตถุประสงค์การจอง' },
  { icon: '4️⃣', title: 'รอการยืนยัน', desc: 'ระบบจะบันทึกคำขอและรอการอนุมัติ' }
];

const INFO_CARDS = [
  {
    icon: '🕐',
    title: 'เวลาเปิดให้บริการ',
    desc: 'ทุกวัน 08:00 - 21:00 น. (ยกเว้นวันที่มหาวิทยาลัยประกาศปิด)'
  },
  {
    icon: '📋',
    title: 'กฎการใช้สนามทั่วไป',
    desc: 'แต่งกายให้เหมาะสมกับชนิดกีฬา ดูแลความสะอาด และเคารพสิทธิ์ผู้ใช้บริการท่านอื่น'
  },
  {
    icon: '💬',
    title: 'ติดต่อสอบถาม',
    desc: 'ฝ่ายกิจการนักศึกษา อาคาร 40 ปี มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ'
  }
];

function Overview() {
  const baseTheme = useTheme();
  const theme = useMemo(() => createKmutnbTheme(baseTheme), [baseTheme]);
  const courts = Object.entries(courtData);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100%' }}>
        <Helmet>
          <title>ระบบจองสนามกีฬา KMUTNB</title>
        </Helmet>

        <HeaderWrapper>
          <Container maxWidth="lg">
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <BrandMark>🏟</BrandMark>
                <Typography variant="h5">ระบบจองสนามกีฬา KMUTNB</Typography>
              </Box>
              <Button
                component={RouterLink}
                to="/extended-sidebar/dashboards/reserve"
                variant="contained"
              >
                เข้าสู่ระบบ / จองสนาม
              </Button>
            </Box>
          </Container>
        </HeaderWrapper>

        <Container maxWidth="lg">
          <HeroSection>
            <Typography variant="h2" sx={{ mb: 2 }}>
              จองสนามกีฬา KMUTNB ได้ง่ายๆ ในไม่กี่ขั้นตอน
            </Typography>
            <Typography variant="h5" color="text.secondary" fontWeight="normal" sx={{ mb: 4 }}>
              ตรวจสอบสนามว่าง เลือกวันเวลา และส่งคำขอจองออนไลน์ สำหรับนักศึกษาและบุคลากร มจพ.
            </Typography>
            <Button
              component={RouterLink}
              to="/extended-sidebar/dashboards/reserve"
              variant="contained"
              size="large"
            >
              🏟 จองสนามตอนนี้
            </Button>
          </HeroSection>

          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
              สนามที่เปิดให้บริการ
            </Typography>
            <Grid container spacing={3}>
              {courts.map(([key, info]) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <Card
                    component={RouterLink}
                    to={`/extended-sidebar/dashboards/reserve/${key}`}
                    sx={{
                      display: 'block',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: '0.2s ease',
                      '&:hover': {
                        boxShadow:
                          '0 4px 14px -4px rgba(16, 24, 40, 0.1), 0 2px 4px -2px rgba(16, 24, 40, 0.04)',
                        transform: 'translateY(-2px)',
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    <Box
                      component="img"
                      src={info.imageUrl}
                      alt={info.name}
                      sx={{ width: '100%', height: 140, objectFit: 'cover' }}
                    />
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6">{info.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {info.description}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
              วิธีการจองสนาม
            </Typography>
            <Grid container spacing={3}>
              {STEPS.map((step) => (
                <Grid item xs={12} sm={6} md={3} key={step.title}>
                  <Card sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      {step.icon}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.desc}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
              ข้อมูลน่ารู้ก่อนใช้บริการ
            </Typography>
            <Grid container spacing={3}>
              {INFO_CARDS.map((card) => (
                <Grid item xs={12} sm={6} md={4} key={card.title}>
                  <Card sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      {card.icon}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.desc}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>

        <Card sx={{ borderRadius: 0 }}>
          <Box
            sx={{ p: 4 }}
            display={{ xs: 'block', md: 'flex' }}
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <Typography variant="subtitle1" color="text.secondary">
              © {new Date().getFullYear()} ระบบจองสนามกีฬา มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ (KMUTNB)
            </Typography>
          </Box>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default Overview;
