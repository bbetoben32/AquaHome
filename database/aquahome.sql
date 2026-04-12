CREATE TABLE "Usuarios"(
    "id_usuario" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(255) NOT NULL,
    "correo" VARCHAR(255) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "creado_en" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "Usuarios" ADD PRIMARY KEY("id_usuario");
ALTER TABLE
    "Usuarios" ADD CONSTRAINT "usuarios_correo_unique" UNIQUE("correo");
CREATE TABLE "Dispositivo"(
    "id_dispositivo" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_usuario" UUID NOT NULL,
    "nombre_dipo" VARCHAR(255) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "Dispositivo" ADD PRIMARY KEY("id_dispositivo");
CREATE TABLE "Datos"(
    "id_datos" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_dispositivo" UUID NOT NULL,
    "ph" FLOAT NOT NULL,
    "turbidez" FLOAT NOT NULL,
    "temp" FLOAT NOT NULL,
    "solido" FLOAT NOT NULL,
    "estado" VARCHAR(50) NOT NULL,
    "registrado_en" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "Datos" ADD PRIMARY KEY("id_datos");
CREATE TABLE "Alertas"(
    "id_alertas" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_dispositivo" UUID NOT NULL,
    "mensaje" VARCHAR(255) NOT NULL,
    "tipo" VARCHAR(255) NOT NULL,
    "visto" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "Alertas" ADD PRIMARY KEY("id_alertas");
ALTER TABLE
    "Dispositivo" ADD CONSTRAINT "dispositivo_id_usuario_foreign" FOREIGN KEY("id_usuario") REFERENCES "Usuarios"("id_usuario");
ALTER TABLE
    "Alertas" ADD CONSTRAINT "alertas_id_dispositivo_foreign" FOREIGN KEY("id_dispositivo") REFERENCES "Dispositivo"("id_dispositivo");
ALTER TABLE
    "Datos" ADD CONSTRAINT "datos_id_dispositivo_foreign" FOREIGN KEY("id_dispositivo") REFERENCES "Dispositivo"("id_dispositivo");