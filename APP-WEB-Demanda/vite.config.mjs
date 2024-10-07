// Renombrar el archivo a vite.config.mjs

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: 'assets/*.html', 
          dest: 'assets'      
        },
        {
          src: 'img/*.jpg', 
          dest: 'img'      
        },
        {
          src: 'img/*.png', 
          dest: 'img'      
        },
        {
          src: 'img/*.jpeg', 
          dest: 'img'      
        },
        {
          src: 'components/proceso/*.html', 
          dest: 'components/proceso'     
        }
        ,
        {
          src: 'components/registroProceso/*.html',
          dest: 'components/registroProceso'       
        },
        {
          src: 'components/seguimiento/*.html', 
          dest: 'components/seguimiento'     
        }
        ,
        {
          src: 'components/seguimientoProceso/*.html',
          dest: 'components/seguimientoProceso'       
        },
        {
          src: 'components/Registros/*.html', 
          dest: 'components/Registros'     
        },
        {
          src: 'final2.css', // Añade esta línea para copiar el archivo CSS
          dest: '.' // El punto indica que será copiado al directorio raíz del proyecto de salida
        }
      ]
    })
  ],
  server: {
    port: 3038,
  },
  build: {
    outDir: 'dist',
    assetsDir: '',
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        consultaproceso: resolve(__dirname, 'consultaProceso.html'),
        escolaridades: resolve(__dirname, 'escolaridad.html'),
        etnia: resolve(__dirname, 'etnia.html'),
        juzgado: resolve(__dirname, 'juzgado.html'),
        ocupacion : resolve(__dirname, 'ocupacion.html'),
        proceso: resolve(__dirname, 'proceso.html'),
        recuperacion: resolve(__dirname, 'recuperacion.html'),
        seguimiento: resolve(__dirname, 'seguimiento.html'),
      }
    },
    cacheAssets: false, // Esta opción desactiva la caché de los activos generados

  },
});
