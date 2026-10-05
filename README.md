# Nexa Browser — MVP

Primer prototipo ejecutable de **Nexa Browser**, basado en Electron. Está pensado como una base real para seguir construyendo el navegador definido durante la planificación.

## Incluido en este MVP

- Identidad visual Nexa: azul futurista, glassmorphism, interfaz limpia.
- Tema automático como base.
- Pestañas, nueva pestaña, navegación atrás/adelante/recarga.
- Barra flotante/translúcida con búsqueda y URL.
- Barra lateral con espacios de trabajo y paneles.
- Workspaces con identidad visual y espacios temporales conceptuales.
- Panel personalizable con los widgets definidos.
- Notas locales.
- IA opcional/local como superficie preparada.
- Buscador configurable.
- Modo concentración.
- Función "Comparar páginas" marcada como experimental.
- Bloqueo básico de determinados anuncios/rastreadores a nivel de red.
- Ajuste de intensidad glassmorphism.
- Importación/recomendación de configuración como superficie preparada.

## Ejecutar

Necesitas Node.js y npm.

```bash
npm install
npm start
```

## Importante

Este proyecto es un **MVP técnico**, no pretende afirmar que todas las protecciones de privacidad, compatibilidad con extensiones Firefox, sincronización E2EE, DNS seguro, fingerprinting protection o IA local estén terminadas. Esas piezas requieren módulos específicos y pruebas de seguridad independientes.

La siguiente arquitectura prevista es:

- Motor web y aislamiento de sitios.
- Capa de privacidad configurable.
- Servicio de identidad Nexa.
- Sync con cifrado de extremo a extremo y gestión de claves.
- Adaptador para extensiones Firefox.
- Runtime de automatización.
- Integración de IA local mediante un proveedor/modelo configurable.
- Cliente Android con la misma lógica de cuenta/sync.


## Releases automáticos con GitHub Actions

El repositorio incluye dos workflows:

- `Nexa CI`: comprueba que el proyecto instala y compila correctamente en cada push/PR.
- `Release Nexa Browser`: al subir un tag `vX.Y.Z`, compila instaladores para Windows y Linux y crea automáticamente un GitHub Release con los archivos generados.

Ejemplo:

```bash
git add .
git commit -m "release: Nexa Browser 0.1.0"
git push origin main
git tag v0.1.0
git push origin v0.1.0
```

No necesitas crear el Release manualmente. GitHub Actions lo hará por ti.
