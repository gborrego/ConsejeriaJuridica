import { APIModel } from '../../models/api.model.js';
import { DataAsesoria } from './data-asesoria.js';

export class DetallesTab extends HTMLElement {
  #api;
  #asesoria;

  constructor() {
    super();
    this.id = 'detalles';
    this.style.display = 'none';
    this.attachShadow({ mode: 'open' });
    this.initTemplate();
  }

  async initTemplate() {
    const templateContent = await this.fetchTemplate();
    this.shadowRoot.appendChild(templateContent.content.cloneNode(true));
    await this.campos(); // Mueve esta llamada aquí para asegurar que el contenido está listo
  }

  async fetchTemplate() {
    const template = document.createElement('template');
    const response = await fetch('./components/asesoria/detalles-tab.html');
    const html = await response.text();
    template.innerHTML = html;
    return template;
  }

  async init() {
    this.asesoradoTab = document.querySelector('asesorado-full-tab');
    this.asesoriaTab = document.querySelector('asesoria-tab');
    this.#api = new APIModel();

    // Espera a que el DOM del shadow esté listo antes de seleccionar elementos
    await this.campos();

    const $section = this.shadowRoot.getElementById('data');
    if ($section === null) {
      console.error('Section "data" not found in shadow DOM');
      return;
    }

    this.#asesoria = {
      ...this.asesoradoTab.data,
      ...this.asesoriaTab.data,
    };

    if (this.#asesoria.persona.domicilio.id_colonia !== '') {
      const domicilio = await this.#api.getColoniaById(this.#asesoria.persona.domicilio.id_colonia);
      const dataAsesoria = new DataAsesoria(
 {asesoria: this.#asesoria},{
   domicilio}
      );
      $section.innerHTML = '';
      $section.appendChild(dataAsesoria);
    } else {
      const dataAsesoria = new DataAsesoria({asesoria:this.#asesoria}, {});
      $section.innerHTML = '';
      $section.appendChild(dataAsesoria);
    }

    this.#asesoria.datos_asesoria = {
      ...this.#asesoria.datos_asesoria,
      id_empleado: this.#asesoria.empleado.id_empleado,
    };
  }

  async campos() {
    this.btnCrearAsesoria = this.shadowRoot.getElementById('btn-crear-asesoria');
    this.btnCrearAsesoria.addEventListener('click', async () => {
      try {
        /*
 const modal = document.querySelector('modal-warning')
                modal.message = 'Si esta seguro de editar el catalogo presione aceptar, de lo contrario presione x para cancelar.'
                modal.title = '¿Confirmacion de editar catalogo?'
                
                modal.setOnCloseCallback(() => {
                  if (modal.open === 'false') {
                    if (modal.respuesta === true) {
                      modal.respuesta = false

                      this.#api.putCatalogos(catalogoID, catalogo).then(response => {
                        if (response) {
                          this.#catalogo.value = '';
                          this.#estatusCatalogo.value = '0';
                          this.#idSeleccion = null;
                          this.#pagina = 1
                          this.getNumeroPaginas()
                          this.mostrarCatalogos();
                        }
                      }).catch(error => {
                        console.error('Error al editar el catalogo:', error);
                        const modal = document.querySelector('modal-warning')
                        modal.setOnCloseCallback(() => {});

                        modal.message = 'Error al editar el catalogo, intente de nuevo o verifique el status del servidor.'
                        modal.title = 'Error de validación'
                        modal.open = true
                      });
                    }
                  }
                }
                );
                modal.open = true
        */
       /*
        await this.#api.postAsesoria(this.#asesoria);
        this.#showModal('La asesoría se ha creado correctamente', 'Asesoría creada', () => {
          location.href = '/';
        });
        */
        
        const modal = document.querySelector('modal-warning');
        modal.message = '¿Está seguro de crear la asesoría?';
        modal.title = 'Confirmación de creación de asesoría';
        modal.setOnCloseCallback(() => {
          if (modal.open === 'false') {
            if (modal.respuesta === true) {
              modal.respuesta = false;
              this.#api.postAsesoria(this.#asesoria).then(response => {
                if (response) {
                  this.#showModal('La asesoría se ha creado correctamente', 'Asesoría creada', () => {
                    location.href = '/';
                  });
                }
              }).catch(error => {
                console.error('Error al crear la asesoría:', error);
                this.#showModal('Ocurrió un error al crear la asesoría, verifique los datos o el servidor', 'Error al crear asesoría');
              });
            }
          }
        });
        modal.open = true;
      } catch (error) {
        console.error(error);
        this.#showModal('Ocurrió un error al crear la asesoría, verifique los datos o el servidor', 'Error al crear asesoría');
      }
    });

    document.addEventListener('tab-change', event => {
      const tabId = event.detail.tabId;
      if (tabId === 'detalles') {
        this.init();
      }
    });
  }

  #showModal(message, title, onCloseCallback) {
    const modal = document.querySelector('modal-warning');
    modal.message = message;
    modal.title = title;
    modal.open = true;
    modal.setOnCloseCallback(onCloseCallback);
  }
}

customElements.define('detalles-tab', DetallesTab);
