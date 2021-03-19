CREATE DATABASE app_track_full; 

CREATE TABLE users (
    id int(255) not null auto_increment,
    email varchar(255) not null,
    password varchar(255) not null,
    status int(2) default 1,
    token varchar(255),
    role int(2) default 0,
    ts_create TIMESTAMP default CURRENT_TIMESTAMP,
    ts_update TIMESTAMP default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_users PRIMARY KEY(id)
)ENGINE=InnoDb;

CREATE TABLE orders (
    id int(255) AUTO_INCREMENT not null,
    id_order int(255) not null,
    email_client varchar(255) not null,
    description text,
    status int(2) default 0,
    ts_create TIMESTAMP default CURRENT_TIMESTAMP,
    ts_update TIMESTAMP default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_orders PRIMARY KEY(id)
)ENGINE=InnoDb;