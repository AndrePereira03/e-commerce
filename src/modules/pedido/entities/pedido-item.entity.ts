import { Decimal } from 'decimal.js';
import { Pedido } from './pedido.entity.ts';
import { Produto } from '@modules/produto/entities/produto.entity.ts';

export class ItemPedido {
  produto: Produto;
  quantidade: number;
  precoUnidade: Decimal;

  constructor(produto: Produto, quantidade: number, precoUnidade: Decimal) {
    this.produto = produto;
    this.quantidade = quantidade;
    this.precoUnidade = precoUnidade;

    if (!Number.isInteger(quantidade) || quantidade <= 0)
      throw new Error('Quantidade deve ser maior que 0.');

    if (new Decimal(produto.preco).isNegative()) {
      throw new Error('Preço unitário inválido.');
    }
  }

  get subtotal(): Decimal {
    return this.precoUnidade.mul(this.quantidade);
  }

  incluir(pedido: Pedido): void {
    pedido.adicionarItem(this);
  }

  exluir(pedido: Pedido): void {
    pedido.removerItem(this.produto);
  }
}
