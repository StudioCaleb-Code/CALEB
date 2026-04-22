CREATE TABLE
    `videojuegos` (
        `id` int (11) NOT NULL AUTO_INCREMENT,
        `nombre` varchar(100) NOT NULL,
        `genero` varchar(50) DEFAULT NULL,
        `anio` int (11) DEFAULT NULL,
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci