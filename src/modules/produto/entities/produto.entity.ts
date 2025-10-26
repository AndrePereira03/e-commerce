import { Decimal } from 'decimal.js';

export class Produto {
  private static idsUsados = new Set<string>();

  id: string;
  nome: string;
  preco: Decimal;
  estoque: number;

  constructor(id: string, nome: string, preco: Decimal, estoque: number) {
    this.id = id;
    this.nome = nome;
    this.preco = preco;
    this.estoque = estoque;

    if (Produto.idsUsados.has(id)) {
      throw new Error('ID já existente.');
    }

    Produto.idsUsados.add(id);

    if (estoque < 0) throw new Error('Estoque não pode ser negativo.');
    if (preco.isNegative() || preco.isZero())
      throw new Error('O preço deve ser positivo.');
  }

  static limparIDs(): void {
    Produto.idsUsados.clear();
  }

  alterarPreco(novoPreco: Decimal) {
    if (novoPreco.isNegative() == true || novoPreco.isZero() == true)
      throw new Error('Preço inválido.');
    this.preco = novoPreco;
  }

  reporEstoque(quantidade: number) {
    if (!Number.isInteger(quantidade) || quantidade <= 0)
      throw new Error('Quantidade inválida.');
    this.estoque += quantidade;
  }

  debitarEstoque(quantidade: number) {
    if (quantidade > this.estoque) throw new Error('Estoque insuficiente.');
    if (!Number.isInteger(quantidade) || quantidade <= 0)
      throw new Error('Quantidade inválida.');
    this.estoque -= quantidade;
  }
}
