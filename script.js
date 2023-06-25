// Logica de request da API e Criação de Cards 

            // Variavel q vai armazenar a URL da API para trazer os dados de personagem
            // Usamos Let pois o valor da variavel será trocado 
            let currentPageUrl = 'https://swapi.dev/api/people/'

            // Toda vez q a pagina carregar vai chamar essa função

            window.onload = async  () => { 

                // Função responsavel para fazer requisição para a API 
                // TRY - Tente fazer o que está dentro da chaves
                // Catch - Caso não de certo, execute o catch 

                try {

                    //função principal do projeto
                    await loadCharacters(currentPageUrl); // Vai pegar a url da api e vai fazer uma requisição, para trazer resultados e transformar em cards

                } catch (error){

                    console.log(error);
                    alert('Erro ao carregar cards');

                }

                // Pegando o elemento dos botões e adicionando dentro de variaveis 
                const nextButton = document.getElementById("next-button")
                const backButton = document.getElementById("back-button")

                // Utilzando o Event Listener para monitorar os eventos que acontecerem no button
                nextButton.addEventListener('click', loadNextPage) // Sempre que acontecer um clique vamos chamar uma função 
                backButton.addEventListener('click', loadPreviousPage)
            };


            async function loadCharacters(url) { // Função de criação dos cards


                const mainContent = document.getElementById('main-content') // pegando o elemento main content

                mainContent.innerHTML = ''; // Limpar os resultados anteriores por causa da navegação de pagina 

                try {

                    // variavel response vai armazenar o resultado da requisição Fetch
                    // Fetch vai fazer a requisição para a url 
                    const response =  await fetch(url);

                    // Convertendo os dados em formato Jason
                    const responseJson = await response.json();

                    // Pegando apenas o results de dentro da API onde fica armazenado os personagens 

                    // Função responsavel por criar os cards e passar as informações dinamicas 

                    responseJson.results.forEach((character) => { // ForEach vai passar por cada objeto 
                        
                        // criando o card
                        const card = document.createElement("div")

                        // Utilizamos o template string e o replace para extrair o id da API e trocar as img de fundo de cada card
                        //  /\D/g, "" É uma expressão regular que vai pegar a informação do ID para nós 
                        card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`
                        card.className = "cards"

                        // Div de background 
                        const characterNameBG = document.createElement("div")
                        characterNameBG.className = "character-name-bg"

                        // Div de Span  
                        const characterName = document.createElement("span")
                        characterName.className = "character-name"

                        // Modificando o elemento de texto do Span para ser dinamico
                        // Pegando o Name da API 
                        characterName.innerText = `${character.name}`

                        //appendChild pega um elemento e coloca um filho dentro dele 
                        characterNameBG.appendChild (characterName)
                        card.appendChild(characterNameBG)

                        // Função de clique no card 
                        card.onclick = () => {
                            const modal = document.getElementById ("modal")
                            modal.style.visibility = "visible"

                            // Pegando o elemento de ModalContent 
                            const modalContent = document.getElementById ("modal-content")
                            // Limpando o conteudo do elemento Elemento 
                            modalContent.innerHTML = ''

                            // Criando div de imagem do personagem 
                            const characterImage = document.createElement("div")
                            characterImage.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`
                            characterImage.className = "character-image"

                            // SPAN de Nome do personagem
                            const name = document.createElement("span")
                            name.className = "character-details"
                            name.innerText = `Nome: ${character.name}`

                            // SPAN da Altura 
                            const characterHeight = document.createElement("span")
                            characterHeight.className = "character-details"
                            characterHeight.innerText = `Altura: ${convertHeight(character.height)}`

                            // SPAN do Peso 
                            const mass = document.createElement("span")
                            mass.className = "character-details"
                            mass.innerText = `Peso: ${convertMass(character.mass)}`

                            // SPAN da cor dos olhos  
                            const eyeColor = document.createElement("span")
                            eyeColor.className = "character-details"
                            eyeColor.innerText = `Cor dos olhos: ${convertEyeColor(character.eye_color)}`

                            // SPAN do ano de aniversario   
                            const birthYear = document.createElement("span")
                            birthYear.className = "character-details"
                            birthYear.innerText = `Nascimento: ${convertBirthYear(character.birth_year)}`

                            // Usando o Append Child para organizar adicionar as informações dentro do modal
                            modalContent.appendChild(characterImage)
                            modalContent.appendChild(name)
                            modalContent.appendChild(characterHeight)
                            modalContent.appendChild(mass)
                            modalContent.appendChild(eyeColor)
                            modalContent.appendChild(birthYear)

                        }

                        mainContent.appendChild(card)

                    });
                    
                    // Verificações dos botões 
                    // Chamamos os elementos novamente, pois usamos const, que trabalha dentro de escopos 
                    const nextButton = document.getElementById("next-button")
                    const backButton = document.getElementById("back-button")

                    // Next dentro da API chama a URL da pagina seguinte, ou seja, quando ser chamado, o botão de NextButton será ativo 
                    // E quando não tiver mais nenhuma pagina seguinte, ele não vai aparecer 
                    nextButton.disabled = !responseJson.next 

                    // Mesma logica para o botão de voltar 
                    // Quando existir uma pagina anterior (Previous) ele vai ser habilitado 
                    backButton.disabled = !responseJson.previous

                    //Agora precisamos mostrar o backbutton caso exista uma pagina anterior (Previous)
                    backButton.style.visibility = responseJson.previous? "visible" : "hidden"
                    //Caso a resposta da API informe que existe uma pagina anterior vamos deixar visible, caso não, vai continuar hidden 

                    currentPageUrl = url

                } catch (error) {
                    alert('Erro ao carregar os personagens')
                    console.log(error)
                }
            }


// Função dos botões de navegação 

            // função de NextButton
            async function loadNextPage (){

                // Como vamos chamar essa função para fazer uma nova requisição para a API, precisamos verificar se o valor dela está true. 
                if (!currentPageUrl) return; 
                // Se o valor da variavel for nulo ele vai dar um return e interromper a função 

                try {
                    const response = await fetch(currentPageUrl) // Armazenando a requisição dentro de uma variavel 
                    const responseJson = await response.json() // Convertendo pra JSON

                    await loadCharacters (responseJson.next) // Pegando o valor de NEXT dentro da API para a load characters ter outro valor de URL 

                } catch (error) {
                    console.log(error)
                    alert('Erro ao carregar a próxima pagina ')
                }

            }

            async function loadPreviousPage (){

                // Como vamos chamar essa função para fazer uma nova requisição para a API, precisamos verificar se o valor dela está true. 
                if (!currentPageUrl) return; 
                // Se o valor da variavel for nulo ele vai dar um return e interromper a função 

                try {
                    const response = await fetch(currentPageUrl) // Armazenando a requisição dentro de uma variavel 
                    const responseJson = await response.json() // Convertendo pra JSON

                    await loadCharacters (responseJson.previous) // Pegando o valor de NEXT dentro da API 

                } catch (error) {
                    console.log(error)
                    alert('Erro ao carregar a página anterior')
                }
            }

            // Função chamada ao clicar no Modal 
            function hideModal () {
                const modal = document.getElementById("modal")
                modal.style.visibility = "hidden"
            }

            // Função para converter a cor dos olhos da API para PT-BR
            function convertEyeColor(eyeColor) {
                const cores = {
                    blue: "azul",
                    brown: "castanho",
                    green: "verde",
                    yellow: "amarelo",
                    black: "preto",
                    pink: "rosa",
                    red: "vermelho",
                    orange: "laranja",
                    hazel: "avela",
                    unknown: "desconhecida",
                };

                // Linha para retornar as informações em minisculo 
                return cores [eyeColor.toLowerCase()] || eyeColor;
            }

            // Função de conversão da altura 
            function convertHeight(height){
                if (height === "unknown"){
                    return "desconhecida"
                }  

                // Retorno para pegar a altura e trazer apenas 2 casas decimais
                return (height / 100).toFixed(2)
            }

            // Função para adicionar KG na Mass
            function convertMass (mass){
                if (mass === "unknown"){
                    return "desconhecido"
                }  

                // Retorno para pegar a altura e trazer apenas 2 casas decimais
                return `${mass} kg`
            }

            function convertBirthYear(birthYear) {
                if (birthYear === "unknown"){
                    return "desconhecido"
                }

                return birthYear
            }