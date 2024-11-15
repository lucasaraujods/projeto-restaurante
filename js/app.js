//importanto o jquery
//a partir do documento ser totalmente lido ele vai executar uma função
$(document).ready(function () {
    cardapio.eventos.init()
})

//criando um váriavel sendo orinetado ao objeto, para ficar mais fácil de se situar
var cardapio = {}

var MEU_CARRINHO = []

var VALOR_CARRINHO=0
var VALOR_ENTREGA=5

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

                //chamando a função para retornar a mensagem de algo foi colocado no carrinho
                cardapio.metodos.mensagem('item adicionado ao carrinho', 'green')
                //ao adicionar, o número 0 retorna para o inicial
                $("#qntd-" + id).text(0)

                //chamando a função para adicionar ao carrinho
                cardapio.metodos.atualizarBagdeTotal()

            }
        }
    },

    //atualiza o iconezinho flutuante quanyo o meu carrinho lá de cima
    atualizarBagdeTotal: () => {

        var total= 0

        $.each(MEU_CARRINHO, (i,e) => {
            total +=e.qntd
        })

        if(total > 0){
            $(".botao-carrinho").removeClass('hidden')
            $(".container-total-carrinho").removeClass('hidden')
        }
        else{
            $(".botao-carrinho").addClass('hidden')
            $(".container-total-carrinho").addClass('hidden')
        }

        $(".badge-total-carrinho").html(total)

    },

    //abrir a pagina de carrinho:
    abrirCarrinho: (abrir) => {

        if(abrir){
            $("#modalCarrinho").removeClass('hidden')
            cardapio.metodos.carregarCarrinho()
        }
        else{
            $("#modalCarrinho").addClass('hidden')
        }

    },

    //altera os textos e exibe os botões das etapas 
    carregarEtapa: (etapa) => {
        if(etapa ==1){
            $("#lblTituloEtapa").text('Seu carrinho:')
            $("#itensCarrinho").removeClass("hidden")
            $("#localEntrega").addClass("hidden")
            $("#resumoCarrinho").addClass("hidden")

            $(".etapa").removeClass('active')
            $(".etapa1").addClass('active')

            $("#btnEtapaPedido").removeClass('hidden')
            $("#btnEtapaEndereco").addClass('hidden')
            $("#btnEtapaResumo").addClass('hidden')
            $("#btnVoltar").addClass('hidden')
        
        }
        if(etapa ==2){
            $("#lblTituloEtapa").text('Endereço de entrega:')
            $("#itensCarrinho").addClass("hidden")
            $("#localEntrega").removeClass("hidden")
            $("#resumoCarrinho").addClass("hidden")

            $(".etapa").removeClass('active')
            $(".etapa1").addClass('active')
            $(".etapa2").addClass('active')


            $("#btnEtapaPedido").addClass('hidden')
            $("#btnEtapaEndereco").removeClass('hidden')
            $("#btnEtapaResumo").addClass('hidden')
            $("#btnVoltar").removeClass('hidden')
        }
        if(etapa ==3){
            $("#lblTituloEtapa").text('Resumo do pedido:')
            $("#itensCarrinho").addClass("hidden")
            $("#localEntrega").addClass("hidden")
            $("#resumoCarrinho").removeClass("hidden")

            $(".etapa").removeClass('active')
            $(".etapa1").addClass('active')
            $(".etapa2").addClass('active')
            $(".etapa3").addClass('active')


            $("#btnEtapaPedido").addClass('hidden')
            $("#btnEtapaEndereco").addClass('hidden')
            $("#btnEtapaResumo").removeClass('hidden')
            $("#btnVoltar").removeClass('hidden')
        }
    },

    //botão de voltar etapas
    voltarEtapa: () => {
        //buscando a etapa que está ativa para voltar
        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa-1)
    },

    //carrega as listas de itens do carrinho
    carregarCarrinho: () => {

        cardapio.metodos.carregarEtapa(1)
        
        if(MEU_CARRINHO.length> 0){

            //limpando a pagina
            $("#itensCarrinho").html('')

            $.each(MEU_CARRINHO, (i,e) => {

                let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.',','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd)

                $("#itensCarrinho").append(temp)

                //ultimo item do carrinho:
                if((i+1) == MEU_CARRINHO.length){

                    cardapio.metodos.carregarValores()
                }
                

            })

        }else{
            $("#itensCarrinho").html('<p class="carrinho-vazio"> <i class= "fa fa-shopping-bag"></i> Seu carrinho está vazio </p>')
            cardapio.metodos.carregarValores()
        }


    },

    diminuirQuantidadeCarrinho: (id) =>{

        let qntdAtual =parseInt($("#qntd-carrinho-" + id).text()) 

        if(qntdAtual > 1){

            $("#qntd-carrinho-" + id).text(qntdAtual-1)
            cardapio.metodos.atualizarCarrinho(id, qntdAtual-1)

        }
        else{
            cardapio.metodos.removerItemCarrinho(id)
        }

    },

    aumentarQuantidadeCarrinho: (id) => {

        let qntdAtual =parseInt($("#qntd-carrinho-" + id).text()) 
        $("#qntd-carrinho-" + id).text(qntdAtual+1)
        cardapio.metodos.atualizarCarrinho(id, qntdAtual+1)
    },
    //botão remover item do carrinho
    removerItemCarrinho: (id) => {

        //retorna a lista com ids diferentes
        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e,i) => {return e.id != id} )
        cardapio.metodos.carregarCarrinho()

        //atualiza o icone pequeno do botao carrinho , com a quantidade atualizada
        cardapio.metodos.atualizarBagdeTotal()
    }, 

    //atualiza o carrinho com a quantidade atual
    atualizarCarrinho: (id,qntd) =>{

        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id))
        MEU_CARRINHO[objIndex].qntd = qntd

        //atualiza o icone pequeno do botao carrinho , com a quantidade atualizada
        cardapio.metodos.atualizarBagdeTotal()

        //ATUALIZA OS VALORES em reais totais do carrinho 
        cardapio.metodos.carregarValores()
    },

    //carrega os valores de subtotal, entrega e total
    carregarValores: () => {

        VALOR_CARRINHO = 0

        $("#lblSubTotal").text('R$ 0,00')
        $("#lblValorEntrega").text(' + R$ 0,00')
        $("#lblValorTotal").text('R$ 0,00')

        $.each(MEU_CARRINHO, (i,e) => {

            VALOR_CARRINHO += parseFloat(e.price * e.qntd)

            if((i+1) == MEU_CARRINHO.length){

                $("#lblSubTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`)
                $("#lblValorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.', ',')}`)
                $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`)
            }
        })

    },

    //carregar a etapa enderecos
    carregarEndereco: () =>{

        if(MEU_CARRINHO.length <= 0){
            cardapio.metodos.mensagem("Seu carrinho está vazio")
            return
        }

        cardapio.metodos.carregarEtapa(2)

    }, 

    //chama api viacep 
    buscarCEP: () => {
        //aqui o trin limpa o espaoço tanto no começo, tanto no final
        var cep = $("#txtCEP").val().trin()
    },


    // o tempo é em milisegundos, por isso 3500, mensgens de adicionar ao carrinho
    mensagem: (texto, cor = 'red', tempo= 3500) => {

        //essa função faz com que pegue um número aletorio e multiplico pela data atual em milisegundos, então sempre os ids são diferentes
        let id= Math.floor(Date.now() * Math.random()).toString()
        //template de mensgaem
        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`

        $("#container-mensagens").append(msg)

        //set time out espera um tempo para executar uma função dentro dele, com animação
        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown ')
            $("#msg-" + id).addClass('fadeOutUp')
            setTimeout(() => {
                $("#msg-" + id).remove()
            }, 800)
        }, tempo)
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
                    <b>R$\${preco}</b>
                </p>

                <!--testenado botões de mais e menos para adicionar o produto no carrinho-->
                <div class="add-carrinho">
                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-\${id}">0</span>
                    <span class="btn-mais" onClick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onClick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fas fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>`,
itemCarrinho:
                `<div class="col-12 item-carrinho">
                    <div class="img-produto">
                        <img src="\${img}" alt="hamburguer">
                    </div>
                    <div class="dados-produto">
                        <p class="title-produto"><b>\${name}</b></p>
                        <p class="price-produto"><b>\${preco}</b></p>
                    </div>
                    <div class="add-carrinho">
                        <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                        <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
                        <span class="btn-mais" onClick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                        <span class="btn btn-remove" onClick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fas fa-times"></i></span>
                    </div>
                </div>`,
}
