// Ponto de entrada do dashboard.

// Rodam sozinhos ao serem importados (têm addEventListener dentro)
import "./foco";
import "./navegacao";

import { criarcardsposicao } from "./vagas";
import { pararArraste } from "./alertas";

criarcardsposicao();
pararArraste();