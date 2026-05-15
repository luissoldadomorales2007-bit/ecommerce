 
  var productos = [
      {
        id: 1, nombre: "Chuletón de Buey",
        descripcion: "600 g madurado 30 días, sal de Añana y aceite virgen extra.",
        precio: 28.90, categoria: "carnes",
        imagen: "resources/Chuletón.jpg"
      },
      {
        id: 2, nombre: "Costillas BBQ",
        descripcion: "Marinadas 24 h en salsa barbacoa artesanal, asadas a fuego lento.",
        precio: 18.50, categoria: "carnes",
        imagen: "resources/Costillas.jpg"
      },
      {
        id: 3, nombre: "Secreto Ibérico",
        descripcion: "Pieza selecta de cerdo ibérico, jugosa y con sabor profundo a brasa.",
        precio: 16.90, categoria: "carnes",
        imagen: "resources/SecretoIberico.webp"
      },
      {
        id: 4, nombre: "Pollo a la Brasa",
        descripcion: "Pollo entero adobado con especias de la casa, dorado a la brasa.",
        precio: 13.50, categoria: "aves",
        imagen: "resources/Pollo.jpg"
      },
      {
        id: 5, nombre: "Alitas Picantes",
        descripcion: "Alitas crujientes con salsa sriracha y miel. Ración de 8 unidades.",
        precio: 9.90, categoria: "aves",
        imagen: "resources/alitas.jpg"
      },
      {
        id: 6, nombre: "Verduras a la Brasa",
        descripcion: "Pimiento, berenjena, calabacín y espárragos con aliño de hierbas.",
        precio: 8.50, categoria: "vegetariano",
        imagen: "resources/Ensalada.jpg"
      },
      {
        id: 7, nombre: "Brocheta Vegetal",
        descripcion: "Tomates cherry, champiñones, cebolla y halloumi a la parrilla.",
        precio: 7.90, categoria: "vegetariano",
        imagen: "resources/brochetas.webp"
      },
      {
        id: 8, nombre: "Agua Mineral",
        descripcion: "Botella 1,5 L. Agua mineral natural.",
        precio: 2.00, categoria: "bebidas",
        imagen: "resources/Agua.jpg"
      },
      {
        id: 9, nombre: "Cerveza Artesana",
        descripcion: "Cerveza rubia de producción local. Botella 33 cl.",
        precio: 3.50, categoria: "bebidas",
        imagen: "resources/cerveza.jpg"
      },
      {
        id: 10, nombre: "Refresco",
        descripcion: "Cola, limonada o naranjada. Lata 33 cl.",
        precio: 2.50, categoria: "bebidas",
        imagen: "resources/cocacola.jpeg"
      },
      {
        id: 11, nombre: "Coulant de Chocolate",
        descripcion: "Bizcocho tibio con corazón de chocolate negro y helado de vainilla.",
        precio: 5.90, categoria: "postres",
        imagen: "resources/coulant.jpg"
      },
      {
        id: 12, nombre: "Tarta de Queso",
        descripcion: "Receta vasca, cremosa, con coulis de frutos rojos.",
        precio: 5.50, categoria: "postres",
        imagen: "resources/tartaqueso.jpg"
      }
  ];
 
 
    var carrito    = [];   // Array de { producto, cantidad }
    var ordenAsc   = false; // false = sin ordenar, true = ascendente
    var usuarioSesion = null; // null o nombre del usuario
 
  
    function anadirAlCarrito(id) {
      // Buscar el producto por id
      var producto = null;
      for (var i = 0; i < productos.length; i++) {
        if (productos[i].id === id) {
          producto = productos[i];
          break;
        }
      }
      if (!producto) return;
 
      // Comprobar si ya está en el carrito
      var itemExistente = null;
      for (var j = 0; j < carrito.length; j++) {
        if (carrito[j].producto.id === id) {
          itemExistente = carrito[j];
          break;
        }
      }
 
      if (itemExistente) {
        // Si ya existe, aumentar la cantidad
        itemExistente.cantidad++;
      } else {
        // Si no existe, añadirlo al array
        carrito.push({ producto: producto, cantidad: 1 });
      }
 
      actualizarCarritoUI();
      mostrarToast("✔ " + producto.nombre + " añadido");
    }
 
   
    function cambiarCantidad(id, delta) {
      for (var i = 0; i < carrito.length; i++) {
        if (carrito[i].producto.id === id) {
          carrito[i].cantidad += delta;
          if (carrito[i].cantidad <= 0) {
            carrito.splice(i, 1); // Eliminar del array
          }
          break;
        }
      }
      actualizarCarritoUI();
    }
 
  
    function calcularTotal() {
      var subtotal = 0;
      for (var i = 0; i < carrito.length; i++) {
        subtotal += carrito[i].producto.precio * carrito[i].cantidad;
      }
 
      // Cálculo del envío según subtotal
      var envio = 0;
      if (subtotal === 0) {
        envio = 0;
      } else if (subtotal >= 30) {
        envio = 0; 
      } else {
        envio = 2.99; // Coste fijo de envío
      }
 
      return { subtotal: subtotal, envio: envio, total: subtotal + envio };
    }
 
 
    function actualizarCarritoUI() {
      var lista = document.getElementById("lista-carrito");
      var numItems = 0;
      for (var i = 0; i < carrito.length; i++) {
        numItems += carrito[i].cantidad;
      }
      document.getElementById("contador-carrito").textContent = numItems;
 
      // Si está vacio
      if (carrito.length === 0) {
        lista.innerHTML = '<p class="carrito-vacio">El carrito está vacío.</p>';
        document.getElementById("btn-pedir").disabled = true;
      } else {
        // Construir los items del carrito
        var html = "";
        for (var j = 0; j < carrito.length; j++) {
          var item = carrito[j];
          html += '<div class="carrito-item">';
          html += '<img src="' + item.producto.imagen + '" alt="' + item.producto.nombre + '" />';
          html += '<div class="carrito-item-info">';
          html += '<strong>' + item.producto.nombre + '</strong>';
          html += '<span>' + formatearPrecio(item.producto.precio) + ' € / ud.</span>';
          html += '</div>';
          html += '<div class="carrito-item-controles">';
          html += '<button onclick="cambiarCantidad(' + item.producto.id + ', -1)">−</button>';
          html += '<span>' + item.cantidad + '</span>';
          html += '<button onclick="cambiarCantidad(' + item.producto.id + ', 1)">+</button>';
          html += '</div>';
          html += '</div>';
        }
        lista.innerHTML = html;
        document.getElementById("btn-pedir").disabled = false;
      }
 
      // Actualizar resumen de precios
      var totales = calcularTotal();
      document.getElementById("subtotal").textContent    = formatearPrecio(totales.subtotal) + " €";
      document.getElementById("total-final").textContent = formatearPrecio(totales.total) + " €";
 
      if (totales.subtotal === 0) {
        document.getElementById("coste-envio").textContent = "—";
      } else if (totales.envio === 0) {
        document.getElementById("coste-envio").textContent = "Gratis 🎉";
      } else {
        document.getElementById("coste-envio").textContent = formatearPrecio(totales.envio) + " €";
      }
    }
 
  
    function filtrarPorCategoria(lista, categoria) {
      if (categoria === "todas") return lista;
      var resultado = [];
      for (var i = 0; i < lista.length; i++) {
        if (lista[i].categoria === categoria) {
          resultado.push(lista[i]);
        }
      }
      return resultado;
    }
 
  
    function ordenarPorPrecio(lista) {
      
      return lista.slice().sort(function(a, b) {
        return a.precio - b.precio;
      });
    }
 

    function aplicarFiltroYOrden() {
      var categoria = document.getElementById("filtro-categoria").value;
 
      var resultado = filtrarPorCategoria(productos, categoria);
 
      if (ordenAsc) {
        resultado = ordenarPorPrecio(resultado);
      }
 
      
      renderizarProductos(resultado);
    }
 
 
    function toggleOrden() {
      ordenAsc = !ordenAsc;
      var icono = document.getElementById("icono-orden");
      icono.textContent = ordenAsc ? "↑" : "↕";
      aplicarFiltroYOrden();
    }
 
 
    function renderizarProductos(lista) {
      var grid = document.getElementById("grid-productos");
 
      if (lista.length === 0) {
        grid.innerHTML = '<p style="color: var(--color-texto-suave); grid-column: 1/-1;">No hay productos en esta categoría.</p>';
        return;
      }
 
      var html = "";
      for (var i = 0; i < lista.length; i++) {
        var p = lista[i];
        html += '<div class="tarjeta">';
        html += '<img src="' + p.imagen + '" alt="' + p.nombre + '" loading="lazy" />';
        html += '<div class="tarjeta-body">';
        html += '<span class="tarjeta-categoria">' + p.categoria + '</span>';
        html += '<h3>' + p.nombre + '</h3>';
        html += '<p>' + p.descripcion + '</p>';
        html += '</div>';
        html += '<div class="tarjeta-footer">';
        html += '<span class="precio">' + formatearPrecio(p.precio) + ' €</span>';
        html += '<button class="btn-anadir" onclick="anadirAlCarrito(' + p.id + ')">+ Añadir</button>';
        html += '</div>';
        html += '</div>';
      }
      grid.innerHTML = html;
    }
 

    function toggleCarrito() {
      var panel   = document.getElementById("panel-carrito");
      var overlay = document.getElementById("overlay");
      var abierto = panel.classList.contains("abierto");
      if (abierto) {
        cerrarCarrito();
      } else {
        panel.classList.add("abierto");
        overlay.classList.add("visible");
      }
    }
 
    function cerrarCarrito() {
      document.getElementById("panel-carrito").classList.remove("abierto");
      document.getElementById("overlay").classList.remove("visible");
    }
 
    
    function hacerPedido() {
      if (carrito.length === 0) return;
      if (!usuarioSesion) {
        cerrarCarrito();
        abrirModalSesion();
        mostrarToast("⚠ Inicia sesión para pedir");
        return;
      }
      var totales = calcularTotal();
      alert("Pedido realizado por " + usuarioSesion + "!\nTotal: " + formatearPrecio(totales.total) + " €\n¡Gracias por tu pedido!");
      carrito = [];
      actualizarCarritoUI();
      cerrarCarrito();
    }
 
   
    // Usuarios simulados
    var usuariosRegistrados = [
      { usuario: "admin",  password: "1234"   },
      { usuario: "carlos", password: "brasa1" },
      { usuario: "maria",  password: "fuego2" }
    ];
 
    function abrirModalSesion() {
      if (usuarioSesion) {
        // Si ya hay sesión, preguntar si cerrar
        if (confirm("¿Cerrar sesión de " + usuarioSesion + "?")) {
          cerrarSesion();
        }
        return;
      }
      document.getElementById("modal-sesion").classList.add("visible");
      document.getElementById("input-usuario").value  = "";
      document.getElementById("input-password").value = "";
      document.getElementById("msg-sesion").textContent = "";
    }
 
    function cerrarModalSesion() {
      document.getElementById("modal-sesion").classList.remove("visible");
    }
 
    function iniciarSesion() {
      var inputUsuario  = document.getElementById("input-usuario").value.trim();
      var inputPassword = document.getElementById("input-password").value;
      var msgEl         = document.getElementById("msg-sesion");
 
      if (!inputUsuario || !inputPassword) {
        msgEl.textContent = "Rellena todos los campos.";
        return;
      }
 
      // Comprobar credenciales en el array de usuarios
      var encontrado = false;
      for (var i = 0; i < usuariosRegistrados.length; i++) {
        if (usuariosRegistrados[i].usuario === inputUsuario &&
            usuariosRegistrados[i].password === inputPassword) {
          encontrado = true;
          break;
        }
      }
 
      if (!encontrado) {
        msgEl.textContent = "Usuario o contraseña incorrectos.";
        return;
      }
 
      // Guardar sesión
      usuarioSesion = inputUsuario;
      cerrarModalSesion();
 
      var btnSesion = document.getElementById("btn-sesion");
      btnSesion.textContent = "Cerrar sesión";
      btnSesion.classList.add("activo");
      document.getElementById("bienvenida").textContent = "Hola, " + usuarioSesion + " 👋";
 
      mostrarToast("👋 Bienvenido, " + usuarioSesion + "!");
    }
 
    function cerrarSesion() {
      usuarioSesion = null;
      var btnSesion = document.getElementById("btn-sesion");
      btnSesion.textContent = "Iniciar sesión";
      btnSesion.classList.remove("activo");
      document.getElementById("bienvenida").textContent = "";
      mostrarToast("Sesión cerrada");
    }
 

    function formatearPrecio(num) {
      return num.toFixed(2).replace(".", ",");
    }
 
    var toastTimer = null;
    function mostrarToast(mensaje) {
      var toast = document.getElementById("toast");
      toast.textContent = mensaje;
      toast.classList.add("show");
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(function() {
        toast.classList.remove("show");
      }, 2200);
    }
 
    // Cerrar modal con Escape
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape") {
        cerrarModalSesion();
        cerrarCarrito();
      }
    });
 
    renderizarProductos(productos);
 