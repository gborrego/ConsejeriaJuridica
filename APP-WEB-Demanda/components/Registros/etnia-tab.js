//const template = document.createElement('template');
//import { ControllerUtils } from '......./lib/controllerUtils';
import { APIModel } from '../../models/api.model'
import { ValidationError } from '../../lib/errors.js'



class EtniaTab extends HTMLElement {
  //Variables privadas de la clase
  #api
  #idSeleccion
  #etnias
  #etnia
  #estatusEtnia

  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('./components/Registros/etnia-tab.html')).text();
    template.innerHTML = html;
    return template;
  }

  #pagina = 1
  #numeroPaginas
  //Este metodo se encarga de gestionar la paginacion de las asesorias
  buttonsEventListeners = () => {
    //Asignación de las variables correspondientes a los botones
    const prev = this.shadowRoot.getElementById('anterior')
    const next = this.shadowRoot.getElementById('siguiente')
    //Asignación de los eventos de los botones y la llamada de los metodos correspondientes en este caso la paginacion metodos de next y prev
    prev.addEventListener('click', this.handlePrevPage)
    next.addEventListener('click', this.handleNextPage)
  }

  //Metodo que se encarga de gestionar con respecto a la pagina actual seguir con la paginacion previa
  handlePrevPage = async () => {
    //Validación de la pagina actual
    if (this.#pagina > 1) {
      //Decremento de la pagina
      this.#pagina--
      //Llamada al metodo de consultar asesorias
      this.mostrarEtnias()
    }
  }

  //Metodo que se encarga de gestionar con respecto a la pagina actual seguir con la paginacion siguiente
  handleNextPage = async () => {
    //Validación de la pagina actual
    if (this.#pagina < this.#numeroPaginas) {
      //Incremento de la pagina
      this.#pagina++
      //Llamada al metodo de consultar asesorias
      this.mostrarEtnias()
    }
  }

  getNumeroPaginas = async () => {
    try {
      const { totalEtnias } = await this.#api.getEtniasTotal()
      const total = this.shadowRoot.getElementById('total')
      total.innerHTML = ''
      total.innerHTML = 'Total :' + totalEtnias
      this.#numeroPaginas = (totalEtnias) / 10
    } catch (error) {
      console.error('Error ', error.message)
      //Mensaje de error
      const modal = document.querySelector('modal-warning');
      modal.setOnCloseCallback(() => {});

      modal.message = 'Error al obtener el total de etnias, intente de nuevo mas tarde o verifique el status del servidor';
      modal.title = 'Error'
      modal.open = 'true'
    }
  }

  //Este metodo se encarga de verificar la cantidad de filas de la tabla y asi poder limpiar la tabla
  //y regesar true en caso de que la tabla tenga filas o regresar false en caso de que la tabla no tenga filas
  validateRows = rowsTable => {
    if (rowsTable > 0) {
      this.cleanTable(rowsTable);
      return true
    } else { return true }
  }

  //Este metodo se encarga de limpiar la tabla
  cleanTable = rowsTable => {
    const table = this.#etnias
    for (let i = rowsTable - 1; i >= 0; i--) {
      table.deleteRow(i)
    }
  }
  //Constructro de la clase
  constructor() {
    super();
    //Llamada a la función init para inicializar las variables
    this.init();
  }

  //Función para inicializar las variables, manejador de eventos y campos del formulario
  async init() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    //Inicializacion de la variable de la clase APIModel
    this.#api = new APIModel();
    //Inicializacion de la variable de idSeleccion en null
    this.#idSeleccion = null;
    //Llamada a la función manageFormFields para manejar los campos del formulario
    this.manageFormFields();
    //Llamada a la función fillInputs para llenar los campos del formulario
    this.fillInputs();
  }
//Función para manejar los campos del formulario 
  manageFormFields() {
    this.#etnias = this.shadowRoot.getElementById('table-etnia');
    this.#etnia = this.shadowRoot.getElementById('etnia');
    this.#estatusEtnia = this.shadowRoot.getElementById('estatus-etnia');

   
  }

//Metodo para manejar la entrada de texto en el campo de etnia
  manejadorEntradaTexto(){
    var etniaInput = this.#etnia;

    etniaInput.addEventListener('input', function () {
   if (etniaInput.value.length > 50) {
        const modal = document.querySelector('modal-warning')
        modal.setOnCloseCallback(() => {});
        modal.message = 'El campo de etnia no puede contener más de 50 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    });
  }

  //Metodo que manda a llamar al metodo de mostrarEtnias y agregarEventosBotones
  fillInputs() {
    //Llamado a la función mostrarEtnias para mostrar las etnias en la tabla
    this.mostrarEtnias();
    this.getNumeroPaginas()
    this.buttonsEventListeners()
    //Llamado a la función agregarEventosBotones para agregar los eventos a los botones
    this.agregarEventosBotones();
  }

  //Metodo para agregar eventos a los botones
  agregarEventosBotones = () => {

    //Se obtienen los botones de agregar etnia y editar etnia
    const agregarEtniaBtn = this.shadowRoot.getElementById('agregar-etnia');

    //Se agrega el evento click al boton de agregar etnia
    agregarEtniaBtn.addEventListener('click', this.agregarEtnia);

    //Se obtiene el boton de editar etnia
    const editarEtniaBtn = this.shadowRoot.getElementById('editar-etnia');
    
    //Se agrega el evento click al boton de editar etnia
    editarEtniaBtn.addEventListener('click', this.editarEtnia);

    //Se obtienen los botones de seleccionar etnia los cuales fueron creados en el metodo de mostrarEtnias
    const seleccionarBotones = this.shadowRoot.querySelectorAll('.seleccionar-etnia');

    //Se recorren los botones de seleccionar etnia y se les agrega el evento click
    seleccionarBotones.forEach(boton => {
      boton.addEventListener('click', () => {
        const etniaId = boton.value;
        console.log(etniaId);
        this.#idSeleccion = etniaId;

        //Se llama a la función activarBotonSeleccionar para activar el boton de seleccionar
        this.activarBotonSeleccionar(etniaId);
      });
    });

    //Se crea una función global para poder llamarla desde el boton de seleccionar etnia
    const llamarActivarBotonSeleccionar = (etniaId) => {
      this.activarBotonSeleccionar(etniaId);
    };

    //Se asigna la función global a una variable global para poder ser llamada desde el boton de seleccionar etnia
    window.llamarActivarBotonSeleccionar = llamarActivarBotonSeleccionar;

  }


  //Metodo para agregar una etnia
  agregarEtnia = async () => {
     
    //Se obtiene el id de la etnia seleccionada , con esto se procede a determinar si se va a agregar una nueva etnia o no 
    const etniaID = this.#idSeleccion;

    //Si no se ha seleccionado una etnia se procede a agregar una nueva etnia
    if (etniaID === null) {
      // Se obtienen los valores de los inputs de etnia y estatus de etnia
      const etniaInput = this.#etnia.value;
      const estatusEtniaInput = this.#estatusEtnia.value;

      try {
        //Se valida que el campo de etnia no este vacio
        if (etniaInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {});
          modal.message = 'El campo de etnia es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //Se valida que el campo de estatus de etnia no este vacio
        if (estatusEtniaInput === '0') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {});
          modal.message = 'El campo de estatus de etnia es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //En caso de que los campos de etnia y estatus de etnia no esten vacios se procede a agregar la etnia
        if (etniaInput !== '' && estatusEtniaInput !== '0') {
          //Se valida que el campo de etnia no contenga mas de 50 caracteres
          if (etniaInput.length > 50) {
            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => {});
            modal.message = 'El campo de etnia no puede contener más de 50 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          }
          else {

            //Se crea un objeto con los valores de la nueva etnia
            const nuevaEtnia = {
              nombre: etniaInput,
              estatus_general: estatusEtniaInput.toUpperCase()
            };

             /*/Se manda a llamar a la funcion postEtnia de la clase APIModel para agregar una nueva etnia
            const response = await this.#api.postEtnia(nuevaEtnia);

            //En caso de que se haya agregado la etnia se procede a limpiar los campos y mostrar las etnias
            if (response) {
              this.#etnia.value = '';
              this.#estatusEtnia.value = '0';
              this.IdSeleccion = null;
              this.mostrarEtnias();
            } 
            */
            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => {
              if (modal.open === 'false') {
                if (modal.respuesta === true) {
                  modal.respuesta = false
                  this.#api.postEtnia(nuevaEtnia).then(response => {
                    if (response) {
                      console.log(response)
                      this.#etnia.value = '';
                      this.#estatusEtnia.value = '0';
                      this.#idSeleccion = null;
                      this.#pagina = 1
                      this.getNumeroPaginas()
                      this.mostrarEtnias();
                    }
                  }).catch(error => {
                    console.error('Error al agregar una nueva etnia:', error.message);
                    const modal = document.querySelector('modal-warning')
                    modal.setOnCloseCallback(() => {});
                    modal.message = 'Error al agregar una nueva etnia, intente de nuevo o verifique el status del servidor.'
                    modal.title = 'Error de validación'
                    modal.open = true
                  });
                }
              }
            }
            );

            modal.message = 'Si esta seguro de agregar la etnia presione aceptar, de lo contrario presione x para cancelar.'
            modal.title = '¿Confirmacion de agregar etnia?'

            modal.open = true

          }
        }
      } catch (error) {
        console.error('Error al agregar una nueva etnia:', error);
      }
    } else {
      //Si ya se ha seleccionado una etnia se muestra un mensaje de error y se limpian los campos
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {});
      modal.message = 'No se puede agregar una nueva etnia si ya se ha seleccionado una, se eliminaran los campos.'
      modal.title = 'Error de validación'
      modal.open = true
      this.#etnia.value = '';
      this.#estatusEtnia.value = '0';
      this.#idSeleccion = null;
      this.mostrarEtnias();
    }
  }

  //Metodo para editar una etnia
  editarEtnia = async () => {
    //Variable que nos ayuda a determinar si se ha seleccionado una etnia
     //esto con el fin de saber si se puede editar o no
    const etniaID = this.#idSeleccion;
    //Si no se ha seleccionado una etnia se muestra un mensaje de error
    if (this.#idSeleccion === null) {
      //Se muestra un mensaje de error
      const modal = document.querySelector('modal-warning')
      modal.setOnCloseCallback(() => {});
      modal.message = 'Debe seleccionar una etnia para poder editarla.'
      modal.title = 'Error de validación'
      modal.open = true
    }
    else {
      //Se obtienen los valores de los inputs de etnia y estatus de etnia
      const etniaInput = this.#etnia.value;
      const estatusEtniaInput = this.#estatusEtnia.value;

      try {
        //Se valida que el campo de etnia no este vacio
        if (etniaInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {});
          modal.message = 'El campo de etnia es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //Se valida que el campo de estatus de etnia no este vacio
        if (estatusEtniaInput === '0') {
          const modal = document.querySelector('modal-warning')
          modal.setOnCloseCallback(() => {});
          modal.message = 'El campo de estatus de etnia es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        //En caso de que los campos de etnia y estatus de etnia no esten vacios se procede a editar la etnia
        if (etniaInput !== '' && estatusEtniaInput !== '0') {
          if (etniaInput.length > 50) {
            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => {});
            modal.message = 'El campo de etnia no puede contener más de 50 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          } else {
            //Se crea un objeto con los valores de la etnia a editar
            const etnia = {
              id_etnia: etniaID,
              nombre: etniaInput,
              estatus_general: estatusEtniaInput.toUpperCase()
            };


            //Se obtiene la etnia por ID para comparar si es posible editarla ya que no esta permitido editar una etnia si no se han realizado cambios con los datos
            //o que estos sean diferentes a los actuales
            const etniaObtenida = await this.#api.getEtniaByID(etniaID);

            //Se compara si los datos de la etnia a editar son iguales a los actuales
            if (etniaObtenida.nombre === etnia.nombre && etniaObtenida.estatus_general === etnia.estatus_general) {
              //Se muestra un mensaje de error
              const modal = document.querySelector('modal-warning')
              modal.setOnCloseCallback(() => {});
              modal.message = 'No se han realizado cambios en la etnia, ya que los datos son iguales a los actuales, se eliminaran los campos.'
              modal.title = 'Error de validación'
              modal.open = true
              this.#etnia.value = '';
              this.#estatusEtnia.value = '0';
              this.#idSeleccion = null;

            }
            else {
           /*/En caso de que los datos sean diferentes se procede a editar la etnia
              const response = await this.#api.putEtnia(etniaID, etnia);
            // En caso de que se haya editado la etnia se procede a limpiar los campos y mostrar las etnias
              if (response) {
                //Se limpian los campos
                this.#etnia.value = '';
                this.#estatusEtnia.value = '0';
                this.#idSeleccion = null;                         
                //Se muestran las etnias
                  this.mostrarEtnias();
              }  
              */
   /*
         const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => {
              if (modal.open === 'false') {
                if (modal.respuesta === true) {
                  modal.respuesta = false
                  this.#api.postEscolaridad(nuevaEscolaridad).then(response => {
                    if (response) {
                      console.log(response)
                      this.#escolaridad.value = '';
                      this.#estatusEscolaridad.value = '0';
                      this.#idSeleccion = null;
                      this.#pagina = 1
                      this.getNumeroPaginas()
                      this.mostrarEscolaridades();
                    }
                  }).catch(error => {
                    console.error('Error al agregar una nueva escolaridad:', error.message);
                    const modal = document.querySelector('modal-warning')
                    modal.setOnCloseCallback(() => {});
                    modal.message = 'Error al agregar una nueva escolaridad, intente de nuevo o verifique el status del servidor.'
                    modal.title = 'Error de validación'
                    modal.open = true
                  });
                }
              }
            });

            modal.message = 'Si esta seguro de agregar la escolaridad presione aceptar, de lo contrario presione x para cancelar.'
            modal.title = '¿Confirmacion de agregar escolaridad?'

            modal.open = true
   */

            const modal = document.querySelector('modal-warning')
            modal.setOnCloseCallback(() => {
              if (modal.open === 'false') {
                if (modal.respuesta === true) {
                  modal.respuesta = false
                  this.#api.putEtnia(etniaID, etnia).then(response => {
                    if (response) {
                      console.log(response)
                      this.#etnia.value = '';
                      this.#estatusEtnia.value = '0';
                      this.#idSeleccion = null;
                      this.#pagina = 1
                      this.getNumeroPaginas()
                      this.mostrarEtnias();
                    }
                  }).catch(error => {
                    console.error('Error al editar la etnia:', error.message);
                    const modal = document.querySelector('modal-warning')
                    modal.setOnCloseCallback(() => {});
                    modal.message = 'Error al editar la etnia, intente de nuevo o verifique el status del servidor.'
                    modal.title = 'Error de validación'
                    modal.open = true
                  });
                }
              }
            });

            modal.message = 'Si esta seguro de editar la etnia presione aceptar, de lo contrario presione x para cancelar.'
            modal.title = '¿Confirmacion de editar etnia?'

            modal.open = true
            }

          }

        }

      } catch (error) {
        console.error('Error al editar la etnia:', error);
      }
    }

  }

  //Metodo para mostrar las etnias en la tabla
  mostrarEtnias = async () => {
   
/*
    try {
      //Se obtienen las etnias
      const etnias = await this.#api.getEtnias();
      //Se obtiene el cuerpo de la tabla      
      const tableBody = this.#etnias;
      //Se limpia el cuerpo de la tabla
      tableBody.innerHTML = '';
      //Se recorren las etnias y se agregan al cuerpo de la tabla
      const lista = etnias;
      const funcion =
        lista.forEach(etnia => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <tr id="etnia-${etnia.id_etnia}">
            <td class="px-6 py-4 whitespace-nowrap">${etnia.id_etnia}</td>
            <td class="px-6 py-4 whitespace-nowrap">${etnia.nombre}</td>
            <td class="px-6 py-4 whitespace-nowrap">${etnia.estatus_general}</td>
            <td class="px-6 py-4 whitespace-nowrap">
            <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-etnia" onclick="llamarActivarBotonSeleccionar(this.value)" value="${etnia.id_etnia}">
            Seleccionar
          </button>
        
            </td>
        </tr>
            `;
          tableBody.appendChild(row);
        });
    } catch (error) {
      console.error('Error al obtener las etnias:', error);
    }
    */
   /*
  try {
      const escolaridades = await this.#api.getEscolaridadesPagina(this.#pagina);
      const lista = escolaridades.escolaridades;
      const table = this.#escolaridades;
      const rowsTable = this.#escolaridades.rows.length
      if (this.validateRows(rowsTable)) {
        lista.forEach(escolaridad => {
          const row = document.createElement('tr');
          row.innerHTML = `
          <tr id="escolaridad-${escolaridad.id_escolaridad}">
          <td class="px-6 py-4 whitespace-nowrap">${escolaridad.id_escolaridad}</td>
          <td class="px-6 py-4 whitespace-nowrap">${escolaridad.descripcion}</td>
          <td class="px-6 py-4 whitespace-nowrap">${escolaridad.estatus_general}</td>
          <td class="px-6 py-4 whitespace-nowrap">
          <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-escolaridad" onclick="llamarActivarBotonSeleccionar(this.value)" value="${escolaridad.id_escolaridad}">
          Seleccionar
        </button>
      
          </td>
      </tr>
          `;
          table.appendChild(row);
        })

      }

    }
    catch (error) {
      console.error('Error al obtener las escolaridades:', error);
      const modal = document.querySelector('modal-warning')

      modal.setOnCloseCallback(() => {});
      modal.message = 'Error al obtener las escolaridades, intente de nuevo o verifique el status del servidor.'
      modal.title = 'Error de validación'
      modal.open = true

    }
   */

    try {
      const etnias = await this.#api.getEtniasPagina(this.#pagina);
      const lista = etnias.etnias;
      const table = this.#etnias;
      const rowsTable = this.#etnias.rows.length
      if (this.validateRows(rowsTable)) {
        lista.forEach(etnia => {
          const row = document.createElement('tr');
          row.innerHTML = `
          <tr id="etnia-${etnia.id_etnia}">
          <td class="px-6 py-4 whitespace-nowrap">${etnia.id_etnia}</td>
          <td class="px-6 py-4 whitespace-nowrap">${etnia.nombre}</td>
          <td class="px-6 py-4 whitespace-nowrap">${etnia.estatus_general}</td>
          <td class="px-6 py-4 whitespace-nowrap">
          <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-etnia" onclick="llamarActivarBotonSeleccionar(this.value)" value="${etnia.id_etnia}">
          Seleccionar
        </button>
      
          </td>
      </tr>
          `;
          table.appendChild(row);
        })

      }

    }
    catch (error) {
      console.error('Error al obtener las etnias:', error);
      const modal = document.querySelector('modal-warning')

      modal.setOnCloseCallback(() => {});
      modal.message = 'Error al obtener las etnias, intente de nuevo o verifique el status del servidor.'
      modal.title = 'Error de validación'
      modal.open = true

    }
  }

  //Metodo para activar el boton de seleccionar etnia
  activarBotonSeleccionar = async etniaId => {

    try {
      //Se obtiene la etnia por ID para mostrarla en los campos de etnia y estatus de etnia
      const etniaID = await this.#api.getEtniaByID(etniaId);
      //Se verifica si la etnia existe
      if (etniaID) {
        //Se colocan los valores de la etnia en los campos de etnia y estatus de etnia
        this.#idSeleccion = etniaID.id_etnia;
        this.#etnia.value = etniaID.nombre;
        this.#estatusEtnia.value = etniaID.estatus_general;
      } else {
        console.error('La etnia con el ID proporcionado no existe.');
      }
    } catch (error) {
      console.error('Error al obtener la etnia por ID:', error);
    }
  }
}

customElements.define('etnia-tab', EtniaTab);
