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
  List,
  ListItem,
  ListItemText,
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
  slots = [],
  onClose,
  onSubmit,
  submitting = false,
}: {
  open: boolean;
  slot?: any;
  slots?: any[];
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void> | void;
  submitting?: boolean;
}) {
  const isBulk = slots && slots.length > 1;
  const target = slot || (slots.length === 1 ? slots[0] : null);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 600 }}>
        {isBulk
          ? `ยืนยันการ Reject (${slots.length} รายการ)`
          : "ยืนยันการ Reject"}
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
            <DialogContent>
              {/* ✅ Bulk Mode */}
              {isBulk && (
                <Stack spacing={1} sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    คุณเลือก {slots.length} รายการที่จะ Reject
                  </Typography>
                  <List dense>
                    {slots.slice(0, 3).map((s) => (
                      <ListItem key={s.id} sx={{ py: 0 }}>
                        <ListItemText
                          primary={`${dayjs(s.date).format("DD/MM/YYYY")} ⏰ ${
                            s.timeSlot?.start_time?.slice(0, 5) ?? "--:--"
                          }–${s.timeSlot?.end_time?.slice(0, 5) ?? "--:--"}`}
                          secondary={`สถานที่: ${s.court?.name} (${s.court?.location})`}
                        />
                      </ListItem>
                    ))}
                  </List>
                  {slots.length > 3 && (
                    <Typography variant="caption" color="text.secondary">
                      + อีก {slots.length - 3} รายการ...
                    </Typography>
                  )}
                </Stack>
              )}

              {/* ✅ Single Mode */}
              {!isBulk && target && (
                <Stack spacing={1.2} sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    วันที่: <b>{dayjs(target.date).format("DD/MM/YYYY")}</b>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    เวลา: ⏰{" "}
                    {target.timeSlot?.start_time?.slice(0, 5) ?? "--:--"} –{" "}
                    {target.timeSlot?.end_time?.slice(0, 5) ?? "--:--"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    สถานที่: <b>{target.court?.name}</b> (
                    {target.court?.location})
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      สถานะปัจจุบัน:
                    </Typography>
                    <Chip
                      size="small"
                      label={target.approve_status}
                      color={
                        target.approve_status === "pending"
                          ? "info"
                          : target.approve_status === "approved"
                          ? "success"
                          : target.approve_status === "rejected"
                          ? "error"
                          : "default"
                      }
                      variant="outlined"
                    />
                  </Stack>
                </Stack>
              )}

              {/* ✅ ฟิลด์กรอกเหตุผล */}
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

            <DialogActions>
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
