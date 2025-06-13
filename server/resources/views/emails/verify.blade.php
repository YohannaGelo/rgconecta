<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Verifica tu correo</title>
</head>

<body>
    <div style='font-family: Arial, sans-serif; background-color: #eaeff4; padding: 15px;'>

        <div style='background-color: #ffffff; margin: 0 auto; border-radius: 12px; padding: 20px; text-align: center;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05); margin-bottom: 15px; max-width: 500px;'>
            <a href="{{ $url }}">
                <img src="https://res.cloudinary.com/dnyqgpinf/image/upload/v1748027218/banner_RG_web_veaxjr.png"
                    alt="Ruiz Gijón Conecta" style="max-width: 160px; height: auto;" />
            </a>
        </div>

        <div style='background-color: #ffffff; color: #999ea2; margin: 0 auto; border-radius: 12px; padding: 20px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05); margin-bottom: 15px; max-width: 500px;'>
            <h2 style='color: #2b4e84; text-align: center;'>¡Hola, {{ $nombre }}!</h2>
            <p style='margin: 1rem;'>Gracias por registrarte en <strong>Ruiz Gijón Conecta</strong>.</p>
            <p style='margin: 1rem;'>Confirma tu dirección de correo haciendo clic en el botón:</p>
            <div style='text-align: center; margin-top: 30px;'>
                <a href="{{ $verificationUrl  }}"
                    style='display: inline-block; padding: 12px 24px; background-color: #2b4e84; color: white;
                            text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;'>
                    Verificar correo
                </a>
            </div>

            <p style='margin-top: 2rem; word-break: break-word; font-size: 13px;'>O copia y pega esta URL en tu navegador:<br>{{ $verificationUrl  }}</p>
        </div>

        <div style='background-color: #ffffff; margin: 0 auto; border-radius: 12px; padding: 20px; text-align: center;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05); font-size: 13px; color: #999; max-width: 500px;'>
            Ruiz Gijón Conecta · IES Ruiz Gijón · © {{ date('Y') }}
            <p style='margin: 15px 0 0 0; color: #a0aec0; font-size: 12px;'>
                Este es un mensaje automático. Por favor no respondas a este correo.
            </p>
        </div>
    </div>
</body>

</html>