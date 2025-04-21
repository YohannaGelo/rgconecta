/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.11-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: rgconecta_db
-- ------------------------------------------------------
-- Server version	10.11.11-MariaDB-0ubuntu0.24.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alumno_tecnologia`
--

DROP TABLE IF EXISTS `alumno_tecnologia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `alumno_tecnologia` (
  `alumno_id` bigint(20) unsigned NOT NULL,
  `tecnologia_id` bigint(20) unsigned NOT NULL,
  `nivel` enum('basico','intermedio','avanzado','A1','A2','B1','B2','C1','C2') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`alumno_id`,`tecnologia_id`),
  KEY `alumno_tecnologia_tecnologia_id_foreign` (`tecnologia_id`),
  CONSTRAINT `alumno_tecnologia_alumno_id_foreign` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `alumno_tecnologia_tecnologia_id_foreign` FOREIGN KEY (`tecnologia_id`) REFERENCES `tecnologias` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumno_tecnologia`
--

LOCK TABLES `alumno_tecnologia` WRITE;
/*!40000 ALTER TABLE `alumno_tecnologia` DISABLE KEYS */;
INSERT INTO `alumno_tecnologia` VALUES
(1,1,'avanzado','2025-04-21 05:10:30','2025-04-21 05:10:30'),
(1,3,'intermedio','2025-04-21 05:10:30','2025-04-21 05:10:30'),
(1,9,'B2','2025-04-21 05:10:30','2025-04-21 05:10:30'),
(1,11,'intermedio','2025-04-21 05:10:30','2025-04-21 05:10:30'),
(2,2,'intermedio','2025-04-21 05:10:30','2025-04-21 05:10:30'),
(2,6,'basico','2025-04-21 05:10:30','2025-04-21 05:10:30'),
(2,9,'C1','2025-04-21 05:10:30','2025-04-21 05:10:30'),
(2,12,'avanzado','2025-04-21 05:10:30','2025-04-21 05:10:30');
/*!40000 ALTER TABLE `alumno_tecnologia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alumno_titulo`
--

DROP TABLE IF EXISTS `alumno_titulo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `alumno_titulo` (
  `alumno_id` bigint(20) unsigned NOT NULL,
  `titulo_id` bigint(20) unsigned NOT NULL,
  `año_inicio` year(4) NOT NULL,
  `año_fin` year(4) DEFAULT NULL,
  `institucion` varchar(255) NOT NULL DEFAULT 'IES Ruiz Gijón',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `alumno_titulo_alumno_id_foreign` (`alumno_id`),
  KEY `alumno_titulo_titulo_id_foreign` (`titulo_id`),
  CONSTRAINT `alumno_titulo_alumno_id_foreign` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `alumno_titulo_titulo_id_foreign` FOREIGN KEY (`titulo_id`) REFERENCES `titulos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumno_titulo`
--

LOCK TABLES `alumno_titulo` WRITE;
/*!40000 ALTER TABLE `alumno_titulo` DISABLE KEYS */;
INSERT INTO `alumno_titulo` VALUES
(1,6,2015,2016,'Universidad Pablo de Olavide','2025-04-21 05:10:30','2025-04-21 05:10:30'),
(2,3,2019,2021,'IES Ruiz Gijón','2025-04-21 05:10:30','2025-04-21 05:10:30'),
(2,5,2019,2023,'IES Polígono Sur','2025-04-21 05:10:30','2025-04-21 05:10:30'),
(2,6,2015,2016,'IES Ruiz Gijón','2025-04-21 05:10:30','2025-04-21 05:10:30');
/*!40000 ALTER TABLE `alumno_titulo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alumnos`
--

DROP TABLE IF EXISTS `alumnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `alumnos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `situacion_laboral` enum('trabajando','buscando_empleo','desempleado') NOT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `promocion` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `alumnos_user_id_foreign` (`user_id`),
  CONSTRAINT `alumnos_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumnos`
--

LOCK TABLES `alumnos` WRITE;
/*!40000 ALTER TABLE `alumnos` DISABLE KEYS */;
INSERT INTO `alumnos` VALUES
(1,4,'2000-05-30','trabajando',NULL,1,'2019/2021','2025-04-21 05:10:30','2025-04-21 05:13:45'),
(2,5,'1998-08-22','buscando_empleo',NULL,1,'2020/2022','2025-04-21 05:10:30','2025-04-21 05:10:30');
/*!40000 ALTER TABLE `alumnos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empresas`
--

DROP TABLE IF EXISTS `empresas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `sector` varchar(255) DEFAULT NULL,
  `web` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `empresas_nombre_unique` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresas`
--

LOCK TABLES `empresas` WRITE;
/*!40000 ALTER TABLE `empresas` DISABLE KEYS */;
INSERT INTO `empresas` VALUES
(1,'TechSolutions S.L.','Tecnología','https://tech-updated.com',NULL,'2025-04-21 05:26:24'),
(2,'GeloTech','Tecnología y Aprendizaje','https://gelotech.com',NULL,NULL),
(3,'Café Central','hosteleria','https://cafecentral.com','2025-04-21 05:14:33','2025-04-21 05:14:33'),
(4,'TechCorp','tecnologia','https://techcorp.com','2025-04-21 05:14:33','2025-04-21 05:14:33');
/*!40000 ALTER TABLE `empresas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experiencias`
--

DROP TABLE IF EXISTS `experiencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `experiencias` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `alumno_id` bigint(20) unsigned NOT NULL,
  `empresa_id` bigint(20) unsigned NOT NULL,
  `puesto` varchar(255) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `experiencias_alumno_id_foreign` (`alumno_id`),
  KEY `experiencias_empresa_id_foreign` (`empresa_id`),
  CONSTRAINT `experiencias_alumno_id_foreign` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `experiencias_empresa_id_foreign` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experiencias`
--

LOCK TABLES `experiencias` WRITE;
/*!40000 ALTER TABLE `experiencias` DISABLE KEYS */;
/*!40000 ALTER TABLE `experiencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES
(1,'0001_01_01_000000_create_users_table',1),
(2,'0001_01_01_000001_create_cache_table',1),
(3,'0001_01_01_000002_create_jobs_table',1),
(4,'2025_03_24_121024_create_empresas_table',1),
(5,'2025_03_24_122547_create_profesores_table',1),
(6,'2025_03_24_122606_create_alumnos_table',1),
(7,'2025_03_24_122630_create_titulos_table',1),
(8,'2025_03_24_122719_create_ofertas_table',1),
(9,'2025_03_24_122735_create_tecnologias_table',1),
(10,'2025_03_24_161114_create_opiniones_table',1),
(11,'2025_03_25_095046_create_alumno_tecnologia_table',1),
(12,'2025_03_25_112040_create_personal_access_tokens_table',1),
(13,'2025_04_11_110725_create_experiencias_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ofertas`
--

DROP TABLE IF EXISTS `ofertas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ofertas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `empresa_id` bigint(20) unsigned DEFAULT NULL,
  `sobre_empresa` text DEFAULT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `jornada` enum('completa','media_jornada','3_6_horas','menos_3_horas') NOT NULL,
  `anios_experiencia` int(11) DEFAULT 0,
  `localizacion` varchar(255) NOT NULL,
  `fecha_publicacion` date NOT NULL,
  `fecha_expiracion` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ofertas_empresa_id_foreign` (`empresa_id`),
  KEY `ofertas_user_id_foreign` (`user_id`),
  CONSTRAINT `ofertas_empresa_id_foreign` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
  CONSTRAINT `ofertas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ofertas`
--

LOCK TABLES `ofertas` WRITE;
/*!40000 ALTER TABLE `ofertas` DISABLE KEYS */;
INSERT INTO `ofertas` VALUES
(1,'Desarrollador FullStack Senior','Buscamos un desarrollador con experiencia en Angular y Laravel. Se valorarán conocimientos en Docker y AWS.',1,'Empresa líder en desarrollo de software con sede en Sevilla y clientes en 20 países.',2,'completa',5,'Sevilla (híbrido)','2025-04-18','2025-06-02','2025-04-21 05:10:30','2025-04-21 05:10:30'),
(2,'Técnico de Soporte IT','Puesto para dar soporte técnico a usuarios en entorno Windows y Office.',2,NULL,3,'media_jornada',2,'Utrera (presencial)','2025-04-14','2025-05-21','2025-04-21 05:10:30','2025-04-21 05:10:30');
/*!40000 ALTER TABLE `ofertas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opiniones`
--

DROP TABLE IF EXISTS `opiniones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `opiniones` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `alumno_id` bigint(20) unsigned NOT NULL,
  `empresa_id` bigint(20) unsigned NOT NULL,
  `años_en_empresa` int(11) NOT NULL,
  `contenido` text NOT NULL,
  `valoracion` tinyint(3) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `opiniones_alumno_id_foreign` (`alumno_id`),
  KEY `opiniones_empresa_id_foreign` (`empresa_id`),
  CONSTRAINT `opiniones_alumno_id_foreign` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `opiniones_empresa_id_foreign` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opiniones`
--

LOCK TABLES `opiniones` WRITE;
/*!40000 ALTER TABLE `opiniones` DISABLE KEYS */;
INSERT INTO `opiniones` VALUES
(1,1,1,2,'Excelente ambiente laboral y aprendizaje continuo.',5,NULL,NULL),
(2,2,2,1,'Buena empresa, aunque mucha carga de trabajo en picos.',4,NULL,NULL);
/*!40000 ALTER TABLE `opiniones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES
(1,'App\\Models\\User',4,'auth_token','8124f8e724bba8c934002f46c6613ba41b0dd72e260f687b34ec9173a2e1590d','[\"*\"]','2025-04-21 05:30:09',NULL,'2025-04-21 05:12:42','2025-04-21 05:30:09'),
(2,'App\\Models\\User',2,'auth_token','ab7f7485c8a20f1dbb85626f3f60b973daf37f90a87c9b58d8bcc282c2148394','[\"*\"]','2025-04-21 05:16:57',NULL,'2025-04-21 05:16:21','2025-04-21 05:16:57');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profesores`
--

DROP TABLE IF EXISTS `profesores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `profesores` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `departamento` varchar(255) NOT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `profesores_user_id_foreign` (`user_id`),
  CONSTRAINT `profesores_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profesores`
--

LOCK TABLES `profesores` WRITE;
/*!40000 ALTER TABLE `profesores` DISABLE KEYS */;
INSERT INTO `profesores` VALUES
(1,2,'Informática',NULL,'2025-04-21 05:10:29','2025-04-21 05:10:29'),
(2,3,'Historia',NULL,'2025-04-21 05:10:29','2025-04-21 05:21:11');
/*!40000 ALTER TABLE `profesores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `requisitos_oferta`
--

DROP TABLE IF EXISTS `requisitos_oferta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `requisitos_oferta` (
  `oferta_id` bigint(20) unsigned NOT NULL,
  `tecnologia_id` bigint(20) unsigned NOT NULL,
  `nivel` enum('basico','intermedio','avanzado') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `requisitos_oferta_oferta_id_foreign` (`oferta_id`),
  KEY `requisitos_oferta_tecnologia_id_foreign` (`tecnologia_id`),
  CONSTRAINT `requisitos_oferta_oferta_id_foreign` FOREIGN KEY (`oferta_id`) REFERENCES `ofertas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `requisitos_oferta_tecnologia_id_foreign` FOREIGN KEY (`tecnologia_id`) REFERENCES `tecnologias` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requisitos_oferta`
--

LOCK TABLES `requisitos_oferta` WRITE;
/*!40000 ALTER TABLE `requisitos_oferta` DISABLE KEYS */;
INSERT INTO `requisitos_oferta` VALUES
(1,4,'avanzado',NULL,NULL),
(1,2,'avanzado',NULL,NULL),
(1,6,'intermedio',NULL,NULL),
(2,10,'intermedio',NULL,NULL),
(2,16,'intermedio',NULL,NULL);
/*!40000 ALTER TABLE `requisitos_oferta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tecnologias`
--

DROP TABLE IF EXISTS `tecnologias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tecnologias` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `tipo` enum('frontend','backend','fullstack','database','devops','ofimatica','idioma','marketing','gestion','disenio','otros') NOT NULL DEFAULT 'otros',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tecnologias_nombre_tipo_unique` (`nombre`,`tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tecnologias`
--

LOCK TABLES `tecnologias` WRITE;
/*!40000 ALTER TABLE `tecnologias` DISABLE KEYS */;
INSERT INTO `tecnologias` VALUES
(1,'PHP','backend',NULL,NULL),
(2,'Laravel','backend',NULL,NULL),
(3,'JavaScript','frontend',NULL,NULL),
(4,'Angular','frontend',NULL,NULL),
(5,'React','frontend',NULL,NULL),
(6,'MySQL','database',NULL,NULL),
(7,'Git','devops',NULL,NULL),
(8,'Docker','devops',NULL,NULL),
(9,'Inglés','idioma',NULL,NULL),
(10,'Excel','ofimatica',NULL,NULL),
(11,'Contasol','gestion',NULL,NULL),
(12,'Sage','gestion',NULL,NULL),
(13,'Factusol','gestion',NULL,NULL),
(14,'Project Management','gestion',NULL,NULL),
(15,'Trello','gestion',NULL,NULL),
(16,'Microsoft Office','ofimatica',NULL,NULL),
(17,'Google Suite','ofimatica',NULL,NULL),
(18,'Prevención de riesgos laborales','otros',NULL,NULL),
(19,'Derecho laboral','otros',NULL,NULL),
(20,'Gestión de nóminas','otros',NULL,NULL),
(21,'Emprendimiento','otros',NULL,NULL),
(22,'Marketing Digital','otros',NULL,NULL),
(23,'Gestión financiera','gestion',NULL,NULL);
/*!40000 ALTER TABLE `tecnologias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `titulos`
--

DROP TABLE IF EXISTS `titulos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `titulos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `tipo` enum('ciclo_medio','ciclo_superior','grado_universitario','master','doctorado') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `titulos`
--

LOCK TABLES `titulos` WRITE;
/*!40000 ALTER TABLE `titulos` DISABLE KEYS */;
INSERT INTO `titulos` VALUES
(1,'Técnico en Sistemas Microinformáticos y Redes','ciclo_medio',NULL,NULL),
(2,'Técnico Superior en Desarrollo de Aplicaciones Web','ciclo_superior',NULL,NULL),
(3,'Técnico Superior en Desarrollo de Aplicaciones Multiplataforma','ciclo_superior',NULL,NULL),
(4,'Técnico Superior en Administración de Sistemas Informáticos en Red','ciclo_superior',NULL,NULL),
(5,'Grado en Ingeniería Informática','grado_universitario',NULL,NULL),
(6,'Máster en Desarrollo Web y Aplicaciones','master',NULL,NULL),
(7,'Técnico en Sistemas de Información','ciclo_medio','2025-04-21 05:14:33','2025-04-21 05:14:33'),
(8,'Licenciado en Administración y Dirección de Empresas','grado_universitario','2025-04-21 05:14:33','2025-04-21 05:14:33');
/*!40000 ALTER TABLE `titulos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','profesor','alumno') NOT NULL DEFAULT 'alumno',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,'Admin','admin@iesruizgijon.es',NULL,'$2y$12$vkkTqKGZAPbJuznC0ue8QuaNty.vMMfWkfVHPf4yWx7AImCl1D6Jq','admin',NULL,'2025-04-21 05:10:29','2025-04-21 05:10:29'),
(2,'Juan Pérez','juan.perez@iesruizgijon.es',NULL,'$2y$12$mssSKy0Dim/2/tKwXi33VOsIOOam9TkThbbdHLn8XeRAuwHvfAef2','profesor',NULL,'2025-04-21 05:10:29','2025-04-21 05:10:29'),
(3,'Ana López','ana.lopez@iesruizgijon.es',NULL,'$2y$12$vpsiEXxcAZahSUVYhyC9aegqi581UFFuSilp6zTm6b2.tzmZz8Ei.','profesor',NULL,'2025-04-21 05:10:29','2025-04-21 05:10:29'),
(4,'María García','maria.garcia@alumno.iesruizgijon.es',NULL,'$2y$12$749xFyo/6E6RrYtFv61ZX.lajZ8Nct0eZccWlnWul6Kkozpu/ANkO','alumno',NULL,'2025-04-21 05:10:30','2025-04-21 05:10:30'),
(5,'Carlos Martínez','carlos.martinez@alumno.iesruizgijon.es',NULL,'$2y$12$R/Yd1yf9PYDDr6ORYMxOJOKJCJNOp1LeQ8bhaerQkyJ5XohojU/mW','alumno',NULL,'2025-04-21 05:10:30','2025-04-21 05:10:30');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-21  9:34:49
