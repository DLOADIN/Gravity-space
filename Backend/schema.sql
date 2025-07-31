-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 31, 2025 at 03:57 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `art_space`
--

-- --------------------------------------------------------

--
-- Table structure for table `artists`
--

CREATE TABLE `artists` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `bio` text DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artists`
--

INSERT INTO `artists` (`id`, `name`, `bio`, `email`, `phone`, `website`, `created_by`, `created_at`) VALUES
(1, 'Amina Mutesi', 'Rwandan visual artist focusing on nature themes.', 'amina@example.com', '+250788111111', 'https://aminamutesi.art', 1, '2025-07-30 20:53:42'),
(2, 'John Doe', 'Digital artist exploring AI in art.', 'john@example.com', '+250788222222', 'https://johndoeart.io', 1, '2025-07-30 20:53:42'),
(3, 'Grace Wanjiru', 'Creates abstract art from recycled materials.', 'grace@example.com', '+250788333333', 'https://gracewanjiru.com', 1, '2025-07-30 20:53:42'),
(4, 'Kwizera Brian', 'Known for detailed cultural portraits.', 'brian@example.com', '+250788444444', 'https://kwizerabrian.art', 1, '2025-07-30 20:53:42'),
(5, 'Mary Kimani', 'Muralist working with schools and communities.', 'mary@example.com', '+250788555555', 'https://marymurals.org', 1, '2025-07-30 20:53:42'),
(6, 'Ivan Mbonigaba', 'Focuses on digital surrealism.', 'ivan@example.com', '+250788666666', 'https://ivanmboni.com', 1, '2025-07-30 20:53:42'),
(7, 'Linda Umutoni', 'Painter and sculpture artist.', 'linda@example.com', '+250788777777', 'https://lindasculptures.com', 1, '2025-07-30 20:53:42'),
(8, 'Eric Nshimiyimana', 'Street artist known for bold color use.', 'eric@example.com', '+250788888888', 'https://ericstreetart.org', 1, '2025-07-30 20:53:42'),
(9, 'Sifa Kalisa', 'Young artist in digital collage.', 'sifa@example.com', '+250788999999', 'https://sifakalisa.net', 1, '2025-07-30 20:53:42'),
(10, 'Daniel Mugisha', 'Fantasy and comic book illustrator.', 'daniel@example.com', '+250789000000', 'https://danieldraws.com', 1, '2025-07-30 20:53:42');

-- --------------------------------------------------------

--
-- Table structure for table `artist_portfolios`
--

CREATE TABLE `artist_portfolios` (
  `id` int(11) NOT NULL,
  `artist_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `portfolio_type` enum('gallery','exhibition','award','publication') DEFAULT 'gallery',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `external_link` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artist_portfolios`
--

INSERT INTO `artist_portfolios` (`id`, `artist_id`, `title`, `description`, `image_url`, `portfolio_type`, `created_at`, `external_link`) VALUES
(1, 1, 'Nature Collection', 'Series of paintings inspired by Nyungwe Forest.', 'images/portfolio1.jpg', 'gallery', '2025-07-30 23:02:37', NULL),
(2, 2, 'Digital Awakening', 'Exploring AI and art fusion.', 'images/portfolio2.jpg', 'exhibition', '2025-07-30 23:02:37', NULL),
(4, 4, 'Faces of Rwanda', 'Portraits published in Art Africa Magazine.', 'images/portfolio4.jpg', 'publication', '2025-07-30 23:02:37', NULL),
(5, 5, 'Urban Touch', 'Exhibited during Kigali Art Week 2024.', 'images/portfolio5.jpg', 'exhibition', '2025-07-30 23:02:37', NULL),
(6, 6, 'Surreal Jungle', 'Digital works displayed at ALU showcase.', 'images/portfolio6.jpg', 'gallery', '2025-07-30 23:02:37', NULL),
(7, 7, 'Bronze Flow', 'Award for innovation in sculpture 2023.', 'images/portfolio7.jpg', 'award', '2025-07-30 23:02:37', NULL),
(8, 8, 'Color Pop', 'Street art curated in local publications.', 'images/portfolio8.jpg', 'publication', '2025-07-30 23:02:37', NULL),
(9, 9, 'Identity and Color', 'Featured in East African Biennale.', 'images/portfolio9.jpg', 'exhibition', '2025-07-30 23:02:37', NULL),
(10, 10, 'Fantasy Realms', 'Comic and fantasy art gallery.', 'images/portfolio10.jpg', 'gallery', '2025-07-30 23:02:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `artworks`
--

CREATE TABLE `artworks` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `artist_id` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('available','sold','reserved') DEFAULT 'available'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artworks`
--

INSERT INTO `artworks` (`id`, `title`, `description`, `price`, `image_url`, `category_id`, `artist_id`, `created_by`, `created_at`, `status`) VALUES
(1, 'Whispers of Nature', 'A serene view of a Rwandan valley.', 120.00, 'images/nature1.jpg', 2, 1, 1, '2025-07-30 20:54:26', 'available'),
(2, 'Urban Chaos', 'Abstract strokes showing city energy.', 95.50, 'images/abstract1.jpg', 3, 2, 1, '2025-07-30 20:54:26', 'available'),
(3, 'Mother and Child', 'Oil portrait with deep emotion.', 150.00, 'images/portrait1.jpg', 4, 3, 1, '2025-07-30 20:54:26', 'available'),
(4, 'Graffiti Vibes', 'Spray paint mural of Kigali streets.', 80.00, 'images/street1.jpg', 5, 8, 1, '2025-07-30 20:54:26', 'available'),
(5, 'Bronze Curve', 'Minimalist bronze sculpture.', 300.00, 'images/sculpture1.jpg', 6, 7, 1, '2025-07-30 20:54:26', 'available'),
(6, 'Digital Jungle', 'Jungle scene with glitch effects.', 110.00, 'images/digital1.jpg', 7, 6, 1, '2025-07-30 20:54:26', 'available'),
(7, 'Zen Circle', 'Simple brush stroke on canvas.', 60.00, 'images/minimal1.jpg', 8, 5, 1, '2025-07-30 20:54:26', 'available'),
(8, 'Dragon’s Flight', 'Fantasy creature in motion.', 180.00, 'images/fantasy1.jpg', 9, 10, 1, '2025-07-30 20:54:26', 'available'),
(9, 'The Ancestors', 'Traditional mask painting.', 135.00, 'images/culture1.jpg', 10, 4, 1, '2025-07-30 20:54:26', 'available'),
(10, 'Colorstorm', 'Explosive digital color palette.', 145.00, 'images/digital2.jpg', 7, 9, 1, '2025-07-30 20:54:26', 'available'),
(11, 'Silent Horizon', 'Peaceful landscape in oil.', 250.00, 'images/art1.jpg', 2, 1, 1, '2025-07-30 23:02:12', 'available'),
(12, 'Cyber City', 'Digital concept of a futuristic town.', 300.00, 'images/art2.jpg', 3, 2, 1, '2025-07-30 23:02:12', 'sold'),
(13, 'Market Vibes', 'Lively traditional market painting.', 180.00, 'images/art3.jpg', 10, 4, 1, '2025-07-30 23:02:12', 'available'),
(14, 'Emerald Light', 'Minimalist painting with green tones.', 120.00, 'images/art4.jpg', 8, 5, 1, '2025-07-30 23:02:12', 'reserved'),
(15, 'Red Mist', 'Bold abstract expressionist work.', 350.00, 'images/art5.jpg', 3, 3, 1, '2025-07-30 23:02:12', 'available'),
(16, 'Gorilla Dreams', 'Wildlife conservation theme.', 280.00, 'images/art6.jpg', 2, 6, 1, '2025-07-30 23:02:12', 'sold'),
(17, 'The Masked Tribe', 'Portrait of an African elder.', 210.00, 'images/art7.jpg', 10, 7, 1, '2025-07-30 23:02:12', 'available'),
(18, 'Floating Islands', 'Fantasy environment in pastel.', 310.00, 'images/art8.jpg', 9, 10, 1, '2025-07-30 23:02:12', 'available'),
(19, 'Stone Peace', 'Marble sculpture with smooth finish.', 400.00, 'images/art9.jpg', 6, 8, 1, '2025-07-30 23:02:12', 'reserved'),
(20, 'Colors of Kigali', 'Street mural of city skyline.', 175.00, 'images/art10.jpg', 5, 9, 1, '2025-07-30 23:02:12', 'available');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `created_by`, `created_at`) VALUES
(1, 'Tech ', 'Thesse are the most techy looking artwork items in the world', 1, '2025-07-30 20:25:20'),
(2, 'Nature', 'Artworks inspired by the beauty of nature', 1, '2025-07-30 20:53:12'),
(3, 'Abstract', 'Abstract and conceptual art pieces', 1, '2025-07-30 20:53:12'),
(4, 'Portrait', 'Portraits of people and animals', 1, '2025-07-30 20:53:12'),
(5, 'Street Art', 'Graffiti and urban-style art', 1, '2025-07-30 20:53:12'),
(6, 'Sculpture', '3D sculpture works in various materials', 1, '2025-07-30 20:53:12'),
(7, 'Digital', 'Digital creations using software tools', 1, '2025-07-30 20:53:12'),
(8, 'Minimalist', 'Simple and elegant designs', 1, '2025-07-30 20:53:12'),
(9, 'Fantasy', 'Artworks depicting fictional themes', 1, '2025-07-30 20:53:12'),
(10, 'Cultural', 'Traditional and cultural art pieces', 1, '2025-07-30 20:53:12');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `buyer_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `artwork_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','completed','cancelled') DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('user','artist') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'Grant Cordone', 'grantcordone@gmail.com', '$2b$12$Q61YsPckiIFygqzV6lW/jOHXNLhsPpO8IahW9fCcne08qL/VCgWs6', 'user', '2025-07-30 18:41:58'),
(2, 'Test User', 'test@example.com', 'test_hash', 'user', '2025-07-30 21:39:16'),
(3, 'Jill Wagner Joe', 'jillwagner@gmail.com', '$2b$12$4ALeDJ27l/hRxpiY3QIrm.XbJwaBe6wgKZpzyF89EUbzD0dhkFJHi', 'artist', '2025-07-30 22:29:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `artists`
--
ALTER TABLE `artists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `artist_portfolios`
--
ALTER TABLE `artist_portfolios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `artist_id` (`artist_id`);

--
-- Indexes for table `artworks`
--
ALTER TABLE `artworks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `artist_id` (`artist_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `buyer_id` (`buyer_id`),
  ADD KEY `seller_id` (`seller_id`),
  ADD KEY `artwork_id` (`artwork_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `artists`
--
ALTER TABLE `artists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `artist_portfolios`
--
ALTER TABLE `artist_portfolios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `artworks`
--
ALTER TABLE `artworks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `artists`
--
ALTER TABLE `artists`
  ADD CONSTRAINT `artists_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `artist_portfolios`
--
ALTER TABLE `artist_portfolios`
  ADD CONSTRAINT `artist_portfolios_ibfk_1` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `artworks`
--
ALTER TABLE `artworks`
  ADD CONSTRAINT `artworks_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `artworks_ibfk_2` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `artworks_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_3` FOREIGN KEY (`artwork_id`) REFERENCES `artworks` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;