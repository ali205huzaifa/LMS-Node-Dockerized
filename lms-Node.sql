-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 20, 2025 at 09:02 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lms`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `BookName` varchar(255) NOT NULL,
  `Author` varchar(255) NOT NULL,
  `Category` varchar(255) NOT NULL,
  `Bookpic` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `BookName`, `Author`, `Category`, `Bookpic`, `created_at`) VALUES
(3, 'Soul', 'Olivia Wilson', 'Novel', 'uploads\\1724069231414-soul.jfif', '2024-08-06 06:39:31'),
(4, 'Lost Sea', 'Ritaj H Alhazmi', 'Fantasy', 'uploads/Lost Sea.png', '2024-08-06 07:54:02'),
(5, 'The Spirit Demon', 'Ariel Rose ', 'Fantasy', 'uploads\\1724154983173-demon.jpeg', '2024-08-06 07:57:07');

-- --------------------------------------------------------

--
-- Table structure for table `rentals`
--

CREATE TABLE `rentals` (
  `id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `duration` int(11) NOT NULL,
  `purpose` varchar(255) DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rentals`
--

INSERT INTO `rentals` (`id`, `book_id`, `user_id`, `username`, `duration`, `purpose`, `time`) VALUES
(1, 3, 1, 'Huzaifa69', 7, 'Research', '2024-08-20 21:03:51'),
(3, 5, 1, 'Huzaifa69', 3, 'Exam-Research', '2024-08-21 14:17:23'),
(4, 4, 3, 'hamza68', 1, 'Self-Learning', '2024-08-21 14:19:57');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`) VALUES
(1, 'Huzaifa69', '$2a$10$N482NIwW1hk6niodGk/EDulXyvoqOtqC1xc/wJDTe6/781V/UxBDO', 'user'),
(2, 'admin123', '$2a$10$7VTg8VdFOkZ6I9371k8YQOwWA1OrSbJSKZGjIeTHp20ArSRhZG1vS', 'admin'),
(3, 'hamza68', '$2a$10$oxA.Al8QpjgNWMoTVRZVCOq03MUoVbvPwc20665fx4v1m1mNI/t/u', 'user'),
(4, 'haider66', '$2a$10$s/HEmkN2JVPXZNq/GkinXO9ruR9uJ6F4PtxMGffe7/tPmusTRkNg.', 'user'),
(6, 'Abdullah69', '$2a$10$G5QXJBJPEiH0SiBz35daNOWtyLZ1/73Uj7nSxXKdbCsFsH/0nakd2', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rentals`
--
ALTER TABLE `rentals`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_rental` (`book_id`,`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `rentals`
--
ALTER TABLE `rentals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
