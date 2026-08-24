import { useMemo } from 'react';
import {
  Box,
  Card,
  Typography,
  Container,
  styled,
  ThemeProvider,
  useTheme
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import JWTLogin from '../LoginJWT';
import { createKmutnbTheme } from '../../../../../theme/kmutnbTheme';

const MainContent = styled(Box)(
  () => `
    width: 100%;
    min-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`
);

const BrandMark = styled(Box)(
  ({ theme }) => `
    width: 56px;
    height: 56px;
    border-radius: ${theme.shape.borderRadius}px;
    display: grid;
    place-items: center;
    font-size: 1.8rem;
    margin: 0 auto ${theme.spacing(2)};
    background: linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light});
`
);

function LoginCover() {
  const baseTheme = useTheme();
  const loginTheme = useMemo(() => createKmutnbTheme(baseTheme), [baseTheme]);

  return (
    <ThemeProvider theme={loginTheme}>
      <Helmet>
        <title>เข้าสู่ระบบ - ระบบจองสนามกีฬา KMUTNB</title>
      </Helmet>
      <MainContent>
        <Container maxWidth="xs">
          <Card sx={{ p: 4 }}>
            <Box textAlign="center">
              <BrandMark>🏟</BrandMark>
              <Typography variant="h2" sx={{ mb: 1 }}>
                เข้าสู่ระบบ
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{ mb: 3 }}
              >
                ระบบจองสนามกีฬา KMUTNB
              </Typography>
            </Box>
            <JWTLogin />
          </Card>
        </Container>
      </MainContent>
    </ThemeProvider>
  );
}

export default LoginCover;
