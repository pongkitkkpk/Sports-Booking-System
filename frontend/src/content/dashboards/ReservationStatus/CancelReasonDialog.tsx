// CancelReasonDialog.tsx (minimal + extra info)
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";

const schema = Yup.object().shape({
  reason: Yup.string()
    .trim()
    .min(3, "พิมพ์อย่างน้อย 3 ตัวอักษร")
    .required("กรุณาระบุเหตุผล"),
});

export default function CancelReasonDialog({
  open,
  slot,
  onClose,
  onSubmit, // (reason: string) => Promise<void> | void
  submitting = false,
}: {
  open: boolean;
  slot: any;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void> | void;
  submitting?: boolean;
}) {
  const start = String(slot?.start ?? "").slice(0, 5);
  const end = String(slot?.end ?? "").slice(0, 5);

  const courtName = slot?.courtName ?? "-";
  const dateISO = slot?.date ?? ""; // ควรเป็น 'YYYY-MM-DD'
  const itemStatus = slot?.itemStatus ?? "-"; // pending / success ฯลฯ

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: { borderRadius: 3, boxShadow: (t) => t.shadows[3] },
      }}
    >
      <DialogTitle sx={{ pb: 0.5, fontWeight: 600 }}>
        ยืนยันการยกเลิก
      </DialogTitle>

      <Formik
        initialValues={{ reason: "" }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await onSubmit(values.reason.trim());
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting, handleChange, values }) => (
          <Form>
            <DialogContent sx={{ pt: 1.5 }}>
              {/* แถบข้อมูลสรุปแบบมินิมอล */}
              <Stack spacing={0.5} sx={{ mb: 1.5 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  สนาม: <b>{courtName}</b>
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  วันที่:{" "}
                  <b>{dateISO ? dayjs(dateISO).format("MMMM D, YYYY") : "-"}</b>
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    สถานะรายการ:
                  </Typography>
                  <Chip
                    size="small"
                    label={itemStatus}
                    color={itemStatus === "pending" ? "info" : "success"}
                    variant="outlined"
                  />
                </Stack>
                <Typography
                  variant="body2"
                  sx={{ mt: 0.5, color: "text.secondary" }}
                >
                  ช่วงเวลา ⏰ {start}–{end}
                </Typography>
              </Stack>

              <TextField
                name="reason"
                placeholder="พิมพ์เหตุผลสั้น ๆ ..."
                fullWidth
                multiline
                minRows={2}
                value={values.reason}
                onChange={handleChange}
                error={touched.reason && Boolean(errors.reason)}
                helperText={touched.reason && errors.reason}
                autoFocus
                variant="outlined"
                size="small"
              />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
              <Button onClick={onClose} color="inherit">
                ยกเลิก
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                color="error"
                loading={submitting || isSubmitting}
              >
                ยืนยัน
              </LoadingButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
