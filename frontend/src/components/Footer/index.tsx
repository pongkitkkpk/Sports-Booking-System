import { Box, Card, Typography, styled } from '@mui/material';

const FooterWrapper = styled(Card)(
  ({ theme }) => `
        border-radius: 0;
        margin-top: ${theme.spacing(4)};
`
);

function Footer() {
  return (
    <FooterWrapper className="footer-wrapper">
      <Box
        p={4}
        display={{ xs: 'block', md: 'flex' }}
        alignItems="center"
        textAlign={{ xs: 'center', md: 'left' }}
        justifyContent="center"
      >
        <Typography variant="subtitle1">
          &copy; {new Date().getFullYear()} ระบบจองสนามกีฬา มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ (KMUTNB)
        </Typography>
      </Box>
    </FooterWrapper>
  );
}

export default Footer;
