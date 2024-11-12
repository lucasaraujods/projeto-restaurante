//importanto o jquery
//a partir do documento ser totalmente lido ele vai executar uma função
$(document).ready(function () {
    cardapio.eventos.init()
})

//criando um váriavel sendo orinetado ao objeto, para ficar mais fácil de se situar
var cardapio = {};

cardapio.eventos = {
    //criando uma função para quando inicializar e chamar os itens do menu
    init: () => {
        cardapio.metodos.obterItensCardapio()
    }

}

cardapio.metodos = {
    //para listar os itens, obtendo a lista de itens do cardapio 
    obterItensCardapio: () => {

        let filtro = MENU['burgers']
        console.log(filtro)

        //*criando um for each em jquery para obter os 12 produtos e cada vez que e a repetição ele cria um template
        //o e é o elemento assim segue os 12 itens do cardápio do array
        $.each(filtro, (i,e) => {

            
            //usando o replace para substituir a variavel, pelo meu item atual sendo a variavel global de img, usand regex
            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${preco}/g, e.price)
            //assim usamos o id para jogar para página e adicionameos o temp
            $("#itensCardapio").append(temp)

        })
    }
}

cardapio.templates = {

    item: `                     
        <div class="col-3 mb-5">
            <div class="card card-item">

                <div class="img-produto">
                    <img src="\${img}">
                </div>

                <p class="title-produto text-center mt-4">
                    <b>\${name}</b>
                </p>

                <p class="price-produto text-center">
                    <b>R$ \${preco}</b>
                </p>

                <!--testenado botões de mais e menos para adicionar o produto no carrinho-->
                <div class="add-carrinho">
                    <span class="btn-menos"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens">0</span>
                    <span class="btn-mais"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add"><i class="fas fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>`
}
