CREATE DATABASE  IF NOT EXISTS `defensoria_usuarios_oficial` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `defensoria_usuarios_oficial`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: defensoria_usuarios_oficial
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
-- Table structure for table `detalle_permiso_usuario`
--

DROP TABLE IF EXISTS `detalle_permiso_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_permiso_usuario` (
  `id_usuario` int NOT NULL,
  `id_permiso` int NOT NULL,
  `id_detalle_permiso` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id_detalle_permiso`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_permiso_usuario`
--

LOCK TABLES `detalle_permiso_usuario` WRITE;
/*!40000 ALTER TABLE `detalle_permiso_usuario` DISABLE KEYS */;
INSERT INTO `detalle_permiso_usuario` VALUES (1,1,1),(1,12,2),(2,1,3),(3,12,4),(4,2,5),(4,3,6),(4,4,7),(4,5,8),(4,6,9),(4,7,10),(4,13,11),(4,14,12),(4,15,13),(4,16,14),(4,8,15),(4,9,16),(4,10,17),(4,17,18),(4,19,19),(5,1,20),(5,12,21),(6,1,22),(6,12,23),(7,1,24),(7,12,25),(8,1,26),(8,12,27),(9,1,28),(9,12,29),(10,1,30),(10,12,31),(11,1,32),(11,12,33),(12,1,34),(12,12,35),(13,12,36);
/*!40000 ALTER TABLE `detalle_permiso_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permisos`
--

DROP TABLE IF EXISTS `permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permisos` (
  `id_permiso` int NOT NULL AUTO_INCREMENT,
  `nombre_permiso` varchar(50) NOT NULL,
  PRIMARY KEY (`id_permiso`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permisos`
--

LOCK TABLES `permisos` WRITE;
/*!40000 ALTER TABLE `permisos` DISABLE KEYS */;
INSERT INTO `permisos` VALUES (1,'ALL_SA'),(2,'AD_USUARIOS_SA'),(3,'AD_EMPLEADOS_SA'),(4,'AD_JUICIOS_SA'),(5,'AD_GENEROS_SA'),(6,'AD_ESTADOSCIVILES_SA'),(7,'AD_MOTIVOS_SA'),(8,'AD_CATALOGOREQUISITOS_SA'),(9,'CONSULTA_ASESORIA_SA'),(10,'REGISTRO_ASESORIA_SA'),(11,'TURNAR_ASESORIA_SA'),(12,'ALL_SD'),(13,'AD_ESCOLARIDAD_SD'),(14,'AD_ETNIA_SD'),(15,'AD_JUZGADO_SD'),(16,'AD_OCUPACION_SD'),(17,'CONSULTA_PROCESO_JUDICIAL_SD'),(18,'SEGUIMIENTO_PROCESO_JUDICIAL_SD'),(19,'REGISTRO_PROCESO_JUDICIAL_SD');
/*!40000 ALTER TABLE `permisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_user`
--

DROP TABLE IF EXISTS `tipo_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_user` (
  `id_tipouser` int NOT NULL AUTO_INCREMENT,
  `tipo_usuario` varchar(45) NOT NULL,
  PRIMARY KEY (`id_tipouser`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_user`
--

LOCK TABLES `tipo_user` WRITE;
/*!40000 ALTER TABLE `tipo_user` DISABLE KEYS */;
INSERT INTO `tipo_user` VALUES (1,'supervisor'),(2,'asesor'),(3,'defensor'),(4,'general');
/*!40000 ALTER TABLE `tipo_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(200) NOT NULL,
  `password` varchar(65) NOT NULL,
  `id_tipouser` int NOT NULL,
  `id_distrito_judicial` int DEFAULT NULL,
  `estatus_general` enum('ACTIVO','INACTIVO') NOT NULL,
  `id_empleado` int DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  KEY `fk_tipo_user_idx` (`id_tipouser`),
  CONSTRAINT `fk_tipo_user` FOREIGN KEY (`id_tipouser`) REFERENCES `tipo_user` (`id_tipouser`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'DPS Usuario Uno','defensoria.testing.usuario1@gmail.com','$2b$10$sMNvquSguksaho9k35eqze6KgYN0EsyHUIXqvyqMHA0Z3iCSxejyG',1,1,'ACTIVO',NULL),(2,'Jose Jesus Orozco Hernandez','defensoria.testing.usuario2@gmail.com','$2b$10$sMNvquSguksaho9k35eqze6KgYN0EsyHUIXqvyqMHA0Z3iCSxejyG',2,1,'ACTIVO',1),(3,'Judith Orozco Hernandez','defensoria.testing.usuario3@gmail.com','$2b$10$sMNvquSguksaho9k35eqze6KgYN0EsyHUIXqvyqMHA0Z3iCSxejyG',3,1,'ACTIVO',2),(4,'Carlos Alfonso Sauceda Cervantes','defensoria.testing.usuario4@gmail.com','$2b$10$sMNvquSguksaho9k35eqze6KgYN0EsyHUIXqvyqMHA0Z3iCSxejyG',4,1,'ACTIVO',NULL),(5,'DPS Usuario Cinco','defensoria.testing.usuario5@gmail.com','$2b$10$sMNvquSguksaho9k35eqze6KgYN0EsyHUIXqvyqMHA0Z3iCSxejyG',1,5,'ACTIVO',NULL),(12,'DPS Usuario Seis','defensoria.testing.usuario6@gmail.com','$2b$10$sMNvquSguksaho9k35eqze6KgYN0EsyHUIXqvyqMHA0Z3iCSxejyG',1,6,'ACTIVO',NULL),(13,'Jenifer Saucedo Cervantes','defensoria.testing.usuario7@gmail.com','$2b$10$sMNvquSguksaho9k35eqze6KgYN0EsyHUIXqvyqMHA0Z3iCSxejyG',3,1,'ACTIVO',3);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-01  1:12:19
