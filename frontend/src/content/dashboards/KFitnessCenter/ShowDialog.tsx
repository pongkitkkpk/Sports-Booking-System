import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";
function ShowDialog({ open, onClose, slot }: any) {
  const userList: { student_id: string; student_name: string }[] =
    slot?.user_list
      ?.split(",")
      .map((entry: string) => {
        const match = entry.trim().match(/^(.*)\s+\((.+)\)$/);
        return match
          ? { student_name: match[1].trim(), student_id: match[2].trim() }
          : null;
      })
      .filter((entry: any) => entry !== null) || [];
  console.log(userList);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {" "}
      <DialogTitle>รายชื่อผู้ใช้บริการ</DialogTitle>{" "}
      <DialogContent>
        {" "}
        {userList.length > 0 ? (
          <Table>
            {" "}
            <TableHead>
              {" "}
              <TableRow>
                {" "}
                <TableCell>ลำดับ</TableCell> <TableCell>รหัสนักศึกษา</TableCell>{" "}
                <TableCell>ชื่อนักศึกษา</TableCell>{" "}
              </TableRow>{" "}
            </TableHead>{" "}
            <TableBody>
              {" "}
              {userList.map((user, index) => (
                <TableRow key={index}>
                  {" "}
                  <TableCell>{index + 1}</TableCell>{" "}
                  <TableCell>{user.student_id}</TableCell>{" "}
                  <TableCell>{user.student_name}</TableCell>{" "}
                </TableRow>
              ))}{" "}
            </TableBody>{" "}
          </Table>
        ) : (
          <Typography>ไม่มีข้อมูลผู้ใช้บริการ</Typography>
        )}{" "}
      </DialogContent>{" "}
      <DialogActions>
        {" "}
        <Button onClick={onClose}>ปิด</Button>{" "}
      </DialogActions>{" "}
    </Dialog>
  );
}
export default ShowDialog;
