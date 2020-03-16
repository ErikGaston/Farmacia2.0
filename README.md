# Farmacia2.0
Este proyecto web esta desarrollado con las siguientes tecnologias:

BackEnd: VisualStudio 2017, Aplicacion Web con WebApi2, EntityFramework 6, multiples capas en C#.

FrontEnd: HTML, CSS, Bootstrap, Jquery y AngularJS.

## Base de datos
```sql
USE [master]
GO
/****** Object:  Database [DBRemedios]    Script Date: 16/03/2020 10:06:56 AM ******/
CREATE DATABASE [DBRemedios]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'DBRemedios', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\DATA\DBRemedios.mdf' , SIZE = 5120KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'DBRemedios_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\DATA\DBRemedios_log.ldf' , SIZE = 2048KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [DBRemedios] SET COMPATIBILITY_LEVEL = 120
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [DBRemedios].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [DBRemedios] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [DBRemedios] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [DBRemedios] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [DBRemedios] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [DBRemedios] SET ARITHABORT OFF 
GO
ALTER DATABASE [DBRemedios] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [DBRemedios] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [DBRemedios] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [DBRemedios] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [DBRemedios] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [DBRemedios] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [DBRemedios] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [DBRemedios] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [DBRemedios] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [DBRemedios] SET  DISABLE_BROKER 
GO
ALTER DATABASE [DBRemedios] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [DBRemedios] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [DBRemedios] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [DBRemedios] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [DBRemedios] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [DBRemedios] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [DBRemedios] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [DBRemedios] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [DBRemedios] SET  MULTI_USER 
GO
ALTER DATABASE [DBRemedios] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [DBRemedios] SET DB_CHAINING OFF 
GO
ALTER DATABASE [DBRemedios] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [DBRemedios] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
ALTER DATABASE [DBRemedios] SET DELAYED_DURABILITY = DISABLED 
GO
USE [DBRemedios]
GO
/****** Object:  Table [dbo].[Remedios]    Script Date: 16/03/2020 10:06:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Remedios](
	[id_Remedio] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](50) NOT NULL,
	[cantidad_stock] [int] NOT NULL,
	[precio] [float] NOT NULL,
	[fecha_vencimiento] [date] NOT NULL,
	[tipo_remedio] [int] NULL,
	[enStock] [bit] NOT NULL,
 CONSTRAINT [PK_Remedios] PRIMARY KEY CLUSTERED 
(
	[id_Remedio] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Tipos_Remedios]    Script Date: 16/03/2020 10:06:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Tipos_Remedios](
	[id_Tipo] [int] IDENTITY(1,1) NOT NULL,
	[descripcion] [varchar](50) NOT NULL,
 CONSTRAINT [PK_Tipos_Remedios] PRIMARY KEY CLUSTERED 
(
	[id_Tipo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
ALTER TABLE [dbo].[Remedios]  WITH CHECK ADD  CONSTRAINT [FK_Remedios_Tipos_Remedios] FOREIGN KEY([tipo_remedio])
REFERENCES [dbo].[Tipos_Remedios] ([id_Tipo])
GO
ALTER TABLE [dbo].[Remedios] CHECK CONSTRAINT [FK_Remedios_Tipos_Remedios]
GO
USE [master]
GO
ALTER DATABASE [DBRemedios] SET  READ_WRITE 
GO
```