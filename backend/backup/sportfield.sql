-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 07, 2026 at 05:32 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sportfield`
--

-- --------------------------------------------------------

--
-- Table structure for table `booking_statuses`
--

CREATE TABLE `booking_statuses` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `booking_statuses`
--

INSERT INTO `booking_statuses` (`id`, `description`) VALUES
(1, 'จองเพื่อออกกำลังกาย'),
(2, 'จองเพือการเรียนการสอน'),
(3, 'จองเพื่อกิจกรรม'),
(4, 'ปิดปรับปรุง'),
(5, 'มหาวิทยาลัยปิด'),
(6, 'aaa'),
(7, 'walk-in');

-- --------------------------------------------------------

--
-- Table structure for table `courts`
--

CREATE TABLE `courts` (
  `id` int(11) NOT NULL,
  `imageUrl` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `type` enum('badminton','futsal','volleyball','basketball','boxing','judo','tennis','football','gym') NOT NULL,
  `capacity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `courts`
--

INSERT INTO `courts` (`id`, `imageUrl`, `description`, `name`, `location`, `type`, `capacity`) VALUES
(1, '', 'สนามแบดมินตันพื้นยางมาตรฐาน', 'badminton 1', 'ชั้น 7 ตึก 40 ปี', 'badminton', 1),
(2, '', 'สนามแบดมินตันพื้นยางมาตรฐาน', 'badminton 2', 'ชั้น 7 ตึก 40 ปี', 'badminton', 1),
(3, '', 'สนามแบดมินตันพื้นยางมาตรฐาน', 'badminton 3', 'ชั้น 7 ตึก 40 ปี', 'badminton', 1),
(4, '', 'สนามแบดมินตันพื้นยางมาตรฐาน', 'badminton 4', 'ชั้น 7 ตึก 40 ปี', 'badminton', 1),
(5, '', 'สนามวอลเลย์บอลพื้นไม้มาตรฐานแข่งขัน', 'สนามvolleyball 1', 'ชั้น 7 ตึก 40 ปี', 'volleyball', 1),
(6, '', 'สนามบาสเกตบอลพื้นยางกันลื่น', 'basketball 1', 'ชั้น 3 ตึก 40 ปี', 'basketball', 1),
(7, '', 'สนามฟุตซอลพื้นยางมาตรฐาน', 'futsal 1', 'ชั้น 3 ตึก 40 ปี', 'futsal', 1),
(8, '', 'สนามฟุตซอลพื้นยางกันลื่น', 'futsal 2', 'ชั้น 12 ตึก 40 ปี', 'futsal', 1),
(9, '', 'เวทีมวยมาตรฐานสำหรับฝึกซ้อม', 'boxing 1', 'ชั้น 12 ตึก 40 ปี', 'boxing', 1),
(10, '', 'ลานยูโดพื้น tatami', 'judo 1', 'ชั้น 12 ตึก 40 ปี', 'judo', 1),
(11, '', 'สนามเทนนิสพื้น hard court', 'tennis 1', 'ชั้น 12 ตึก 40 ปี', 'tennis', 1),
(12, '', 'สนามฟุตบอลกลางแจ้งพื้นหญ้าเทียม', 'football 1', 'สนามบอลลอยฟ้า', 'football', 1),
(13, '', 'ลานยิมกลางแจ้งสำหรับฝึกกล้ามเนื้อและคาร์ดิโอ', 'gym 1', 'สนามบอลลอยฟ้า', 'gym', 30);

-- --------------------------------------------------------

--
-- Table structure for table `reservation`
--

CREATE TABLE `reservation` (
  `id` int(11) NOT NULL,
  `icit` varchar(255) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `booking_status_id` int(11) NOT NULL,
  `approve_status` varchar(255) NOT NULL,
  `ban_count` int(11) NOT NULL DEFAULT 0,
  `is_banned` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `reservation`
--

INSERT INTO `reservation` (`id`, `icit`, `student_id`, `student_name`, `booking_status_id`, `approve_status`, `ban_count`, `is_banned`) VALUES
(392, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(393, 'TestWalkinicit', '4566', 'TestWalkin', 7, '', 0, 0),
(394, 'TestWalkinicit', '444444444444', 'TestWalkin', 7, '', 0, 0),
(395, 'TestWalkinicit', '55555555555555555', 'TestWalkin', 7, '', 0, 0),
(396, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(397, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(398, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(399, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(400, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(401, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(402, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(403, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(404, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(405, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(406, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(407, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(408, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(409, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(410, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(411, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(412, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(413, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(414, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(415, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(416, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(417, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(418, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(419, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(420, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(421, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(422, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(423, 'CIT', '65010001', 'รอเชื่อม API typeA', 1, '', 0, 0),
(424, 'TestWalkinicit', '456456456', 'TestWalkin', 7, '', 0, 0),
(425, 'TestWalkinicit', '456456456', 'TestWalkin', 7, '', 0, 0),
(426, 'TestWalkinicit', '456456456', 'TestWalkin', 7, '', 0, 0),
(427, 'TestWalkinicit', '456456456', 'TestWalkin', 7, '', 0, 0),
(428, 'TestWalkinicit', '456456456', 'TestWalkin', 7, '', 0, 0),
(429, 'TestWalkinicit', '564456', 'TestWalkin', 7, '', 0, 0),
(430, 'TestWalkinicit', '545', 'TestWalkin', 7, '', 0, 0),
(431, 'TestWalkinicit', '112', 'TestWalkin', 7, '', 0, 0),
(432, 'TestWalkinicit', '111', 'TestWalkin', 7, '', 0, 0),
(433, 'TestWalkinicit', '2121', 'TestWalkin', 7, '', 0, 0),
(434, 'TestWalkinicit', 'ฟหก', 'TestWalkin', 7, '', 0, 0),
(435, '', 'ฟห', 'ฟหกด', 4, '', 0, 0),
(436, 'ICIT คณะเทคโนโลยีอุตสาหกรรม', 'asdf', 'qwer', 2, '', 1, 1),
(437, 'ICIT คณะเทคโนโลยีอุตสาหกรรม', 'asdf', 'asdfasdf', 1, '', 0, 0),
(438, 'TestWalkinicit', '23', 'TestWalkin', 7, '', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `reservation_slots`
--

CREATE TABLE `reservation_slots` (
  `id` int(11) NOT NULL,
  `reservation_id` int(11) DEFAULT NULL,
  `court_id` int(11) DEFAULT NULL,
  `time_slot_id` int(11) DEFAULT NULL,
  `date` varchar(255) NOT NULL,
  `approve_status` enum('pending','approved','rejected','cancel','success','no_show','close','walk-in') NOT NULL DEFAULT 'pending',
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `is_available` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `reservation_slots`
--

INSERT INTO `reservation_slots` (`id`, `reservation_id`, `court_id`, `time_slot_id`, `date`, `approve_status`, `reason`, `created_at`, `is_available`) VALUES
(1011, 392, 13, 9, '2025-09-25', 'pending', NULL, '2025-09-25 08:20:46.535000', 0),
(1012, 393, 13, 8, '2025-09-25', 'walk-in', NULL, '2025-09-25 08:21:07.363000', 0),
(1013, 394, 13, 4, '2025-09-26', 'walk-in', NULL, '2025-09-26 04:09:22.623000', 0),
(1014, 395, 13, 4, '2025-09-26', 'walk-in', NULL, '2025-09-26 04:09:34.420000', 0),
(1015, 396, 13, 4, '2025-09-26', 'pending', NULL, '2025-09-26 04:28:16.768000', 0),
(1016, 397, 13, 4, '2025-09-26', 'pending', NULL, '2025-09-26 04:28:21.778000', 0),
(1017, 398, 13, 4, '2025-09-26', 'pending', NULL, '2025-09-26 04:28:25.137000', 0),
(1018, 399, 13, 4, '2025-09-26', 'pending', NULL, '2025-09-26 04:28:30.182000', 0),
(1019, 400, 13, 4, '2025-09-26', 'pending', NULL, '2025-09-26 04:33:58.643000', 0),
(1020, 401, 13, 4, '2025-09-26', 'pending', NULL, '2025-09-26 04:39:31.559000', 0),
(1021, 402, 13, 3, '2025-09-26', 'pending', NULL, '2025-09-26 04:42:23.313000', 0),
(1022, 402, 13, 4, '2025-09-26', 'pending', NULL, '2025-09-26 04:42:23.315000', 0),
(1023, 403, 13, 3, '2025-09-26', 'pending', NULL, '2025-09-26 04:42:26.928000', 0),
(1024, 403, 13, 4, '2025-09-26', 'pending', NULL, '2025-09-26 04:42:26.930000', 0),
(1025, 404, 13, 3, '2025-09-26', 'pending', NULL, '2025-09-26 04:42:30.078000', 0),
(1026, 404, 13, 4, '2025-09-26', 'pending', NULL, '2025-09-26 04:42:30.080000', 0),
(1027, 405, 13, 3, '2025-09-26', 'pending', NULL, '2025-09-26 04:42:33.345000', 0),
(1028, 405, 13, 4, '2025-09-26', 'pending', NULL, '2025-09-26 04:42:33.347000', 0),
(1029, 406, 13, 4, '2025-09-26', 'pending', NULL, '2025-09-26 04:42:35.898000', 0),
(1030, 407, 13, 4, '2025-09-26', 'pending', NULL, '2025-09-26 04:42:38.350000', 0),
(1031, 408, 13, 4, '2025-09-26', 'pending', NULL, '2025-09-26 04:42:41.181000', 0),
(1032, 409, 13, 4, '2025-09-26', 'pending', NULL, '2025-09-26 04:42:43.478000', 0),
(1033, 410, 13, 4, '2025-09-26', 'pending', NULL, '2025-09-26 04:42:45.733000', 0),
(1034, 411, 13, 4, '2025-09-26', 'pending', NULL, '2025-09-26 04:42:49.100000', 0),
(1036, 413, 13, 4, '2025-09-26', 'pending', NULL, '2025-09-26 04:42:54.457000', 0),
(1037, 414, 13, 4, '2025-09-26', 'pending', NULL, '2025-09-26 04:42:57.780000', 0),
(1038, 415, 13, 4, '2025-09-26', 'pending', NULL, '2025-09-26 04:43:13.512000', 0),
(1039, 416, 13, 4, '2025-09-26', 'pending', NULL, '2025-09-26 04:43:17.278000', 0),
(1042, 419, 13, 4, '2025-09-26', 'pending', NULL, '2025-09-26 04:43:25.093000', 0),
(1043, 420, 13, 4, '2025-09-26', 'pending', NULL, '2025-09-26 04:43:28.068000', 0),
(1044, 421, 13, 4, '2025-09-26', 'rejected', 'asdfasdf', '2025-09-26 04:43:30.938000', 1),
(1045, 422, 13, 4, '2025-09-26', 'rejected', 'asdf', '2025-09-26 04:43:33.253000', 1),
(1047, 428, 13, 4, '2025-09-26', 'walk-in', NULL, '2025-09-26 04:45:29.205000', 0),
(1048, 430, 13, 4, '2025-09-26', 'walk-in', NULL, '2025-09-26 04:48:48.787000', 0),
(1049, 431, 13, 4, '2025-09-26', 'walk-in', NULL, '2025-09-26 04:49:49.364000', 0),
(1050, 432, 13, 4, '2025-09-26', 'walk-in', NULL, '2025-09-26 04:49:51.696000', 0),
(1051, 435, 1, 1, '2025-09-26', 'close', NULL, '2025-09-26 04:51:08.953000', 0),
(1052, 435, 1, 2, '2025-09-26', 'close', NULL, '2025-09-26 04:51:08.954000', 0),
(1053, 436, 2, 5, '2025-09-26', 'no_show', 'asdf', '2025-09-26 05:14:08.889000', 1),
(1054, 436, 2, 6, '2025-09-26', 'success', NULL, '2025-09-26 05:14:08.891000', 0),
(1055, 436, 2, 7, '2025-09-26', 'success', NULL, '2025-09-26 05:14:08.893000', 0),
(1056, 437, 5, 3, '2025-09-26', 'pending', NULL, '2025-09-26 05:19:51.844000', 0),
(1057, 437, 5, 4, '2025-09-26', 'pending', NULL, '2025-09-26 05:19:51.848000', 0),
(1058, 438, 13, 5, '2025-09-26', 'walk-in', NULL, '2025-09-26 05:45:20.971000', 0);

-- --------------------------------------------------------

--
-- Table structure for table `time_slots`
--

CREATE TABLE `time_slots` (
  `id` int(11) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `time_slots`
--

INSERT INTO `time_slots` (`id`, `start_time`, `end_time`) VALUES
(1, '08:00:00', '09:00:00'),
(2, '09:00:00', '10:00:00'),
(3, '10:00:00', '11:00:00'),
(4, '11:00:00', '12:00:00'),
(5, '12:00:00', '13:00:00'),
(6, '13:00:00', '14:00:00'),
(7, '14:00:00', '15:00:00'),
(8, '15:00:00', '16:00:00'),
(9, '16:00:00', '17:00:00'),
(10, '17:00:00', '18:00:00'),
(11, '18:00:00', '19:00:00'),
(12, '19:00:00', '20:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking_statuses`
--
ALTER TABLE `booking_statuses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `courts`
--
ALTER TABLE `courts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_2dc453f2bb08dc548cdfcb2fc78` (`booking_status_id`);

--
-- Indexes for table `reservation_slots`
--
ALTER TABLE `reservation_slots`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_d6f29b90b27f4e4433348699932` (`reservation_id`),
  ADD KEY `FK_71122213a19db693b63a0cbdaa8` (`court_id`),
  ADD KEY `FK_22c193d35f678209ccce488ba4f` (`time_slot_id`);

--
-- Indexes for table `time_slots`
--
ALTER TABLE `time_slots`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `booking_statuses`
--
ALTER TABLE `booking_statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `courts`
--
ALTER TABLE `courts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=439;

--
-- AUTO_INCREMENT for table `reservation_slots`
--
ALTER TABLE `reservation_slots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1059;

--
-- AUTO_INCREMENT for table `time_slots`
--
ALTER TABLE `time_slots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `FK_2dc453f2bb08dc548cdfcb2fc78` FOREIGN KEY (`booking_status_id`) REFERENCES `booking_statuses` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `reservation_slots`
--
ALTER TABLE `reservation_slots`
  ADD CONSTRAINT `FK_22c193d35f678209ccce488ba4f` FOREIGN KEY (`time_slot_id`) REFERENCES `time_slots` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_71122213a19db693b63a0cbdaa8` FOREIGN KEY (`court_id`) REFERENCES `courts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_d6f29b90b27f4e4433348699932` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
