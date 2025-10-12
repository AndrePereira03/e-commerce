import { Decimal } from 'decimal.js';

export class Produto {
  id: string;
  nome: string;
  preco: Decimal;
  estoque: number;

  constructor(id: string, nome: string, preco: Decimal, estoque: number) {
    this.id = id;
    this.nome = nome;
    this.preco = preco;
    this.estoque = estoque;

    if (estoque < 0) throw new Error('Estoque não pode ser negativo.');
    if (preco.isNegative()) throw new Error('O preço deve ser positivo.');
  }

  alterarPreco(novoPreco: Decimal) {
    if (novoPreco.isNegative() == true) throw new Error('Preço inválido.');
    this.preco = novoPreco;
  }

  reporEstoque(quantidade: number) {
    if (!Number.isInteger(quantidade) || quantidade <= 0)
      throw new Error('Quantidade inválida.');
    this.estoque += quantidade;
  }

  debitarEstoque(quantidade: number) {
    if (!Number.isInteger(quantidade) || quantidade <= 0)
      throw new Error('Quantidade inválida.');
    if (quantidade > this.estoque) throw new Error('Estoque insuficiente.');
    this.estoque -= quantidade;
  }
}
