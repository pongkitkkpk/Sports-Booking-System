import * as Yup from 'yup';
import type { FC } from 'react';
import { Formik } from 'formik';

import {
  Button,
  FormHelperText,
  MenuItem,
  TextField,
  CircularProgress
} from '@mui/material';
import useAuth from '../../../../hooks/useAuth';
import useRefMounted from '../../../../hooks/useRefMounted';

// Mirrors the mock users seeded in backend/src/auth/auth.service.ts —
// there is no self-registration, so picking one here is how a reviewer
// gets in, the same way DMS_c hands out pre-provisioned test accounts.
const MOCK_ACCOUNTS = [
  { label: 'นักศึกษา — student01', username: 'student01', password: '1234' },
  { label: 'เจ้าหน้าที่ — staff01', username: 'staff01', password: 'abcd' },
  { label: 'ผู้ดูแลระบบ — admin', username: 'admin', password: 'admin' }
];

const LoginJWT: FC = () => {
  const { login } = useAuth() as any;
  const isMountedRef = useRefMounted();

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().max(255).required('กรุณากรอกชื่อผู้ใช้'),
        password: Yup.string().max(255).required('กรุณากรอกรหัสผ่าน')
      })}
      onSubmit={async (
        values,
        { setErrors, setStatus, setSubmitting }
      ): Promise<void> => {
        try {
          await login(values.username, values.password);

          if (isMountedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
          }
        } catch (err: any) {
          if (isMountedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        touched,
        values
      }): JSX.Element => (
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            select
            fullWidth
            margin="normal"
            label="บัญชีทดสอบ"
            value=""
            onChange={(e) => {
              const account = MOCK_ACCOUNTS.find(
                (a) => a.username === e.target.value
              );
              if (account) {
                setFieldValue('username', account.username);
                setFieldValue('password', account.password);
              }
            }}
          >
            {MOCK_ACCOUNTS.map((account) => (
              <MenuItem key={account.username} value={account.username}>
                {account.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            error={Boolean(touched.username && errors.username)}
            fullWidth
            margin="normal"
            autoFocus
            helperText={touched.username && errors.username}
            label="ชื่อผู้ใช้"
            name="username"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.username}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            margin="normal"
            helperText={touched.password && errors.password}
            label="รหัสผ่าน"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />

          {Boolean(errors.submit) && (
            <FormHelperText error sx={{ mt: 1 }}>
              {errors.submit as any}
            </FormHelperText>
          )}

          <Button
            sx={{ mt: 3 }}
            color="primary"
            startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
            disabled={isSubmitting}
            type="submit"
            fullWidth
            size="large"
            variant="contained"
          >
            เข้าสู่ระบบ
          </Button>
        </form>
      )}
    </Formik>
  );
};

export default LoginJWT;
