
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
          src: 'assets/turnar/**/*',
          dest: 'assets/turnar'      
        },   {
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
          src: 'assets/*.html', 
          dest: 'assets'      
        },
        {
          src: 'components/asesoria/*.html', 
          dest: 'components/asesoria'     
        }
        ,
        {
          src: 'components/codigo-postal/*.html',
          dest: 'components/codigo-postal'       
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
        asesorias: resolve(__dirname, 'asesoria.html'),
        asesoriaturnar: resolve(__dirname, 'asesorias-turnar.html'),
        busquedaturnar: resolve(__dirname, 'busqueda-turnar.html'),
        catalogos: resolve(__dirname, 'catalogos.html'),
        consulta: resolve(__dirname, 'consulta.html'),
        empleados: resolve(__dirname, 'empleados.html'),
        estadosciviles: resolve(__dirname, 'estadosCiviles.html'),
        generos: resolve(__dirname, 'generos.html'),
        juicios: resolve(__dirname, 'jucios.html'),
        motivos: resolve(__dirname, 'motivos.html'),
        recuperacion: resolve(__dirname, 'recuperacion.html'),
        turnar: resolve(__dirname, 'turnar.html'),
        usuarios: resolve(__dirname, 'usuarios.html'),
        //prueba: resolve(__dirname, 'prueba.html'),
      }
    },  cacheAssets: false, // Esta opción desactiva la caché de los activos generados

  },
});