class APIModel {
  /*
 API_URL = 'http://200.58.127.244'
 USERS_API_URL = `${this.API_URL}:3002`
 ASESORIAS_API_URL = `${this.API_URL}:3009`
 CP_API_URL = `${this.API_URL}:3012`
 DEMANDAS_API_URL = `${this.API_URL}:3026`
 */
  API_URL = 'http://localhost'

  USERS_API_URL = import.meta.env.VITE_DEPLOY_USUARIOS === 'DEPLOYA' ? import.meta.env.VITE_BACKEND_USUARIOS : import.meta.env.VITE_BACKEND_USUARIOS_HTTPS
  ASESORIAS_API_URL = import.meta.env.VITE_DEPLOY_ASESORIAS === 'DEPLOYA' ? import.meta.env.VITE_BACKEND_ASESORIAS : import.meta.env.VITE_BACKEND_ASESORIAS_HTTPS
  CP_API_URL = import.meta.env.VITE_DEPLOY_CODIGOS_POSTALES === 'DEPLOYA' ? import.meta.env.VITE_BACKEND_CODIGOS_POSTALES : import.meta.env.VITE_BACKEND_CODIGOS_POSTALES_HTTPS
  DEMANDAS_API_URL = import.meta.env.VITE_DEPLOY_DEMANDAS === 'DEPLOYA' ? import.meta.env.VITE_BACKEND_DEMANDAS : import.meta.env.VITE_BACKEND_DEMANDAS_HTTPS

  user = JSON.parse(sessionStorage.getItem('user'))


  constructor() { }

  /*
    async login({ correo, password }) {
      const url = `${this.USERS_API_URL}/usuarios/usuario?correo=${correo}&password=${password}`
      console.log(url)
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        throw new Error('Error en la petición')
      }
    }
  
  */

  async login({ correo, password }) {
    try {
      const url = new URL(`${this.USERS_API_URL}/usuarios/usuario`);
      url.searchParams.append('correo', correo);
      url.searchParams.append('password', password);
    //  console.log(url.toString());

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

    //  console.log(response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
    //  console.error('Error en login:', error);
      throw error;
    }
  }
  /*
    async recover(correo) {
      const url = `${this.USERS_API_URL}/usuarios/recuperacion?correo=${correo}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        throw new Error('Error en la petición')
      }
    }
  */
  async recover(correo) {
    try {
      const url = new URL(`${this.USERS_API_URL}/usuarios/recuperacion`);
      url.searchParams.append('correo', correo);
    //  console.log(url.toString());

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

    //  console.log(response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
   //   console.error('Error en recuperación:', error);
      throw error;
    }
  }


  // --------------------Proceso Judicial------------------------
  /*
  async postProcesoJudicial(data) {
    const url = `${this.DEMANDAS_API_URL}/proceso-judicial`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }

  }

 */

  async postProcesoJudicial(data) {
    try {
      const url = `${this.DEMANDAS_API_URL}/proceso-judicial`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
   //  console.error('Error en postProcesoJudicial:', error);
      throw error;
    }
  }

  /*
  async putProcesoJudicial(id, data) {
    const url = `${this.DEMANDAS_API_URL}/proceso-judicial/${id}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
      body: JSON.stringify(data),
    })

    console.log(url)
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }

  }
    */

  async putProcesoJudicial(id, data) {
    try {
      const url = `${this.DEMANDAS_API_URL}/proceso-judicial/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
   //   console.error('Error en putProcesoJudicial:', error);
      throw error;
    }

  }

  /*
  async getEscolaridadesTotal() {
    const url = `${this.DEMANDAS_API_URL}/escolaridad/paginacion?total=${true}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data
    }
    else {
      throw new Error('Error en la petición')
    }

  }

   */

  async getEscolaridadesTotal() {
    try {
      const url = `${this.DEMANDAS_API_URL}/escolaridad/paginacion?total=true`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.user.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
//      console.error('Error en getEscolaridadesTotal:', error);
      throw error;
    }
  }

  /*
  async getEscolaridadesPagina(pagina) {
    const url = `${this.DEMANDAS_API_URL}/escolaridad/paginacion?pagina=${pagina}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data
    }

    else {
      throw new Error('Error en la petición')

    }
  }
*/

  async getEscolaridadesPagina(pagina) {
    try {
      const url = `${this.DEMANDAS_API_URL}/escolaridad/paginacion?pagina=${pagina}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.user.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
   //   console.error('Error en getEscolaridadesPagina:', error);
      throw error;
    }
  }

  /*
  async getDefensoresByDistrito2(id) {
    const url = `${this.ASESORIAS_API_URL}/defensores/distrito?id_distrito_judicial=${id}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
    })

    if (response.ok) {
      let data = await response.json()
      data = data.defensores
      return data
    } else {
      throw new Error('Error en la petición')
    }
  }
  */

  async getDefensoresByDistrito2(id) {
    try {
      const url = `${this.ASESORIAS_API_URL}/defensores/distrito?id_distrito_judicial=${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      let data = await response.json();
      data = data.defensores;
      return data;
    } catch (error) {
   //   console.error('Error en getDefensoresByDistrito2:', error);
      throw error;
    }
  }

  /*
    async getOcupacionesTotal() {
      const url = `${this.DEMANDAS_API_URL}/ocupacion/paginacion?total=${true}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.user.token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        return data
      }
      else {
        throw new Error('Error en la petición')
      }
  
    }
      */

  async getOcupacionesTotal() {
    try {
      const url = `${this.DEMANDAS_API_URL}/ocupacion/paginacion?total=true`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en getOcupacionesTotal:', error);
      throw error;
    }

  }

  /*
    async getOcupacionesPagina(pagina) {
      const url = `${this.DEMANDAS_API_URL}/ocupacion/paginacion?pagina=${pagina}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.user.token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        return data
      }
  
      else {
        throw new Error('Error en la petición')
  
      }
    }
      */

  async getOcupacionesPagina(pagina) {
    try {
      const url = `${this.DEMANDAS_API_URL}/ocupacion/paginacion?pagina=${pagina}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en getOcupacionesPagina:', error);
      throw error;
    }

  }

  /*
   async getEtniasTotal() {
     const url = `${this.DEMANDAS_API_URL}/etnia/paginacion?total=${true}`
     const response = await fetch(url, {
       method: 'GET',
       headers: {
         Authorization: `Bearer ${this.user.token}`,
       },
     })
     if (response.ok) {
       const data = await response.json()
       return data
     }
     else {
       throw new Error('Error en la petición')
     }
 
   }
 
   */

  async getEtniasTotal() {
    try {
      const url = `${this.DEMANDAS_API_URL}/etnia/paginacion?total=true`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
  //    console.error('Error en getEtniasTotal:', error);
      throw error;
    }
  }

  /*
    async getEtniasPagina(pagina) {
      const url = `${this.DEMANDAS_API_URL}/etnia/paginacion?pagina=${pagina}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.user.token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        return data
      }
  
      else {
        throw new Error('Error en la petición')
  
      }
    }
      */

  async getEtniasPagina(pagina) {
    try {
      const url = `${this.DEMANDAS_API_URL}/etnia/paginacion?pagina=${pagina}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en getEtniasPagina:', error);
      throw error;
    }
  }


  /*
  async getJuzgadosTotal() {

    const url = `${this.DEMANDAS_API_URL}/juzgado/paginacion?total=${true}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data
    }
    else {
      throw new Error('Error en la petición')
    }
  }
    */

  async getJuzgadosTotal() {
    try {
      const url = `${this.DEMANDAS_API_URL}/juzgado/paginacion?total=true`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en getJuzgadosTotal:', error);
      throw error;
    }

  }

  /*
    async getJuzgadosPagina(pagina) {
      const url = `${this.DEMANDAS_API_URL}/juzgado/paginacion?pagina=${pagina}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.user.token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        return data
      }
  
      else {
        throw new Error('Error en la petición')
  
      }
    }
      */

  async getJuzgadosPagina(pagina) {
    try {
      const url = `${this.DEMANDAS_API_URL}/juzgado/paginacion?pagina=${pagina}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en getJuzgadosPagina:', error);
      throw error;
    }
  }


  /*
    async getProcesosJudicialesByDefensor(id, estatus) {
      const url = `${this.DEMANDAS_API_URL}/proceso-judicial/defensor?id_defensor=${id}&estatus_proceso=${estatus}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        throw new Error('Error en la petición')
      }
  
    }
  
    */


  async getProcesosJudicialesByDefensor(id, estatus) {
    try {
      const url = `${this.DEMANDAS_API_URL}/proceso-judicial/defensor?id_defensor=${Number(id)}&estatus_proceso=${estatus}`;
         
   //   console.log(url);
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });
 
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
  //    console.error('Error en getProcesosJudicialesByDefensor:', error);
      throw error;
    }
  }

  /*
    async getProcesosJudicialesEnTramite(estatus) {
      const url = `${this.DEMANDAS_API_URL}/proceso-judicial/tramite?estatus_proceso=${estatus}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        throw new Error('Error en la petición')
      }
  
    }
      */

  async getProcesosJudicialesEnTramite(estatus) {
    try {
      const url = `${this.DEMANDAS_API_URL}/proceso-judicial/tramite?estatus_proceso=${estatus}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en getProcesosJudicialesEnTramite:', error);
      throw error;
    }
  }


  /*
    async getProcesosBusqueda(id_defensor, id_distrito_judicial, total, pagina,estatus_proceso) {
      const url = new URL(`${this.DEMANDAS_API_URL}/proceso-judicial/busqueda/`);
  
      const params = new URLSearchParams();
      if (estatus_proceso) params.append('estatus_proceso', estatus_proceso);
      if (id_defensor) params.append('id_defensor', id_defensor);
      if (id_distrito_judicial) params.append('id_distrito_judicial', id_distrito_judicial);
      if (total) params.append('total', total);
      if (pagina) params.append('pagina', pagina);
  
  
      url.search = params.toString();
      
  
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.user.token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      else {
        throw new Error('Error en la petición');
      }
  
    }
      */


  async getProcesosBusqueda(id_defensor, id_distrito_judicial, total, pagina, estatus_proceso) {
    try {
      const url = new URL(`${this.DEMANDAS_API_URL}/proceso-judicial/busqueda`);

      const params = new URLSearchParams();
      if (estatus_proceso) params.append('estatus_proceso', estatus_proceso);
      if (id_defensor) params.append('id_defensor', id_defensor);
      if (id_distrito_judicial) params.append('id_distrito_judicial', id_distrito_judicial);
      if (total) params.append('total', total);
      if (pagina) params.append('pagina', pagina);

      url.search = params.toString();


   //   console.log(url.toString());
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en getProcesosBusqueda:', error);
      throw error;
    }
  }

  /*


  async getProcesosJudiciales() {
    const url = `${this.DEMANDAS_API_URL}/proceso-judicial`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }
  }
    */

  async getProcesosJudiciales() {
    try {
      const url = `${this.DEMANDAS_API_URL}/proceso-judicial`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
  //    console.error('Error en getProcesosJudiciales:', error);
      throw error;
    }
  }

  /*

  async getProcesoJudicialById(id) {
    const url = `${this.DEMANDAS_API_URL}/proceso-judicial/${id}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }
  }
    */

  async getProcesoJudicialById(id) {
    try {
      const url = `${this.DEMANDAS_API_URL}/proceso-judicial/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
     // console.error('Error en getProcesoJudicialById:', error);
      throw error;
    }
  }

  /*
    async getTotalDemandas() {
      const url = `${this.DEMANDAS_API_URL}/proceso-judicial`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        throw new Error('Error en la petición')
      }
    }
  */


  async getTotalDemandas() {
    try {
      const url = `${this.DEMANDAS_API_URL}/proceso-judicial`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en getTotalDemandas:', error);
      throw error;
    }
  }

  /*
    async getDemandaById(id) {
      const url = `${this.DEMANDAS_API_URL}/proceso-judicial/${id}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        throw new Error('Error en la petición')
      }
    }
      */

  async getDemandaById(id) {
    try {
      const url = `${this.DEMANDAS_API_URL}/proceso-judicial/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en getDemandaById:', error);
      throw error;
    }
  }


  //---------------------  Juzgados ------------------------
  /*
  async getJuzgadoByID(id) {
    const url = `${this.DEMANDAS_API_URL}/juzgado/${id}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }
  }
    */

  async getJuzgadoByID(id) {
    try {
      const url = `${this.DEMANDAS_API_URL}/juzgado/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en getJuzgadoByID:', error);
      throw error;
    }
  }

  /*
    async getJuzgados() {
      const url = `${this.DEMANDAS_API_URL}/juzgado`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        throw new Error('Error en la petición')
      }
  
    }
      */

  async getJuzgados() {
    try {
      const url = `${this.DEMANDAS_API_URL}/juzgado`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en getJuzgados:', error);
      throw error;
    }
  }


  /*
  async getJuzgados2() {
    const url = `${this.DEMANDAS_API_URL}/juzgado?activo=true`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }

  }
    */

  async getJuzgados2() {
    try {
      const url = `${this.DEMANDAS_API_URL}/juzgado?activo=true`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en getJuzgados2:', error);
      throw error;
    }
  }

  /*
  async putJuzgado(id, data) {
    const url = `${this.DEMANDAS_API_URL}/juzgado/${id}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }
  }
    */

  async putJuzgado(id, data) {
    try {
      const url = `${this.DEMANDAS_API_URL}/juzgado/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en putJuzgado:', error);
      throw error;
    }
  }

  /*
    async postJuzgado(data) {
      const url = `${this.DEMANDAS_API_URL}/juzgado`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        throw new Error('Error en la petición')
      }
    }
      */

  async postJuzgado(data) {
    try {
      const url = `${this.DEMANDAS_API_URL}/juzgado`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en postJuzgado:', error);
      throw error;
    }
  }


  // -------------------- Escolaridad ------------------------
  /*
  async getEscolaridadByID(id) {
    const url = `${this.DEMANDAS_API_URL}/escolaridad/${id}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }
  }
  */

  async getEscolaridadByID(id) {
    try {
      const url = `${this.DEMANDAS_API_URL}/escolaridad/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en getEscolaridadByID:', error);
      throw error;
    }
  }


  /*
  async putEscolaridad(id, data) {
    const url = `${this.DEMANDAS_API_URL}/escolaridad/${id}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }
  }
  */

  async putEscolaridad(id, data) {
    try {
      const url = `${this.DEMANDAS_API_URL}/escolaridad/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en putEscolaridad:', error);
      throw error;
    }
  }

  /*
  async postEscolaridad(data) {
    const url = `${this.DEMANDAS_API_URL}/escolaridad`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }

  }
    */

  async postEscolaridad(data) {
    try {
      const url = `${this.DEMANDAS_API_URL}/escolaridad`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en postEscolaridad:', error);
      throw error;
    }
  }

  /*
    async getEscolaridades() {
      const url = `${this.DEMANDAS_API_URL}/escolaridad`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        throw new Error('Error en la petición')
      }
    }
      */


  async getEscolaridades() {
    try {
      const url = `${this.DEMANDAS_API_URL}/escolaridad`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en getEscolaridades:', error);
      throw error;
    }
  }

  /*
    async getEscolaridades2() {
      const url = `${this.DEMANDAS_API_URL}/escolaridad?activo=true`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        throw new Error('Error en la petición')
      }
    }
      */

  async getEscolaridades2() {
    try {
      const url = `${this.DEMANDAS_API_URL}/escolaridad?activo=true`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en getEscolaridades2:', error);
      throw error;
    }
  }


  // -------------------- Etnia ------------------------
  /*
 
   async getEtniaByID(id) {
     const url = `${this.DEMANDAS_API_URL}/etnia/${id}`
     const response = await fetch(url, {
       method: 'GET',
       headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${this.user.token}`,
       },
     })
     if (response.ok) {
       const data = await response.json()
       return data
     } else {
       throw new Error('Error en la petición')
     }
 
   }
 
 
   */

  async getEtniaByID(id) {
    try {
      const url = `${this.DEMANDAS_API_URL}/etnia/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en getEtniaByID:', error);
      throw error;
    }
  }


  /*
  async putEtnia(id, data) {
    const url = `${this.DEMANDAS_API_URL}/etnia/${id}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }
  }
*/

  async putEtnia(id, data) {
    try {
      const url = `${this.DEMANDAS_API_URL}/etnia/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en putEtnia:', error);
      throw error;
    }
  }

  /*
  async getEtnias() {
    const url = `${this.DEMANDAS_API_URL}/etnia`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }


  }
  */

  async getEtnias() {
    try {
      const url = `${this.DEMANDAS_API_URL}/etnia`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en getEtnias:', error);
      throw error;
    }
  }

  /*
    async getEtnias2() {
      const url = `${this.DEMANDAS_API_URL}/etnia?activo=true`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        throw new Error('Error en la petición')
      }
  
  
    }
  
    */

  async getEtnias2() {
    try {
      const url = `${this.DEMANDAS_API_URL}/etnia?activo=true`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en getEtnias2:', error);
      throw error;
    }
  }

  /*
    async postEtnia(data) {
      const url = `${this.DEMANDAS_API_URL}/etnia`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        throw new Error('Error en la petición')
      }
    }
      */

  async postEtnia(data) {
    try {
      const url = `${this.DEMANDAS_API_URL}/etnia`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
  //    console.error('Error en postEtnia:', error);
      throw error;
    }
  }


  // -------------------- Ocupacion ------------------------
  /*
  async postOcupacion(data) {
    const url = `${this.DEMANDAS_API_URL}/ocupacion`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }


  }
    */

  async postOcupacion(data) {
    try {
      const url = `${this.DEMANDAS_API_URL}/ocupacion`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en postOcupacion:', error);
      throw error;
    }
  }

  /*
  async getOcupacionByID(id) {
    const url = `${this.DEMANDAS_API_URL}/ocupacion/${id}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }

  }
    */

  async getOcupacionByID(id) {
    try {
      const url = `${this.DEMANDAS_API_URL}/ocupacion/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
  //    console.error('Error en getOcupacionByID:', error);
      throw error;
    }
  }


  /*
  async putOcupacion(id, data) {
    const url = `${this.DEMANDAS_API_URL}/ocupacion/${id}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }


  }
    */

  async putOcupacion(id, data) {
    try {
      const url = `${this.DEMANDAS_API_URL}/ocupacion/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en putOcupacion:', error);
      throw error;
    }
  }

  /*
    async getOcupaciones() {
      const url = `${this.DEMANDAS_API_URL}/ocupacion`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        throw new Error('Error en la petición')
      }
  
  
    }
      */

  async getOcupaciones() {
    try {
      const url = `${this.DEMANDAS_API_URL}/ocupacion`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en getOcupaciones:', error);
      throw error;
    }
  }


  /*
  async getOcupaciones2() {
    const url = `${this.DEMANDAS_API_URL}/ocupacion?activo=true`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }
  }
    */

  async getOcupaciones2() {
    try {
      const url = `${this.DEMANDAS_API_URL}/ocupacion?activo=true`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en getOcupaciones2:', error);
      throw error;
    }
  }


  // --------------------Turno------------------------
  /*
  async getTurno(id) {
    const url = `${this.ASESORIAS_API_URL}/turnos/${id}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }
  }
 */

  async getTurno(id) {
    try {
      const url = `${this.ASESORIAS_API_URL}/turnos/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en getTurno:', error);
      throw error;
    }
  }

  /*
  async putTurno(id, turno) {
    const url = `${this.ASESORIAS_API_URL}/turnos/${id}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
      body: JSON.stringify(turno),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Error en la petición');
    }

  }
    */


  async putTurno(id, turno) {

    try {
      const url = `${this.ASESORIAS_API_URL}/turnos/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(turno),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
  ////    console.error('Error en putTurno:', error);
      throw error;
    }
  }

  /*
  async getTurnos() {
    const url = `${this.ASESORIAS_API_URL}/turnos`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }
  }
 */

  async getTurnos() {
    try {
      const url = `${this.ASESORIAS_API_URL}/turnos`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
 //     console.error('Error en getTurnos:', error);
      throw error;
    }

  }
  /*

  async getTurnosBusqueda(id_defensor, id_distrito_judicial, total, pagina) {
    const url = new URL(`${this.ASESORIAS_API_URL}/turnos/busqueda`);

    const params = new URLSearchParams();

    if (id_defensor) params.append('id_defensor', id_defensor);
    if (id_distrito_judicial) params.append('id_distrito_judicial', id_distrito_judicial);
    if (total) params.append('total', total);
    if (pagina) params.append('pagina', pagina);


    url.search = params.toString();
 

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    else {
      throw new Error('Error en la petición');
    }

  }
  */

  async getTurnosBusqueda(id_defensor, id_distrito_judicial, total, pagina) {
    try {
      const url = new URL(`${this.ASESORIAS_API_URL}/turnos/busqueda`);

      const params = new URLSearchParams();

      if (id_defensor) params.append('id_defensor', id_defensor);
      if (id_distrito_judicial) params.append('id_distrito_judicial', id_distrito_judicial);
      if (total) params.append('total', total);
      if (pagina) params.append('pagina', pagina);

      url.search = params.toString();

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
 //     console.error('Error en getTurnosBusqueda:', error);
      throw error;
    }
  }

  /*
    async getTurnosBydIDDistrito(id_distrito_judicial) {
      const url = `${this.ASESORIAS_API_URL}/turnos/distrito?id_distrito_judicial=${id_distrito_judicial}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        throw new Error('Error en la petición')
      }
    }
      */

  async getTurnosBydIDDistrito(id_distrito_judicial) {
    try {
      const url = `${this.ASESORIAS_API_URL}/turnos/distrito?id_distrito_judicial=${id_distrito_judicial}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
  //    console.error('Error en getTurnosBydIDDistrito:', error);
      throw error;
    }
  }
  /*

  async getTurnoById(id) {
    const url = `${this.ASESORIAS_API_URL}/turnos/${id}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }
  }

  */

  async getTurnoById(id) {
    try {
      const url = `${this.ASESORIAS_API_URL}/turnos/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en getTurnoById:', error);
      throw error;
    }
  }

  /*
    async getTurno(id) {
      const url = `${this.ASESORIAS_API_URL}/turnos/${id}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        throw new Error('Error en la petición')
      }
    }
      */

  async getTurno(id) {
    try {
      const url = `${this.ASESORIAS_API_URL}/turnos/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en getTurno:', error);
      throw error;
    }
  }


  /*
  async getTurnosByDefensor(idDefensor) {
    const url = `${this.ASESORIAS_API_URL}/turnos/defensor/${idDefensor}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }
  }
    */

  async getTurnosByDefensor(idDefensor) {
    try {
      const url = `${this.ASESORIAS_API_URL}/turnos/defensor/${idDefensor}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
  //    console.error('Error en getTurnosByDefensor:', error);
      throw error;
    }
  }


  //  --------------------Tipo de Juicio------------------------
  /*
  async getTiposJuicioByID(id) {
    const url = `${this.ASESORIAS_API_URL}/tipos-de-juicio/${id}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Error en la petición');
      }
    } catch (error) {
      console.log('Error:', error.message);
      return null;
    }
  }
    */

  async getTiposJuicioByID(id) {
    try {
      const url = `${this.ASESORIAS_API_URL}/tipos-de-juicio/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en getTiposJuicioByID:', error);
      throw error;
    }
  }

  /*
  async getTiposJuicio() {
    const url = `${this.ASESORIAS_API_URL}/tipos-de-juicio`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }
  }
    */


  async getTiposJuicio() {
    try {
      const url = `${this.ASESORIAS_API_URL}/tipos-de-juicio`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
 //     console.error('Error en getTiposJuicio:', error);
      throw error;
    }
  }

  /*
  async getTiposJuicio2() {
    const url = `${this.ASESORIAS_API_URL}/tipos-de-juicio?activo=true`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Error en la petición');
    }
  }
    */

  async getTiposJuicio2() {
    try {
      const url = `${this.ASESORIAS_API_URL}/tipos-de-juicio?activo=true`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
  //    console.error('Error en getTiposJuicio2:', error);
      throw error;
    }

  }

  //--------------------Asesoria------------------------

  /*
   async getAsesoriaById(id) {
     const url = `${this.ASESORIAS_API_URL}/asesorias/${id}`
     const response = await fetch(url, {
       method: 'GET',
       headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${this.user.token}`,
       },
     })
     if (response.ok) {
       const data = await response.json()
       return data
     } else {
       throw new Error('Error en la petición')
     }
   } 
     */

  async getAsesoriaById(id) {
    try {
      const url = `${this.ASESORIAS_API_URL}/asesorias/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en la petición: ${response.status} - ${errorData.message}`);
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en getAsesoriaById:', error);
      throw error;
    }
  }


  // --------------------Municipio Distrito------------------------
  /*
  async getMunicipiosByDistrito(idDistro) {
    const url = `${this.ASESORIAS_API_URL}/municipios-distritos/distrito/${idDistro}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
      },
    })
    if (response.ok) {
      let data = await response.json()
      data = data.municipios
      return data
    }
    else {
      throw new Error('Error en la petición')
    }
  }
    */

  async getMunicipiosByDistrito(idDistro) {

    try {
      const url = `${this.ASESORIAS_API_URL}/municipios-distritos/distrito/${idDistro}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData.municipios;

    } catch (error) {
 //     console.error('Error en getMunicipiosByDistrito:', error);
      throw error;
    }
  }


  // -------------------- Distrito  Judiciales------------------------

  /*
  async getDistritos() {
    const url = `${this.ASESORIAS_API_URL}/distritos-judiciales`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
      },
    })
    if (response.ok) {
      //console.log("Entro a distritos")
      let data = await response.json()
      data = data.distritosJudiciales
      return data
    }
    else {
      console.log("Error en la petición")
      throw new Error('Error en la petición')
    }
  }

 */

  async getDistritos() {
    try {
      const url = `${this.ASESORIAS_API_URL}/distritos-judiciales`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData.distritosJudiciales;

    } catch (error) {
  //    console.error('Error en getDistritos:', error);
      throw error;
    }
  }


  //--------------------Asesores------------------------
  /*
   async getAsesores() {
     const url = `${this.ASESORIAS_API_URL}/asesores`
 
     const response = await fetch(url, {
       method: 'GET',
       headers: {
         Authorization: `Bearer ${this.user.token}`,
       },
     })
 
     if (response.ok) {
       const data = await response.json()
       return data
     } else {
       throw new Error('Error en la petición')
     }
   }
  */

  async getAsesores() {
    try {
      const url = `${this.ASESORIAS_API_URL}/asesores`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
  //    console.error('Error en getAsesores:', error);
      throw error;
    }
  }

  /*
    async getAsesorID(id_asesor) {
      const url = `${this.ASESORIAS_API_URL}/asesores/${id_asesor}`
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.user.token}`,
        },
      })
  
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        throw new Error('Error en la petición')
      }
    }
      */

  async getAsesorID(id_asesor) {
    try {
      const url = `${this.ASESORIAS_API_URL}/asesores/${id_asesor}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en getAsesorID:', error);
      throw error;
    }
  }

  /*
  async getAsesores2() {
    const url = `${this.ASESORIAS_API_URL}/asesores?activo=true`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }
  }
    */

  async getAsesores2() {
    try {
      const url = `${this.ASESORIAS_API_URL}/asesores?activo=true`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en getAsesores2:', error);
      throw error;
    }
  }

  // --------------------Defensores------------------------
  /*
   async getDefensorID(id_defensor) {
     const url = `${this.ASESORIAS_API_URL}/defensores/${id_defensor}`
 
     const response = await fetch(url, {
       method: 'GET',
       headers: {
         Authorization: `Bearer ${this.user.token}`,
       },
     })
 
     if (response.ok) {
       const data = await response.json()
       return data
     } else {
       throw new Error('Error en la petición')
     }
   } 
     */

  async getDefensorID(id_defensor) {
    try {
      const url = `${this.ASESORIAS_API_URL}/defensores/${id_defensor}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en getDefensorID:', error);
      throw error;
    }
  }


  /*
  async getDefensores() {
    const url = `${this.ASESORIAS_API_URL}/defensores`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }
  }
 */

  async getDefensores() {
    try {
      const url = `${this.ASESORIAS_API_URL}/defensores`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
  //    console.error('Error en getDefensores:', error);
      throw error;
    }

  }

  /*
  async getDefensores2() {
    const url = `${this.ASESORIAS_API_URL}/defensores?activo=true`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }
  }
    */

  async getDefensores2() {
    try {
      const url = `${this.ASESORIAS_API_URL}/defensores?activo=true`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en getDefensores2:', error);
      throw error;
    }
  }

  // --------------------Genero------------------------
  /*
  async getGeneros() {
    const url = `${this.ASESORIAS_API_URL}/generos`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }
  }
    */

  async getGeneros() {
    try {
      const url = `${this.ASESORIAS_API_URL}/generos`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
  //    console.error('Error en getGeneros:', error);
      throw error;
    }
  }

  /*
 async getGeneros2() {
   const url = `${this.ASESORIAS_API_URL}/generos?activo=true`

   const response = await fetch(url, {
     method: 'GET',
     headers: {
       Authorization: `Bearer ${this.user.token}`,
     },
   })

   if (response.ok) {
     const data = await response.json()
     return data
   } else {
     throw new Error('Error en la petición')
   }
 } 
   */

  async getGeneros2() {
    try {
      const url = `${this.ASESORIAS_API_URL}/generos?activo=true`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en getGeneros2:', error);
      throw error;
    }
  }

  /*
   async getGeneroByID(id) {
     const url = `${this.ASESORIAS_API_URL}/generos/${id}`
 
     const response = await fetch(url, {
       method: 'GET',
       headers: {
         Authorization: `Bearer ${this.user.token}`,
       },
     })
 
     if (response.ok) {
       const data = await response.json()
       return data
     } else {
       throw new Error('Error en la petición')
     }
   }
   */

  async getGeneroByID(id) {
    try {
      const url = `${this.ASESORIAS_API_URL}/generos/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en getGeneroByID:', error);
      throw error;
    }
  }




  // ---------------------- CP ----------------------
  /*
  async getDomicilioByCP(cp) {
    const url = `${this.CP_API_URL}/codigospostales/cp/${cp}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }
  }
    */

  async getDomicilioByCP(cp) {

    try {
      const url = `${this.CP_API_URL}/codigospostales/cp/${cp}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en getDomicilioByCP:', error);
      throw error;
    }
  }

  /*
    async getColoniaById(idColonia) {
      const url = `${this.CP_API_URL}/colonias/${idColonia}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.user.token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        throw new Error('Error en la petición')
      }
    }
      */

  async getColoniaById(idColonia) {
    try {
      const url = `${this.CP_API_URL}/colonias/${idColonia}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en getColoniaById:', error);
      throw error;
    }
  }

  // --------------------Prueba------------------------
  /*
  async getPruebaByID(id) {
    const url = `${this.DEMANDAS_API_URL}/prueba/${id}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }

  }
    */

  async getPruebaByID(id) {
    try {
      const url = `${this.DEMANDAS_API_URL}/prueba/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
  //    console.error('Error en getPruebaByID:', error);
      throw error;
    }
  }

  /*
    async getPruebasBusqueda(id_proceso_judicial, total, pagina) {
      const url = new URL(`${this.DEMANDAS_API_URL}/prueba/proceso-judicial`);
  
      const params = new URLSearchParams();
  
      if (id_proceso_judicial) params.append('id_proceso_judicial', id_proceso_judicial);
      if (total) params.append('total', total);
      if (pagina) params.append('pagina', pagina);
  
  
      url.search = params.toString();
  
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.user.token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      else {
        throw new Error('Error en la petición');
      }
  
    }
      */

  async getPruebasBusqueda(id_proceso_judicial, total, pagina) {
    try {
      const url = new URL(`${this.DEMANDAS_API_URL}/prueba/proceso-judicial`);

      const params = new URLSearchParams();

      if (id_proceso_judicial) params.append('id_proceso_judicial', id_proceso_judicial);
      if (total) params.append('total', total);
      if (pagina) params.append('pagina', pagina);

      url.search = params.toString();

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
  //    console.error('Error en getPruebasBusqueda:', error);
      throw error;
    }
  }

  /*
  async postPrueba(data) {
    const url = `${this.DEMANDAS_API_URL}/prueba`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }

  }
    */

  async postPrueba(data) {
    try {
      const url = `${this.DEMANDAS_API_URL}/prueba`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
 //     console.error('Error en postPrueba:', error);
      throw error;
    }
  }


  /*
  async putPrueba(id, data) {
    const url = `${this.DEMANDAS_API_URL}/prueba/${id}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }

  }
 */

  async putPrueba(id, data) {
    try {
      const url = `${this.DEMANDAS_API_URL}/prueba/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
  //    console.error('Error en putPrueba:', error);
      throw error;
    }
  }


  // --------------------Estado Procesal------------------------
  /*
  async getEstadoProcesalByID(id) {
    const url = `${this.DEMANDAS_API_URL}/estado-procesal/${id}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }

  }
    */

  async getEstadoProcesalByID(id) {
    try {
      const url = `${this.DEMANDAS_API_URL}/estado-procesal/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en getEstadoProcesalByID:', error);
      throw error;
    }
  }


  /*
  async getEstadosBusqueda(id_proceso_judicial, total, pagina) {

    const url = new URL(`${this.DEMANDAS_API_URL}/estado-procesal/proceso-judicial`);

    const params = new URLSearchParams();

    if (id_proceso_judicial) params.append('id_proceso_judicial', id_proceso_judicial);
    if (total) params.append('total', total);
    if (pagina) params.append('pagina', pagina);


    url.search = params.toString();

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    else {
      throw new Error('Error en la petición');
    }

  }
*/


  async getEstadosBusqueda(id_proceso_judicial, total, pagina) {
    try {
      const url = new URL(`${this.DEMANDAS_API_URL}/estado-procesal/proceso-judicial`);

      const params = new URLSearchParams();

      if (id_proceso_judicial) params.append('id_proceso_judicial', id_proceso_judicial);
      if (total) params.append('total', total);
      if (pagina) params.append('pagina', pagina);

      url.search = params.toString();

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en getEstadosBusqueda:', error);
      throw error;
    }
  }

  /*
  async postEstadoProcesal(data) {
    const url = `${this.DEMANDAS_API_URL}/estado-procesal`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }

  }
    */


  async postEstadoProcesal(data) {
    try {
      const url = `${this.DEMANDAS_API_URL}/estado-procesal`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en postEstadoProcesal:', error);
      throw error;
    }
  }

  /*
    async putEstadoProcesal(id, data) {
      const url = `${this.DEMANDAS_API_URL}/estado-procesal/${id}`
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(data),
      })
  
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        throw new Error('Error en la petición')
      }
  
    }
   */

  async putEstadoProcesal(id, data) {
    try {
      const url = `${this.DEMANDAS_API_URL}/estado-procesal/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en putEstadoProcesal:', error);
      throw error;
    }
  }


  // --------------------Observacion------------------------
  /*

  async getObservacionByID(id) {
    const url = `${this.DEMANDAS_API_URL}/observacion/${id}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }

  }
*/

  async getObservacionByID(id) {
    try {
      const url = `${this.DEMANDAS_API_URL}/observacion/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
  //    console.error('Error en getObservacionByID:', error);
      throw error;
    }
  }


  /*
  async getObservacionesBusqueda(id_proceso_judicial, total, pagina) {
    const url = new URL(`${this.DEMANDAS_API_URL}/observacion/proceso-judicial`);

    const params = new URLSearchParams();

    if (id_proceso_judicial) params.append('id_proceso_judicial', id_proceso_judicial);
    if (total) params.append('total', total);
    if (pagina) params.append('pagina', pagina);


    url.search = params.toString();

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    else {
      throw new Error('Error en la petición');
    }


  }
    */

  async getObservacionesBusqueda(id_proceso_judicial, total, pagina) {
    try {
      const url = new URL(`${this.DEMANDAS_API_URL}/observacion/proceso-judicial`);

      const params = new URLSearchParams();

      if (id_proceso_judicial) params.append('id_proceso_judicial', id_proceso_judicial);
      if (total) params.append('total', total);
      if (pagina) params.append('pagina', pagina);

      url.search = params.toString();

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
     // console.error('Error en getObservacionesBusqueda:', error);
      throw error;
    }
  }


  /*
  async postObservacion(data) {
    const url = `${this.DEMANDAS_API_URL}/observacion`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }

  }
 */

  async postObservacion(data) {
    try {
      const url = `${this.DEMANDAS_API_URL}/observacion`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en postObservacion:', error);
      throw error;
    }
  }


  /*
  async putObservacion(id, data) {
    const url = `${this.DEMANDAS_API_URL}/observacion/${id}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }

  }
    */

  async putObservacion(id, data) {
    try {
      const url = `${this.DEMANDAS_API_URL}/observacion/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en putObservacion:', error);
      throw error;
    }
  }



  // --------------------Resolucion------------------------

  /*
  async getResolucionByID(id) {
    const url = `${this.DEMANDAS_API_URL}/resolucion/${id}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }

  }
    */


  async getResolucionByID(id) {
    try {
      const url = `${this.DEMANDAS_API_URL}/resolucion/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en getResolucionByID:', error);
      throw error;
    }
  }


  /*
  async getResolucionesBusqueda(id_proceso_judicial, total, pagina) {
    const url = new URL(`${this.DEMANDAS_API_URL}/resolucion/proceso-judicial`);

    const params = new URLSearchParams();

    if (id_proceso_judicial) params.append('id_proceso_judicial', id_proceso_judicial);
    if (total) params.append('total', total);
    if (pagina) params.append('pagina', pagina);


    url.search = params.toString();

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    else {
      throw new Error('Error en la petición');
    }
  }
    */

  async getResolucionesBusqueda(id_proceso_judicial, total, pagina) {
    try {
      const url = new URL(`${this.DEMANDAS_API_URL}/resolucion/proceso-judicial`);

      const params = new URLSearchParams();

      if (id_proceso_judicial) params.append('id_proceso_judicial', id_proceso_judicial);
      if (total) params.append('total', total);
      if (pagina) params.append('pagina', pagina);

      url.search = params.toString();

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en getResolucionesBusqueda:', error);
      throw error;
    }
  }


  /*

  async postResolucion(data) {
    const url = `${this.DEMANDAS_API_URL}/resolucion`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }

  }

  */

  async postResolucion(data) {
    try {
      const url = `${this.DEMANDAS_API_URL}/resolucion`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en postResolucion:', error);
      throw error;
    }
  }


  /*
   async putResolucion(id, data) {
     const url = `${this.DEMANDAS_API_URL}/resolucion/${id}`
     const response = await fetch(url, {
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${this.user.token}`,
       },
       body: JSON.stringify(data),
     })
 
     if (response.ok) {
       const data = await response.json()
       return data
     } else {
       throw new Error('Error en la petición')
     }
 
   }
   */

  async putResolucion(id, data) {
    try {
      const url = `${this.DEMANDAS_API_URL}/resolucion/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
  //    console.error('Error en putResolucion:', error);
      throw error;
    }
  }



  // --------------------Familiar------------------------
  /*
  async getFamiliarByID(id) {
    const url = `${this.DEMANDAS_API_URL}/familiar/${id}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }

  }

  */

  async getFamiliarByID(id) {
    try {
      const url = `${this.DEMANDAS_API_URL}/familiar/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
     // console.error('Error en getFamiliarByID:', error);
      throw error;
    }
  }

  /*
  async getFamiliaresBusqueda(id_promovente, total, pagina) {
    const url = new URL(`${this.DEMANDAS_API_URL}/familiar/promovente`);

    const params = new URLSearchParams();

    if (id_promovente) params.append('id_promovente', id_promovente);
    if (total) params.append('total', total);
    if (pagina) params.append('pagina', pagina);


    url.search = params.toString();


    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    else {
      throw new Error('Error en la petición');
    }

  }
  */

  async getFamiliaresBusqueda(id_promovente, total, pagina) {
    try {
      const url = new URL(`${this.DEMANDAS_API_URL}/familiar/promovente`);

      const params = new URLSearchParams();

      if (id_promovente) params.append('id_promovente', id_promovente);
      if (total) params.append('total', total);
      if (pagina) params.append('pagina', pagina);

      url.search = params.toString();

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { Authorization: `Bearer ${this.user.token}` },
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en getFamiliaresBusqueda:', error);
      throw error;
    }
  }


  /*
  async postFamiliar(data) {
    const url = `${this.DEMANDAS_API_URL}/familiar`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.user.token}`,
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Error en la petición')
    }

  } 
    */

  async postFamiliar(data) {
    try {
      const url = `${this.DEMANDAS_API_URL}/familiar`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
    //  console.error('Error en postFamiliar:', error);
      throw error;
    }
  }



  /*
   async putFamiliar(id, data) {
     const url = `${this.DEMANDAS_API_URL}/familiar/${id}`
     const response = await fetch(url, {
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${this.user.token}`,
       },
       body: JSON.stringify(data),
     })
 
     if (response.ok) {
       const data = await response.json()
       return data
     } else {
       throw new Error('Error en la petición')
     }
 
   }
     */

  async putFamiliar(id, data) {
    try {
      const url = `${this.DEMANDAS_API_URL}/familiar/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
   //   console.error('Error en putFamiliar:', error);
      throw error;
    }
  }






}

export { APIModel }
