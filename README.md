```
                                    ▄
                                   ███
                                  █████
                                 ███████
                                █████████
                                █████████
                                 ███████
                                  ▀███▀

 █████╗  ██████╗ ██╗   ██╗ █████╗    ██╗  ██╗ ██████╗ ███╗   ███╗███████╗
██╔══██╗██╔═══██╗██║   ██║██╔══██╗   ██║  ██║██╔═══██╗████╗ ████║██╔════╝
███████║██║   ██║██║   ██║███████║   ███████║██║   ██║██╔████╔██║█████╗  
██╔══██║██║▄▄ ██║██║   ██║██╔══██║   ██╔══██║██║   ██║██║╚██╔╝██║██╔══╝  
██║  ██║╚██████╔╝╚██████╔╝██║  ██║   ██║  ██║╚██████╔╝██║ ╚═╝ ██║███████╗
╚═╝  ╚═╝ ╚══▀▀═╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝
```

 **Desarrollo de una aplicación móvil para el monitoreo del estado del recurso hídrico en las albercas y tanques elevados mediante Internet de las Cosas (IoT)**

Este proyecto abordó la problemática de la calidad del agua almacenada en albercas y tanques elevados en hogares de Santa Marta, Magdalena, donde la ausencia de mecanismos objetivos de monitoreo obliga a los usuarios a evaluar el recurso hídrico por características organolépticas, incrementando el riesgo de enfermedades de origen hídrico. El objetivo fue analizar, diseñar e implementar una aplicación móvil de monitoreo continuo mediante Internet de las Cosas (IoT) denominada como AquaHome, tomando como referencia los rangos establecidos por la Resolución 2115 de 2007 y las directrices de la Organización Mundial de la Salud. Se adoptó una arquitectura por capas compuesta por el microcontrolador ESP32 con sensores físicos, un backend desarrollado en FastAPI y una capa de presentación en React Native y Expo, gestionada bajo la metodología ágil Scrum. La solución implementada detectó correctamente los valores fuera de rango y generó alertas en tiempo real hacia la aplicación móvil, alcanzando un rendimiento sólido al procesar 3.000 peticiones simuladas con una tasa de error del 0%, validando así una herramienta accesible, confiable y de bajo costo para el monitoreo autónomo de la calidad del agua en el hogar.
