const URL = "https://angelakrw.pythonanywhere.com/"

//////////////////////////
// Añadir productos

document.getElementById('formulario').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitamos que se envie el form por ahora

    // Obtenemos los valores del formulario
    var codigo = document.getElementById('codigo').value;
    var descripcion = document.getElementById('descripcion').value;
    var cantidad = document.getElementById('cantidad').value;
    var precio = document.getElementById('precio').value;

    // Creamos un objeto con los datos del producto
    var producto = {
        codigo: codigo,
        descripcion: descripcion,
        cantidad: cantidad,
        precio: precio
    };
    console.log(producto)
    // Realizamos la solicitud POST al servidor
    fetch(URL + 'productos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
    })
        .then(function (response) {
            // Código para manejar la respuesta
            if (response.ok) {
                return response.json(); // Parseamos la respuesta JSON
            } else {
                // Si hubo un error, lanzar explícitamente una excepción
                // para ser "catcheada" más adelante
                throw new Error('Error al agregar el producto.');
            }
        })
        .then(function (data) {
            alert('Producto agregado correctamente.');
            //Limpiamos el formulario.
            document.getElementById('codigo').value = "";
            document.getElementById('descripcion').value = "";
            document.getElementById('cantidad').value = "";
            document.getElementById('precio').value = "";
        })
        .catch(function (error) {
            // Código para manejar errores
            alert('Error al agregar el producto.');
        });
})




//////////////////////////
// Modificar productos
const appMod = Vue.createApp({
    data() {
        return {
            codigo: '',
            mostrarDatosProducto: false,
            descripcion: '',
            cantidad: '',
            precio: '',
        }
    },
    methods: {
        obtenerProducto() {
            fetch(URL + 'productos/' + this.codigo)
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        throw new Error('Error al comunicarse con la base de datos.')
                    }
                })
                .then(data => {
                    this.descripcion = data.descripcion
                    this.cantidad = data.cantidad
                    this.precio = data.precio
                    this.mostrarDatosProducto = true
                    const modal = document.querySelector('#modalModif');
                    modal.style.display = 'block';
                })
                .catch(error => {
                    alert('Error al obtener los datos del producto.')
                })
        },

        cerrarModal() {
            this.mostrarDatosProducto = false;
            const modal = document.querySelector('#modalModif');
            modal.style.display = 'none';
        },

        guardarCambios() {
            const producto = {
                codigo: this.codigo,
                descripcion: this.descripcion,
                cantidad: this.cantidad,
                precio: this.precio
            }

            fetch(URL + 'productos/' + this.codigo, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            })
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        throw new Error('Error al guardar los cambios del producto.')
                    }
                })
                .then(data => {
                    alert('Cambios guardados correctamente.')
                    location.reload()
                })
                .catch(error => {
                    alert('Error al guardar los cambios del producto.')
                })
        },
    }
})

appMod.mount('#appMod');



//////////////////////////////////
// Borrar productos

const appDel = Vue.createApp({
    data() {
        return {
            productos: []
        }
    },
    methods: {
        obtenerProductos() {
            // Obtenemos el contenido del inventario
            fetch(URL + 'productos')
                .then(response => {
                    if (response.ok) {
                        return response.json(); // Parseamos la respuesta JSON
                    } else {
                        // Si hubo un error, lanzar explícitamente una excepción
                        // para ser "catcheada" más adelante
                        throw new Error('Error al obtener los productos.');
                    }
                })
                .then(data => {
                    // El código Vue itera este elemento para generar la tabla
                    this.productos = data;
                })
                .catch(error => {
                    console.log('Error:', error);
                    alert('Error al obtener los productos.');
                });
        },
        eliminarProducto(codigo) {
            // Eliminamos el producto de la fila seleccionada
            fetch(URL + `productos/${codigo}`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        // Eliminar el producto de la lista después de eliminarlo en el servidor
                        this.productos = this.productos.filter(producto => producto.codigo !== codigo);
                        console.log('Producto eliminado correctamente.');
                    } else {
                        // Si hubo un error, lanzar explícitamente una excepción
                        // para ser "catcheada" más adelante
                        throw new Error('Error al eliminar el producto.');
                    }
                })
                .catch(error => {
                    // Código para manejar errores
                    alert('Error al eliminar el producto.');
                });
        }
    },
    mounted() {
        //Al cargar la página, obtenemos la lista de productos
        this.obtenerProductos();
    }
});

appDel.mount('#appDel');