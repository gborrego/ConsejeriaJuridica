CREATE DATABASE  IF NOT EXISTS `defensoria_demandas_oficial` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `defensoria_demandas_oficial`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: defensoria_demandas_oficial
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `demandado`
--

DROP TABLE IF EXISTS `demandado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `demandado` (
  `id_demandado` int NOT NULL,
  PRIMARY KEY (`id_demandado`),
  CONSTRAINT `demandado_ibfk_1` FOREIGN KEY (`id_demandado`) REFERENCES `participante` (`id_participante`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `demandado`
--

LOCK TABLES `demandado` WRITE;
/*!40000 ALTER TABLE `demandado` DISABLE KEYS */;
INSERT INTO `demandado` VALUES (2),(4);
/*!40000 ALTER TABLE `demandado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domicilio_participante`
--

DROP TABLE IF EXISTS `domicilio_participante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `domicilio_participante` (
  `id_domicilio` int NOT NULL AUTO_INCREMENT,
  `calle_domicilio` varchar(255) NOT NULL,
  `numero_exterior_domicilio` varchar(255) DEFAULT NULL,
  `numero_interior_domicilio` varchar(255) DEFAULT NULL,
  `id_colonia` int DEFAULT NULL,
  `id_participante` int NOT NULL,
  PRIMARY KEY (`id_domicilio`),
  KEY `id_participante` (`id_participante`),
  CONSTRAINT `domicilio_participante_ibfk_1` FOREIGN KEY (`id_participante`) REFERENCES `participante` (`id_participante`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domicilio_participante`
--

LOCK TABLES `domicilio_participante` WRITE;
/*!40000 ALTER TABLE `domicilio_participante` DISABLE KEYS */;
INSERT INTO `domicilio_participante` VALUES (1,'Alberto Vargas Martinez','2905','',107729,1),(2,'Alberto Vargas ','2903','',107729,2),(3,'German Pablos','2902','',107729,3),(4,'Alberto Vargas ','2903','',107729,4);
/*!40000 ALTER TABLE `domicilio_participante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `escolaridad`
--

DROP TABLE IF EXISTS `escolaridad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `escolaridad` (
  `id_escolaridad` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(50) NOT NULL,
  `estatus_general` enum('ACTIVO','INACTIVO') NOT NULL,
  PRIMARY KEY (`id_escolaridad`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `escolaridad`
--

LOCK TABLES `escolaridad` WRITE;
/*!40000 ALTER TABLE `escolaridad` DISABLE KEYS */;
INSERT INTO `escolaridad` VALUES (1,'Preescolar','ACTIVO'),(2,'Primaria','ACTIVO'),(3,'Secundaria','ACTIVO'),(4,'Preparatoria','ACTIVO'),(5,'Licenciatura','ACTIVO'),(6,'Maestria','ACTIVO'),(7,'Doctorado','ACTIVO');
/*!40000 ALTER TABLE `escolaridad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_procesal`
--

DROP TABLE IF EXISTS `estado_procesal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_procesal` (
  `id_estado_procesal` int NOT NULL AUTO_INCREMENT,
  `descripcion_estado_procesal` varchar(200) NOT NULL,
  `fecha_estado_procesal` date NOT NULL,
  `id_proceso_judicial` int NOT NULL,
  PRIMARY KEY (`id_estado_procesal`),
  KEY `id_proceso_judicial` (`id_proceso_judicial`),
  CONSTRAINT `estado_procesal_ibfk_1` FOREIGN KEY (`id_proceso_judicial`) REFERENCES `proceso_judicial` (`id_proceso_judicial`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_procesal`
--

LOCK TABLES `estado_procesal` WRITE;
/*!40000 ALTER TABLE `estado_procesal` DISABLE KEYS */;
INSERT INTO `estado_procesal` VALUES (3,'Estado Procesal 1','2024-06-30',1);
/*!40000 ALTER TABLE `estado_procesal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `etnia`
--

DROP TABLE IF EXISTS `etnia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `etnia` (
  `id_etnia` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `estatus_general` enum('ACTIVO','INACTIVO') NOT NULL,
  PRIMARY KEY (`id_etnia`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `etnia`
--

LOCK TABLES `etnia` WRITE;
/*!40000 ALTER TABLE `etnia` DISABLE KEYS */;
INSERT INTO `etnia` VALUES (1,'Yaqui','ACTIVO'),(2,'Mayo','ACTIVO'),(3,'Guarijío','ACTIVO'),(4,'Pima','ACTIVO'),(5,'Seri','ACTIVO'),(6,'Papago','ACTIVO'),(7,'Cucapá','ACTIVO'),(8,'\'O\'odham','ACTIVO');
/*!40000 ALTER TABLE `etnia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `familiar`
--

DROP TABLE IF EXISTS `familiar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `familiar` (
  `id_familiar` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `nacionalidad` varchar(100) NOT NULL,
  `parentesco` varchar(100) NOT NULL,
  `perteneceComunidadLGBT` tinyint(1) NOT NULL,
  `adultaMayor` tinyint(1) NOT NULL,
  `saludPrecaria` tinyint(1) NOT NULL,
  `pobrezaExtrema` tinyint(1) NOT NULL,
  `id_promovente` int NOT NULL,
  PRIMARY KEY (`id_familiar`),
  KEY `id_promovente` (`id_promovente`),
  CONSTRAINT `familiar_ibfk_1` FOREIGN KEY (`id_promovente`) REFERENCES `promovente` (`id_promovente`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `familiar`
--

LOCK TABLES `familiar` WRITE;
/*!40000 ALTER TABLE `familiar` DISABLE KEYS */;
INSERT INTO `familiar` VALUES (2,'Julia Antonieta','Mexicana','Madre',1,1,1,1,1);
/*!40000 ALTER TABLE `familiar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `juzgado`
--

DROP TABLE IF EXISTS `juzgado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `juzgado` (
  `id_juzgado` int NOT NULL AUTO_INCREMENT,
  `nombre_juzgado` varchar(50) NOT NULL,
  `estatus_general` enum('ACTIVO','INACTIVO') NOT NULL,
  PRIMARY KEY (`id_juzgado`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `juzgado`
--

LOCK TABLES `juzgado` WRITE;
/*!40000 ALTER TABLE `juzgado` DISABLE KEYS */;
INSERT INTO `juzgado` VALUES (1,'Primero Familiar','ACTIVO'),(2,'Segundo Familiar','ACTIVO'),(3,'Tercero Familiar','ACTIVO');
/*!40000 ALTER TABLE `juzgado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `observacion`
--

DROP TABLE IF EXISTS `observacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `observacion` (
  `id_observacion` int NOT NULL AUTO_INCREMENT,
  `observacion` varchar(200) NOT NULL,
  `id_proceso_judicial` int NOT NULL,
  PRIMARY KEY (`id_observacion`),
  KEY `id_proceso_judicial` (`id_proceso_judicial`),
  CONSTRAINT `observacion_ibfk_1` FOREIGN KEY (`id_proceso_judicial`) REFERENCES `proceso_judicial` (`id_proceso_judicial`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `observacion`
--

LOCK TABLES `observacion` WRITE;
/*!40000 ALTER TABLE `observacion` DISABLE KEYS */;
INSERT INTO `observacion` VALUES (3,' Observacion 1',1);
/*!40000 ALTER TABLE `observacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ocupacion`
--

DROP TABLE IF EXISTS `ocupacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ocupacion` (
  `id_ocupacion` int NOT NULL AUTO_INCREMENT,
  `descripcion_ocupacion` varchar(50) NOT NULL,
  `estatus_general` enum('ACTIVO','INACTIVO') NOT NULL,
  PRIMARY KEY (`id_ocupacion`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ocupacion`
--

LOCK TABLES `ocupacion` WRITE;
/*!40000 ALTER TABLE `ocupacion` DISABLE KEYS */;
INSERT INTO `ocupacion` VALUES (1,'Agricultor/a','ACTIVO'),(2,'Comerciante','ACTIVO'),(3,'Empleado/a','ACTIVO'),(4,'Ingeniero/a','ACTIVO'),(5,'Abogado/a','ACTIVO'),(6,'Médico/a','ACTIVO');
/*!40000 ALTER TABLE `ocupacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `participante`
--

DROP TABLE IF EXISTS `participante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participante` (
  `id_participante` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellido_paterno` varchar(50) NOT NULL,
  `apellido_materno` varchar(50) NOT NULL,
  `edad` int NOT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `id_genero` int NOT NULL,
  `id_proceso_judicial` int NOT NULL,
  PRIMARY KEY (`id_participante`),
  KEY `id_proceso_judicial_idx3` (`id_proceso_judicial`) USING BTREE,
  CONSTRAINT `participante_ibfk_1` FOREIGN KEY (`id_proceso_judicial`) REFERENCES `proceso_judicial` (`id_proceso_judicial`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participante`
--

LOCK TABLES `participante` WRITE;
/*!40000 ALTER TABLE `participante` DISABLE KEYS */;
INSERT INTO `participante` VALUES (1,'Juan A','Barrera','Morales',45,'6442138093',1,1),(2,'Tania','Roman','Diaz',33,'6442138596',2,1),(3,'Juan','Ricardo','Olga',45,'6442213456',1,2),(4,'Martin','Duarte','Diaz',44,'6442195869',1,2);
/*!40000 ALTER TABLE `participante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proceso_judicial`
--

DROP TABLE IF EXISTS `proceso_judicial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proceso_judicial` (
  `id_proceso_judicial` int NOT NULL AUTO_INCREMENT,
  `fecha_inicio` date NOT NULL,
  `fecha_estatus` date DEFAULT NULL,
  `control_interno` varchar(20) NOT NULL,
  `numero_expediente` varchar(20) NOT NULL,
  `id_turno` int NOT NULL,
  `id_distrito_judicial` int NOT NULL,
  `id_municipio_distrito` int NOT NULL,
  `id_tipo_juicio` int NOT NULL,
  `id_defensor` int NOT NULL,
  `estatus_proceso` enum('EN_TRAMITE','BAJA','CONCLUIDO') NOT NULL,
  `id_juzgado` int NOT NULL,
  PRIMARY KEY (`id_proceso_judicial`),
  KEY `id_juzgado` (`id_juzgado`),
  CONSTRAINT `proceso_judicial_ibfk_1` FOREIGN KEY (`id_juzgado`) REFERENCES `juzgado` (`id_juzgado`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proceso_judicial`
--

LOCK TABLES `proceso_judicial` WRITE;
/*!40000 ALTER TABLE `proceso_judicial` DISABLE KEYS */;
INSERT INTO `proceso_judicial` VALUES (1,'2024-06-24','2024-07-01','CCCCCDDDDD','AAAAABBBBB',1,1,60,2,2,'BAJA',1),(2,'2024-06-24',NULL,'CCCCCVVVVV','DDDDDFFFFF',2,1,60,11,2,'EN_TRAMITE',2);
/*!40000 ALTER TABLE `proceso_judicial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promovente`
--

DROP TABLE IF EXISTS `promovente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promovente` (
  `id_promovente` int NOT NULL,
  `español` tinyint(1) NOT NULL,
  `id_escolaridad` int DEFAULT NULL,
  `id_etnia` int DEFAULT NULL,
  `id_ocupacion` int DEFAULT NULL,
  PRIMARY KEY (`id_promovente`),
  KEY `id_escolaridad` (`id_escolaridad`),
  KEY `id_etnia` (`id_etnia`),
  KEY `id_ocupacion` (`id_ocupacion`),
  CONSTRAINT `promovente_ibfk_1` FOREIGN KEY (`id_promovente`) REFERENCES `participante` (`id_participante`),
  CONSTRAINT `promovente_ibfk_2` FOREIGN KEY (`id_escolaridad`) REFERENCES `escolaridad` (`id_escolaridad`),
  CONSTRAINT `promovente_ibfk_3` FOREIGN KEY (`id_etnia`) REFERENCES `etnia` (`id_etnia`),
  CONSTRAINT `promovente_ibfk_4` FOREIGN KEY (`id_ocupacion`) REFERENCES `ocupacion` (`id_ocupacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promovente`
--

LOCK TABLES `promovente` WRITE;
/*!40000 ALTER TABLE `promovente` DISABLE KEYS */;
INSERT INTO `promovente` VALUES (1,1,4,1,2),(3,1,1,3,2);
/*!40000 ALTER TABLE `promovente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prueba`
--

DROP TABLE IF EXISTS `prueba`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prueba` (
  `id_prueba` int NOT NULL AUTO_INCREMENT,
  `descripcion_prueba` varchar(200) NOT NULL,
  `id_proceso_judicial` int NOT NULL,
  PRIMARY KEY (`id_prueba`),
  KEY `id_proceso_judicial` (`id_proceso_judicial`),
  CONSTRAINT `prueba_ibfk_1` FOREIGN KEY (`id_proceso_judicial`) REFERENCES `proceso_judicial` (`id_proceso_judicial`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prueba`
--

LOCK TABLES `prueba` WRITE;
/*!40000 ALTER TABLE `prueba` DISABLE KEYS */;
INSERT INTO `prueba` VALUES (3,'Prueba 1',1);
/*!40000 ALTER TABLE `prueba` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resolucion`
--

DROP TABLE IF EXISTS `resolucion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resolucion` (
  `id_resolucion` int NOT NULL AUTO_INCREMENT,
  `resolucion` varchar(200) NOT NULL,
  `fecha_resolucion` date NOT NULL,
  `id_proceso_judicial` int NOT NULL,
  PRIMARY KEY (`id_resolucion`),
  KEY `id_proceso_judicial` (`id_proceso_judicial`),
  CONSTRAINT `resolucion_ibfk_1` FOREIGN KEY (`id_proceso_judicial`) REFERENCES `proceso_judicial` (`id_proceso_judicial`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resolucion`
--

LOCK TABLES `resolucion` WRITE;
/*!40000 ALTER TABLE `resolucion` DISABLE KEYS */;
INSERT INTO `resolucion` VALUES (3,'Resolucion 1','2024-06-30',1);
/*!40000 ALTER TABLE `resolucion` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-01  1:12:47
