CREATE Table proveedor (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(100) NOT NULL
);

INSERT INTO
    proveedor(nombre, descripcion)
VALUES (
        "StudioCaleb",
        "Estudio de software - desarrollo de programas"
    )