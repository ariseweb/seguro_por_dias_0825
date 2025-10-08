<?php 
echo '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style type="text/css" emogrify="no">
        /* Estilos generales para compatibilidad en diferentes dispositivos y clientes de correo */
        body { margin: 0; padding: 0; width: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { border-collapse: collapse; }
        img { outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
        a { color: #644bf1; text-decoration: underline; }
        .nl2go-default-textstyle { color: #004481; font-family: Space Grotesk, Arial; font-size: 16px; line-height: 1.5; }
    </style>
    <title>Recordatorio de Finalización de Cobertura</title>
</head>
<body style="background-color: #ffffff; color: #004481;">

    <table width="100%" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td>
                <table width="600" align="center" cellpadding="0" cellspacing="0" border="0" style="width: 600px; margin: 0 auto;">
                    <!-- Logo -->
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <img src="'.SPDA_LOGO_TOP_EMPRESA.'" width="160" alt="Logo" style="display: block;">
                        </td>
                    </tr>
                    <!-- Título -->
                    <tr>
                        <td align="center" style="padding: 25px 0;">
                            <h1 style="color: #004481; font-family: Arial, Helvetica, sans-serif; font-size: 28px; line-height: 1.2;">Cobertura Próxima a Finalizar</h1>
                        </td>
                    </tr>
                    <!-- Mensaje -->
                    <tr>
                        <td style="padding: 0 20px;">
                            <p style="color: #333333; font-family: Space Grotesk, Arial; font-size: 16px;">
                                Estimado/a <strong>'.$nombre_tomador.' '.$primer_apellido_tomador.' '.$segundo_apellido_tomador.'</strong>, <br><br>
                                Te informamos que la cobertura de tu seguro por días finalizará en <strong>2 horas</strong>. A continuación, te detallamos la información de la cobertura y del vehículo:
                            </p>
                            <ul style="color: #333333; font-family: Space Grotesk, Arial; font-size: 16px; margin-top: 15px; list-style-type: none; padding: 0;">
                                <li><strong>Marca del vehículo:</strong> '.$marca_vehiculo.'</li>
                                <li><strong>Modelo del vehículo:</strong> '.$modelo_vehiculo.'</li>
                                <li><strong>Matrícula del vehículo:</strong> '.$matricula_vehiculo.'</li>
                            </ul>
                            <p style="color: #333333; font-family: Space Grotesk, Arial; font-size: 16px; margin-top: 20px; margin-bottom: 30px;">
                                Si necesitas extender la cobertura, no dudes en visitar <a href="'.SPDA_URLEMPRESA.'/seguros-por-dias/">nuestra web</a>.
                            </p>
                        </td>
                    </tr>
                   
                    <!-- Pie de página -->
                    <tr>
                        <td align="center" style="padding: 20px 15px; background-color: #eafcfd; color: #3b3f44;">
                            <p style="font-size: 18px; font-family: Space Grotesk, Arial; font-weight: bold;">'.SPDA_NAME_EMPRESA.'</p>
                        </td>
                    </tr>
                </table>
                <!-- Texto Legal -->
                <div align="center" style="color: #727272; font-size: 10px; padding-top: 20px;">
                    Concertado seguro de Responsabilidad Civil según art. 27 Ley 26/2006 del 17 de Julio.
                </div>
            </td>
        </tr>
    </table>

</body>
</html>';