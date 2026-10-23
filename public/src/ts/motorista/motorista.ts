// Ponto de entrada da página de busca de motorista.

import "./navegacao";
import { buttonBuscar } from "./elementos";
import { enviarReqDeBusca } from "./busca";
import { criaDelete, limpar } from "./deletar";

buttonBuscar?.addEventListener("click", async () => {
  const dados = await enviarReqDeBusca();


  if (dados?.nome) {
    criaDelete(dados.nome);
  }

  else{
    limpar()
  }
});