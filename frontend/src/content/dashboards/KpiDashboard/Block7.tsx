import { Box, Card, Typography, Divider, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface ReservationSlot {
  id: number;
  date: string;
  approve_status: string;
  reservation: {
    student_id: string;
    student_name: string;
    icit: string;
    bookingStatus: { description: string };
  };
  court: { name: string; location: string };
  timeSlot: { start_time: string; end_time: string };
  reason: string;
}

function Block7({ rows }: { rows: ReservationSlot[] }) {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();

  // Group ข้อมูลตามวันที่และสถานะ
  const grouped: Record<
    string,
    {
      approved: number;
      pending: number;
      cancel: number;
      success: number;
      noshow: number;
      close: number;
      walkin: number;
    }
  > = {};

  rows.forEach((r) => {
    if (!grouped[r.date]) {
      grouped[r.date] = {
        approved: 0,
        pending: 0,
        cancel: 0,
        success: 0,
        noshow: 0,
        close: 0,
        walkin: 0,
      };
    }

    switch (r.approve_status) {
      case "approved":
        grouped[r.date].approved++;
        break;
      case "pending":
        grouped[r.date].pending++;
        break;
      case "cancel":
        grouped[r.date].cancel++;
        break;
      case "success":
        grouped[r.date].success++;
        break;
      case "no_show":
        grouped[r.date].noshow++;
        break;
      case "close":
        grouped[r.date].close++;
        break;
      case "walk-in":
        grouped[r.date].walkin++;
        break;
    }
  });

  const categories = Object.keys(grouped).sort();

  const approvedData = categories.map((d) => grouped[d].approved);
  const pendingData = categories.map((d) => grouped[d].pending);
  const cancelData = categories.map((d) => grouped[d].cancel);
  const successData = categories.map((d) => grouped[d].success);
  const noshowData = categories.map((d) => grouped[d].noshow);
  const closeData = categories.map((d) => grouped[d].close);
  const walkinData = categories.map((d) => grouped[d].walkin);

  // Chart options พร้อมสีสอดคล้องกับ <Chip>
  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
      background: "transparent",
    },
    theme: { mode: theme.palette.mode },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
      },
    },
    xaxis: {
      categories,
      labels: { style: { fontSize: "12px" } },
    },
    yaxis: {
      title: { text: "Reservations" },
    },
    legend: {
      position: "top",
    },
    fill: { opacity: 1 },
    colors: [
      theme.palette.success.dark, // Success
      theme.palette.success.main, // Approved
      theme.palette.warning.main, // Pending
      theme.palette.error.main, // Cancel
      theme.palette.error.dark, // No Show
      theme.palette.grey[600], // Close
      theme.palette.info.main, // walkin
    ],
    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  const chartData = [
    { name: "Success", data: successData },
    { name: "Approved", data: approvedData },
    { name: "Pending", data: pendingData },
    { name: "Cancelled", data: cancelData },
    { name: "No Show", data: noshowData },
    { name: "Close", data: closeData },
    { name: "Walk-in", data: walkinData },
  ];

  return (
    <Card>
      <Box p={3}>
        <Typography variant="h4">{t("Reservation Trends")}</Typography>
        <Typography variant="subtitle2">
          {t("Daily summary of reservations by status")}
        </Typography>
      </Box>
      <Divider />
      <Box px={2} py={2}>
        <Chart
          options={chartOptions}
          series={chartData}
          type="bar"
          height={350}
        />
      </Box>
    </Card>
  );
}

export default Block7;
