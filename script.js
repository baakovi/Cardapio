// console.log("Teste de funcionamento")

// Returns a reference to the first object with the specified value of the ID attribute.
const menu = document.getElementById("menu")
// console.log(menu)
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
   updateCartModal();

   cartModal.style.display = "flex"
})

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event) {
   // cartModal.style.display = "none"
   // console.log(event)
   if (event.target === cartModal) {
      cartModal.style.display = "none"
   }
})

closeModalBtn.addEventListener("click", function() {
   // alert("Clicou")
   cartModal.style.display = "none"
})

menu.addEventListener("click", function(event) {
   // console.log(event.target)

   let parentButton = event.target.closest(".add-to-cart-btn")

   // console.log(parentButton);

   if (parentButton) {
      const name = parentButton.getAttribute("data-name")
      const price = parseFloat(parentButton.getAttribute("data-price"))

      // console.log(name)
      // console.log(price)

      // Adicionar o produto no carrinho
      addToCart(name, price)
   }
})

// Função para adicionar o produto no carrinho
// Essa função chamada o 'updateCartModal'
function addToCart(name, price) {
   // alert("O item é " + name + " com o preço de " + price)

   const existingItem = cart.find(item => item.name === name)

   if(existingItem) {
      // Se o item já existe (já foi adicionado ao carrinho), aumenta apenas a quantidade + 1

      existingItem.quantity += 1

      // return;

   } else {
      cart.push({
         name,
         price,
         quantity: 1,
      })
   }

   updateCartModal()
}

// Atualizar o carrinho visualmente
function updateCartModal() {
   cartItemsContainer.innerHTML = "";
   let total = 0;

   // forEach --> é um loop que percorre toda a lista, com as propriedades name, quantity, price. Nota variações na lista e adiciona novas informações caso o usuário adicione um novo item no carrinho.
   cart.forEach(item => {
      // console.log(item)

      const cartItemElement = document.createElement("div");
      cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

      cartItemElement.innerHTML = `
         <div class="flex items-center justify-between">
            <div>
               <p class="font-semibold">${item.name}</p>

               <p>Qtd: ${item.quantity}</p>

               <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

            <div>
               <button class="remove-from-cart-btn" data-name="${item.name}">
                  Remover
               </button>
            </div>
         </div>
      `

      // Acessar a variável total
      // += <== valor que tem no total mais o preço
      total += item.price * item.quantity;

      cartItemsContainer.appendChild(cartItemElement)
   })

   // cartTotal.textContent = total.toFixed(2);
   // Mostrar o total de itens selecionados no modal, na parte do "total"
   cartTotal.textContent = total.toLocaleString("PT-BR", {
      // Codificando para o valor do total aparecer em reais
      style: "currency",
      currency: "BRL"
   });

   // Mudar o contador de quantidade de produtos no carrinho localizado no footer (área vermelha)
   // lenght ==> ver a quantidade de itens adicionados no carrinho.
   cartCounter.innerHTML = cart.length;

}

// Função para remover a quantidade do produto no carrinho quando o usuário clicar no botão 'remover' dentro do modal.
cartItemsContainer.addEventListener("click", function(event) {
   if (event.target.classList.contains("remove-from-cart-btn")) {
      const name = event.target.getAttribute("data-name")

      // console.log(name)

      removeItemCart(name)
   }
})

function removeItemCart(name) {
   const index = cart.findIndex(item => item.name === name);

   if(index !== -1) {
      const item = cart[index];

      // console.log(item)

      // Se for verdadeiro, significa que tem mais de 1 mesmo produto adicionado no carrinho, como 2 ou mais.
      if(item.quantity > 1) {
         // Diminuir menos um na quantidade
         item.quantity -= 1;

         updateCartModal();

         return;
      }

      // splice ==> Remover o item(objeto) na sua lista
      cart.splice(index, 1)

      updateCartModal();
   }
}

// Ação para digitar o endereço no input do modal no carrinho. Evento de monitoração do input
addressInput.addEventListener("input", function(event) {
   let inputValue = event.target.value;

   // Quando clicar no botão 'Finalizar pedido', verificar se o input do endereço está vazio ou não. Se estiver vazio, mostrar o aviso.
   if (inputValue !== "") {
      addressInput.classList.remove("border-red-500");
      addressWarn.classList.add("hidden");
   }
})

// Lógica para finalizar o carrinho, finalizar pedido
checkoutBtn.addEventListener("click", function() {
   const isOpen = checkRestauranteOpen();
   if (!isOpen) {
      // alert("Restaurante fechado no momento! Volte novamente no horário de atendimento.")

      Toastify({
         text: "Ops, o restaurante está fechado no momento! Volte novamente no horário de atendimento :)",
         duration: 3000,
         // destination: "https://github.com/apvarun/toastify-js",
         // newWindow: true,
         close: true,
         gravity: "top", // `top` or `bottom`
         position: "right", // `left`, `center` or `right`
         stopOnFocus: true, // Prevents dismissing of toast on hover
         style: {
           background: "#EF4444",
         },
      }).showToast();

      return
   }

   if(cart.length === 0) return;

   if(addressInput.value === "") {
      addressWarn.classList.remove("hidden")

      addressInput.classList.add("border-red-500")

      return;
   }

   // Enviar o pedido do carrinho para o API WhatsApp
   // console.log(cart)

   const cartItems = cart.map((item) => {
      return (
         ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
      )
   }).join("")

   // console.log(cartItems)

   const message = encodeURIComponent(cartItems)
   const phone = "199971640553"

   // API do WhatsApp

   window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

   Toastify({
      text: "Seu pedido foi realizado com sucesso! Caso tenha alguma dúvida, poderá nos contatar pelo WhatsApp.",
      duration: 10000,
      // destination: "https://github.com/apvarun/toastify-js",
      // newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#54CC0A",
      },
   }).showToast();

   // Zerar o carrinho
   // cart.length = 0;
   cart = [];

   updateCartModal();
})

// Validar se o restaurante está aberto
// Algoritmo para verificar a hora e manipular o card pelo horário
function checkRestauranteOpen() {
   const data = new Date();
   const hora = data.getHours();
   return hora >= 18 && hora < 22;
   // True --> restaurante está aberto
}

const spanItem = document.getElementById("date-span")

const isOpen = checkRestauranteOpen();

if (isOpen) {
   spanItem.classList.remove("bg-red-500");
   spanItem.classList.add("bg-green-500")
}
else {
   spanItem.classList.remove("bg-green-500");
   spanItem.classList.add("bg-red-500")
}