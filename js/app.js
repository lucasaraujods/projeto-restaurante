//importanto o jquery
//a partir do documento ser totalmente lido ele vai executar uma função
$(document).ready(function () {
    cardapio.eventos.init()
})

//criando um váriavel sendo orinetado ao objeto, para ficar mais fácil de se situar
var cardapio = {}

var MEU_CARRINHO = []

cardapio.eventos = {
    //criando uma função para quando inicializar e chamar os itens do menu
    init: () => {
        cardapio.metodos.obterItensCardapio()
    }

}

cardapio.metodos = {
    //para listar os itens, obtendo a lista de itens do cardapio 
    obterItensCardapio: (categoria = 'burgers', vermais=false) => {

        let filtro = MENU[categoria]
        console.log(filtro)

         //limpando a tela para depois dar o append
        if(!vermais){
            $("#itensCardapio").html('')
            $("#btnVerMais").removeClass("hidden")
        }

       
       

        //*criando um for each em jquery para obter os 12 produtos e cada vez que e a repetição ele cria um template
        //o e é o elemento assim segue os 12 itens do cardápio do array
        $.each(filtro, (i,e) => {

            
            //usando o replace para substituir a variavel, pelo meu item atual sendo a variavel global de img, usand regex
            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${preco}/g, e.price.toFixed(2).replace('.',','))
            .replace(/\${id}/g, e.id)

            //ao clicar no ver mais exbir os 4 ultimos itens, assim total =12 itens
            if(vermais && i >=8 && i < 12){
                $("#itensCardapio").append(temp)
            }
            //paginação inicial = 8 itens
            if(!vermais && i < 8){
                $("#itensCardapio").append(temp)
            }
          
        })

        //removendo o ativo para o click, ou seja, a parte amarelha deve ser removida o active
        $(".container-menu a").removeClass('active')

        // coloca o menu para ativo
        $('#menu-' + categoria).addClass('active')
    },

    verMais: () => {

        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1] //menu burgers, assim o split quebra o array e pegamso o nome no array 1
        cardapio.metodos.obterItensCardapio(ativo,true)

        $("#btnVerMais").addClass('hidden')
    },

    //diminuir a quantidade do item no cardapio
    diminuirQuantidade: (id) => {

        let qntdAtual =parseInt($("#qntd-" + id).text()) 

        if(qntdAtual > 0){

            $("#qntd-" + id).text(qntdAtual-1)

        }
    },

    //aumentar a quantidade do item no cardapio
    aumentarQuantidade: (id) => {

        let qntdAtual =parseInt($("#qntd-" + id).text())

        $("#qntd-" + id).text(qntdAtual+1)
    },

    //adicionar ao carrinho o item do cardapio
    adicionarAoCarrinho: (id) => {

        let qntdAtual =parseInt($("#qntd-" + id).text())

        if(qntdAtual>0){

            //obter a cateoria ativa
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1]

            // obtem a lista de itens
            let filtro = MENU[categoria]

            // obte item 
            let item = $.grep(filtro, (e,i) => {return e.id == id})

            if(item.length > 0){

                //VALIDAR se já existe esse item no carrinho, so retorna se o elemento for igual ao id do item, assim filtrando para se caso adicionar mais um item, ele fazer a soma do que já estão selecionados e adicionados
                let existe= $.grep(MEU_CARRINHO, (elem, index) => {return elem.id == id})

                //pegamso a posição do item e altera a qntd dele, se ele existir, assim, usando o método de encontrar o index do item para adicionar a quantidade dada no memsmo item, assim retorna a posição no carrinho
                if(existe.length > 0){

                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id))
                    //acesso ao meu carrinho, passando a posição do elemento acima e quantidade, assim vai ser igual a quantidade que já existe mais a quantidade atual escolhida pela usuario 
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual

                }
                //se nao existir o item no carrinho, adiiciona ele
                else{
                    item[0].qntd = qntdAtual
                    MEU_CARRINHO.push(item[0])
                }

            }
        }
    },
}

cardapio.templates = {

    item: `                     
        <div class="col-3 mb-5">
            <div class="card card-item" id="\${id}">

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
                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-\${id}">0</span>
                    <span class="btn-mais" onClick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onClick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fas fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>`
}
